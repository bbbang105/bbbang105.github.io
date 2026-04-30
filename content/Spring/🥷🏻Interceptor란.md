---
date: 2025-04-28
description: Spring Interceptor의 동작 원리와 Filter와의 차이점, 인증 처리 활용법을 정리합니다.
tags:
  - springboot
  - backend
---

---

# 📌 Interceptor?

인터셉터는 요청 전/후의 공통 처리 로직을 담당하는 컴포넌트이다.
이전에 정리한 [Spring Filter](https://bbbang105.github.io/Spring/%EF%B8%8FFilter%EB%9E%80)와 유사하지만 동작하는 레벨에서의 차이점이 존재한다.

## Interceptor 🆚 Filter

```
[클라이언트 요청]
       ↓
    [Filter]
       ↓
[DispatcherServlet]
       ↓
  [Interceptor - preHandle()]
       ↓
    [Controller]
       ↓
  [Interceptor - postHandle()]
       ↓
 [View Resolver & View]
       ↓
[Interceptor - afterCompletion()]
       ↓
    [Filter 응답 처리]
       ↓
[클라이언트 응답]
```

- 필터는 서블렛 스펙에 속하고, 인터셉터는 스프링 MVC에 속한다.
-> 그렇기에 필터는 스프링 프레임워크에 독립적이지만, 인터셉터는 스프링 MVC에 종속적이다.
- 필터는 디스패처서블렛 도달 전에 작동하므로 모든 요청에 대해 적용되는 반면, 인터셉터는 컨트롤러 핸들러 호출 전/후로만 작동한다.
-> 즉, 모든 요청에 대해 적용을 하고 싶다면 필터를 활용하는 것이 적절하다.

---

# 📌 Interceptor 주요 메서드 3가지

## 1. preHandle

```java
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String token = request.getHeader("Authorization");
    if (token == null || !jwtProvider.isValid(token)) {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        return false; // 인증 실패: Controller로 넘어가지 않음
    }
    return true; // 인증 성공: 다음으로 진행
}
```

- 컨트롤러 호출 직전에 동작한다.
- 요청 검증, 인증, 흐름 차단 등에 활용된다.

## 2. postHandle

```java
@Override
public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                       ModelAndView modelAndView) throws Exception {
    if (modelAndView != null) {
        modelAndView.addObject("serverTime", LocalDateTime.now());
    }
}
```

- 컨트롤러가 정상적으로 동작하고 응답을 반환하기 직전 동작한다.
- ModelAndView 조작 등 공통 데이터 삽입에 활용된다.

## 3. afterCompletion

```java
@Override
public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    long startTime = (long) request.getAttribute("startTime");
    long endTime = System.currentTimeMillis();
    System.out.println("요청 완료 - 총 소요 시간: " + (endTime - startTime) + "ms");
}
```

- 요청/응답 흐름이 완전히 끝난 후에 동작한다. 예외가 발생했더라도 무조건 동작한다.
- 리소스 해제, 예외 이후 처리 등에 활용된다.
- try-catch-finally에서 `finally`와 유사한 느낌이다.

---

# 📌 왜 Interceptor를 써야 할까?

필터를 써서 이미 모든 요청에 대해 걸러줄 수 있는데, 왜 인터셉터까지 쓰는 걸까?
이에 대한 이유들은 아래와 같다.

## 1. 컨트롤러/비즈니스 흐름

필터는 HTTP 요청/응답 전체를 대상으로 한다.
때문에 해당 요청이 어느 컨트롤러로 가고, 어떠한 비즈니스 흐름을 가지고 있는지 알 수 없다. 

반면 인터셉터는 해당 요청이 어떠한 컨트롤러로 가는지 알고 있으며, HandlerMethod를 통해서 비즈니스 흐름, 사용된 어노테이션 등을 모두 확인할 수가 있다.

그렇기에 필터에 비해서 `더욱 세밀한 거름망`이 되어줄 수 있기에 사용하는 것이다.

## 2. 공통 로직 및 관심사 분리

예를 들어서 로그인한 사용자만 접근이 가능한 API가 있다고 가정을 해 보자.

```java
@GetMapping("/api/user/profile")
public ResponseEntity<UserProfile> getProfile(HttpServletRequest request) {
    String token = request.getHeader("Authorization");

    if (token == null || !jwtProvider.validate(token)) {
        throw new UnauthorizedException();
    }

    // 로그인한 사용자의 프로필 조회
    UserProfile profile = userService.getProfile(token);
    return ResponseEntity.ok(profile);
}

```

위와 같은 형태를 띄게 될 것이다.

인증이 필요한 API가 1~2개 정도라면 큰 문제가 안 되겠지만, 보통 대부분의 API에서 인증을 하는 경우가 많다.

그렇다면 해당하는 모든 API 들에 대하여 인증 코드가 공통적으로 포함될 것이고, 이는 코드 중복을 야기한다.
또한 예시 코드에서는 컨트롤러에서 인증까지 맡고 있기에, 관심사가 적절하게 분리되지 않아 보인다.

### Interceptor 사용

Interceptor를 사용하면 어떤 식으로 개선이 될까?

```java
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");

        if (token == null || !jwtProvider.validate(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return false;
        }

        return true; // 정상 통과
    }
}

```

토큰 유효성 검증만 진행하는 `AuthInterceptor`를 만들어 둔다.


```java
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");

        if (token == null || !jwtProvider.validate(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return false;
        }

        UserInfo userInfo = jwtProvider.getUserInfo(token);
        if (!userInfo.isAdmin()) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: Admins only");
            return false;
        }

        return true; // 정상 통과
    }
}

```

토큰 유효성 검증 이후 관리자인지 확인까지 진행하는 `AdminInterceptor `도 만들어 둔다.

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // 일반 사용자 인증용
        registry.addInterceptor(new AuthInterceptor())
                .addPathPatterns("/api/users/**");

        // 관리자 권한 인증용
        registry.addInterceptor(new AdminInterceptor())
                .addPathPatterns("/api/admin/**");

    }
}
```

이를 `WebMvcConfig`에 등록함으로써 위에서 만들어 둔 인터셉터를 적용할 수 있다.

`.addPathPatterns("/api/users/**");`는 `/api/users/**` 엔드포인트로 요청이 들어오는 경우에 작동한다는 뜻이다.

즉, 위와 같이 인터셉터를 각각 만든 후에 원하는 엔드포인트에 적용할 수 있다. 모든 요청에 대해 적용되는 필터에 비해서 더욱 세밀한 모습을 볼 수 있다.

### 인터셉터에서도 공통 로직 분리

하지만 위 예시 코드를 보면 또 다시 중복되는 로직이 보인다.

```java
if (token == null || !jwtProvider.validate(token)) {
    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    return false;
}

```

바로 이 부분인데, 해당 부분까지 공통 로직으로 분리해보려고 한다.

```java
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");

        if (token == null || !jwtProvider.validate(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return false;
        }

        // 유효한 토큰이면 사용자 정보를 저장
        UserInfo userInfo = jwtProvider.getUserInfo(token);
        request.setAttribute("userInfo", userInfo); 

        return true;
    }
}

```

토큰 검증을 마친 후, 문제가 없다면 다음 인터셉터 동작을 위해서 `request`에 유저 정보를 저장해 둔다.

```java
public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserInfo userInfo = (UserInfo) request.getAttribute("userInfo");

        if (userInfo == null || !userInfo.isAdmin()) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: Admins only");
            return false;
        }

        return true;
    }
}

```

관리자인지 까지 확인해야 하는 API에서는, 위 과정에서 저장된 유저 정보를 가지고 최종 확인하게 된다.

```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new AuthInterceptor())
            .addPathPatterns("/api/users/**", "/api/admin/**");

    registry.addInterceptor(new AdminInterceptor())
            .addPathPatterns("/api/admin/**");
}

```

마지막으로 인터셉터 등록을 진행해 주면 되며, `AuthInterceptor`의 동작이 선행되어야 하기에 먼저 등록해주어야 한다.

---

# 📌 그래서 Interceptor를 쓰고 있는가?

결론부터 말하자면 인터셉터를 사용하지는 않고, 인증인가 처리를 위해서 `Spring Security` 와 `JwtFilter`를 활용하고 있다.

코드는 아래와 같다.

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
            // ✅ OPTIONS 요청일 경우 필터를 건너뛰고 바로 다음 필터 실행
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

    /**
     * 특정 경로에 대해 JWT 검증을 생략합니다.
     *
     * @param request HTTP 요청 객체
     * @return true일 경우 해당 요청에 대해 필터를 적용하지 않음
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/v1/users/onboarding");
    }
}
```

두 기술에 대해서는 추후 개별 포스팅으로 진행할 예정이므로, 여기서는 간단하게 장점만 언급해 보려고 한다.

## 👍🏻Spring Security + JwtFilter를 쓰는 이유

### 1. 더욱 빠르고 안전하게 요청 제어 가능

필터를 사용하면 디스패처서블렛 이전에 요청을 가로채 적절한지 검증해 줄 수 있다. 

때문에 디스패처서블렛 이후에 인증인가를 진행하는 인터셉터 방식보다 보안성을 높일 수 있으며, 불필요한 서버 리소스 낭비도 막을 수 있다.

### 2. SecurityContext를 통해 인증 정보를 시스템 전체에서 사용 가능

인증 성공 후, `SecurityContext`라는 스프링 보안 저장소에 인증 정보를 저장해 둘 수 있다.

그러면 이후 프레젠테이션, 애플리케이션 레이어 어디서든 
`SecurityContextHolder.getContext().getAuthentication()` 를 통해서 해당 정보를 꺼내서 사용할 수 있다.

> 🧑🏻‍💻 더 많은 장점이 존재하겠지만 Spring Security에 미숙한 상태로 적는 것은 좋지 않을 것 같아 추후 더 알아보려고 한다!
