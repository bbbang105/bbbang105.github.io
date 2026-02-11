---
date: 2024-04-20
description: Spring Security와 OAuth2.0으로 구글/카카오/네이버 소셜 로그인을 구현하는 전체 과정을 정리합니다.
tags:
  - springboot
  - backend
  - security
  - springsecurity
---

---

큐시즘 밋업팀 테크 블로그에 작성한 글인데, 그동안 했던 소셜 로그인 구현 과정의 집약체 느낌이라 개인적으로도 계속 참고할 겸 개인 블로그에도 함께 올린다 ❗️

쿨피스팀 테크 블로그 👇🏻
(https://velog.io/@kusitms-29th-d/Spring-Security-백엔드에서-소셜-로그인-구현하기-프론트에서-해야-할-일-feat.-OAuth2.0)

---

어쩌다보니 큐시즘 밋업 쿨피스팀 테크 블로그 첫 글.. 

어떤 주제로 작성을 해야 할까 고민을 하다가, Spring Security를 사용해서 백엔드에서 소셜 로그인을 구현하는 방법에 대해 적어보기로 결정했다!

소셜 로그인 구현은 이전에도 2번 정도 해보았고, 근 한 달 동안 소셜 로그인을 추가로 3번이나 구현을 했기 때문에 이 참에 한 번 제대로 정리해 두면 좋을 것 같다는 생각이 들었기 때문이다.

찾아 보면 많은 소셜 로그인과 관련한 많은 글들이 있는데, 방식도 사람마다 너무 다르고 버전 업그레이드에 따라 deprecated된 메서드들도 많아서 가장 최신 버전으로 적용하려고 노력한 나의 방식이 누군가에게는 도움이 되지 않을까 한다..!

---

# 1. OAuth2.0? 🤔

글을 본격적으로 시작하기에 앞서, OAuth2.0에 대해 간략히 설명해보고자한다.

OAuth란, Open Authorization의 줄임말로 인증을 위한 개방형 표준 프로토콜을 의미한다.

구글, 카카오, 네이버, 페이스북, 깃허브 등등 많은 플랫폼에서 해당 프로토콜을 활용하여 간편하게 소셜 로그인 서비스를 이용할 수 있도록 제공하고 있다.

그렇기에 구현 방식이 대부분 유사하다!

---

# 2. 소셜 로그인 구현 방식 2가지 ✌🏻

내가 알기로는 소셜 로그인 구현 방식에는 대표적으로 아래의 2가지가 있다.

(04.24)
방식은 총 4가지가 있다고 한다! 추후 보완할 예정
```
1. 프론트엔드 <-> 백엔드 <-> 인증 서버
2. 백엔드 <-> 인증 서버
```

1번 방식으로 진행을 하게 되면, 프론트엔드와 백엔드가 API 통신을 통해서 모든 소셜 로그인 과정에 함께 참여하게 된다. 찾아볼 때는 해당 방식으로 구현한 경우가 조금 더 많았던 것 같다.

반면 2번 방식으로 진행을 하게 되면, 백엔드와 인증 서버만이 통신을 하면서 모든 소셜 로그인 과정을 처리해주게 된다.

그럼 프론트엔드에서 할 일은 아예 없는가? 그건 아니다.
프론트엔드에서 처리해주어야 할 부분이 몇 가지 있는데, 이는 소셜 로그인 구현 과정에 대해 설명한 후에 말해보도록 하겠다.

텍스트로만 보면 이해가 잘 되지 않기 때문에, 아래 그림을 참고해보자.

![](https://velog.velcdn.com/images/kusitms-29th-d/post/d07448ef-37f4-4f2c-9437-a8090d4c0dc3/image.png)

(출처 : https://velog.io/@evnif/OAuth2.0-social-login)

위 그림은 1번 방식을 표현한 것으로, 원래는 프론트엔드에서 먼저 인증서버와 통신을 해서 인가 코드를 백엔드로 보내주게 된다. ( ③ 인가코드 전달 화살표가 반대로 되어있는 것 같다.)

백엔드는 프론트엔드에서 받은 인가 코드를 가지고 인증 서버와 통신을 하여 액세스 토큰을 받고, 다시 그 토큰을 활용하여 유저 정보(자원)를 받아오게 된다.

마지막으로 유저 정보를 담은 Jwt 토큰을 발급한 후에, 프론트엔드로 보내주며 모든 과정이 종료가 된다.

이러한 방식으로 진행을 하게 되면, 프론트엔드 쪽에서 할 일이 꽤나 많아진다.

하지만 이 글에서 얘기하고자 하는 2번 방식을 사용하게 된다면, ② ~ ⑧ 의 과정을 모두 Spring Security를 사용해 처리할 수 있게 되어 과정을 간소화할 수 있다.

두 방식 중에서 어떤 것이 좋은지는 잘 모르겠지만, 해커톤과 같이 짧은 프로젝트 기간이 주어졌을 때나, 소셜 로그인은 빠르게 구현 후에 다음 과정에 집중하고 싶다면 2번 방식을 활용해도 좋다고 생각한다!

---

# 3. 소셜 로그인 구현 과정 🚀

이제부터는 본격적으로 구현 과정에 대해 설명해보고자 한다.

1. 구글 2. 카카오 3. 네이버 

3가지 플랫폼에 대해 구현해보도록 하겠다!

## 가. 환경

- Spring Boot 3.2.4
- JDK 17

## 나. 애플리케이션 등록 

우선은 구글, 카카오, 네이버 개발자 콘솔에 들어가서 애플리케이션 등록을 진행주어야 한다.

### 1) 구글

**1. 아래 링크로 입장한다.**
https://console.cloud.google.com/apis/credentials

**2. 구글 클라우드 로고 옆에 있는 프로젝트 목록을 누른 후에, 새 프로젝트를 눌러 생성한다.**
- 이름은 자유롭게 설정해도 무방하다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/cc96242a-bc0f-48e2-bd69-d52c832ba8e9/image.png)

**3. 프로젝트를 만들었다면, OAuth 동의 화면을 눌러서 `외부`로 생성한다.**
- 앱 이름, 사용자 지원 이메일, 개발자 이메일을 설정해준다.
- 앱 이름은 소셜 로그인 시에 보이는 서비스명이다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/8a839244-6d07-4b75-8148-8dce2a56eca6/image.png)

**4. 생성한 후에, `앱 게시`를 눌러서 프로덕션으로 푸시한다.**
- 개발 시에는 `테스트`로 해도 되지만, 그러면 테스트 사용자로 추가한 사람들만 소셜 로그인을 할 수 있기 때문에 그냥 앱 게시를 먼저 하는 편이다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/5f0d4f9e-fe22-4e0a-80bd-e50755c94721/image.png)

