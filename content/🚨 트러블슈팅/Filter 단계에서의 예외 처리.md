---
date: 2025-05-14
tags:
  - troubleshooting
  - backend
  - springboot
---
Trouble Shooting

---

# 🚨 문제

이전 글에서 [LazyInitializationException는 해결](https://velog.io/@hsh111366/트러블슈팅-JwtFilter-문제-해결)했으나...
계속해서 토큰 재발행이 되지 않는 문제가 발생했다.

현재는 서버 측에서 액세스 토큰 만료 401 응답을 보내면, 클라이언트 측에서 리프레쉬 토큰을 사용하여 재발행을 하는 구조이다.

재발행까지는 문제가 없었기에, 새로운 액세스 토큰을 헤더에 담아 보내주며 올바르게 인증이 되어야 할텐데 계속해서 `만료된 토큰입니다.` 라는 로그만 찍혔다.

## Filter에서 전역 예외 처리?

### 초기 코드

```java
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
```

기존에는 위와 같이 검증을 한 후에 예외가 발생한다면 로그를 찍고 컨텍스트를 초기화하기만 하였다.
클라이언트 측에서는 에러 응답을 올바르게 받을 수 없기 때문에 아래와 같이 코드를 변경하였다.

### 수정 코드

```java
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = jwtUtil.getTokenFromHeader(request.getHeader("Authorization"));
        jwtUtil.validateToken(token);
        Long userId = jwtUtil.getClaimFromToken(token, "userId", Long.class);
        setAuthentication(userId);

        filterChain.doFilter(request, response);
    }
```

try-catch 문을 제거하여 `GlobalExceptionHandler`가 예외 처리를 하도록 유도했다.

### JwtFilter

```java
    public void validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(this.getSigningKey())
                    .build()
                    .parseSignedClaims(token);
        } catch (SecurityException | MalformedJwtException | SignatureException e) {
            log.error("Invalid JWT signature, 유효하지 않은 JWT 서명 입니다.");
            throw new CustomException(TokenErrorStatus._TOKEN_SIGNATURE_INVALID);
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token, 만료된 JWT token 입니다.");
            throw new CustomException(TokenErrorStatus._TOKEN_EXPIRED);
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token, 지원되지 않는 JWT 토큰 입니다.");
            throw new CustomException(TokenErrorStatus._TOKEN_UNSUPPORTED);
        } catch (IllegalArgumentException e) {
            log.error("JWT claims is empty, 잘못된 JWT 토큰 입니다.");
            throw new CustomException(TokenErrorStatus._TOKEN_MALFORMED);
        }
    }
```

JwtFilter에서 토큰을 검증하고, 문제가 있다면 커스텀 에러를 던지기 때문에 해당 부분을 처리하기를 기대한 것이다.

> **하지만 이 부분이 문제였다.**

---

# 🔍 문제점 찾기

로그도 추가해 보고, 여러 가지 테스트를 진행하였지만 계속해서 문제점을 찾지 못 했다.
그렇게 스웨거로 에러를 터트려 보던 중 이상한 점을 발견했다.

![](https://velog.velcdn.com/images/hsh111366/post/f460c1cd-725e-4d4a-9e24-5acc58e4da24/image.png)

예외가 발생하면 정해둔 응답을 보내도록 처리해두었는데, 위 화면과 같이 제대로 처리가 안 되었던 것이다. 

> **이제서야 '예외 처리가 제대로 되고 있지 않다'는 점을 깨달았다.**

문제점을 정리하자면 아래와 같다.

> 1. Filter에서 발생하는 예외가 GlobalExceptionHandler에서 처리되기를 기대했다.
2. 하지만 예외 처리가 제대로 되지 않았다.
3. GlobalExceptionHandler는 DispatcherServlet이 처리하는 요청들에 대해서 작동한다.
4. Filter는 DispatcherServlet 이전에 작동한다.

즉, `GlobalExceptionHandler`가 **처리해 줄 수 없는 단계에서 발생하는 예외이기 때문에 당연히 처리할 수 없었던 것이다.**

최근에 필터와 인터셉터에 대해서 학습을 했는데 이를 인지하지 못 하다니..부끄러웠다 😂

---

# ✅ 해결

그렇기에 필터 단계에서 발생하는 예외에 대해서는 직접 처리해주어야 했다.

### writeErrorResponse

```java
    /**
     * JWT 검증 중 발생한 CustomException을 클라이언트에게 응답 형태로 반환합니다.
     *
     * @param response HTTP 응답 객체
     * @param e        JWT 검증 중 발생한 CustomException
     * @throws IOException 출력 스트림 처리 중 오류 발생 시
     */
    private void writeErrorResponse(HttpServletResponse response, CustomException e) throws IOException {
        int status = e.getErrorCode().getReasonHttpStatus().getHttpStatus().value();
        String code = e.getErrorCode().getReasonHttpStatus().getCode();
        String message = e.getErrorCode().getReasonHttpStatus().getMessage();

        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");

        response.getWriter().write(
                "{"
                        + "\"is_success\": false,"
                        + "\"code\": \"" + code + "\","
                        + "\"message\": \"" + message + "\","
                        + "\"payload\": null"
                        + "}"
        );
    }
```

`HttpServletResponse`에 status와 응답 값들을 담아서 클라이언트 측으로 보낼 수 있다.
이를 구성해주는 위 메서드를 추가하였다.

### doFilterInternal

```java
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authorizationHeader = request.getHeader("Authorization");
            String token = jwtUtil.getTokenFromHeader(authorizationHeader);
            jwtUtil.validateToken(token);
            Long userId = jwtUtil.getClaimFromToken(token, "userId", Long.class);
            setAuthentication(userId);

            filterChain.doFilter(request, response);

        } catch (CustomException e) {
            writeErrorResponse(response, e);
        }
    }
```

try-catch 문을 다시 추가하고, 문제가 발생하면 커스텀 에러를 잡아 정해진 응답 값을 보내도록 변경하였다.

```
2025-05-14T22:14:11.249+09:00 ERROR 1 --- [io-8090-exec-10] side.onetime.util.JwtUtil                : Expired JWT token, 만료된 JWT token 입니다.
2025-05-14T22:14:11.259+09:00  INFO 1 --- [nio-8090-exec-3] side.onetime.service.TokenService        : 토큰 재발행에 성공하였습니다.
2025-05-14T22:14:11.265+09:00  INFO 1 --- [nio-8090-exec-2] s.o.g.interceptor.LoggingInterceptor     : ✅ [POST] /api/v1/tokens/action-reissue request completed - 49ms | status=201
```

위와 같이 예외 처리와 재발행이 잘 작동하는 것을 볼 수 있다!

---

[참고한 블로그](https://velog.io/@kimdy0915/Spring-Security-Filter-예외처리는-어떻게-할까)
