---
date: 2025-05-10
tags:
  - troubleshooting
  - backend
  - springsecurity
---

---

# 🎬 서론

최근에 원타임의 로깅을 개선해보았다. [관련 글](https://bbbang105.github.io/Spring/%EC%A1%B0%EC%95%85%ED%95%9C-%EB%A1%9C%EA%B9%85-%EA%B0%9C%EC%84%A0%ED%95%B4-%EB%B3%B4%EA%B8%B0)

![](https://velog.velcdn.com/images/hsh111366/post/03da7f37-f29a-47cd-89e0-a51e23a48177/image.png)

해당 과정에서 JWT 검증 로직이 중복되어, 불필요하게 검증이 1번 더 이루어지는 문제가 있었기에 모두 시큐리티 컨텍스트에 등록된 유저 객체를 사용하는 방향으로 해결하였다.

문제가 더 이상 없을 것이라고 생각하고 테스트 서버에 배포하였지만, 예기치 못 한 500에러가 계속해서 발생하며 제대로 동작하지 않았다.

지금부터는 해당 문제에 대해 해결하고 배운 점을 정리해보려고 한다.

---

# 🚨 문제

```
2025-05-03T06:01:22.264+09:00  INFO 89099 --- [nio-8090-exec-9] s.o.g.interceptor.LoggingInterceptor     : ✅ [GET] /v3/api-docs request completed - 359ms | status=200
2025-05-03T06:01:56.217+09:00  INFO 89099 --- [nio-8090-exec-6] s.o.g.interceptor.LoggingInterceptor     : 📦 [GET] /api/v1/schedules/date/e7285da6-1d97-40cf-88d7-63c34285485e/user 
pathVars : {event_id=e7285da6-1d97-40cf-88d7-63c34285485e}
2025-05-03T06:01:56.311+09:00 ERROR 89099 --- [nio-8090-exec-6] s.o.exception.GlobalExceptionHandler     : failed to lazily initialize a collection of role: side.onetime.domain.User.selections: could not initialize proxy - no Session: {}

org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role: side.onetime.domain.User.selections: could not initialize proxy - no Session
	at org.hibernate.collection.spi.AbstractPersistentCollection.throwLazyInitializationException(AbstractPersistentCollection.java:634) ~[hibernate-core-6.5.2.Final.jar:6.5.2.Final]
	at org.hibernate.collection.spi.AbstractPersistentCollection.withTemporarySessionIfNeeded(AbstractPersistentCollection.java:217) ~[hibernate-core-6.5.2.Final.jar:6.5.2.Final]
	at org.hibernate.collection.spi.AbstractPersistentCollection.initialize(AbstractPersistentCollection.java:613) ~[hibernate-core-6.5.2.Final.jar:6.5.2.Final]
	at org.hibernate.collection.spi.AbstractPersistentCollection.read(AbstractPersistentCollection.java:136) ~[hibernate-core-6.5.2.Final.jar:6.5.2.Final]
	at org.hibernate.collection.spi.PersistentBag.iterator(PersistentBag.java:369) ~[hibernate-core-6.5.2.Final.jar:6.5.2.Final]
	at java.base/java.util.Spliterators$IteratorSpliterator.estimateSize(Spliterators.java:1865) ~[na:na]
	at java.base/java.util.Spliterator.getExactSizeIfKnown(Spliterator.java:414) ~[na:na]
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:508) ~[na:na]
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499) ~[na:na]
	at java.base/java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:921) ~[na:na]
	at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234) ~[na:na]
	at java.base/java.util.stream.ReferencePipeline.collect(ReferencePipeline.java:682) ~[na:na]
	at side.onetime.service.ScheduleService.getUserDateSchedules(ScheduleService.java:453) ~[main/:na]
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77) ~[na:na]
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[na:na]
	at java.base/java.lang.reflect.Method.invoke(Method.java:569) ~[na:na]
	at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:354) ~[spring-aop-6.1.11.jar:6.1.11]
	at org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:196) ~[spring-aop-6.1.11.jar:6.1.11]
	at 
    
(생략 ..)
```

에러 로그는 위와 같았으며, 아래 부분이 중요한 포인트였다.

### LazyInitializationException

```
org.hibernate.LazyInitializationException: 
failed to lazily initialize a collection of role: side.onetime.domain.User.selections: 
could not initialize proxy - no Session
```

User 엔티티의 selections 필드가 LAZY 로딩으로 설정되어 있는데, Session이 닫힌 상태에서 selections에 접근했기 때문에 발생하는 에러였다.

즉, 트랜잭션(세션) 범위 밖에서 LAZY 필드에 접근한 것이 문제였던 것이다.

## 코드

문제인 코드를 한 번 살펴보자.

### JwtFilter

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * 요청을 처리하며 JWT 검증 및 인증 설정을 수행합니다.
     *
     * @param request     HTTP 요청 객체
     * @param response    HTTP 응답 객체
     * @param filterChain  필터 체인 객체
     * @throws ServletException 서블릿 예외 발생 시
     * @throws IOException      입출력 예외 발생 시
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
                filterChain.doFilter(request, response);
                return;
            }
            String token = jwtUtil.getTokenFromHeader(request.getHeader("Authorization"));
            jwtUtil.validateToken(token);
            Long userId = jwtUtil.getClaimFromToken(token, "userId", Long.class);
            setAuthentication(userId);

        } catch (Exception e) {
            log.error("JWT validation failed: " + e.getMessage());
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }

    /**
     * 인증 정보를 SecurityContext에 설정합니다.
     *
     * @param userId 인증된 사용자의 ID
     */
    private void setAuthentication(Long userId) {
        UserDetails userDetails = customUserDetailsService.loadUserByUserId(userId);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
```

생략하는 특정 API를 제외하고, 호출이 되면 JwtFilter를 거쳐서 SecurityContext에 유저 객체를 저장한다.

### CustomUserDetailsService

```java
    /**
     * 사용자 ID로 사용자 정보를 로드합니다.
     *
     * 데이터베이스에서 주어진 사용자 ID를 기반으로 사용자를 조회하고,
     * CustomUserDetails 객체로 래핑하여 반환합니다.
     *
     * @param userId 사용자 ID
     * @return 사용자 상세 정보 (CustomUserDetails 객체)
     * @throws CustomException 사용자 ID에 해당하는 사용자가 없을 경우 예외를 발생시킵니다.
     */
    public UserDetails loadUserByUserId(Long userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserErrorStatus._NOT_FOUND_USER_BY_USERID));
        return new CustomUserDetails(user);
    }