**5. 왼쪽 카테고리에서 사용자 인증 정보 → 사용자 인증 정보 만들기 → OAuth 클라이언트 ID 를 클릭한다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/7ff589ac-d5d3-434a-b940-b3715a10a184/image.png)
- 유형은 웹 애플리케이션으로 설정한다.
- 승인된 리디렉션 URI는 로컬 환경이기때문에 `http://localhost:8080/login/oauth2/code/google`로 지정한다.
- 이후 도메인을 적용하게 되면, 해당 도메인을 추가해준다.
ex) `https://test.com/login/oauth2/code/google`
- 구글 소셜 로그인에서는 최상위급 도메인이 아니면 인정을 안해줘서.. 보통 가비아에서 500원 짜리 도메인을 하나 구입해서 적용했던 것 같다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/a3812403-0b02-4c8a-b368-dabc49a5aae0/image.png)

**6. `클라이언트 ID & 클라이언트 보안 비밀번호`를 저장한다.**
- 테스트용으로 만든 프로젝트라서 그대로 올렸지만, 실제 프로젝트 시에는 외부에 노출되지 않도록 해야 한다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/c892dcef-2003-4bb8-bc0f-39a49314a09d/image.png)

### 2) 카카오

**1. 아래 링크로 입장한다.**
https://developers.kakao.com/console/app

**2. 애플리케이션 추가하기를 누르고, 프로젝트에 맞게 설정하여 생성한다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/48133311-4be0-496c-9518-555dbfb0e06f/image.png)

**3. 생성 후 클릭을 한 후, 앱 키에서 `REST API키`를 저장한다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/3460821a-9dec-446b-bf7a-be1d84facbed/image.png)

**4. 보안 탭에 들어가, 클라이언트 시크릿 생성을 한다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/a8374306-a748-4693-b266-e1197cffb3f1/image.png)

**5. 클라이언트 시크릿 코드를 저장하고, 활성화 상태를 `사용함`으로 변경해준다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/085129ec-d347-4ee1-b3d4-825651e9e273/image.png)

**6. 카카오 로그인 -> 둘 다 활성화를 ON으로 설정해준다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/175ad0b0-d416-4eef-a6de-514ecbc4cd67/image.png)

**7. 리다이렉트 URI를 설정해준다.**
- `http://localhost:8080/login/oauth2/code/kakao`
- 나중에 도메인 적용 후, 추가해주면 된다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/ef425455-2fef-4e82-acf0-d4f9d848af71/image.png)

**8. 플랫폼 -> Web 플랫폼을 등록해준다.**
- `http://localhost:8080`
- 나중에 도메인 적용 후, 추가해주면 된다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/f84eaddb-467a-415f-b33b-17ae6024d664/image.png)

**9. 동의항목을 설정해준다. **
- 필요한 정보에 대해 설정해주면 되는데, 어차피 닉네임 & 프로필 사진 & 친구 목록만 가져올 수 있다.
- 원래는 이메일도 가능했었는데.. 어느 순간부터 안되도록 변경된 것 같다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/3b7d8285-b13e-4447-8efe-97f6930b8753/image.png)

### 3) 네이버

**1. 아래 링크로 입장한다.**
https://developers.naver.com/apps/#/register

**2. 이름과 사용 API를 설정한다.**
- 필요한 정보에 대해서 설정해주면 된다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/ee7bd47c-65b2-42da-a60e-2862853e6664/image.png)

