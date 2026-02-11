---
date: 2025-04-24
description: 서블릿 필터의 개념과 동작 원리, 로깅/인코딩/CORS 등 실전 사용 사례를 정리합니다.
tags:
  - springboot
  - backend
---

---

# 📌 Filter?

서블릿 필터는 HTTP 요청 또는 응답을 `DispatcherServlet`이 받기 전에 가로채서 처리할 수 있는 컴포넌트이다.

즉, 필터는 웹 애플리케이션에서의 요청 & 응답을 사전 & 사후 처리할 수 있도록 도와주는 `서블릿 컴포넌트`이다.

## 서블릿 컴포넌트

서블릿 컴포넌트는 크게 3가지 종류가 존재한다.

### 1. 서블릿 (Servlet)

- 핵심 컴포넌트이다.
- 클라이언트 요청을 받아서 응답을 생성한다.
- `HttpServlet`을 상속 받아 구현한다.

> **Spring 예시 코드**

```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        resp.getWriter().write("Hello, Servlet!");
    }
}
```
> **Spring Boot예시 코드**


```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        resp.getWriter().write("Hello, Spring Boot!");
    }
}

```

```java
@SpringBootApplication
@ServletComponentScan
public class MyApplication { ... }

```

- 최근에는 서블릿을 잘 쓰지는 않으며, `@RestController` , `@RequestMapping`을 사용한다. [참고 글](https://bbbang105.github.io/Spring/Spring--Spring-Boot)

### 2. 필터 (Filter)

- 서블릿 실행 전/후에 동작한다.
- 요청 및 응답을 전처리 또는 후처리한다.
- 주로 보안, 로깅, CORS 등에 사용한다.

> **Spring 예시 코드**

```java
@WebFilter("/*")
public class LogFilter implements Filter {
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        System.out.println("Request Start");
        chain.doFilter(req, res); // 다음 필터 또는 서블릿 호출
        System.out.println("Response End");
    }
}

```

> **Spring Boot 예시 코드**

```java
@Component
public class LogFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("🌐 필터 동작");
        chain.doFilter(request, response);
    }
}

```

```java
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<LogFilter> logFilter() {
        FilterRegistrationBean<LogFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new LogFilter());
        registrationBean.addUrlPatterns("/*"); // 전체 요청
        registrationBean.setOrder(1); // 필터 순서
        return registrationBean;
    }
}
```

- 순서나 경로 설정을 할 수 있다.

### 3. 리스너 (Listener)

- 애플리케이션, 세션, 요청 등 생명주기 이벤트를 감지한다.
- 리소스 초기화, 세션 추적, 통계 등에서 사용한다.

> **Spring 예시 코드**


```java
@WebListener
public class AppListener implements ServletContextListener {
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("애플리케이션 시작됨");
    }

    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("애플리케이션 종료됨");
    }
}

```

> **Spring Boot 예시 코드**


```java
@Component
public class AppListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("🚀 애플리케이션 시작");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("🛑 애플리케이션 종료");
    }
}

```
- `@WebListener` 대신에 `@Component`로 자동 등록한다.
- `@ServletComponentScan` 또한 필요하지 않다.

---
# 📌 왜 Filter를 써야 할까?

Spring Boot에는 이미 `@RestController, Interceptor, AOP` 등 로직을 분리할 수 있는 다양한 방식들이 존재한다.

그럼에도 Filter를 사용하는 이유는 무엇일까?

## 전역 처리

아래 Spring 애플리케이션 동작 과정을 간략히 살펴보자.

```
[클라이언트 요청]
  ↓
[서블릿 컨테이너 (Tomcat 등)]
  ↓
[Filter] ← 여기까지는 서블릿 API 영역
  ↓
[DispatcherServlet] ← 여기서부터 Spring MVC
  ↓
[HandlerMapping → Controller → View 처리]

```

필터는 Spring MVC보다 먼저 실행된다.
반면, `Interceptor, ControllerAdvice, @Controller` 등은 모두 `DispatcherServlet` 이후에 작동한다.

때문에 필터는 Spring 진입 전, 공통 처리 로직을 실행할 수 있는 유일한 수단이기에 사용한다.

---
# 📌 Filter 사용 사례

실제 코드와 사용 사례를 보면서 필터에 대해 더욱 깊이 이해해보자.

예시 코드이기 때문에 그대로 프로젝트에 적용하기에는 무리가 있을 수 있다!

## 1. 요청/응답 시간 로깅 필터

```java
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        long start = System.currentTimeMillis();

        HttpServletRequest req = (HttpServletRequest) request;
        log.info("📥 요청 URI: {}", req.getRequestURI());

        chain.doFilter(request, response);

        long duration = System.currentTimeMillis() - start;
        log.info("📤 처리 완료 ({}ms)", duration);
    }
}

```

> **결과 예시**
```
INFO  [LoggingFilter] 📥 요청 URI: /api/v1/users
INFO  [LoggingFilter] 📤 처리 완료 (87ms)
```

위처럼 구성하여 등록해 둔다면 들어오는 모든 요청에 대해서 처리 속도를 파악할 수 있고, 어떤 API에서 병목이 생기는 지 파악이 용이하다.

## 2. UTF-8 인코딩 필터

```java
import jakarta.servlet.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class EncodingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        log.debug("📌 UTF-8 인코딩 설정 완료");

        chain.doFilter(request, response);
    }
}
```

```java
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<EncodingFilter> encodingFilter() {
        FilterRegistrationBean<EncodingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new EncodingFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1); // 가장 먼저 실행되도록 설정
        return registrationBean;
    }
}
```

위와 같이 필터를 만들어 준 후에, 등록해 주면 적용된다.

> 👨‍💻 하지만 Spring Boot 1.2.0 버전 이후로는 `CharacterEncodingAutoConfiguration`이 등장하며, `CharacterEncodingFilter`를 자동으로 등록해주는 구조가 갖춰졌다. 
때문에 인코딩 필터를 만들어서 등록할 필요성이 사라졌다.

`org.springframework.boot.autoconfigure.web.servlet.CharacterEncodingAutoConfiguration` 클래스는, 
`spring.http.encoding.enabled = true`인 경우에 인코딩 필터를 자동으로 등록해 준다. 

디폴트 값이 UTF-8 이기에 따로 변경하지 않는다면 인코딩 필터의 등록 없이도 충분히 사용 가능하다.

만약 인코딩 방식을 명시적으로 지정하고 싶다면, 아래와 같이 `.yaml` 파일에 넣어주면 된다.

```yaml
spring:
  http:
    encoding:
      charset: MS949
      force: true

```

## 3. CORS 필터

### 가. OPTIONS 요청

CORS에 대한 설명은 넘어가고, CORS와 OPTIONS의 관계성에 대해서 적어보려고 한다.

브라우저는 요청을 보낼 때 아래와 같은 경우에서 먼저 `OPTIONS` 요청(Preflight)을 보내게 된다.

> **1) 다른 Origin으로 요청을 보내는 경우**

