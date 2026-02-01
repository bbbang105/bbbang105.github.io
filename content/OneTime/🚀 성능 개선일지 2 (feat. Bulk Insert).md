---
date: 2025-05-25
tags:
  - onetime
  - backend
  - perf
  - side-project
---

---

# ⏰ OneTime?

> [원타임](https://www.onetime-with-members.com/)에 대해서 궁금하다면 아래를 참고해주세요!

[⏰ OneTime 서비스 바로가기](https://www.onetime-with-members.com/)
[📝 OneTime 소개글](https://disquiet.io/product/%EC%9B%90%ED%83%80%EC%9E%84-one-time-l-%EC%9D%BC%EC%A0%95%EC%9D%84-%EC%89%BD%EA%B3%A0-%EB%B9%A0%EB%A5%B4%EA%B2%8C)
[🧑🏻‍💻 GitHub](https://github.com/onetime-with-members)
[📸 Instagram](https://www.instagram.com/one.time.official/)

---

# 🎬 서론

지난 [성능 개선기1](https://bbbang105.github.io/OneTime/%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0%EC%9D%BC%EC%A7%80-1-(feat.-N+1,-Index))에서는 조회 성능을 개선하기 위해서, N+1 문제 해결과 인덱스를 적용해 보았다.

이번에는 이벤트 생성 API에 대한 개선을 여러 방면으로 도전해 볼 계획이다. 해당 글은 이에 대한 내용으로 이어진다.

---


# 이벤트 생성 API

![](https://velog.velcdn.com/images/hsh111366/post/e75a8a93-3911-4767-aafa-dc191c38c3ca/image.png)


보통의 경우에는 크게 병목이 생기는 일은 없으나, 위와 같이 한 달을 통째로 범위로 지정하는 경우에는 생성하는 데 꽤 오랜 시간이 걸릴 수 있다. 특히 시간도 `00:00 ~ 24:00`으로 한다면 더욱 그렇다.

실제로 위와 같이 이벤트를 만들어 사용하시는 유저분들도 있기 때문에, 이벤트 생성 처리 속도 개선이 필요하다고 판단되었다.


## 초기 성능 측정

> **성능 측정 툴은 `Grafana K6`를 사용하였다.**

또한 아래의 조건을 고정으로 두어 측정하였다.

>1) 5명의 동시 사용자가 호출 : `vus: 5`
2) 20번 호출 시 종료 : `iterations: 20`
3) `6월 1일 ~ 6월 30일 / 00:00 ~ 24:00` 로 범위 지정

조회에 비해서 빈번하게 이루어지는 경우가 아니기도 하고, 호출을 너무 많이 잡으면 테스트 시간이 과도하게 소요되어서 위와 같이 지정하였다.

![](https://velog.velcdn.com/images/hsh111366/post/8f35176b-af8f-442e-b840-4b242153d0e7/image.png)

초기에는 위와 같이 평균 응답 시간이 `16.56s`로 측정되었다.

## 병목 지점 찾기 : `StopWatch`


Spring의 `StopWatch`는 여러 작업의 실행 시간을 측정하여, 어떤 작업이 성능 병목을 유발하는지 분석하는 데 유용한 도구이다.

현재 인증 사용자의 이벤트를 생성해 주는 `createEventForAuthenticatedUser` 메서드는 여러 작업(save, QR 생성, 스케줄 저장)을 포함하고 있다.

이를 정밀하게 분석하기 위해, `StopWatch`로 각 단계의 소요 시간을 측정해 보았다.

```java
    @Transactional
    public CreateEventResponse createEventForAuthenticatedUser(CreateEventRequest createEventRequest, String authorizationHeader) {
        StopWatch stopWatch = new StopWatch("CreateEvent");

        stopWatch.start("saveEvent");
        Event savedEvent = eventRepository.save(createEventRequest.toEntity());
        stopWatch.stop();

        stopWatch.start("createQrCode");
        createAndAddQrCode(savedEvent);
        stopWatch.stop();

        stopWatch.start("saveParticipation");
        User user = jwtUtil.getUserFromHeader(authorizationHeader);
        EventParticipation eventParticipation = EventParticipation.builder()
                .user(user)
                .event(savedEvent)
                .eventStatus(EventStatus.CREATOR)
                .build();
        eventParticipationRepository.save(eventParticipation);
        stopWatch.stop();

        stopWatch.start("saveSchedules");
        validateAndSaveSchedules(savedEvent, createEventRequest);
        stopWatch.stop();

        log.info("\n✅ [CreateEvent 프로파일링 결과]\n{}", stopWatch.prettyPrint());

        return CreateEventResponse.of(savedEvent);
    }
```

```bash
✅ [CreateEvent 프로파일링 결과]
StopWatch 'CreateEvent': 17.522903625 seconds
---------------------------------------------
Seconds       %       Task name
---------------------------------------------
00.01018171   00%     saveEvent
00.13092308   01%     createQrCode
00.03012458   00%     saveParticipation
17.35167425   99%     saveSchedules
```

분석 결과, 총 소요 시간은 약 17.5초였으며, 이 중 99% 이상이 `saveSchedules` 과정에서 발생하였다.

이는 이벤트 생성 시, 30분 단위 스케줄을 생성하고 저장하는 과정에서 성능 병목이 발생한다는 의미이기에, 이를 우선적으로 해결하고자 하였다.

---

# 🚨 문제 1 : 약 3만 개의 INSERT

```
48 (30분 단위 스케줄) × 30 (일) × 20 (요청 수)  
= 28,800개의 Schedule insert
```

위에서 가정한 대로라면, 20번 호출을 했을 때 발생하는 INSERT 연산은 총 28,800번이 된다.
[`saveAll`이 `save` 에 비해 성능이 좋지만](https://velog.io/@sudhdkso/JPA-save와-saveAll의-성능-차이), 이 또한 결국에는 save 문을 한 번씩 호출하는 구조가 된다.

이를 개선하기 위해서, `Bulk Insert` 방식을 활용해보기로 했다.

## ✅ 해결 방안 : Bulk Insert

### Bulk Insert란?

`Bulk Insert`는 다수의 데이터를 한 번의 쿼리로 묶어 대량으로 삽입하는 방식을 의미한다.
예를 들어, 일반적인 insert는 다음과 같이 하나의 데이터에 대해 하나의 쿼리를 실행한다:

```sql
insert into schedules (date, time) values ('2025.06.01', '09:00');
insert into schedules (date, time) values ('2025.06.01', '09:30');
insert into schedules (date, time) values ('2025.06.01', '10:00');
...
```

하지만 `Bulk Insert`는 다음과 같이 다수의 데이터를 한 쿼리로 묶어 전송함으로써, DB와의 통신 횟수를 줄이고 성능을 크게 향상시킨다:

```sql
insert into schedules (date, time) values 
('2025.06.01', '09:00'), 
('2025.06.01', '09:30'), 
('2025.06.01', '10:00');
```

이 방식은 특히 수천, 수만 건의 데이터를 처리해야 하는 상황에서 효과가 크며, 대량 저장 작업의 성능 병목을 해결하는 주요 전략 중 하나로 활용되곤 한다.

### IDENTITY 전략은 Bulk Insert 사용이 불가?

여기서 한 가지 제약이 존재했다.
나는 보통 id에 대해서는 아래와 같이 IDENTITY 전략을 활용해 코드를 작성한다.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

하지만 해당 전략을 사용한다면, 일반적으로는 `Hibernate batch insert` 를 지원하지 않는데 그 이유는 아래와 같다.

>1. IDENTITY는 DB에서 **insert 시점에 ID를 생성함**
2. 즉, 각 row마다 insert 후에 DB에서 auto_increment된 PK를 받아와야 함
3. Hibernate batch insert를 활용하기 위해서는 **모든 ID를 미리 알아야 하나로 묶을 수 있음**
4. 하지만 IDENTITY는 **insert 후에야 ID를 알 수 있으므로**, 하나씩 insert할 수밖에 없음

### 대안 : JdbcTemplate을 활용한 직접 Bulk Insert

Hibernate의 제약 사항을 우회하기 위해, Spring의 JdbcTemplate을 활용한 직접 Bulk Insert 방식을 활용해 보려고 한다.

이를 통해 `@GeneratedValue(strategy = IDENTITY)` 전략은 그대로 유지하면서도, insert 쿼리를 하나로 묶어 대량 삽입을 수행할 수 있다.

> **ScheduleBatchRepository**

```java
@Repository
@RequiredArgsConstructor
public class ScheduleBatchRepository {

    private final JdbcTemplate jdbcTemplate;

    public void insertAll(List<Schedule> schedules) {
        String sql = "INSERT INTO schedules (events_id, date, day, time, created_date, updated_date) VALUES (?, ?, ?, ?, ?, ?)";
        Timestamp now = Timestamp.valueOf(LocalDateTime.now());

        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Schedule schedule = schedules.get(i);
                ps.setLong(1, schedule.getEvent().getId());
                ps.setString(2, schedule.getDate());
                ps.setString(3, schedule.getDay());
                ps.setString(4, schedule.getTime());
                ps.setTimestamp(5, now);
                ps.setTimestamp(6, now);
            }

            @Override
            public int getBatchSize() {
                return schedules.size();
            }
        });
    }
}
```

JDBC 템플릿을 활용하는 `ScheduleBatchRepository`를 만들어 준 후에, 해당 메서드를 서비스 단에서 `saveAll()` 대신 호출하도록 하였다.

```java
scheduleRepository.saveAll(schedules); // 기존

scheduleBatchRepository.insertAll(schedules); // 변경 후
```

### `rewriteBatchedStatements=true`

`Bulk Insert`를 적용했음에도 성능 개선 효과가 나타나지 않았고, SQL 로그도 출력되지 않아 문제의 원인을 파악하기 어려웠다.

[서칭을 해 본 결과](https://hyos-dev-log.tistory.com/1), MySQL의 경우 `rewriteBatchedStatements=true` 옵션을 명시적으로 설정하지 않으면 JDBC 드라이버가 실제로 배치 쿼리를 하나의 쿼리로 합치지 않는다는 사실을 알게 되었다.

때문에 아래와 같이 DB URL을 수정하여 옵션을 추가해주었다.

```yaml
jdbc:mysql:// ... &rewriteBatchedStatements=true
```

## 📊 결과

![](https://velog.velcdn.com/images/hsh111366/post/41f431b0-0b10-4123-a527-273d9de7e111/image.png)

`Bulk Insert`를 제대로 적용한 결과, 처리 속도가 `16.56s -> 0.41s`로 크게 개선된 것을 확인할 수 있었다!

```bash
✅ [CreateEvent 프로파일링 결과]
StopWatch 'CreateEvent': 0.215752875 seconds
--------------------------------------------
Seconds       %       Task name
--------------------------------------------
0.034693542   16%     saveEvent
0.0626085     29%     createQrCode
0.027162833   13%     saveParticipation
0.091288      42%     saveSchedules
```

분석 결과를 보아도, `saveSchedules`가 차지하는 비율이 많이 낮아진 것을 볼 수 있다.

> 🧑🏻‍💻 다음으로 높은 `createQrCode` 단계에 대한 개선을 진행해볼까 하였지만, 해당 메서드를 주석처리 한 후 측정하였을 때에도 처리 속도의 차이가 미미하였다. 
때문에 가장 큰 병목 지점이었던 `saveSchedules` 단계를 개선한 것에 만족하며 여기서 마무리 하고자 한다.

---

# 🏁 마무리

## 💡 느낀 점 및 배운 점

1. 테스트 상으로 처리 속도가 `16.56s -> 0.41s (97.5%)` 개선되었다. 
2. 다량의 INSERT 문이 발생할 때에는, 앞으로도 `Bulk Insert`를 고려해 보아야겠다는 생각이 들었다.
3. `Bulk Insert`를 사용하기 위해서는, `rewriteBatchedStatements=true` 옵션을 꼭 지정해주어야 한다.
4. `StopWatch` 라는 성능 측정 툴을 알게 되었다. 앞으로도 세세하게 병목 지점을 찾아낼 때 활용해보아야겠다.