**3. 아래로 내려 환경추가 -> PC 웹을 선택한다.**
- 서비스 URL : `http://localhost:8080`
- 콜백 URL : `http://localhost:8080/login/oauth2/code/naver`
- 나중에 도메인 적용 후, 둘 다 추가해주면 된다.
![](https://velog.velcdn.com/images/kusitms-29th-d/post/08446031-babc-47df-bcff-8d218819c7f7/image.png)

**4. 등록 후, 클라이언트 ID, 클라이언트 시크릿을 저장한다.**
![](https://velog.velcdn.com/images/kusitms-29th-d/post/bf51aef5-bc08-4727-9318-78ef9be3f358/image.png)

---

## 다. application.yml

이제부터는 위에서 등록을 진행하면서 얻은 키 값들을 yml파일에 설정해주는 작업을 진행한다.

``` yml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_HOST}
    password: ${DATABASE_PW}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
    hibernate:
      ddl-auto: update

    defer-datasource-initialization: true
    open-in-view: false
    generate-ddl: true
    show-sql: true

  sql:
    init:
      mode: always

  security:
    oauth2:
      client:
        registration:

          google:
            client-id: ${OAUTH_GOOGLE_CLIENT_ID}
            client-secret: ${OAUTH_GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
            redirect-uri: ${OAUTH_GOOGLE_REDIRECT_URI}

          kakao:
            client-id: ${OAUTH_KAKAO_CLIENT_ID}
            client-secret: ${OAUTH_KAKAO_CLIENT_SECRET}
            scope:
              - profile_nickname
            authorization-grant-type: authorization_code
            redirect-uri: ${OAUTH_KAKAO_REDIRECT_URI}
            client-name: Kakao
            client-authentication-method: client_secret_post

          naver:
            client-id: ${OAUTH_NAVER_CLIENT_ID}
            client-secret: ${OAUTH_NAVER_CLIENT_SECRET}
            scope:
              - name
            client-name: Naver
            authorization-grant-type: authorization_code
            redirect-uri: ${OAUTH_NAVER_REDIRECT_URI}

        provider:

          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id

          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: https://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
            user-name-attribute: response
```

DB 설정은 각자 환경에 맞게 해주면 되고, Security 아래 부분부터가 중요하다.

해당 코드를 본인의 yml파일에 붙여 넣은 후에, 환경 변수를 설정해주면 된다.

위 과정을 통해서 얻은 각 플랫폼마다의 클라이언트 ID와 클라이언트 시크릿 키가 있는데, 이를 넣어준다.

카카오에서 `OAUTH_KAKAO_CLIENT_ID`는 `REST API`키를 의미한다.

또한, `OAUTH_GOOGLE_REDIRECT_URI` 과 같이 리다이렉트 URI도 설정해준다. 
- 구글 : `http://localhost:8080/login/oauth2/code/google` 
- 카카오 : `http://localhost:8080/login/oauth2/code/kakao` 
- 네이버 : `http://localhost:8080/login/oauth2/code/naver` 

로컬 개발환경에서는 위와 같이 설정해주고, 도메인 적용 후에는 그에 따라 변경해주면 된다!

카카오, 네이버에서는 구글과 다르게 `provider` 설정도 해주어야 해서, 위 yml 파일과 동일하게 작성해주면 되겠다.

---

## 라. build.gradle

이제는 build.gradle 파일을 설정해줄 차례이다.

```java
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.4'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'kusitms'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

repositories {
    mavenCentral()
}

dependencies {
    // 웹
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    // JPA
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.mysql:mysql-connector-j'
    // OAuth 2.0
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
    // Jwt
    implementation 'io.jsonwebtoken:jjwt-api:0.12.2'
    implementation 'io.jsonwebtoken:jjwt-impl:0.12.2'
    implementation 'io.jsonwebtoken:jjwt-jackson:0.12.2'
    // 시큐리티
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity6'
    testImplementation 'org.springframework.security:spring-security-test'
    // 롬복
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

나는 보통 위처럼 사용을 하는데, 다른 부분은 상황에 맞게 하되
- OAuth2.0 
- Jwt
- Spring Security

설정만 동일하게 진행해주면 되겠다!

---

## 마. User 엔터티 & 레포지토리

### 1) User

소셜 로그인 진행 후, 유저를 등록하거나 찾아와야 하기 때문에 이를 위한 엔터티와 레포지토리를 생성해준다.

```java
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_id")
    private Long id;

    @Column(name = "users_uuid", columnDefinition = "BINARY(16)", unique = true)
    private UUID userId;

    @Column(name = "name", nullable = false, length = 5)
    private String name;

    @Column(name = "provider", nullable = false, length = 10)
    private String provider;

    @Column(name = "provider_id", nullable = false, length = 50)
    private String providerId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, length = 20)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", length = 20)
    private LocalDateTime updatedAt;
}
```

- provider는 google, kakao, naver로 지정된다.
- ~~카카오에서 이메일을 받을 수 없기 때문에~~, 로그인 시 providerId를 추출하여 각 유저를 구분한다.

=> 비즈니스로 변경하면 이메일을 받을 수 있다고 한다. 생각보다 어렵지 않은 것 같으니, 이메일이 꼭 필요하다면 변경하도록 하자!

### 2) UserRepository

```java
import kusitms.jangkku.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query("SELECT u FROM User u WHERE u.userId = :userId")
    Optional<User> findByUserId(UUID userId);

    User findByProviderId(String providerId);
}
```

- 유저의 UUID로 유저를 찾는 메서드와, providerId로 유저를 찾는 메서드를 구현해준다.

---

## 바. Refresh 토큰 엔터티 & 레포지토리

다음으로는 리프레쉬 토큰을 DB에 저장하기 위한 엔터티와 레포지토리를 만들어준다.

보통 해당 과정에서는 Redis를 많이 사용하기도 한다.

### 1) 리프레쉬 토큰은 왜 필요한가?

인증 & 인가에 사용되는 토큰을 액세스 토큰 (=Jwt 토큰) 이라고 부르고, 이 액세스 토큰을 재발행하기 위한 토큰을 리프레쉬 토큰이라고 부른다.

Jwt 토큰의 단점 중 하나가, 발행 후에 다시 회수하여 관리할 수가 없다는 점이다.
그렇기에 만약 토큰이 탈취된다면, 유저의 정보가 담긴 토큰으로 악용할 우려가 있기 때문에 보통은 토큰에 유효기간을 설정해준다.

만약 1시간으로 설정을 한 후에 발급한다면, 탈취가 되었어도 그 시간이 지난 후에는 사용할 수 없으니 보안성을 높일 수 있다.

하지만 여기서 또 발생하는 문제점은, 유저가 계속 서비스를 이용하는 와중에도 1시간마다 토큰을 재발행하기 위해 재로그인을 진행해주어야 한다는 번거로움이 있다는 것이다.

이를 고려하여 만든 것이 바로 리프레쉬 토큰이며, 해당 리프레쉬 토큰의 유효기간이 남아 있는 동안에는 계속해서 액세스 토큰을 재발행할 수 있다.

자세히 설명하자면 글이 너무 길어질 것 같아서, 이해가 안된다면 아래 블로그 글을 참고하면 좋을 것 같다!

https://han-um.tistory.com/17

### 2) RefreshToken

```java
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refresh_tokens_id")
    private Long id;

    @Column(name = "users_uuid", columnDefinition = "BINARY(16)", unique = true)
    private UUID userId;

    @Column(name = "token", nullable = false)
    private String token;
}
```
- 어느 유저의 리프레쉬 토큰인지 알아야 하기 때문에, userId를 함께 저장한다.

### 3) RefreshTokenRepository

```java
import jakarta.transaction.Transactional;
import kusitms.jangkku.domain.token.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
    @Query("SELECT u FROM RefreshToken u WHERE u.userId = :userId")
    RefreshToken findByUserId(UUID userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM RefreshToken u WHERE u.userId = :userId")
    void deleteByUserId(UUID userId);
}
```
- 유저의 UUID로 리프레쉬 토큰을 찾는 메서드와, 삭제하는 메서드를 구현해준다.

---

## 사. 유저 정보 저장 & 추출

### 1) OAuth2UserInfo

```java
public interface OAuth2UserInfo {
    String getProviderId();
    String getProvider();
    String getName();
}
```

- 유저의 정보를 가져오는 메서드들을 통일해주기 위해서 인터페이스로 만들어준다.

### 2) GoogleUserInfo

```java
import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class GoogleUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }
}
```

- 위 인터페이스를 implements하여 구현해준다.
- 구글, 카카오, 네이버에 담겨 있는 정보의 형태가 약간씩은 다르기 때문에 이러한 방식으로 인터페이스 - 구현체로 만들어 주는 것이다.

### 3) KaKaoUserInfo

```java
import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class KakaoUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        // Long 타입이기 때문에 toString으로 변환
        return attributes.get("id").toString();
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getName() {
        // kakao_account라는 Map에서 추출
        return (String) ((Map) attributes.get("properties")).get("nickname");
    }
}
```

### 4) NaverUserInfo

```java
import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class NaverUserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes;

    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }
}
```

---

## 아. Jwt 토큰 관련 설정 & 메서드

여기까지 하면 이제 소셜 로그인을 통해서 유저의 정보를 받아 오고, 가공하여 저장할 준비까지는 완료가 되었다.

하지만 최종적으로 해당 정보를 가지고 Jwt 토큰을 발급하여 프론트엔드로 보내주어야 하고, 또 나중에는 리프레쉬 토큰도 활용해야 하기에 관련한 설정 및 메서드들이 필요하다.

### 1) application.yml

```yml
jwt:
  secret: ${JWT_SECRET}
  redirect: ${JWT_REDIRECT_URI}
  access-token:
    expiration-time: ${ACCESS_TOKEN_EXPIRATION_TIME}
  refresh-token:
    expiration-time: ${REFRESH_TOKEN_EXPIRATION_TIME}
