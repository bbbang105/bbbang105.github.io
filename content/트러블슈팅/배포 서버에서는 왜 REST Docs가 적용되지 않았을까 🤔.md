---
date: 2024-11-01
tags:
  - backend
  - springboot
  - troubleshooting
---
 Trouble Shooting

---

한창 큐시즘 30기 밋업 프로젝트를 달리고 있는 요즘이다.
자세한 회고록은 끝나고 쓰겠지만, 중간중간 트러블 슈팅한 내용을 기록해두려고 글을 적는다!

---

# 📄 REST Docs + Swagger

우리 팀은 HitZone 서비스를 만들면서,
API 명세서를 REST Docs + Swagger로 관리하기로 결정했다.

이렇게 하면,
1) 테스트 코드를 자연스럽게 작성하게 되고
2) 깔끔하면서도 가독성 좋은 문서를 만들 수가 있게 된다.

기본적인 구축은 같은 백엔드 팀원 준형이형이 해주었기에,
나는 명확한 동작 원리는 잘 모르는 상태였음을 미리 알린다!

적용 방법에 대해서는 후에 글로 한 번 작성해보려고 한다.

---

# 🥲 배포 서버에서는 왜..?

API를 만든 후 테스트 코드까지 작성하고,
빌드 후 실행하게 되면 아래와 같이 REST Docs가 Swagger에 잘 적용되어서 보였다.