> **2) 동일 Origin이지만, 복잡한 요청인 경우**
- 커스텀 헤더가 존재 (Authorization 등..)
- PATCH, PUT 등 메서드
- 반환 타입이 urlencoded가 아님 (application/json 등..)

동일 Origin이라면 CORS를 고려할 필요가 없기 때문에, 1번 다른 Origin으로 요청을 보내는 경우에 집중하면 된다.

`OPTIONS` 요청은 디스패치 서블렛에서 처리하며, 요청 브라우저에서 `200ok`를 받는다면 실제 메서드 (GET, POST..) 요청을 보낸다.

### 나. DispatcherServlet의 한계

하지만 받은 응답의 헤더에 CORS 허용 설정인 `Access-Control-Allow-*` 값이 없다면, 브라우저는 실제 요청을 차단하여 CORS 에러가 발생한다.

즉, 요청 자체는 문제 없이 처리가 되더라도 CORS 허용 헤더가 있어야 하는 것이다.

그렇기에 CORS 허용 헤더를 디스패치 서블렛 동작 전에 추가해주어야 하는 것이고, 여기서 필터가 쓰이게 된다.

### 다. Spring Security를 사용하지 않는 경우

```java
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse res = (HttpServletResponse) response;
        res.setHeader("Access-Control-Allow-Origin", "*"); // 모든 origin 허용
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        chain.doFilter(request, response);
    }
}

```

Spring Security를 사용하지 않는다면, 동일하게 필터를 만들어준 후 설정에서 등록해 주면 된다.

하지만 최근에는 Spring Security를 많이들 사용하기 때문에 해당 예시도 보도록 하겠다.

### 라. Spring Security를 사용하는 경우

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults()) // CORS 설정 활성화
            .csrf().disable()
            .authorizeHttpRequests()
                .anyRequest().permitAll();

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOriginPattern("*");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

우선 `corsConfigurationSource()` 메서드를 만들어 설정 값들을 지정한다. 

이후 시큐리티 필터 체인에 `.cors(withDefaults())`로 등록해 주면 끝이다. 
해당 코드는 `"CORS 설정을 사용하겠다"`라는 뜻이며, 동작 과정을 정리하자면 아래와 같다.

> 1. `@Bean CorsConfigurationSource`를 등록해 둠
2. `.cors(withDefaults())`가 이를 감지
3. Spring Security 내부에서 `CorsFilter`를 생성
4. `Security Filter Chain` 내에 `CorsFilter`가 자동으로 추가