```
우선은 yml 파일에 위 설정들을 추가해주어야 한다.
- **JWT_SECRET**은 64글자 이상의 영어 알파벳으로 이루어진 값으로 사용해준다. 당연히 탈취되지 않도록 유의해주어야 하기에, 환경 변수로 설정한다.
`ex) hadgafasadad...`

- **JWT_REDIRECT_URI**는 소셜 로그인 성공 이후 프론트엔드 측으로 보내줄 리다이렉트 URI이다.
`ex) http://localhost:5173/login?name=%s&access_token=%s&refresh_token=%s`
위와 같이 프론트엔드에서 받을 수 있는 URI로 지정해주면 되고, 쿼리 파라미터로 보내주고 싶은 정보들을 지정한다. 
여기서는 이름, 액세스 토큰, 리프레쉬 토큰을 보내도록 하였고, 후에 포맷팅을 사용하기 위해서 `%s`로 지정했다.
리다이렉트가 잘 되는지 확인하기 위해, 우선은 localhost:5173 -> localhost:8080 으로 변경해서 진행하겠다!

- **ACCESS_TOKEN_EXPIRATION_TIME**은 액세스 토큰의 유효기간이다. 1시간을 의미하는 `3600000`으로 지정한다.

- **REFRESH_TOKEN_EXPIRATION_TIME**은 리프레쉬 토큰의 유효기간이다. 일주일을 의미하는 `604800000`으로 지정한다. 기간은 프로젝트 상황에 맞게 설정해주면 되겠다.

### 2) JwtUtil

```java
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import kusitms.jangkku.domain.token.exception.TokenErrorResult;
import kusitms.jangkku.domain.token.exception.TokenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 액세스 토큰을 발급하는 메서드
    public String generateAccessToken(UUID userId, long expirationMillis) {
        log.info("액세스 토큰이 발행되었습니다.");

        return Jwts.builder()
                .claim("userId", userId.toString()) // 클레임에 userId 추가
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(this.getSigningKey())
                .compact();
    }

    // 리프레쉬 토큰을 발급하는 메서드
    public String generateRefreshToken(UUID userId, long expirationMillis) {
        log.info("리프레쉬 토큰이 발행되었습니다.");

        return Jwts.builder()
                .claim("userId", userId.toString()) // 클레임에 userId 추가
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(this.getSigningKey())
                .compact();
    }

    // 응답 헤더에서 액세스 토큰을 반환하는 메서드
    public String getTokenFromHeader(String authorizationHeader) {
        return authorizationHeader.substring(7);
    }

    // 토큰에서 유저 id를 반환하는 메서드
    public String getUserIdFromToken(String token) {
        try {
            String userId = Jwts.parser()
                    .verifyWith(this.getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("userId", String.class);
            log.info("유저 id를 반환합니다.");
            return userId;
        } catch (JwtException | IllegalArgumentException e) {
            // 토큰이 유효하지 않은 경우
            log.warn("유효하지 않은 토큰입니다.");
            throw new TokenException(TokenErrorResult.INVALID_TOKEN);
        }
    }

    // Jwt 토큰의 유효기간을 확인하는 메서드
    public boolean isTokenExpired(String token) {
        try {
            Date expirationDate = Jwts.parser()
                    .verifyWith(this.getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();
            log.info("토큰의 유효기간을 확인합니다.");
            return expirationDate.before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            // 토큰이 유효하지 않은 경우
            log.warn("유효하지 않은 토큰입니다.");
            throw new TokenException(TokenErrorResult.INVALID_TOKEN);
        }
    }
}
```

---

## 자. 소셜 로그인 성공 or 실패 시 핸들러

소셜 로그인에 실제로 성공하거나 실패하는 경우에, 동작하는 핸들러를 만들어 줄 차례이다.

지금까지 위에서 만든 기능들을 여기서 사용해준다고 보면 되겠다.

### 1) OAuthLoginSuccessHandler

