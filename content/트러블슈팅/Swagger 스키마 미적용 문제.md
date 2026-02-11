---
date: 2025-03-29
description: REST Docs + Swagger 연동 시 Components 덮어쓰기로 스키마가 누락되는 문제 해결
tags:
  - backend
  - swaager
  - springboot
  - rest-docs
  - troubleshooting
---

---

# 🚨 문제 

나는 API 문서화를 `REST Docs + Swagger` 로 하고 있다.

테스트 코드도 자연스럽게 작성할 수 있고, 컨트롤러에 코드를 붙이지 않으면서도 Swagger를 이용할 수 있다는 점이 매력적인 방법이다.

하지만 언젠가부터 아래와 같은 문제가 있었다.

![](https://velog.velcdn.com/images/hsh111366/post/763b6dde-243d-41b9-848c-912f4e76b0c8/image.png)

```
Resolver error at paths./api/v1/events.post.requestBody.content.application/json;charset=UTF-8.schema.$ref
Could not resolve reference: Could not resolve pointer: /components/schemas/CreateEventRequestSchema does not exist in document
Resolver error at paths./api/v1/events.post.responses.201.content.application/json;charset=UTF-8.schema.$ref
Could not resolve reference: Could not resolve pointer: /components/schemas/CreateEventResponseSchema does not exist in document
```

이는 스키마가 문서에 없다는 에러였다.

![](https://velog.velcdn.com/images/hsh111366/post/2c4eb4c9-e9f4-4a46-b189-9571a1a1a419/image.png)

해당 에러 때문에 스키마가 적용이 되지 않아서 필드들의 세부적인 설명을 확인할 수가 없었다.

그래서 Open API 문서를 한 번 확인해보았다.

## Open API 문서

![](https://velog.velcdn.com/images/hsh111366/post/dcc9da40-8f8b-46a1-bbf6-aea59d47d8c5/image.png)


하지만 이미지를 보면 알다시피 스키마는 문서에 잘 들어가 있었다.
도대체 뭐가 문제인지 모르겠어서 구글링을 열심히 했지만, 원하는 결과는 얻을 수 없었다.

---

# ✅ 해결 방법

그렇게 포기할까..싶었던 순간 스웨거 설정이 있는 `SwaggerConfig`를 확인해 보기로 했다.

## 기존 코드

```java
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("OneTime API Documentation")
                        .version("v1.4.7")
                        .description("Spring REST Docs with Swagger UI.")
                        .contact(new Contact()
                        .name("Sangho Han")
                        .url("https://github.com/bbbang105")
                        .email("hchsa77@gmail.com"))
                )
                .servers(List.of(
                        new Server().url("http://localhost:8090").description("로컬 서버"),
                        new Server().url("https://onetime-test.store").description("테스트 서버")
                ));

        // REST Docs에서 생성한 open-api-3.0.1.json 파일 읽어오기
        try {
            ClassPathResource resource = new ClassPathResource("static/docs/open-api-3.0.1.json");
            InputStream inputStream = resource.getInputStream();
            ObjectMapper mapper = new ObjectMapper();

            // open-api-3.0.1.json 파일을 OpenAPI 객체로 매핑
            OpenAPI restDocsOpenAPI = mapper.readValue(inputStream, OpenAPI.class);

            // REST Docs에서 생성한 Paths 정보 병합
            Paths paths = restDocsOpenAPI.getPaths();
            openAPI.setPaths(paths);

            openAPI.components(restDocsOpenAPI.getComponents());

        } catch (Exception e) {
            throw new CustomException(ErrorStatus._FAILED_TRANSLATE_SWAGGER);
        }

        // 액세스 토큰
        SecurityScheme apiKey = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("Bearer Token");

        openAPI.components(new Components().addSecuritySchemes("Bearer Token", apiKey))
                .addSecurityItem(securityRequirement);

        return openAPI;
    }
```

위는 기존 코드이다.

```java
openAPI.components(restDocsOpenAPI.getComponents());
...
openAPI.components(new Components().addSecuritySchemes("Bearer Token", apiKey))
        .addSecurityItem(securityRequirement);
```    

잘 보면 이렇게 components를 두 번 호출하고 있다.
바로 해당 부분이 문제였다.

> 첫 번째 줄에서 REST Docs에서 불러온 모든 컴포넌트(schema 포함)를 설정했는데, 두 번째 줄에서 새로운 빈 Components()를 만들어서 Bearer Token만 추가한 후 덮어써버림
-> **결국 스키마가 사라지고, Swagger UI는 찾을 수 없게 된 것이다!!**
      
## 변경 코드
    
```java
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("OneTime API Documentation")
                        .version("v1.4.7")
                        .description("Spring REST Docs with Swagger UI.")
                        .contact(new Contact()
                                .name("Sangho Han")
                                .url("https://github.com/bbbang105")
                                .email("hchsa77@gmail.com"))
                )
                .servers(List.of(
                        new Server().url("http://localhost:8090").description("로컬 서버"),
                        new Server().url("https://onetime-test.store").description("테스트 서버")
                ));

        try {
            // ✅ Swagger 전용 ObjectMapper 사용
            ObjectMapper swaggerMapper = Json.mapper();
            ClassPathResource resource = new ClassPathResource("static/docs/open-api-3.0.1.json");
            InputStream inputStream = resource.getInputStream();

            // ✅ REST Docs에서 생성한 open-api JSON -> OpenAPI 객체로 변환
            OpenAPI restDocsOpenAPI = swaggerMapper.readValue(inputStream, OpenAPI.class);

            // ✅ REST Docs Paths 적용
            openAPI.setPaths(restDocsOpenAPI.getPaths());

            // ✅ REST Docs Components + Security 병합
            Components components = restDocsOpenAPI.getComponents();
            SecurityScheme apiKey = new SecurityScheme()
                    .type(SecurityScheme.Type.APIKEY)
                    .in(SecurityScheme.In.HEADER)
                    .name("Authorization");

            components.addSecuritySchemes("Bearer Token", apiKey);

            openAPI.components(components)
                    .addSecurityItem(new SecurityRequirement().addList("Bearer Token"));

        } catch (Exception e) {
            throw new CustomException(ErrorStatus._FAILED_TRANSLATE_SWAGGER);
        }

        return openAPI;
    }
}
```

때문에 위와 같이 코드를 변경하였고,

![](https://velog.velcdn.com/images/hsh111366/post/7cd04715-3daa-436b-ac2a-8b0bf934d48c/image.png)

문제가 해결된 것을 확인할 수 있었다!

---

# 💡 느낀 점

1. 이전에 꽤나 오랫동안 찾아봐도 문제가 해결되지 않았는데, 이번에 다시 보니 생각보다 빠르게 문제를 해결할 수 있었다.
2. 해결 방법이 잘 떠오르지 않는다면 조금 여유를 가지고 임하는 것도 좋을 것 같다.
3. 좋은 API 문서를 만들기 위해 더 노력하자 💪🏻
