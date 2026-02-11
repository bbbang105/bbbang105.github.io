---
date: 2025-06-08
description: 토큰 재발행 시 발생한 동시성 문제를 Redisson 분산 락과 AOP로 해결한 과정입니다.
tags:
  - onetime
  - backend
  - side-project
---

---

# 🚨 문제 상황

11개월째 운영중인, [다인원 일정조율 웹서비스 OneTime](https://www.onetime-with-members.com/)에서는 액세스 & 리프레쉬 토큰을 아래와 같이 관리하고 있다.

> 1. 로그인 시, 유저의 액세스 & 리프레쉬 토큰을 반환한다.
2. 클라이언트에서 보관 후, 필요 시에 재발행 요청을 한다.
	 - 요청 시에는 리프레쉬 토큰을 담아서 보낸다.
3. 서버에서는 받은 리프레쉬 토큰이 유저 id와 동일한지 & 레디스에 있는 토큰과 동일한지 검증한다.
4. 검증이 완료되었다면, **액세스 & 리프레쉬 토큰 모두 재발행하여 반환한다.**
	- 리프레쉬 토큰까지 재발행 하는 이유는, [토큰 탈취 시나리오를 고려](https://mgyo.tistory.com/832#google_vignette)한 것이다.
    - 물론 그렇다고 모든 경우에 대해서 안전할 수는 없다. 
5. 검증에 실패하는 등 문제가 발생하는 경우에는, **401 에러를 응답하여 재로그인**하도록 한다.
6. 현재는 `유저id + 브라우저id`를 복합키로 두었고, 총 5개의 조합을 가질 수 있다.
	- 즉, **유저 1명 당 5개의 브라우저에서 접속 및 로그인 유지가 가능한 상태**이다.
    
여기서 중요한 부분은 4번으로, 현재는 리프레쉬 토큰까지 함께 재발행하므로 재사용이 불가능하다.

때문에 이전에 사용한 리프레쉬 토큰으로 요청을 보내는 경우에는, 401 에러 응답을 하게 되고 유저는 재로그인을 해야 한다.

## 동시성 문제

언제부터인가 원타임에서 로그인이 한 번씩 풀리는 경우가 발생했다. 매번 그런 것은 아니었기에 대수롭지 않게 여겼으나, 최근 관련 로직을 건들게 되면서 문제가 있다는 것을 알게 되었다.

```bash
2025-06-05T01:18:35.210+09:00  INFO 1 --- [nio-8090-exec-8] s.o.g.interceptor.LoggingInterceptor     : 📦 [POST] /api/v1/tokens/action-reissue 
body : {
  "refresh_token" : "..."
}
2025-06-05T01:18:35.231+09:00  INFO 1 --- [nio-8090-exec-8] s.o.g.interceptor.LoggingInterceptor     : ✅ [POST] /api/v1/tokens/action-reissue request completed - 21ms | status=201
2025-06-05T01:18:35.907+09:00  INFO 1 --- [io-8090-exec-10] s.o.g.interceptor.LoggingInterceptor     : ✅ [GET] /api/v1/users/profile request completed - 6ms | status=200
2025-06-05T01:18:35.964+09:00  INFO 1 --- [nio-8090-exec-9] s.o.g.interceptor.LoggingInterceptor     : 📦 [POST] /api/v1/tokens/action-reissue 
body : {
  "refresh_token" : "..."
}
2025-06-05T01:18:35.968+09:00 ERROR 1 --- [nio-8090-exec-9] s.o.exception.GlobalExceptionHandler     : CustomException: 리프레쉬 토큰을 찾을 수 없습니다.
2025-06-05T01:18:35.969+09:00 ERROR 1 --- [nio-8090-exec-9] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 5ms | status=401
```

위 로그를 보게 되면, 거의 동일한 시점에 재발행 요청을 보낸다. 현재 리프레쉬 토큰은 마스킹하였지만, **동일한 리프레쉬 토큰으로 요청이 들어온 상황이다.**

때문에 첫 번째 요청에 대해서는 정상적으로 201 처리되었지만, 두 번째 요청에 대해서는 401 에러가 발생했다.

문제 상황을 정리하면 아래와 같다.

> 1. 동시에 A, B 요청이 들어온다.
2. A에서 보낸 리프레쉬 토큰과, 레디스에 저장된 리프레쉬 토큰이 동일하다. 때문에 정상적으로 재발행되고 201을 응답한다.
3. 2번 과정에서 재발행된 리프레쉬 토큰이 레디스에 새롭게 저장된다.
4. B에서 보낸 리프레쉬 토큰(A에서 보낸 것과 같음)과, 레디스에 저장된 리프레쉬 토큰을 비교한다. **하지만 이미 재발행되어 새롭게 저장되었기에 동일하지 않다.**
5. 때문에 B 요청에 대해서는 `"리프레쉬 토큰을 찾을 수 없습니다."` 401 에러를 반환하게 되고, 유저의 로그인 상태가 풀린다.

만약 A에서 새로운 리프레쉬 토큰을 저장하기 전에, B에서 레디스에 있는 리프레쉬 토큰을 이미 조회했다면 문제가 발생하지 않았을 것이다. 이러한 부분 때문에 항상 로그인이 풀리지는 않았던 것 같다.

유저의 로그인 유지는 사용성 부분에서 중요한 부분이기에, 서버에서도 안전성을 보장하는 것이 좋다고 판단하였고 **이를 위해 분산 락을 도입하게 되었다.**

---

# 🔒 분산 락

## 분산 락(Distributed Lock)이란?

`분산 락` 은 멀티 서버 환경에서 공유 리소스에 대한 동시 접근을 제어하기 위한 동기화 메커니즘이다.
 
단일 인스턴스 환경에서는 `synchronized, ReentrantLock`과 같은 JVM 수준의 락을 활용할 수 있지만, 여러 서버가 동시에 요청을 처리하는 환경에서는 프로세스 간 자원을 제어할 수단이 필요하다.

> **특징**
- 락의 소유 여부를 `Redis`나 `ZooKeeper` 같은 중앙 저장소를 통해 관리한다.
- 동시에 하나의 프로세스만 락 소유가 가능하다.
- 일정 시간 후 자동 해제되도록 TTL (lease time)등의 설정이 가능하다.

> **주요 사용 사례**
- 결제/주문 시스템에서 중복 결제 방지
- 단일 자원에 대한 동시 변경 제어
- 동일 자원을 조작하는 배치 작업에서의 충돌 방지

### 사용 이유

그러나 현재 OneTime은 단일 서버로 운영중이기에, `분산 락을 사용하는 것이 적절한가?` 라는 의문이 들 수 있다.

고민 끝에 아래와 같은 이유로 분산 락 사용을 결정하였다.

> 1. 리프레쉬 토큰을 저장하고 있는 Redis는 애플리케이션 외부 리소스이기 때문에, synchronized 같은 JVM 내부 락으로는 Redis 상태를 보장할 수 없다. 또한 락이 풀린 순간 외부 접근이 동시에 발생할 수 있어 정합성 보장이 어렵다.

> 2. 향후 서버가 여러 대로 확장되더라도, Redis 기반 분산 락은 확장성과 안정성을 유지할 수 있다.

분산 락을 구현할 수 있는 방법은 다양하지만, 그 중에서도 `Redisson`을 택하게 되었다.

## Redisson이란?

`Redisson`은 **Java 기반의 Redis 클라이언트**로, Redis를 이용한 `분산 락, 캐시, 세션, 큐` 등의 고급 기능을 제공하는 라이브러리이다.

Redisson은 `Redis`를 활용해서 **여러 스레드 / 여러 서버에서 동시에 접근하는 상황에서도 락을 제어**할 수 있다.

### Redisson 🆚 Lettuce

분산 락 구현 시 자주 사용되는 두 스택을 비교해 보자면 아래와 같다.

| 항목 | **Redisson** | **Lettuce** |
|------|--------------|-------------|
| **락 구현 방식** | 내장된 고수준 락 구현 제공 (Fair Lock, ReentrantLock 등) | 기본 Redis 명령어 기반 (`SETNX`, `EXPIRE`)으로 직접 구현 필요 |
| **락 소유자 식별** | `lock.unlock()` 시 락 소유자 여부 확인 가능 | 기본 API에서는 소유자 확인 기능 없음 |
| **자동 만료 (TTL)** | `leaseTime` 설정으로 자동 해제 가능 | `EXPIRE` 명시적 설정 필요, 누락 시 지속될 수 있음 |
| **재시도 로직** | `tryLock()` 등에서 내부 재시도, 대기 시간 포함 (스핀락 아님) | 재시도 로직 직접 구현 필요 (`while` 루프 + 백오프 등) |
| **예외 상황 처리** | 락 소유 여부 검증 및 자동 해제로 복구에 유리 | 예외 상황 시 해제 누락이나 충돌 가능성 고려 필요 |
| **API 사용성** | 고수준 API 제공으로 간결한 코드 작성 가능 | Redis 명령 조합 위주로 유연하지만 상대적으로 복잡 |
| **적합한 상황** | 분산 락, 세션, 큐 등 고급 동기화 기능이 필요한 경우 | 비동기 처리나 커스터마이징이 필요한 경우, 캐시 중심 구조 |

> **💡 스핀 락(Spin Lock)이란?**
>
스핀 락은 락을 획득할 때까지 반복적으로 락 상태를 확인하며 기다리는 락 방식이다. 즉, 락이 해제될 때까지 계속 루프를 돌며(lock이 풀릴 때까지 spin) 대기한다.

[참고한 블로그](https://yeees.tistory.com/473)

### 왜 Redisson이 더 적합한가?

> 1. 재시도 로직을 자동으로 처리해주기 때문에 `스핀락` 없이 효율적으로 이용할 수 있다.

> 2. TTL 기반 자동 해제 기능이 있기 때문에, 락이 무기한 유지될 일이 없다.

> 3. Lettuce에 비해서 추상화가 많이 되어 있기에, API 사용이 쉽고 간결하다. 때문에 실수를 줄일 수 있고, 유지보수가 용이하다.

> 4. 보안 민감한 Refresh Token 처리에 안전성을 확보할 수 있다.

정리하자면 현재 리프레시 토큰 갱신 시 Redis 기반 락이 필요하고, 동시에 `안전성 / 예외 복원`이 중요한 상황이므로, 직접 락을 구현해야 하는 `Lettuce`보다 `Redisson`이 더 적합하다고 판단하였다.

## Redisson 분산 락 구현 과정

### Redisson 의존성 추가

```java
// Redisson
implementation 'org.redisson:redisson-spring-boot-starter:3.46.0'
```

### RedissonConfig

```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    private static final String REDISSON_HOST_PREFIX = "redis://";

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
                .setAddress(REDISSON_HOST_PREFIX + redisHost + ":" + redisPort)
                .setConnectionMinimumIdleSize(1)
                .setConnectionPoolSize(64)
                .setConnectTimeout(3000)
                .setTimeout(3000)
                .setRetryAttempts(3)
                .setRetryInterval(1500);
        return Redisson.create(config);
    }
}

```

| 옵션                          | 설명                                                   |
|-----------------------------|--------------------------------------------------------|
| `setAddress()`              | Redis 주소 지정 (`redis://host:port`)                   |
| `setConnectionMinimumIdleSize()` | 최소 유휴 커넥션 수 (항상 유지할 커넥션 수)              |
| `setConnectionPoolSize()`       | 최대 커넥션 풀 크기 (동시 요청 처리 수용 범위)           |
| `setConnectTimeout()`           | Redis 서버 연결 시도 타임아웃(ms)                        |
| `setTimeout()`                  | Redis 명령 처리 타임아웃(ms)                             |
| `setRetryAttempts()`            | 실패 시 재시도 횟수                                     |
| `setRetryInterval()`            | 재시도 간격(ms)                                        |

---

# ⬇️ AOP

여기까지 `Redisson`에 대한 기본 설정은 마쳤다.
바로 사용할 수 있지만, **공통 관심사를 분리하기 위해 AOP를 적용**해보기로 결정했다.

## AOP란?

![](https://velog.velcdn.com/images/hsh111366/post/d7a1e89d-18be-4d4b-b55f-59bb65b68180/image.png)


> `AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)`는
**공통 로직을 핵심 로직과 분리해서 관리할 수 있게 해주는 개념**이다.

예를 들어, `로깅, 트랜잭션, 인증, 분산 락` 같은 기능들은 여러 클래스에 걸쳐 반복되기 쉽고, **핵심 비즈니스 로직과 섞이면 코드가 지저분**해질 수 있다.

AOP는 이런 로직들을 핵심 로직과 분리해서 깔끔하게 처리할 수 있게 도와준다.

## 선정 이유

현재는 재발행 메서드에만 락 관련 로직을 추가하겠지만, 추후 늘어날 수 있는 여지가 있다.

때문에 모든 메서드에 직접 락을 잡고 해제하는 코드를 작성하는 건 유지보수나 확장성 면에서 좋지 않다고 판단했다.

아래에서 자세히 나오겠지만, AOP를 적용한다면 락을 사용할 메서드에 단순히 `@DistributedLock` 같은 어노테이션만 붙여 적용할 수 있기에 실용적이다.

## 구현 과정

### DistributedLock 커스텀 어노테이션

```java
import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {
    String prefix();
    String key();
    long waitTime() default 3L;
    long leaseTime() default 2L;
    TimeUnit timeUnit() default TimeUnit.SECONDS;
}

```

Redisson 기반 분산 락을 적용하기 위한 `AOP 어노테이션`이다.

이 어노테이션은 `@Aspect`로 구성된 AOP 클래스에서 파싱되어 Redisson의 `tryLock()` 등에 적용되는 구조로 활용된다.

| 속성명       | 설명                                                                 | 기본값             |
|--------------|----------------------------------------------------------------------|--------------------|
| `prefix`     | 락 키의 접두사. 서비스 도메인 구분 등을 위해 사용됨                 | default 없으므로 필수             |
| `key`        | 락을 걸기 위한 고유 식별자 (ex. 사용자 ID, 요청 ID 등)               | default 없으므로 필수             |
| `waitTime`   | 락 획득을 위해 기다리는 최대 시간                                   | `3L`               |
| `leaseTime`  | 락을 획득한 뒤 자동 해제까지의 시간                                  | `2L`               |
| `timeUnit`   | `waitTime`, `leaseTime`에 대한 시간 단위                             | `TimeUnit.SECONDS` |

### CustomSpringELParser

```java
import lombok.RequiredArgsConstructor;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

import java.lang.reflect.Method;

@RequiredArgsConstructor
public class CustomSpringELParser {

    private final SpelExpressionParser parser = new SpelExpressionParser();
    private final DefaultParameterNameDiscoverer nameDiscoverer = new DefaultParameterNameDiscoverer();

    public String getDynamicValue(Method method, Object[] args, String expression) {
        EvaluationContext context = new StandardEvaluationContext();
        String[] paramNames = nameDiscoverer.getParameterNames(method);

        if (paramNames != null) {
            for (int i = 0; i < paramNames.length; i++) {
                context.setVariable(paramNames[i], args[i]);
            }
        }

        return parser.parseExpression(expression).getValue(context, String.class);
    }
}

```

`CustomSpringELParser`는 메서드에 전달된 파라미터 값을 `SpEL(Spring Expression Language)` 형식으로 동적으로 해석해 `락 키`를 생성하는 유틸 클래스이다.

예를 들어 `@DistributedLock(key = "#userId")`처럼 작성하면, AOP 내부에서 `userId` **파라미터의 실제 값을 추출해 락 키에 사용**할 수 있다.
`#dto.name`처럼 객체 내부 필드도 접근 가능하며, 런타임에 동적으로 평가된다.

이를 통해 메서드마다 유연하고 구체적인 락 키를 지정할 수 있게 된다.

### DistributedLockAop

```java
package side.onetime.global.lock.aop;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;
import side.onetime.exception.CustomException;
import side.onetime.exception.status.TokenErrorStatus;
import side.onetime.global.lock.annotation.DistributedLock;
import side.onetime.global.lock.util.CustomSpringELParser;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class DistributedLockAop {

    private final RedissonClient redissonClient;
    private final CustomSpringELParser parser = new CustomSpringELParser();

    @Around("@annotation(lock)")
    public Object lock(ProceedingJoinPoint joinPoint, DistributedLock lock) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String dynamicKey = parser.getDynamicValue(signature.getMethod(), joinPoint.getArgs(), lock.key());
        String lockName = lock.prefix() + ":" + dynamicKey;

        RLock rLock = redissonClient.getLock(lockName);
        boolean available = false;

        try {
            available = rLock.tryLock(lock.waitTime(), lock.leaseTime(), lock.timeUnit());
            if (!available) {
                throw new CustomException(TokenErrorStatus._TOO_MANY_REQUESTS);
            }

            log.debug("🔐 락 획득: {}", lockName);
            return joinPoint.proceed();
        } finally {
            if (available && rLock.isHeldByCurrentThread()) {
                rLock.unlock();
                log.debug("🔓 락 해제: {}", lockName);
            }
        }
    }
}

```

`DistributedLockAop`는 `@DistributedLock` 어노테이션이 붙은 **메서드에 AOP 방식으로 Redisson 기반의 분산 락을 적용해주는 클래스**이다.

동작 과정은 아래와 같다.


> **1. @Around("@annotation(lock)")**
`@DistributedLock`이 붙은 메서드 실행 전후에 해당 AOP가 작동한다.

> **2. parser.getDynamicValue(...)**
`SpEL`을 이용해 락 키로 사용할 동적 값을 추출한다.

> **3. rLock.tryLock(...)**
`waitTime` 동안 락을 기다리고, `leaseTime` 동안 유지한다. 락 획득 실패 시 커스텀 예외를 발생한다.

> **4. rLock.unlock()**
락을 현재 스레드가 가지고 있다면 해제한다.

### 패키지 구조

![](https://velog.velcdn.com/images/hsh111366/post/834f5891-97b8-42c8-9362-a65a761ff646/image.png)

### AopForTransaction

```java
@Component
public class AopForTransaction {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Object proceed(final ProceedingJoinPoint joinPoint) throws Throwable {
        return joinPoint.proceed();
    }
}

```

`AopForTransaction`은 락이 걸린 로직에서 트랜잭션을 분리 실행할 때 사용할 수 있다.

`@Transactional(REQUIRES_NEW)`로 **항상 새로운 트랜잭션을 시작하게 하여, 트랜잭션 커밋 이후에 락이 해제되도록 보장**한다.

현재는 트랜잭션이 사용되지 않는 로직에 락을 추가하였기에 필요 없지만, **추후 DB 작업이 추가되면 위 기능을 추가하여 데이터 정합성을 보장**해야 할 것이다.

### 메서드에 적용하기

```java
   @DistributedLock(prefix = "lock:reissue", key = "#reissueTokenRequest.refreshToken", waitTime = 0)
    public ReissueTokenResponse reissueToken(ReissueTokenRequest reissueTokenRequest) {
        String refreshToken = reissueTokenRequest.refreshToken();

        Long userId = jwtUtil.getClaimFromToken(refreshToken, "userId", Long.class);
        String browserId = jwtUtil.getClaimFromToken(refreshToken, "browserId", String.class);
        String existRefreshToken = refreshTokenRepository.findByUserIdAndBrowserId(userId, browserId)
                .orElseThrow(() -> new CustomException(TokenErrorStatus._NOT_FOUND_REFRESH_TOKEN));

        if (!existRefreshToken.equals(refreshToken)) {
            throw new CustomException(TokenErrorStatus._NOT_FOUND_REFRESH_TOKEN);
        }

        String newAccessToken = jwtUtil.generateAccessToken(userId, "USER");
        String newRefreshToken = jwtUtil.generateRefreshToken(userId, browserId);
        refreshTokenRepository.save(new RefreshToken(userId, browserId, newRefreshToken));

        return ReissueTokenResponse.of(newAccessToken, newRefreshToken);
    }
```

`@DistributedLock(prefix = "lock:reissue", key = "#reissueTokenRequest.refreshToken", waitTime = 0)` 어노테이션을 붙임으로써 토큰 재발행 메서드에 분산 락을 적용한 모습이다.

AOP를 활용했기에, 비즈니스 로직에 추가적인 코드를 포함하지 않고도 깔끔하게 분산 락을 적용할 수 있게 되었다.

> 1. `refreshToken` 자체를 락의 key로 사용하여, 동일한 토큰당 하나의 락만 생성되도록 하였다.

>2. `waitTime = 0`으로 설정함으로써, 이미 다른 요청이 락을 잡고 있으면 바로 실패시키도록 만들었다.
>
토큰 재발행은 한 번만 성공해야 하는 작업이라 기다릴 필요가 없으며, 중복 요청을 강하게 막아야 하는 케이스이기에 이렇게 결정하였다.
>

### + 25.06.12 내용 추가

하지만 완전히 동일한 타이밍에 들어오는 요청이 아니고서는 429 에러를 보낼 수 없었다. 문제가 된 건 아래와 같은 상황이었다.

	1.	첫 번째 요청이 락을 잡고 정상적으로 처리된 뒤 락을 해제한다.
	2.	두 번째 요청이 락이 해제된 이후 들어온다.
	3.	락을 정상적으로 잡은 후 로직을 처리한다.
	4.	첫 번째 요청에서 이미 이전 토큰은 재발행되었고, Redis에서는 삭제된 상태이다.
	5.	결국 두 번째 요청은 401 에러가 발생해 유저는 재로그인을 해야 한다.

즉, **요청이 이미 처리되어 락이 해제된 이후에 들어오는 동일 토큰 요청은 락으로는 막을 수 없었다.**

사실 **락의 목적 자체가 일정 시간 요청을 제한하는 게 아니라, 동시 접근에 따른 데이터 정합성 문제를 방지하는 데 초점**이 맞춰져 있으니 당연한 결과이기도 하다.

그래서 [`Redis Cooldown Key`](https://redis.io/kb/doc/19n37tc6g3/what-is-the-redis-enterprise-cooldown-feature) 를 활용해서, 락 이후의 짧은 시간 동안 중복 요청을 막아보았다.

> **RefreshTokenRepository**

```java
public boolean isInCooldown(Long userId, String browserId) {
    String key = COOLDOWN_PREFIX + userId + ":" + browserId;
    return Boolean.TRUE.equals(redisTemplate.hasKey(key));
}

public void setCooldown(Long userId, String browserId, long millis) {
    String key = COOLDOWN_PREFIX + userId + ":" + browserId;
    redisTemplate.opsForValue().set(key, "1", millis, TimeUnit.MILLISECONDS);
}
```

Redis에 `쿨다운 키가 있는지 확인하는 메서드와, 해당 키를 일정 시간 동안 설정하는 메서드`를 각각 추가했다.

> **TokenService**

```java
@DistributedLock(prefix = "lock:reissue", key = "#reissueTokenRequest.refreshToken", waitTime = 0)
public ReissueTokenResponse reissueToken(ReissueTokenRequest reissueTokenRequest) {
    String refreshToken = reissueTokenRequest.refreshToken();

    Long userId = jwtUtil.getClaimFromToken(refreshToken, "userId", Long.class);
    String browserId = jwtUtil.getClaimFromToken(refreshToken, "browserId", String.class);

    // 쿨다운 체크
    if (refreshTokenRepository.isInCooldown(userId, browserId)) {
        throw new CustomException(TokenErrorStatus._TOO_MANY_REQUESTS);
    }

    String existRefreshToken = refreshTokenRepository.findByUserIdAndBrowserId(userId, browserId)
        .orElseThrow(() -> new CustomException(TokenErrorStatus._NOT_FOUND_REFRESH_TOKEN));

    if (!existRefreshToken.equals(refreshToken)) {
        throw new CustomException(TokenErrorStatus._NOT_FOUND_REFRESH_TOKEN);
    }

    String newAccessToken = jwtUtil.generateAccessToken(userId, "USER");
    String newRefreshToken = jwtUtil.generateRefreshToken(userId, browserId);
    refreshTokenRepository.save(new RefreshToken(userId, browserId, newRefreshToken));

    // 쿨다운 설정 (0.5초)
    refreshTokenRepository.setCooldown(userId, browserId, 500);

    return ReissueTokenResponse.of(newAccessToken, newRefreshToken);
}
```

요청이 들어왔을 때, 먼저 쿨다운 키 존재 여부를 확인해서 **0.5초 이내 중복 요청이면 429 에러로 차단하고, 정상 처리된 경우에는 로직 종료 후 해당 쿨다운 키를 Redis에 설정**한다.

> **결과**

```bash
2025-06-12T20:11:11.277+09:00  INFO 1 --- [nio-8090-exec-8] s.o.g.interceptor.LoggingInterceptor     : 📦 [POST] /api/v1/tokens/action-reissue 
body : {
  "refresh_token" : "...qaN_0"
}
2025-06-12T20:11:11.286+09:00  INFO 1 --- [nio-8090-exec-7] s.o.g.interceptor.LoggingInterceptor     : 📦 [POST] /api/v1/tokens/action-reissue 
body : {
  "refresh_token" : "...qaN_0"
}
2025-06-12T20:11:11.297+09:00  INFO 1 --- [io-8090-exec-10] s.o.g.interceptor.LoggingInterceptor     : 📦 [POST] /api/v1/tokens/action-reissue 
body : {
  "refresh_token" : "...qaN_0"
}
2025-06-12T20:11:11.331+09:00 ERROR 1 --- [io-8090-exec-10] s.o.exception.GlobalExceptionHandler     : CustomException: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
2025-06-12T20:11:11.331+09:00 ERROR 1 --- [nio-8090-exec-7] s.o.exception.GlobalExceptionHandler     : CustomException: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
2025-06-12T20:11:11.332+09:00  INFO 1 --- [nio-8090-exec-8] s.o.g.interceptor.LoggingInterceptor     : ✅ [POST] /api/v1/tokens/action-reissue request completed - 54ms | status=201
2025-06-12T20:11:11.337+09:00 ERROR 1 --- [io-8090-exec-10] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 39ms | status=429
2025-06-12T20:11:11.338+09:00 ERROR 1 --- [nio-8090-exec-7] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 52ms | status=429
```

위 방법을 적용하여 빠른 시간 내에 중복으로 들어오는 요청을 막을 수 있었다. 
결과적으로는 `분산 락 + Redis Cooldown Key`의 조합으로 토큰 재발행 시 동시성 문제를 해결하게 되었다.

---

# 📊 테스트

## 테스트 환경

> **목적**
동일한 리프레시 토큰으로 동시에 여러 요청이 들어올 경우, `@DistributedLock`이 제대로 동작하여 하나만 성공하고 나머지는 실패(429) 하는지 확인한다.

> **사용 도구**
`Grafana K6`

> **시나리오**
1명의 사용자가 동일한 `refresh_token`을 가지고, 동시에 10개의 토큰 재발급 요청을 병렬로 보낸다.

> **기대 결과**
오직 1개의 요청만 201(Created) 로 성공하고, 나머지 9개는 락 획득 실패로 인해 429(Too Many Requests) 에러가 발생한다.
>
새로 발급된 토큰을 활용해 후속 단일 요청도 성공(201) 해야 한다.

## 테스트 코드

```js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  const originalToken = '...'
  const url = 'http://localhost:8090/api/v1/tokens/action-reissue';
  const headers = { 'Content-Type': 'application/json' };
  const payload = JSON.stringify({ refresh_token: originalToken });

  const requests = Array.from({ length: 10 }, () => [
    'POST',
    url,
    payload,
    { headers },
  ]);

  const responses = http.batch(requests);

  let newRefreshToken = null;

  responses.forEach((res, i) => {
    const ok = check(res, {
      [`[Parallel ${i + 1}] Status is 201 or 429`]: (r) => r.status === 201 || r.status === 429,
    });

    if (res.status === 201) {
      const resBody = JSON.parse(res.body);
      newRefreshToken = resBody.payload.refresh_token;
      console.log(`[Parallel ${i + 1}] ✅ Success - New token: ${newRefreshToken}`);
    } else {
      console.error(`[Parallel ${i + 1}] ❌ Failed - Status: ${res.status}`);
    }
  });

  // 새 토큰이 있다면 단일 요청으로 재확인
  if (newRefreshToken) {
    const newPayload = JSON.stringify({ refresh_token: newRefreshToken });
    const res = http.post(url, newPayload, { headers });

    check(res, {
      '[Follow-up] Status is 201': (r) => r.status === 201,
    });

    console.log(`[Follow-up] Status: ${res.status}`);
  }
}

```

## 결과

### 기존 로직 : 분산 락 X

![](https://velog.velcdn.com/images/hsh111366/post/9a07fce5-f62c-45d2-a645-4057f6aea1e1/image.png)

- 초기 6개의 요청에 대해서는 모두 201 응답을 받았다. 이는 새로운 리프레쉬 토큰이 레디스에 저장되기 이전이었기에 예외 처리되지 않은 것으로 예상된다.
- 하지만 이후로는 모두 401 에러 응답을 받았다. 마지막으로 성공한 6번째 요청에서 새롭게 저장된 리프레쉬 토큰과, 이후 4번의 요청에서의 리프레쉬 토큰이 다르기 때문이다.
- 마지막으로 재요청 했을 때도 정상적으로 201 응답을 받았다. 허나, 이미 유저는 이전의 401 에러 응답으로 인해서 재로그인하는 상황이 발생한다.

### 변경 로직 : 분산 락 O

![](https://velog.velcdn.com/images/hsh111366/post/3801abf4-c5a5-4d6a-b0af-2a743369ad6a/image.png)

```bash
2025-06-08T02:58:51.704+09:00 ERROR 19265 --- [nio-8090-exec-1] s.o.exception.GlobalExceptionHandler     : CustomException: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
2025-06-08T02:58:51.704+09:00 ERROR 19265 --- [nio-8090-exec-6] s.o.exception.GlobalExceptionHandler     : CustomException: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
2025-06-08T02:58:51.704+09:00 ERROR 19265 --- [nio-8090-exec-2] s.o.exception.GlobalExceptionHandler     : CustomException: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
2025-06-08T02:58:51.704+09:00 ERROR 19265 --- [nio-8090-exec-3] s.o.exception.GlobalExceptionHandler     : CustomException: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
2025-06-08T02:58:51.704+09:00 ERROR 19265 --- [nio-8090-exec-6] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 2ms | status=429
2025-06-08T02:58:51.704+09:00 ERROR 19265 --- [nio-8090-exec-1] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 1ms | status=429
2025-06-08T02:58:51.705+09:00 ERROR 19265 --- [nio-8090-exec-2] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 3ms | status=429
2025-06-08T02:58:51.705+09:00 ERROR 19265 --- [nio-8090-exec-3] s.o.g.interceptor.LoggingInterceptor     : ❌ [POST] /api/v1/tokens/action-reissue request failed - 2ms | status=429
2025-06-08T02:58:51.725+09:00  INFO 19265 --- [nio-8090-exec-7] s.o.g.interceptor.LoggingInterceptor     : ✅ [POST] /api/v1/tokens/action-reissue request completed - 99ms | status=201
2025-06-08T02:58:51.729+09:00  INFO 19265 --- [nio-8090-exec-4] s.o.g.interceptor.LoggingInterceptor     : 📦 [POST] /api/v1/tokens/action-reissue 
body : {
  "refresh_token" : "..."
}
2025-06-08T02:58:51.736+09:00  INFO 19265 --- [nio-8090-exec-4] s.o.g.interceptor.LoggingInterceptor     : ✅ [POST] /api/v1/tokens/action-reissue request completed - 6ms | status=201
```

- 10번의 병렬 요청 중에서, 단 1번의 요청에 대해서만 201 응답을 받았다. 나머지는 모두 락을 획득하지 못 하여 429 에러 응답을 받는다.
- 마지막으로 재요청 했을 때 정상적으로 201 응답을 받았다. 이전에 401 에러가 발생하지 않았기 때문에, 유저는 재로그인할 필요가 없다.

> 🧑🏻‍💻 테스트 결과가 기대대로 잘 나왔고, 결과적으로 이를 적용하여 동시성 문제를 해결할 수 있었다!
>
ps. 하지만 동시성 문제를 해결했다고 해서 근본적인 문제가 해결되지는 않는다. **1차적인 문제는 클라이언트 측에서 동일한 토큰으로 여러 번 요청하는 것**이기에, 이를 우선적으로 해결할 수 있도록 프론트 개발자와 잘 소통하도록 하자.
>
[프론트에서 참고하면 좋을 글 1](https://velog.io/@eogns0321/token-refresh-동시성-이슈)
[프론트에서 참고하면 좋을 글 2](https://jaeseo0519.tistory.com/405)

---

[참고한 블로그 1](https://helloworld.kurly.com/blog/distributed-redisson-lock/)
[참고한 블로그 2](https://velog.io/@meong/SpringBoot-Redisson-AOP-%EC%A0%81%EC%9A%A9%EA%B8%B0-%EC%9E%AC%EA%B3%A0-%EB%8F%99%EC%8B%9C%EC%84%B1-%EC%A0%9C%EC%96%B4)