```java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kusitms.jangkku.domain.token.dao.RefreshTokenRepository;
import kusitms.jangkku.domain.token.domain.RefreshToken;
import kusitms.jangkku.domain.user.dao.UserRepository;
import kusitms.jangkku.domain.user.domain.User;
import kusitms.jangkku.global.auth.dto.GoogleUserInfo;
import kusitms.jangkku.global.auth.dto.KakaoUserInfo;
import kusitms.jangkku.global.auth.dto.NaverUserInfo;
import kusitms.jangkku.global.auth.dto.OAuth2UserInfo;
import kusitms.jangkku.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuthLoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Value("${jwt.redirect}")
    private String REDIRECT_URI; // 프론트엔드로 Jwt 토큰을 리다이렉트할 URI

    @Value("${jwt.access-token.expiration-time}")
    private long ACCESS_TOKEN_EXPIRATION_TIME; // 액세스 토큰 유효기간

    @Value("${jwt.refresh-token.expiration-time}")
    private long REFRESH_TOKEN_EXPIRATION_TIME; // 리프레쉬 토큰 유효기간

    private OAuth2UserInfo oAuth2UserInfo = null;

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication; // 토큰
        final String provider = token.getAuthorizedClientRegistrationId(); // provider 추출

        // 구글 || 카카오 || 네이버 로그인 요청
        switch (provider) {
            case "google" -> {
                log.info("구글 로그인 요청");
                oAuth2UserInfo = new GoogleUserInfo(token.getPrincipal().getAttributes());
            }
            case "kakao" -> {
                log.info("카카오 로그인 요청");
                oAuth2UserInfo = new KakaoUserInfo(token.getPrincipal().getAttributes());
            }
            case "naver" -> {
                log.info("네이버 로그인 요청");
                oAuth2UserInfo = new NaverUserInfo((Map<String, Object>) token.getPrincipal().getAttributes().get("response"));
            }
        }

        // 정보 추출
        String providerId = oAuth2UserInfo.getProviderId();
        String name = oAuth2UserInfo.getName();

        User existUser = userRepository.findByProviderId(providerId);
        User user;

        if (existUser == null) {
            // 신규 유저인 경우
            log.info("신규 유저입니다. 등록을 진행합니다.");

            user = User.builder()
                    .userId(UUID.randomUUID())
                    .name(name)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            userRepository.save(user);
        } else {
            // 기존 유저인 경우
            log.info("기존 유저입니다.");
            refreshTokenRepository.deleteByUserId(existUser.getUserId());
            user = existUser;
        }

        log.info("유저 이름 : {}", name);
        log.info("PROVIDER : {}", provider);
        log.info("PROVIDER_ID : {}", providerId);

        // 리프레쉬 토큰 발급 후 저장
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId(), REFRESH_TOKEN_EXPIRATION_TIME);

        RefreshToken newRefreshToken = RefreshToken.builder()
                                        .userId(user.getUserId())
                                        .token(refreshToken)
                                        .build();
        refreshTokenRepository.save(newRefreshToken);

        // 액세스 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(user.getUserId(), ACCESS_TOKEN_EXPIRATION_TIME);

        // 이름, 액세스 토큰, 리프레쉬 토큰을 담아 리다이렉트
        String encodedName = URLEncoder.encode(name, "UTF-8");
        String redirectUri = String.format(REDIRECT_URI, encodedName, accessToken, refreshToken);
        getRedirectStrategy().sendRedirect(request, response, redirectUri);
    }
}
```

- 유저가 소셜 로그인을 진행해 성공하면 동작하는 핸들러이다.
- provider에 따라 구분한 뒤에, oAuth2UserInfo에 유저 정보를 담아준다.
- 정보를 추출하고, 신규 유저인 경우에는 DB에 저장해주고, 기존 유저인 경우에는 원래 있던 리프레쉬 토큰을 삭제해준다.
- 리프레쉬 토큰을 새로 발급해서 DB에 저장해준다.
- 액세스 토큰 (=Jwt 토큰)까지 새로 발급한 후에, 미리 지정해두었던 리다이렉트 URI로 정보들을 쿼리 파라미터에 담아 리다이렉트한다.

### 2) OAuthLoginFailureHandler

```java
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuthLoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.error("LOGIN FAILED : {}", exception.getMessage());
        super.onAuthenticationFailure(request, response, exception);
    }
}
```

- 유저가 소셜 로그인에 실패하면 동작하는 핸들러이다.

(04.24)
로그인 실패 시 후속 조치 (= 로그인 페이지로 리다이렉트 등)가 없음. 추후 보완 예정

---

## 차. Spring Security

### 1) SecurityConfig

이제 마지막 단계로 Spring Security를 설정해주면 소셜 로그인 구현을 마칠 수 있다.

```java
import kusitms.jangkku.global.auth.application.OAuthLoginFailureHandler;
import kusitms.jangkku.global.auth.application.OAuthLoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final OAuthLoginSuccessHandler oAuthLoginSuccessHandler;
    private final OAuthLoginFailureHandler oAuthLoginFailureHandler;

    // CORS 설정
    CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedHeaders(Collections.singletonList("*"));
            config.setAllowedMethods(Collections.singletonList("*"));
            config.setAllowedOriginPatterns(Collections.singletonList("*")); // 허용할 origin
            config.setAllowCredentials(true);
            return config;
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.
                httpBasic(HttpBasicConfigurer::disable)
                .cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource())) // CORS 설정 추가
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/**").permitAll()
                )

                .oauth2Login(oauth -> // OAuth2 로그인 기능에 대한 여러 설정의 진입점
                        oauth
                                .successHandler(oAuthLoginSuccessHandler) // 로그인 성공 시 핸들러
                                .failureHandler(oAuthLoginFailureHandler) // 로그인 실패 시 핸들러
                );

        return httpSecurity.build();
    }
}
```

- Security에 위에서 만든 성공 & 실패 핸들러를 등록해준다.
- 기타 CORS, CSRF, 허용 origin 등등은 개발 상황에 맞게 설정해주면 되겠다. 우선은 모든 요청에 대해 허용하도록 설정해두었다.

---

## 카. 소셜 로그인 동작 모습

여기까지 구현을 완료했다면, 우선 소셜 로그인 구현까지는 진행이 된 것이다.

애플리케이션을 실행한 후에, `localhost:8080/login`에 접속하면 아래와 같은 화면이 나온다.

