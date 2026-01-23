---
date: 2025-04-23
tags:
  - springboot
  - backend
---

---

# 📌 Spring Boot의 배경

`Spring`이라는 우수한 프레임워크가 이미 존재하는데, 왜 `Spring Boot`가 탄생했을까?

Spring은 유연하고 확장성 있는 구조 덕분에 많이 사용되었지만, 초기 설정이 복잡하고 귀찮은 문제가 있었다. 대표적으로 아래와 같다.

## Spring의 문제점

> **1. 설정할 것들이 많다.**
- applicationContext.xml, dispatcher-servlet.xml, 각종 bean 설정 등
- 하나의 기능을 쓰기 위해 수십 줄의 XML + 관련 클래스 작성

> **2. 빌드와 배포가 번거롭다.**
- WAR 파일로 빌드하고, 톰캣에 올리고 재시작하는 등의 과정

> **3. 의존성 설정이 복잡하다.**
-  Maven에서 어떤 라이브러리를 어떤 버전으로 써야 할지 감을 잡기 어려움

> **4. 빠른 실험이 불가하다.**
- 작은 API 하나를 만들려고 해도 폴더 구조 & 설정 & 메인 클래스 등 진입장벽이 높음

## Spring Boot == Starter

Spring Boot는 기본 설정과 구조를 자동으로 구성해주는 스타터이다.
즉, 초보자도 바로 생산성을 낼 수 있도록 만든 Spring 기반의 `확장 프레임워크`인 것이다.

> Spring이 부품이 잘 정리되어 있는 자동차 공장이라면, Spring Boot는 시동만 걸면 바로 달릴 수 있는 자동차 키트와 유사하다.

---

# 📌 Spring Boot의 핵심 기능

기존 Spring이 가진 복잡함을 아래와 같은 방식들로 해소해준다.

## 1. 내장 톰캣 지원 (Embedded Tomcat)
- 별도로 톰캣에 배포할 필요가 없다.
- 메인 메서드만 실행하면 바로 웹 서버를 구동할 수 있다.

> Spring (기존) : WAR 파일을 빌드해서 톰캣에 올려서 실행
Spring Boot : 톰캣이 내장되어 있어서 main() 메서드만 실행하면 바로 실행됨

### 톰캣(Tomcat)?
- 서블릿 컨테이너이자 웹 서버이다.
- 클라이언트로부터 들어오는 HTTP 요청을 받아서, 서블릿 기반의 웹 애플리케이션 로직을 실행하고 응답을 돌려주는 역할이다.

## 2. Starter 의존성
- spring-boot-starter-web, spring-boot-starter-data-jpa 등 ..
- 관련 라이브러리를 한 번에 가져오는 의존성 묶음이 존재한다.

## 3. 자동 설정 (Auto Configuration)
- `@SpringBootApplication` 안에 `@EnableAutoConfiguration`이 포함되어 있다.
- 상황에 따라 자동으로 Bean을 등록하고 설정해 준다.

## 4. application.yaml or application.properties
- XML 설정 대신 간단하고 명시적인 설정 파일이 존재한다.

## 5. 개발 편의 기능
- devtools, actuator, test starter 등 ..
- 빠른 개발과 진단을 지원한다.

---

# 📌 Spring (Boot 이전)에서의 웹 설정 흐름

Spring MVC를 사용할 때는 보통, **web.xml + Java Config (또는 XML)**을 조합해서 DispatcherServlet, ComponentScan, ViewResolver 등등을 전부 수동으로 설정해야만 했다.

## 예시

>  **web.xml: DispatcherServlet 등록**

```java
<web-app>
  <servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>/WEB-INF/spring/appServlet/servlet-context.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>

  <servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
</web-app>

```

>  **servlet-context.xml: 설정 파일**

```java
<context:component-scan base-package="com.example.controller" />
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
  <property name="prefix" value="/WEB-INF/views/" />
  <property name="suffix" value=".jsp" />
</bean>

```

>  **Controller**

```java
@Controller
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    public String hello(Model model) {
        model.addAttribute("data", "Hello!");
        return "hello"; // /WEB-INF/views/hello.jsp 로 이동
    }
}

```

- 어노테이션은 사용하지만, 작동하게 만들기 위한 설정은 전부 수동으로 작업된다.

---

# 📌 Spring Boot에서의 웹 설정 흐름

## 1. 메인 클래스