```

실질적으로 유저 객체는 위 로직에서 가져오게 된다.

### ScheduleController

```java
    /**
     * 개인 요일 스케줄 조회 API (로그인).
     *
     * 인증된 사용자의 특정 이벤트에 대한 개인 요일 스케줄을 조회합니다.
     *
     * @param eventId 조회할 이벤트의 ID
     * @param customUserDetails 인증된 사용자 정보
     * @return 사용자의 요일 스케줄
     */
    @GetMapping("/day/{event_id}/user")
    public ResponseEntity<ApiResponse<PerDaySchedulesResponse>> getUserDaySchedules(
            @PathVariable("event_id") String eventId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        PerDaySchedulesResponse perDaySchedulesResponse = scheduleService.getUserDaySchedules(eventId, customUserDetails.user());
        return ApiResponse.onSuccess(SuccessStatus._GET_USER_DAY_SCHEDULES, perDaySchedulesResponse);
    }
```

SecurityContext에 저장된 유저 객체 자체를 서비스 단으로 보낸다.

### ScheduleService

```java
    /**
     * 개인 요일 스케줄 반환 메서드 (로그인).
     *
     * 로그인 사용자의 개인 요일 스케줄을 반환합니다.
     *
     * @param eventId 조회할 이벤트 ID
     * @param user 인증된 사용자
     * @return 개인 요일 스케줄 응답
     */
    @Transactional(readOnly = true)
    public PerDaySchedulesResponse getUserDaySchedules(String eventId, User user) {
        Event event = eventRepository.findByEventId(UUID.fromString(eventId))
                .orElseThrow(() -> new CustomException(EventErrorStatus._NOT_FOUND_EVENT));

        Map<String, List<Selection>> groupedSelectionsByDay = user.getSelections().stream()
                .filter(selection -> selection.getSchedule().getEvent().equals(event))
                .collect(Collectors.groupingBy(
                        selection -> selection.getSchedule().getDay(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<DaySchedule> daySchedules = groupedSelectionsByDay.entrySet().stream()
                .map(entry -> DaySchedule.from(entry.getValue()))
                .collect(Collectors.toList());

        return PerDaySchedulesResponse.of(user.getNickname(), daySchedules);
    }
```

서비스에서는 파라미터로 들어온 유저 객체를 활용해서 비즈니스 로직을 처리한다.
여기서 바로 아래 부분이 문제가 되었다.

```java
Map<String, List<Selection>> groupedSelectionsByDay = user.getSelections().stream() ...
```

정리하면 문제 로직은 아래와 같다.

>  1. JwtFilter에서 UserDetails로 생성된 User 객체 → SecurityContext에 넣음
2. 이후 컨트롤러 → 서비스 → getUserDaySchedules(String eventId, User user) 호출
3. 이때 전달된 user는 영속성 컨텍스트(세션) 밖에 있는 **detached 객체**
4. 그런데 user.getSelections()는 LAZY → DB 접근 필요 → **❌ 세션 없음 → LazyInitializationException 발생**

> ☝🏻 **Detached 객체란?**
- JPA/Hibernate가 더 이상 관리하지 않는 엔티티 객체
- 즉, 영속성 컨텍스트(Session) 에서 **분리(detach)된 상태.**


---

# ✅ 해결

이를 해결하기 위해서는 서비스의 트랜잭셔널 내에서, 유저 객체를 직접 `find~` 하여 가져와야 했다. 그렇기에 서비스 단에서 SecurityContext 내에 있는 유저 객체의 id를 사용해서 다시 가져오는 방식으로 리팩토링하기로 결정했다.

다만 여기서 한 가지 의문점이 들었다.

> 그럼 그냥 userId만 SecurityContext에 저장하면 되는 거 아닌가?

해당 부분도 고려는 하였지만, SecurityContext에 User를 저장하는 큰 이유는 
`현재 로그인한 사용자가 누구인지 전역적으로 접근할 수 있게 하기 위함`이기에 유저를 저장하는 부분은 유지하기로 했다.

## 해결 후 코드

### UserAuthorizationUtil

```java
public class UserAuthorizationUtil {

    private UserAuthorizationUtil() {
        throw new AssertionError();
    }
    
    /**
     * 현재 로그인한 사용자의 ID를 반환하는 메서드.
     *
     * SecurityContextHolder에서 Authentication을 가져와
     * CustomUserDetails로 캐스팅한 후, 사용자 ID를 추출합니다.
     *
     * @return 로그인된 사용자의 ID
     */
    public static Long getLoginUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}

```

코드 수정에 앞서 위 유틸 클래스를 생성해주었다.
SecurityContextHolder에서 userId를 추출하여 반환하는 메서드가 존재한다.

### ScheduleController

```java
    /**
     * 개인 날짜 스케줄 조회 API (로그인).
     *
     * 인증된 사용자의 특정 이벤트에 대한 개인 날짜 스케줄을 조회합니다.
     *
     * @param eventId 조회할 이벤트의 ID
     * @return 사용자의 날짜 스케줄
     */
    @GetMapping("/date/{event_id}/user")
    public ResponseEntity<ApiResponse<PerDateSchedulesResponse>> getUserDateSchedules(
            @PathVariable("event_id") String eventId) {

        PerDateSchedulesResponse perDateSchedulesResponse = scheduleService.getUserDateSchedules(eventId);
        return ApiResponse.onSuccess(SuccessStatus._GET_USER_DATE_SCHEDULES, perDateSchedulesResponse);
    }
```

기존에 존재하던 
```
@AuthenticationPrincipal CustomUserDetails customUserDetails
```
을 제거하였다.

### ScheduleService

```java
   /**
     * 개인 요일 스케줄 반환 메서드 (로그인).
     *
     * 로그인 사용자의 개인 요일 스케줄을 반환합니다.
     *
     * @param eventId 조회할 이벤트 ID
     * @return 개인 요일 스케줄 응답
     */
    @Transactional(readOnly = true)
    public PerDaySchedulesResponse getUserDaySchedules(String eventId) {
        User user = userRepository.findById(UserAuthorizationUtil.getLoginUserId())
                .orElseThrow(() -> new CustomException(UserErrorStatus._NOT_FOUND_USER));

        Event event = eventRepository.findByEventId(UUID.fromString(eventId))
                .orElseThrow(() -> new CustomException(EventErrorStatus._NOT_FOUND_EVENT));

        Map<String, List<Selection>> groupedSelectionsByDay = user.getSelections().stream()
                .filter(selection -> selection.getSchedule().getEvent().equals(event))
                .collect(Collectors.groupingBy(
                        selection -> selection.getSchedule().getDay(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<DaySchedule> daySchedules = groupedSelectionsByDay.entrySet().stream()
                .map(entry -> DaySchedule.from(entry.getValue()))
                .collect(Collectors.toList());

        return PerDaySchedulesResponse.of(user.getNickname(), daySchedules);
    }
```

서비스 단에서 UserAuthorizationUtil을 활용해 userId를 가져온 후 user 객체를 가져와 세션에 올린다. 이후 로직은 동일하다.

```java
User user = userRepository.findById(UserAuthorizationUtil.getLoginUserId())
                .orElseThrow(() -> new CustomException(UserErrorStatus._NOT_FOUND_USER));
```

다른 부분도 동일하게 변경하며 문제를 해결할 수 있었다.


---

# 🏁 마무리

1. 기존에는 몰랐던 `LazyInitializationException`에 대해서 알 수 있었던 경험이었다.
2. DB와 JPA, 영속성 컨텍스트에 대한 깊은 이해가 필요하다고 느꼈다. 때문에 다음에는 지연 로딩 & Proxy에 대해서 공부하는 글을 적어보려고 한다. ([참고할 글](https://yeon-kr.tistory.com/190))