![](https://velog.velcdn.com/images/kusitms-29th-d/post/d640bc49-009c-480a-8069-1b94b4870c5a/image.png)

이는 Spring Security에서 자체적으로 제공하는 기본 화면이고, 여기서 각 플랫폼을 누르면 로그인 화면으로 넘어가게 된다.

하지만 클라이언트에게 위와 같은 화면을 보여줄 수는 없기 때문에, 프론트엔드에서 클라이언트를 적절하게 로그인 화면으로 리다이렉트 시켜주어야 한다.

![](https://velog.velcdn.com/images/kusitms-29th-d/post/573c4aeb-560d-4930-9672-3e6911fef273/image.png)

개발자 도구를 켜서 보면, 각 플랫폼 클릭 시

- 구글 : `http://localhost:8080/oauth2/authorization/google`
- 카카오 : `http://localhost:8080/oauth2/authorization/kakao`
- 네이버 : `http://localhost:8080/oauth2/authorization/naver`

로 리다이렉트 시키는 것을 볼 수 있다.

그러므로 프론트엔드에서 로그인 버튼을 만들어 준 후에, 클라이언트가 해당 버튼을 클릭하면 위 URI로 리다이렉트만 시켜주면 된다.

ex) 카카오톡으로 로그인 하기 버튼 클릭 -> `http://localhost:8080/oauth2/authorization/kakao`로 리다이렉트

현재는 로컬 개발 환경이기에 localhost:8080이고, 이후 도메인을 적용하면 그 쪽으로 넘겨주면 된다.

ex) `https://test.com/oauth2/authorization/kakao`