![](https://velog.velcdn.com/images/hsh111366/post/e7f7b2f2-e07c-4529-ad40-f01366c1e0d3/image.png)

하지만 이상하게도 배포 서버에서는 보이지 않았다.

![](https://velog.velcdn.com/images/hsh111366/post/0616c2e5-a192-4955-971b-5c89c090439f/image.png)

---

# 🏃🏻 초기 해결 시도

이를 해결하기 위해 초기에 여러 방법을 시도해보았다.

## 1. 배포 서버를 기본 서버 URL로 설정

#### build.gradle

```java

def serverUrl = "https://git.hitzone.store"

openapi3 {
    server = serverUrl
    title = "히트존 API 문서"
    description = "Spring REST Docs with Swagger UI."
    version = "0.0.1"
    outputFileNamePrefix = 'open-api-3.0.1'
    format = 'json'
    outputDirectory = 'build/resources/main/static/docs'
}
```

이런식으로 설정을 하였지만 해결되지 않았다.
후에 테스트를 해본 결과 기본 서버 URL은 큰 역할을 하는 것 같지는 않았다.
위처럼 배포 도메인으로 설정해두었지만, 로컬에서도 잘 실행되었기 때문이다.

## 2. CORS 허용, Swagger 서버 설정 추가

#### SecurityConfig (기존)

```java
...

	@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://211.188.55.153:8080"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setMaxAge(3600L);
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
...
```

#### SecurityConfig (배포 도메인 추가)

```java
...

	@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://git.hitzone.store"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setMaxAge(3600L);
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
...
```

배포 도메인을 추가하여 CORS를 허용하였다.

#### SwaggerConfig

```java
...

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info().title("히트존 API 문서").version("0.0.1").description("Spring REST Docs with Swagger UI."))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("로컬 서버"),
                        new Server().url("https://git.hitzone.store").description("배포 서버")
                ));
                
...
```

또한 위와 같이 로컬과 배포 서버를 분리하였다.

당연하게도 이를 통해 해결되지는 않았다.
하지만 어차피 이 부분을 해 두지 않으면, 배포 도메인 Swagger에서 테스트를 할 때 CORS 에러가 발생하게 되니 해두어야 한다.

---

# 🕵🏻‍♂️ 문제를 찾은 것 같다

그렇게 갈피를 못 잡고 있던 도중,
Swagger는 되는데 REST Docs가 적용되지 않는 문제라면 해당 `문서가 제대로 생성되지 않아서가 아닐까?` 하는 생각이 들었다.

빌드를 하게 되면 `/resources/static/docs` 디렉토리에 `open-api-3.0.1.json` 파일이 생기게 되고 이를 Swagger에서 적용하는 구조이다.

그렇기에 `open-api-3.0.1.json` 파일 자체에 문제가 있다면 당연하게도 REST Docs가 제대로 적용되지 않을 것이다.

## 도커 컨테이너 내부 확인

우리는 도커를 사용해서 인스턴스 내에 컨테이너로 서버를 띄우는 구조였기에,
도커 컨테이너 내부를 한 번 확인해보았다.

![](https://velog.velcdn.com/images/hsh111366/post/e3217464-716a-4954-9dec-8b3309f13e7b/image.png)

아니나 다를까 위와 같이 `open-api-3.0.1.json`이 제대로 생성되지 않았음을 확인할 수 있었다.
이제 문제를 파악했으니, 해당 파일이 잘 생성될 수 있는 방법만 찾으면 되었다.

---

# 🧑🏻‍💻 해결 과정

## 첫 번째 시도 : 도커파일 수정

처음에는 도커파일에 문제가 있다고 생각했다.

#### Dockerfile(기존)
```dockerfile
# Alpine & Slim 이미지 사용 (용량 및 보안 개선)
# 버전 명시 (latest 지양)
# 최종 이미지의 경량화를 위해 Multi-Stage 빌드 사용
FROM openjdk:17-jdk-slim as build

WORKDIR /app

COPY ./build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

# 최종 이미지: 경량화된 Alpine 이미지를 사용하여 빌드된 파일을 실행
FROM openjdk:17-jdk-alpine as final

WORKDIR /app

COPY --from=build /app/app.jar app.jar

# HEALTHCHECK 추가
# 컨테이너가 시작된 후 5초마다, 최대 3초 동안 http://localhost:8080으로 헬스 체크
HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=3 \
  CMD curl --fail http://localhost:8080 || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8080
```

#### Dockerfile(변경)
```dockerfile
# 빌드 단계
FROM openjdk:17-jdk-slim as build

WORKDIR /app

# Gradle 빌드 실행
COPY . .
RUN ./gradlew build openapi3 asciidoctor

# 최종 이미지 단계
FROM openjdk:17-jdk-alpine as final

WORKDIR /app

# 빌드된 JAR 파일과 정적 문서 파일을 복사
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
COPY --from=build /app/build/resources/main/static/docs /app/static/docs

# HEALTHCHECK 추가
HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=3 \
  CMD curl --fail http://localhost:8080 || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8080
```

그래서 위와 같이 기존과 다르게 빌드 단계도 추가를 하고,
`openapi3 asciidoctor` 와 같은 옵션들도 추가하였다.

하지만 여전히 되지 않았다.

## 두 번째 시도 : Github Actions 스크립트 수정

그렇게 `뭐가 문제지...` 하며 Github Actions가 돌아가는 모습을 바라보다가 한 부분이 눈에 띄었다.

![](https://velog.velcdn.com/images/hsh111366/post/1def25ce-627d-40c6-8777-ffcf389f4ba6/image.png)

빌드를 하는 부분이었는데, `-x test`라는 옵션이 붙어있었다.
이는 테스트를 하지 않고 빌드를 한다는 옵션이기에, 
Github Actions를 통해 빌드를 진행할 때 테스트가 실행되지 않아 REST Docs가 빈 채로 생성되었던 것이다.

```yaml
...
      - name: ⏱️gradle build를 위한 권한을 부여합니다.
        run: chmod +x gradlew

      - name: ⏱️gradle build 중입니다.
        run: ./gradlew clean build openapi3 asciidoctor
...
```

그렇기에 위와 같이 스크립트를 수정했고,

```dockerfile
# 최종 이미지 단계
FROM openjdk:17-jdk-alpine as final

WORKDIR /app

# 빌드된 JAR 파일과 정적 문서 파일을 복사
COPY ./build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
COPY ./build/resources/main/static/docs /app/static/docs

# HEALTHCHECK 추가
HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=3 \
  CMD curl --fail http://localhost:8080 || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8080
```

도커파일에서도 불필요한 빌드 단계를 다시 제거했다.

---

# ✨ 결과

그 결과...

![](https://velog.velcdn.com/images/hsh111366/post/2451497a-e3c2-40f4-bf84-9f7f05203cf9/image.png)

컨테이너 내부에서 `open-api-3.0.1.json` 이 잘 생성된 것을 확인했고,

![](https://velog.velcdn.com/images/hsh111366/post/8d91a65a-54a7-48c7-9dfe-8ae5a62fdb00/image.png)

위와 같이 배포 서버에서도 REST Docs가 잘 적용됨을 확인할 수 있었다!

![](https://velog.velcdn.com/images/hsh111366/post/334b7e6b-d9dd-44a1-9f27-c13e629fdc27/image.png)

테스트 또한 문제 없이 해 볼 수 있었다.

---

# 💡 느낀 점
1. `-x test`는 빌드 시에 테스트 과정을 생략하여 시간 단축을 하는 데 활용한다. 때문에 테스트가 필요 없는 환경에서 사용하는데, 이를 배포시에 사용했다는 것은 테스트 코드를 짜지 않았다고 고백하는 거나 다름이 없다.
2. 지금까지 프로젝트를 하면서 테스트 코드를 제대로 짜본 적이 없었기 때문에 지금과 같은 일이 생겼다고 생각한다. 이에 부끄러움을 느끼면서 앞으로는 테스트 코드를 무조건 작성하는 개발자가 되어야겠다.
3. 실행만 잘 되고나면 빌드 단계에는 신경을 쓰지 않는 경우가 많다. 하지만 빌드 단계부터 하나하나 해당 코드가 어떤 기능인지를 알아야겠다고 생각이 들었다.