```java
@SpringBootApplication // 자동 설정 + 컴포넌트 스캔 + 설정 클래스 등록
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}

```

> `@SpringBootApplication`은,
1) `@Configuration`
2) `@EnableAutoConfiguration`
3) `@ComponentScan`
를 합한 것이다.

### 1) `@Configuration`

- `해당 클래스는 설정 클래스입니다.` 라는 의미를 가진다.
- Spring의 설정 정보, 즉 컨테이너에 등록할 Bean 정의를 담고 있다는 것이다.

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}

```

### 2) `@EnableAutoConfiguration`

- `Spring Boot가 자동 설정을 하도록 허용합니다.` 라는 의미를 가진다.
- 스프링 부트의 핵심 기능이다.
- 클래스패스에 있는 라이브러리를 기반으로, 필요한 설정을 자동으로 구성한다.

### 3) `@ComponentScan`

- `현재 패키지와 그 하위 패키지를 스캔해서 Bean 등록해 주세요.` 라는 의미를 가진다.
- `@Component, @Service, @Repository, @Controller` 등을 자동으로 찾아서 등록한다.
- 스프링의 자동 빈 등록 매커니즘을 작동시키는 어노테이션이라 할 수 있다.

## 2. 컨트롤러

```java
@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

- `@RestController` : 응답을 자동으로 JSON으로 반환해 준다.
- `@RequestMapping + @GetMapping` : URL을 매핑한다.
- View 없이 데이터만 주고받는 `REST` 스타일을 기본 지원한다.

## 3. 의존성 설정

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}

```

- `spring-boot-starter-web` 하나에는 대표적으로 아래의 의존성들이 포함된다.

> **1) Spring MVC**
- @RestController, @RequestMapping, @GetMapping 등 어노테이션 사용 가능

>** 2) Jackson (JSON)**
- 객체 ↔ JSON 자동 직렬화/역직렬화
- 컨트롤러에서 객체를 반환하면 자동으로 JSON 변환
- @RequestBody, @ResponseBody 기반 동작

>** 3) Tomcat (내장)**

> **4) Validation**
- `@Valid, @NotNull, @Email, @Min, @Max` 등 지원
- 컨트롤러 파라미터 바인딩 시 자동 검증

## 4. 설정 파일

```yaml
server:
  port: 8081

spring:
  application:
    name: myapp

```

- XML 대신 YAML 또는 properties로 간단하게 설정 가능하다.
- `@Value`, `@ConfigurationProperties` 등으로 쉽게 주입이 가능하다.

---

# 📌 Spring Boot에서 gradle을 많이 사용하는 이유

Spring Boot에서도 Maven 빌드 방식을 물론 사용할 수 있지만, 대부분 Gralde을 선호한다. 그 이유는 무엇일까?

## 1. 간결한 DSL 기반 설정 방식

> **DSL : Domain Specific Language (도메인 특화 언어)**
- `Groovy`는 자바 기반의 동적 프로그래밍 언어이다.
- `Gradle DSL (Groovy DSL)`은 Gradle이 Groovy 문법을 이용해서 만든 설정용 문법이다.

즉, Gradle은 Groovy(또는 Kotlin) 기반의 DSL을 사용하여
빌드 스크립트를 마치 코딩하듯 작성할 수 있다.

아래에서 Maven과 Gradle 방식을 비교해 보자.

> **Maven**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

```

> **Gradle (Groovy DSL)**

```groovy
implementation 'org.springframework.boot:spring-boot-starter-web'
```

## 2. 빠른 빌드 속도

Gradle은 아래와 같은 기술적 이유로 Maven보다 빠른 빌드 속도를 지원한다.

| 항목                    | 설명                                                                 |
|-------------------------|----------------------------------------------------------------------|
| **캐시(Cache)**         | 이전 빌드 결과를 저장해두고 **같은 작업은 다시 하지 않음**          |
| **증분 빌드(Incremental Build)** | 변경된 파일만 빌드하여 **전체 빌드 시간을 단축**            |
| **병렬 처리(Parallel Build)**   | 모듈/작업 단위로 **여러 작업을 동시에 수행**               |
| **데몬(Daemon) 프로세스**       | JVM을 계속 띄워둬서 **매번 JVM 부팅 시간을 줄임**           |

> Maven은 `XML 기반 정적 구성`이기에 동적 최적화가 어렵다. 반면 Gradle은 `스크립트`처럼 동작하므로 빠른 빌드가 가능하다.