### 1) 구글
![](https://velog.velcdn.com/images/kusitms-29th-d/post/a2f05ede-646e-408c-95a3-a3ad21a00241/image.png)

![](https://velog.velcdn.com/images/kusitms-29th-d/post/ac7e3dab-60de-40a3-81d4-6e1cacd2d6ed/image.png)

![](https://velog.velcdn.com/images/kusitms-29th-d/post/dcc8f05f-8e6a-47ad-8c03-8d47969d98a1/image.png)

### 2) 카카오
![](https://velog.velcdn.com/images/kusitms-29th-d/post/eb560f09-f86e-40ba-9f1c-d80ff59b1c16/image.png)

![](https://velog.velcdn.com/images/kusitms-29th-d/post/649083e9-407b-4599-bd6f-31152b45feec/image.png)

### 3) 네이버
![](https://velog.velcdn.com/images/kusitms-29th-d/post/27a11f64-b87e-42ed-a54d-4db6fd7864de/image.png)

![](https://velog.velcdn.com/images/kusitms-29th-d/post/6c594ca2-ba67-4e86-b74a-41a1e7ca3f61/image.png)

### 4) DB 저장 모습
![](https://velog.velcdn.com/images/kusitms-29th-d/post/3c1a3026-7d5f-4c6f-a660-4eccb6bc7f3b/image.png)

- DB에 까지 잘 들어가는 모습을 확인할 수 있다.

### 5) 리다이렉트 모습


![](https://velog.velcdn.com/images/kusitms-29th-d/post/b3b9f182-28d8-4f93-b9ee-dbf5df75d4c1/image.png)

```
http://localhost:8080/login?name=한빵&access_token=eyJhbGciOiJIUzM4NCJ9.eyJ1c2VySWQiOiIwMDdlYTFiMC03MzA2LTQwZDEtODY0Yy1hNjIyY2FhNzNlYzQiLCJpYXQiOjE3MTM2MDg2NDEsImV4cCI6MTcxMzYxMjI0MX0.Uq9Fl3keLccJt248QisJSjKH_RZF-POXwbKrWPok-KsUi-zs8dLPvK_u4nhYbLX1&refresh_token=eyJhbGciOiJIUzM4NCJ9.eyJ1c2VySWQiOiIwMDdlYTFiMC03MzA2LTQwZDEtODY0Yy1hNjIyY2FhNzNlYzQiLCJpYXQiOjE3MTM2MDg2NDEsImV4cCI6MTcxNDIxMzQ0MX0.rJi3uuIxWYb4yo3HMlh-PV8nm51gVCdANQJPFefzsiORwgun3BsdhXccWAOv_KqA
```

- 마지막으로는 이렇게 미리 지정해두었던 리다이렉트 URI에 정보를 담아 보내주게 되고, 이를 프론트엔드 측에서 파싱하여 저장해둔 후 이후 API 요청 시 사용하면 된다.

- 도메인은 프론트엔드에서 접근 가능한 곳으로 변경해서 보내주면 되겠다. 
만약 프론트에서 `vercel`로 배포했다면, `https://{지정한 도메인 명}.vercel.app/login~` 과 같이 될 것이다.

(04.24)
쿼리 파라미터로 리프레쉬 토큰까지 함께 보낼 시, 탈취당할 우려가 존재함.
때문에 리프레쉬 토큰은 HTTP Only, Secure 설정된 쿠키에 담아 관리하는 방식으로 보완할 예정

---

# 4. 액세스 토큰 재발행 API 🪙

마지막 단계로, 리프레쉬 토큰을 활용하여 액세스 토큰을 재발행하는 API를 구현해주면 된다.

위 과정까지 잘 따라왔다면, 소셜 로그인 성공 시 프론트엔드 측에서 액세스 토큰과 리프레쉬 토큰을 저장하고 있다는 점은 이해하고 있을 것이다.

유저의 정보가 담긴 액세스 토큰 (=Jwt 토큰)을 매 API 요청 시마다 보내주면 되고, 만약 액세스 토큰의 유효기간이 만료되어 간다면 이를 캐치해서 재발행 요청을 해주면 된다.

이 과정은 프론트엔드 쪽에서 구현해주어야 하는 부분이다!

주의해야할 점은 이미 만료된 후에만 재발행 요청을 하는 것이 아니라,

1. 만료되기 직전인 경우
2. 만료된 경우

두 가지 경우에 요청을 해주어야 한다.

왜냐하면 API 요청 시에도 시간이 걸리는데, 만료되기 직전인 액세스 토큰을 보내 요청을 했다가, 백엔드가 처리할 때에는 만료가 되어 401 에러가 뜰 상황이 존재하기 때문이다.

## 가. 응답 객체 통일 & 에러 처리

프론트엔드 측으로 보내주는 응답 객체를 통일하는 과정이다.

소셜 로그인과 관련이 있는 부분은 아니지만, 내 코드를 따라서 작업하는 사람들이 있을 수도 있기 때문에 우선은 다 올려두려고 한다!

응답 객체와 에러 처리 같은 부분은 나도 미숙하기도 하고, 사람마다 스타일이 다르기 때문에 이 부분들은 참고만 하고 넘어가도 좋겠다.

### 1) BaseCode

```java
import kusitms.jangkku.global.common.dto.ReasonDto;

public interface BaseCode {
    public ReasonDto getReason();

    public ReasonDto getReasonHttpStatus();
}
```

### 2) BaseErrorCode

```java
import kusitms.jangkku.global.common.dto.ErrorReasonDto;

public interface BaseErrorCode {
    public ErrorReasonDto getReason();

    public ErrorReasonDto getReasonHttpStatus();
}
```

### 3) ReasonDto

```java
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@Builder
public class ReasonDto {
    private HttpStatus httpStatus;
    private final boolean isSuccess;
    private final String code;
    private final String message;
}
```

### 4) ErrorReasonDto

```java
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@Builder
public class ErrorReasonDto {
    private HttpStatus httpStatus;
    private final boolean isSuccess;
    private final String code;
    private final String message;
}
```

### 5) ApiResponse

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import kusitms.jangkku.global.common.code.BaseCode;
import kusitms.jangkku.global.common.code.BaseErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

@Getter
@RequiredArgsConstructor
public class ApiResponse<T> {
    @JsonProperty("isSuccess")
    private final Boolean isSuccess;
    private final String code;
    private final String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final T payload;
    public static <T> ResponseEntity<ApiResponse<T>> onSuccess(BaseCode code, T data) {
        ApiResponse<T> response = new ApiResponse<>(true, code.getReasonHttpStatus().getCode(), code.getReasonHttpStatus().getMessage(), data);
        return ResponseEntity.status(code.getReasonHttpStatus().getHttpStatus()).body(response);
    }

    public static <T> ResponseEntity<ApiResponse<T>> onFailure(BaseErrorCode code) {
        ApiResponse<T> response = new ApiResponse<>(false, code.getReasonHttpStatus().getCode(), code.getReasonHttpStatus().getMessage(), null);
        return ResponseEntity.status(code.getReasonHttpStatus().getHttpStatus()).body(response);
    }
}
```

- 여기서 API 응답 객체를 원하는 형식으로 커스텀할 수 있다.
- 나는 성공 시에는 HttpStatus, 메세지, payload를 담고, 실패 시에는 HttpStatus, 메세지만 담도록 구현했다.

### 6) SuccessStatus

```java
import kusitms.jangkku.global.common.code.BaseCode;
import kusitms.jangkku.global.common.dto.ReasonDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SuccessStatus implements BaseCode {
    // 전역 응답 코드
    _OK(HttpStatus.OK, "200", "성공입니다."),
    _CREATED(HttpStatus.CREATED, "201", "생성에 성공했습니다."),

    // 커스텀 응답 코드
    _CREATED_ACCESS_TOKEN(HttpStatus.CREATED, "201", "액세스 토큰 재발행에 성공했습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ReasonDto getReason() {
        return ReasonDto.builder()
                .isSuccess(true)
                .code(code)
                .message(message)
                .build();
    }

    @Override
    public ReasonDto getReasonHttpStatus() {
        return ReasonDto.builder()
                .isSuccess(true)
                .httpStatus(httpStatus)
                .code(code)
                .message(message)
                .build();
    }
}
```

- 성공 시 보낼 응답 코드를 Enum 클래스로 만들어준다.

### 7) ErrorStatus

```java
import kusitms.jangkku.global.common.code.BaseErrorCode;
import kusitms.jangkku.global.common.dto.ErrorReasonDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    // 전역 에러
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"500", "서버에서 요청을 처리 하는 동안 오류가 발생했습니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST,"400", "입력 값이 잘못된 요청 입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"401", "인증이 필요 합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "403", "금지된 요청 입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDto getReason() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .build();
    }

    @Override
    public ErrorReasonDto getReasonHttpStatus() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .httpStatus(httpStatus)
                .code(code)
                .message(message)
                .build();
    }
}
```

- 실패 시 보낼 응답 코드를 Enum 클래스로 만들어준다.

### 8) TokenException

```java
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TokenException extends RuntimeException {
    private final TokenErrorResult tokenErrorResult;

    @Override
    public String getMessage() {
        return tokenErrorResult.getMessage();
    }
}
```

### 9) TokenErrorResult

```java
import kusitms.jangkku.global.common.code.BaseErrorCode;
import kusitms.jangkku.global.common.dto.ErrorReasonDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TokenErrorResult implements BaseErrorCode {
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "401", "유효하지 않은 토큰입니다."),
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "401", "유효하지 않은 액세스 토큰입니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "401", "유효하지 않은 리프레쉬 토큰입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDto getReason() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .build();
    }

    @Override
    public ErrorReasonDto getReasonHttpStatus() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .httpStatus(httpStatus)
                .code(code)
                .message(message)
                .build();
    }
}
```

- 토큰과 관련된 에러 발생 시 보낼 응답 코드를 Enum 클래스로 만들어준다.

### 10) UserException

```java
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserException extends RuntimeException {
    private final UserErrorResult userErrorResult;

    @Override
    public String getMessage() {
        return userErrorResult.getMessage();
    }
}
```

### 11) UserErrorResult

```java
import kusitms.jangkku.global.common.code.BaseErrorCode;
import kusitms.jangkku.global.common.dto.ErrorReasonDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UserErrorResult implements BaseErrorCode {
    NOT_FOUND_USER(HttpStatus.NOT_FOUND, "404", "존재하지 않는 유저입니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDto getReason() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .build();
    }

    @Override
    public ErrorReasonDto getReasonHttpStatus() {
        return ErrorReasonDto.builder()
                .isSuccess(false)
                .httpStatus(httpStatus)
                .code(code)
                .message(message)
                .build();
    }
}
```

- 유저와 관련된 에러 발생 시 보낼 응답 코드를 Enum 클래스로 만들어준다.

### 12. GlobalExceptionHandler

```java
import kusitms.jangkku.domain.token.exception.TokenErrorResult;
import kusitms.jangkku.domain.token.exception.TokenException;
import kusitms.jangkku.domain.user.exception.UserErrorResult;
import kusitms.jangkku.domain.user.exception.UserException;
import kusitms.jangkku.global.common.ApiResponse;
import kusitms.jangkku.global.common.code.BaseErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleTokenException(TokenException e) {
        TokenErrorResult errorResult = e.getTokenErrorResult();
        return ApiResponse.onFailure(errorResult);
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleUserException(UserException e) {
        UserErrorResult errorResult = e.getUserErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
}
```

- 컨트롤러 동작 과정에서 발생하는 에러들을 전역적으로 처리해주는 핸들러이다.
- 토큰 에러가 발생하면, 토큰 에러를 대신 처리해주고, 유저 에러가 발생하면 유저 에러를 대신 처리해준다.

---

## 나. API 구현

### 1) TokenResponse

```java
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class TokenResponse {
    @JsonProperty("access_token")
    private String accessToken;
}
```

- 우선은 재발행 성공 시에 보내 줄 토큰 DTO를 만들어주자.

### 2) TokenService

```java
import kusitms.jangkku.domain.token.dto.response.TokenResponse;

public interface TokenService {
    TokenResponse reissueAccessToken(String authorizationHeader);
}
```

- 토큰 서비스 인터페이스를 만들어 사용할 메서드를 정의해준다.

### 3) TokenServiceImpl

```java
import kusitms.jangkku.domain.token.dao.RefreshTokenRepository;
import kusitms.jangkku.domain.token.domain.RefreshToken;
import kusitms.jangkku.domain.token.dto.response.TokenResponse;
import kusitms.jangkku.domain.token.exception.TokenErrorResult;
import kusitms.jangkku.domain.token.exception.TokenException;
import kusitms.jangkku.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    @Value("${jwt.access-token.expiration-time}")
    private long ACCESS_TOKEN_EXPIRATION_TIME; // 액세스 토큰 유효기간

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    
    @Override
    public TokenResponse reissueAccessToken(String authorizationHeader) {
        String refreshToken = jwtUtil.getTokenFromHeader(authorizationHeader);
        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        RefreshToken existRefreshToken = refreshTokenRepository.findByUserId(UUID.fromString(userId));
        String accessToken = null;

        if (!existRefreshToken.getToken().equals(refreshToken) || jwtUtil.isTokenExpired(refreshToken)) {
            // 리프레쉬 토큰이 다르거나, 만료된 경우
            throw new TokenException(TokenErrorResult.INVALID_REFRESH_TOKEN); // 401 에러를 던져 재로그인을 요청
        } else {
            // 액세스 토큰 재발급
            accessToken = jwtUtil.generateAccessToken(UUID.fromString(userId), ACCESS_TOKEN_EXPIRATION_TIME);
        }

        return TokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}
```

- 메서드를 오버라이드해 구현해준다.
- 헤더에서 리프레쉬 토큰을 가져온 후에, 다시 그 토큰에서 userId를 가져온다.
- userId를 사용해서 기존에 존재하는 리프레쉬 토큰을 가져온다.
- 만약, 리프레쉬 토큰이 다르거나 만료되었을 경우에는 401 에러를 던져 유저가 재로그인하도록 한다.
- 모든 경우에 통과했다면, 액세스 토큰을 재발급하여 반환한다.

### 4) TokenController

```java
import kusitms.jangkku.domain.token.application.TokenService;
import kusitms.jangkku.domain.token.dto.response.TokenResponse;
import kusitms.jangkku.global.common.ApiResponse;
import kusitms.jangkku.global.common.constant.SuccessStatus;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TokenController {
    private final TokenService authService;

    // 액세스 토큰을 재발행하는 API
    @GetMapping("/reissue/access-token")
    public ResponseEntity<ApiResponse<Object>> reissueAccessToken(
            @RequestHeader("Authorization") String authorizationHeader) {

        TokenResponse accessToken = authService.reissueAccessToken(authorizationHeader);
        return ApiResponse.onSuccess(SuccessStatus._CREATED_ACCESS_TOKEN, accessToken);
    }
}
```

- 컨트롤러에서 위에서 만든 서비스를 활용하여 API를 최종적으로 구현해준다.
- 프론트엔드에서 헤더에 `Bearer`를 붙여서 백엔드에 요청을 하면 되는 구조이다.
- 나는 커스텀한 ApiResponse를, ResponseEntity에 한 번 더 감싸서 보내주어 프론트엔드 측에서 HttpStatus를 받을 수 있도록 구현했다.
- 즉, 프론트엔드에서는 요청 시에 액세스 토큰이 오면 그대로 받아 사용해주면 되고, 만약 401 에러가 발생하면 유저가 재로그인하도록 해주면 되는 것이다.

### 5) 재발행 성공 모습

![](https://velog.velcdn.com/images/kusitms-29th-d/post/3b9e42fb-f21c-4886-8184-c2b49fa1a86e/image.png)

### 6) 재발행 실패 모습

![](https://velog.velcdn.com/images/kusitms-29th-d/post/b65dedca-e4df-4678-94e6-8378efb36dc7/image.png)

---

# 5. 마무리 💫

지금까지 꽤나 긴 소셜 로그인 구현 과정이 이어졌다.

글을 작성하면서 다시 한 번 더 개념도 잡고, 코드에서 불필요한 부분도 제거를 하면서 조금 더 배울 수 있었던 것 같다.

아래 블로그 글에 많은 도움을 받았다.
https://chb2005.tistory.com/182

나도 처음 소셜 로그인을 구현했을 때, 감도 안 잡히고 많이 어려웠던 기억이 있어서 이 글이 누군가에게 조금이나마 도움이 되었으면 한다.

지금까지 이 글을 작성하기 위해서 수많은 블로그 글을 찾아 보았고, 나의 경험에 의해서 코드를 조합했기 때문에 분명히 리팩토링 해야 할 부분도 존재할 것이다.

피드백은 환영이니, 누구나 편하게 말해주면 좋을 것 같다 🙃

마지막으로 큐시즘 밋업 쿨피스팀 화이팅! 👻

(Github🧑🏻‍💻 : https://github.com/KUSITMS-29th-TEAM-D/backend)
