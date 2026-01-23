---
date: 2025-07-25
tags:
  - illdan
  - backend
  - springboot
---

---

# 🎬 서론

[MBTI P들을 위한 투두 앱, `일단`](https://velog.io/@hsh111366/계획은-적게-행동은-빠르게-일단) 에서는 최근 VOC 수집을 위해서 `일단에게 의견 보내기` 기능을 앱 내에 구현했다.

해당 기능에서는 디스코드 & 노션 외부 API 연동이 필요했고, 이를 구현하기 위해서 비동기 이벤트 처리 방식을 활용했다. 이번 글에서는 이에 대해서 작성해보려고 한다.

---


# 🧱 설계

## 요구사항

1. 유저는 일단에게 의견을 보낼 수 있다
    - 내용 (필수)
    - 이메일 or 연락처 (선택)
    
2. 의견은 DB에 영구저장된다
    - **의견 POST API 구현**
    
3. 디스코드에 의견 내용이 정제되어 전송된다
    - **디스코드 웹훅 API 호출**
4. 노션 DB에 의견 내용이 저장된다
    - **노션 API 호출**

## 고민지점

1. DB에는 데이터가 영구저장 되어야 한다 → **트랜잭션 필요**
2. 트랜잭션 내에서 외부 API를 호출하면 안 된다 → **DB 저장 성공 이후 , 비동기 이벤트 기반 처리 방식 사용**

> **🧑🏻‍💻 왜 트랜잭션 내에서 외부 API를 호출하면 안 될까?**
>
트랜잭션을 쓰는 데에는 여러 이유가 존재하며, 그 중 하나는 데이터의 원자성을 보장하기 위함이다. 만약 트랜잭션 내에서 외부 API를 호출하게 된다면 아래와 같은 문제가 발생할 수가 있다.
>
**1. API 호출에 실패하는 경우**
: 외부 API 호출은 DB 트랜잭션과는 무관하기 때문에, API 호출에 실패해도 DB에는 데이터가 커밋된다. 즉, 외부 API 호출이 실패하는 상황에 대처하기 어렵다.
>
**2. 트랜잭션이 롤백되는 경우**
: DB 작업에 실패해서 롤백이 되는 경우, DB에는 데이터가 없는데 API 호출은 그대로 진행되어 데이터 정합성이 깨질 수가 있다. 예를 들어 신규유저가 가입하면 유저의 리프레쉬 토큰을 레디스에 저장하는 로직이 있는데, 가입 중 오류가 발생하여 롤백되더라도 레디스 I/O는 진행되는 경우가 발생한다.
>
**3. 응답 지연 및 블로킹**
: 외부 API 호출 시 응답이 느리다면, 전체 트랜잭션 시간이 늘어나고 시스템 자원을 낭비하게 된다.

이처럼 트랜잭션 안에서 외부 API를 호출하는 건 데이터 정합성과 효율성 면에서 리스크가 크다. 그렇기에 비동기 이벤트 기반 처리 방식을 사용하여 해당 문제를 해결하기로 결정했다.

구체적인 구현 과정은 아래에서 이어지며, 대략적인 로직은 아래와 같다.

>1.	DB 저장 → 트랜잭션 커밋 후 이벤트를 발행한다.
2.	`@Async` 이벤트 리스너에서 각각 디스코드 웹훅 & 노션 API를 호출한다.
3. 외부 API 호출에 실패하는 경우를 고려하여 응답에 따라 재시도한다.

이를 통해 **트랜잭션은 DB 작업에만 집중하고, 외부 API는 비동기 & 독립적으로 처리하도록 분리**하고자 했다.

## 외부 API 클라이언트 비교

| 구분 | RestClient | FeignClient | WebClient |
| --- | --- | --- | --- |
| 방식 | 동기 (블로킹) | 동기 (블로킹) | 비동기 (논블로킹) |
| 도입 시기 | Spring 6부터 | Spring Cloud OpenFeign 필요 | Spring 5부터 (WebFlux 기반) |
| 사용 방식 | 코드 기반 (builder 스타일) | 인터페이스 선언형 | 코드 기반 (함수형, 체이닝 방식) |
| 특징 | 간결하고 현대적인 방식 | 간단한 선언형 호출, 내부는 RestTemplate | 고성능, 비동기 처리에 최적화 |
| 권장 사용 상황 | 최신 Spring에서 간단한 동기 호출 | 간단한 외부 API 호출 | 비동기/병렬 호출, 외부 API가 많은 경우 |

이번 기능에서는 외부 시스템(디스코드, 노션)에 데이터를 전송해야 했고, 이에 따라 외부 API 클라이언트를 선택해야 했다. 아래와 같은 이유로 위 셋 중에서 `FeignClient`를 사용하기로 결정했다.

> **🧑🏻‍💻 `FeignClient` 를 선택한 이유?**
>
**1. 기존에 이미 `FeignClient` 기반의 연동 구조가 존재**
: 소셜 로그인 부분에서 `FeignClient` 연동 로직이 존재했기에, 새로운 외부 API(디스코드 & 노션)도 동일한 방식으로 쉽게 확장할 수 있다고 판단했다.
>
**2. 복잡한 비동기 로직이나 대용량 데이터가 아닌, 단순 POST 요청 중심의 연동**
: 이번 연동 기능은 사용자의 의견 데이터를 외부로 전송하는 간단한 구조로, 별도의 응답 처리나 고성능 병렬 호출이 필요한 상황은 아니었다. 
>-> 따라서 `WebClient` 논블로킹 구조가 필요한 시나리오는 아니라고 판단했고, `FeignClient`의 선언형 API 호출 방식이 더 직관적이고 유지보수하기 쉽기에 택하게 되었다.



---

# 🚀 구현

## 1. API 구현

우선은 유저 의견 보내기 API를 구현해주었다.

### UserController

```java
    /**
     * 사용자 의견 생성 및 전송 API.
     *
     * 사용자가 일단에게 의견을 보내며, DB에 저장 및 해당 내용을 디스코드 & 노션에 전송합니다.
     *
     * @param authorizationHeader 요청 헤더의 Authorization (Bearer 토큰)
     * @param requestDTO 의견 정보
     * @return 성공 여부를 나타내는 응답
     */
    @PostMapping("/comments")
    public ResponseEntity<ApiResponse<SuccessStatus>> createAndSendUserComment(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UserCommentRequestDTO requestDTO
    ) {
        userService.createAndSendUserComment(jwtService.extractUserIdFromToken(authorizationHeader), requestDTO);
        return ApiResponse.onSuccess(SuccessStatus._CREATED);
    }
```

### UserCommentRequestDTO

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import server.poptato.user.domain.entity.Comment;

public record UserCommentRequestDTO(
        @NotBlank(message = "의견 내용은 비어 있을 수 없습니다.")
        @Size(max = 800, message = "의견 내용은 800자 이내여야 합니다.")
        String content,

        @Size(max = 100, message = "연락처는 100자 이내여야 합니다.")
        String contactInfo
) {
    public Comment toEntity(Long userId) {
        return Comment.builder()
                .userId(userId)
                .content(content)
                .contactInfo(contactInfo)
                .build();
    }
}

```

### UserService

```java
    /**
     * 사용자 의견 생성 메서드.
     *
     * @param userId 사용자 ID
     * @param requestDTO 의견 정보
     */
    @Transactional
    public void createAndSendUserComment(Long userId, UserCommentRequestDTO requestDTO) {
        User user = userValidator.checkIsExistAndReturnUser(userId);
        Comment comment = commentRepository.save(requestDTO.toEntity(user.getId()));

        eventPublisher.publishEvent(CreateUserCommentEvent.from(comment, user.getName()));
    }
```

비즈니스 로직에서는 새로운 의견 데이터를 저장한 후, `유저 의견 생성 이벤트` 를 발행하게 된다.

## 2. FeignClient

### build.gradle

```java
// Feign
implementation 'org.springframework.cloud:spring-cloud-starter-openfeign:4.1.0'
```

`openfeign` 사용을 위해서, 위 의존성을 추가해준다.

### FeignConfig

```java
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "server.poptato.external")
public class FeignConfig {

    @Bean
    public RequestInterceptor notionRequestInterceptor(
            @Value("${notion.secret-key}") String secretKey) {

        return requestTemplate -> {
            if (requestTemplate.feignTarget().name().startsWith("notion")) {
                requestTemplate.header("Authorization", "Bearer " + secretKey);
                requestTemplate.header("Notion-Version", "2022-06-28");
                requestTemplate.header("Content-Type", "application/json");
            }
        };
    }
}

```

> 🧑🏻‍💻 FeignClient를 설정하는 Config이다.
>
`@EnableFeignClients(basePackages = "server.poptato.external")` 를 통해 해당 패키지 아래의 FeignClient 인터페이스를 스캔한다.
>
디스코드는 따로 헤더가 필요 없지만, 노션 API 호출 시에는 공통적으로 필요한 인증 및 버전 헤더가 있으므로, `RequestInterceptor`를 통해 자동으로 헤더를 추가해준다.
> 
이때 `feignTarget().name()`이 "notion"으로 시작하는 경우에만 해당 헤더를 설정하도록 조건을 걸어, 다른 외부 API(예: 디스코드)에는 영향을 주지 않도록 분리하였다.

## 3. 디스코드 웹훅 연동

### CreateUserCommentEvent

```java
import server.poptato.user.domain.entity.Comment;

public record CreateUserCommentEvent(
        Long commentId,
        Long userId,
        String userName,
        String content,
        String contactInfo,
        String createDate
) {
    public static CreateUserCommentEvent from(Comment comment, String userName) {
        return new CreateUserCommentEvent(
                comment.getId(),
                comment.getUserId(),
                userName,
                comment.getContent(),
                comment.getContactInfo(),
                comment.getCreateDate().toString()
        );
    }
}

```

유저 의견이 생성되었을 때 발행되는 이벤트 객체로, 비동기 이벤트 처리 시 필요한 정보를 담는 DTO 역할을 수행한다.

### UserEventListener

```java
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import server.poptato.external.discord.sender.DiscordSender;
import server.poptato.user.application.event.CreateUserCommentEvent;

@Component
@RequiredArgsConstructor
public class UserEventListener {

    private final DiscordSender discordSender;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCreateUserComment(CreateUserCommentEvent event) {
        discordSender.sendCreateUserCommentMessage(event);
        notionSender.sendCreateUserCommentMessage(event);
    }
}

```

> 🧑🏻‍💻 유저 관련 이벤트를 처리하는 비동기 이벤트 리스너이다.
>
`@Async` 를 사용하여 별도의 스레드에서 비동기적으로 실행되며,
`@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)` 을 통해서 **DB 트랜잭션이 성공적으로 커밋된 이후에만 이벤트를 처리하도록 보장**한다.

이를 통해 DB 저장과 외부 API 호출을 명확히 분리할 수 있으며, 트랜잭션이 롤백된 경우 외부 API 호출이 발생하지 않도록 한다.

### DiscordCreateUserCommentWebhookClient

```java
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import server.poptato.external.discord.dto.DiscordMessage;

@FeignClient(
        name = "discordCommentWebhookClient",
        url = "${discord.create-user-comment-webhook-url}"
)
public interface DiscordCreateUserCommentWebhookClient {

    @PostMapping
    void sendMessage(@RequestBody DiscordMessage message);
}

```

유저가 보낸 의견을 디스코드 웹훅으로 전송하기 위해 사용되는 FeignClient 인터페이스이다. 설정된 url로 POST 요청을 보내며, 메시지 본문은 DiscordMessage 객체로 전달된다.

```yaml
discord:
  create-user-comment-webhook-url: ${DISCORD_CREATE_USER_COMMENT_WEBHOOK_URL}
```

디스코드 웹훅 URL을 yaml 파일에 추가해서 환경변수로 이용한다.

### DiscordMessage

```java
public record DiscordMessage(
        String content
) {
    public static DiscordMessage of(String content) {
        return new DiscordMessage(content);
    }
}

```

디스코드 웹훅 API에는 다양한 기능이 있지만, 내용만 보내면 되기 때문에 간단하게 `content` 로만 필드를 구성했다.

### DiscordMessageFormatter

```java
import server.poptato.user.application.event.CreateUserCommentEvent;
import server.poptato.user.application.event.CreateUserEvent;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DiscordMessageFormatter {

    private static final String CREATE_USER_COMMENT_MESSAGE_TEMPLATE =
            "```[일단에게 의견이 전송되었어요 💌]\n\n" +
            "- 전송 일자 : %s\n" +
            "- 유저 이름 : %s\n" +
            "- 연락처 : %s\n" +
            "- 의견 내용 : \n%s\n```";

    private static final String CREATE_USER_MESSAGE_TEMPLATE =
            "```[일단에 %d번째 유저가 가입했어요 👋🏻]\n\n" +
                    "- 가입 일자 : %s\n" +
                    "- 유저 이름 : %s\n" +
                    "- 소셜 플랫폼 : %s\n```";

    public static String formatCreateUserCommentMessage(CreateUserCommentEvent event) {
        String contact = event.contactInfo() == null ? "없음" : event.contactInfo();
        return String.format(
                CREATE_USER_COMMENT_MESSAGE_TEMPLATE,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                event.userName(),
                contact,
                event.content()
        );
    }

    public static String formatCreateUserMessage(CreateUserEvent event) {
        return String.format(
                CREATE_USER_MESSAGE_TEMPLATE,
                event.userCount(),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                event.userName(),
                event.socialType()
        );
    }
}

```

원하는 형태로 메세지를 구성하기 위한 포매터이다. 위와 같이 유저 가입 메세지 등 상황에 따라서 추가하기에 용이하다.

### DiscordSender

```java
import lombok.RequiredArgsConstructor;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import server.poptato.external.discord.client.DiscordCreateUserCommentWebhookClient;
import server.poptato.external.discord.client.DiscordCreateUserWebhookClient;
import server.poptato.external.discord.dto.DiscordMessage;
import server.poptato.external.discord.formatter.DiscordMessageFormatter;
import server.poptato.user.application.event.CreateUserCommentEvent;
import server.poptato.user.application.event.CreateUserEvent;

@Component
@RequiredArgsConstructor
public class DiscordSender {

    private final DiscordCreateUserCommentWebhookClient discordCreateUserCommentWebhookClient;
    private final DiscordCreateUserWebhookClient discordCreateUserWebhookClient;

    public void sendCreateUserCommentMessage(CreateUserCommentEvent event) {
        String message = DiscordMessageFormatter.formatCreateUserCommentMessage(event);
        discordCreateUserCommentWebhookClient.sendMessage(DiscordMessage.of(message));
    }

    public void sendCreateUserMessage(CreateUserEvent event) {
        String message = DiscordMessageFormatter.formatCreateUserMessage(event);
        discordCreateUserWebhookClient.sendMessage(DiscordMessage.of(message));
    }
}

```

> 🧑🏻‍💻 위에서 구현한 로직들을 활용하여, 실제로 디스코드 웹훅으로 메세지를 보내는 DiscordSender 클래스이다. 
>
이벤트 데이터를 DiscordMessageFormatter를 통해 포맷팅하고, 포맷된 문자열을 DiscordMessage 객체로 감싼 후, FeignClient를 통해 전송한다.

여기까지 구현을 한다면, 이벤트가 발행되었을 때 디스코드 웹훅 URL로 관련 메시지가 전송될 것이다. 지금부터는 노션 API 연동을 진행보도록 하겠다.

## 4. 노션 API 연동

### API 키 & 데이터베이스 ID

```yaml
notion:
  api-url: https://api.notion.com/v1
  secret-key: ${NOTION_SECRET_KEY}
  database-id: ${NOTION_DATABASE_ID}
```

노션 API 연동으로 데이터베이스에 쓰기 작업을 하기 위해서는, 우선 노션 통합 API의 시크릿 키와 데이터베이스 ID가 필요하다.키 값과 ID를 얻은 후에, 환경변수로 등록해 둔다.

이에 대해서는 아래 레퍼런스에 올려둔 글들에 자세히 설명되어 있으니 참고하기를 바란다.

### NotionCreateUserCommentClient

```java
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(
        name = "notionCreateUserCommentClient",
        url = "${notion.api-url}"
)
public interface NotionCreateUserCommentClient {

    @PostMapping("/pages")
    void sendUserComment(@RequestBody Map<String, Object> payload);
}

```

노션 API로 POST 요청을 보내기 위해서 새로운 `FeignClient`를 생성해 준다.

디스코드와 `name & url`이 다르고, `https://api.notion.com/v1/pages`로 요청을 보내야 하기 때문에 `/pages`를 명시해 준 모습이다.

### NotionPayloadFormatter

```java
import server.poptato.user.application.event.CreateUserCommentEvent;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class NotionPayloadFormatter {

    public static Map<String, Object> formatCreateUserCommentPayload(CreateUserCommentEvent event, String databaseId) {
        Map<String, Object> payload = new HashMap<>();

        payload.put("parent", Map.of("database_id", databaseId));

        Map<String, Object> properties = new HashMap<>();

        properties.put("Date", Map.of(
                "date", Map.of("start", LocalDate.now().toString())
        ));

        properties.put("Name", Map.of(
                "title", new Object[] {
                    Map.of("text", Map.of("content", event.userName()))
                }
        ));

        properties.put("Content", Map.of(
                "rich_text", new Object[] {
                    Map.of("text", Map.of("content", event.content()))
                }
        ));

        if (event.contactInfo() != null && !event.contactInfo().isBlank()) {
            properties.put("ContactInfo", Map.of(
                    "rich_text", new Object[] {
                        Map.of("text", Map.of("content", event.contactInfo()))
                    }
            ));
        }

        payload.put("properties", properties);
        return payload;
    }
}

```

노션 DB에 쓰기 작업을 하기 위해서는 디스코드에 비해 복잡한 요청 값이 필요하다. 때문에 위와 같이 Map 구조로 포맷팅을 해주는 클래스를 생성했다. 

### NotionSender

```java
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import server.poptato.external.notion.client.NotionCreateUserCommentClient;
import server.poptato.external.notion.formatter.NotionPayloadFormatter;
import server.poptato.user.application.event.CreateUserCommentEvent;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class NotionSender {

    private final NotionCreateUserCommentClient notionCreateUserCommentClient;

    @Value("${notion.database-id}")
    private String databaseId;

    public void sendCreateUserCommentMessage(CreateUserCommentEvent event) {
        Map<String, Object> payload = NotionPayloadFormatter.formatCreateUserCommentPayload(event, databaseId);
        notionCreateUserCommentClient.sendUserComment(payload);
    }
}

```

> 🧑🏻‍💻 최종적으로 노션 API를 호출하여 DB에 쓰기 작업을 진행하는 클래스이다.
>
이벤트 데이터를 NotionPayloadFormatter를 통해 포맷팅하고, 포맷된 payload를 FeignClient를 통해 전송한다.

## 5. 재시도 처리

여기까지 한다면 비동기 이벤트 처리 방식을 활용한 디스코드 & 노션 API 연동은 완료된 것이다.

하지만 트랜잭션에 포함되어 있지 않기 때문에, 외부 API 호출 과정에서 오류가 발생하더라도 이를 적절하게 처리해줄 수가 없다. 때문에 스프링 `@Retryable` 을 활용한 재시도 처리 로직을 추가해주었다.

### build.gradle

```java
// Spring Retry
implementation 'org.springframework.retry:spring-retry'
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

사용을 위해서 위 의존성을 추가해 준다.

### RetryConfig

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

@Configuration
@EnableRetry
public class RetryConfig {
}

```

Config 클래스도 추가해 준다.

### @Retryable 어노테이션 추가

```java
@Retryable(
    retryFor = { Exception.class },
    maxAttempts = 3,
    backoff = @Backoff(delay = 2000)
)
public void sendCreateUserComment(CreateUserCommentEvent event) {
    String message = DiscordMessageFormatter.formatCreateUserComment(event);
    discordCreateUserCommentWebhookClient.sendMessage(DiscordMessage.of(message));
}
```

```java
@Retryable(
    retryFor = { Exception.class },
    maxAttempts = 3,
    backoff = @Backoff(delay = 2000)
)
public void sendCreateUserComment(CreateUserCommentEvent event) {
    Map<String, Object> payload = NotionPayloadFormatter.formatCreateUserCommentPayload(event, databaseId);
    notionCreateUserCommentClient.sendUserComment(payload);
}
```

위와 같이 적용하고자 하는 메서드에, `@Retryable` 어노테이션을 붙임으로써 간편하게 이용할 수가 있다.

>  - `@Retryable` : 지정된 예외가 발생했을 때 해당 메서드를 재시도하도록 설정
- `retryFor = { Exception.class }` : Exception이 발생하면 재시도
- `maxAttempts = 3` : 최대 3번까지 시도 (최초 1회 + 재시도 2회)
- `backoff = @Backoff(delay = 2000)`: 재시도 간 2초 딜레이

---

# ✨ 결과

## 1. 유저가 의견을 보냈을 시

![](https://velog.velcdn.com/images/hsh111366/post/6b01336f-f9a0-4c3e-8eba-e342880c5b7f/image.jpg)|![](https://velog.velcdn.com/images/hsh111366/post/457d9745-3572-40b5-b489-555efcbe3786/image.jpg)
---|---|

> **현재 앱 업데이트가 완료되어, iOS & 안드로이드 모두 해당 기능을 사용할 수 있다!**
>
[🍎 iOS 다운로드](https://apps.apple.com/kr/app/%EC%9D%BC%EB%8B%A8/id6740790261)
[🤖 안드로이드 다운로드](https://play.google.com/store/apps/details?id=com.poptato.app&pcampaignid=web_share)


![](https://velog.velcdn.com/images/hsh111366/post/68fa1fd3-1da8-4787-816c-214d7f66d523/image.png)

유저가 앱 내에서 의견을 보내게 되면 위 이미지와 같이 디스코드에 바로 메세지가 전송된다. 모든 팀원이 해당 의견을 확인하여 VoC를 인지할 수 있게 된다.

아직 홍보를 하지 않았음에도 불구하고 벌써 2분이나 의견을 보내주셨다..!

![](https://velog.velcdn.com/images/hsh111366/post/4353bd65-91ed-4119-98d3-47dd95180309/image.png)

소중한 고객의 의견은 노션 DB에도 수집되어 관리된다. 이러한 의견들에 대해서는 팀원들과 빠르게 논의하고 있으며, 이는 앞으로의 방향성을 잡는 데 큰 도움이 되고 있다!

## 2. 신규 유저 가입 시

![](https://velog.velcdn.com/images/hsh111366/post/5ee31169-6000-497e-a7b0-50a2fd667b58/image.png)

추가적으로 신규 유저가 가입하는 경우에 위와 같이 메세지를 전송하도록 구현하였다. 이는 앞으로 유저 탈퇴 시 등 더 많은 케이스에서 확장할 수 있을 것이다.

![](https://velog.velcdn.com/images/hsh111366/post/cd9f63b8-2b93-4590-9fda-5ee7ec81e544/image.png)

정말로 감사하게도 [일단 소개글](https://velog.io/@hsh111366/계획은-적게-행동은-빠르게-일단)을 작성한 이후로 20명이 넘는 분들이 가입을 해 주셨다. 벨로그 트렌딩에도 꽤나 상위권에 올라서 많은 분들께서 관심을 가져주신 듯하다.

> 🧑🏻‍💻 사이드 프로젝트로 서비스를 1년 이상 운영해 보고 있는 입장에서, 유저 한 명이 얼마나 소중하고 팀원들에게 큰 동기부여가 되는지를 잘 알고 있다. 
>
그렇기에 이번 `의견 보내기` 기능을 통해서 더욱 고객 친화적인 앱을 만들고 더 많은 유저들과 함께 하고 싶다!

---

# 🔗 레퍼런스

## 디스코드 웹훅 API

[[Spring Boot] 디스코드 웹훅을 구현해보자](https://velog.io/@joydev/Spring-Boot-%EB%94%94%EC%8A%A4%EC%BD%94%EB%93%9C-%EC%9B%B9%ED%9B%85%EC%9D%84-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EC%9E%90)
[Spring Boot와 Discord 웹훅으로 실시간 신고 알림 시스템 구현하기](https://velog.io/@chae_ag/%EB%94%94%EC%8A%A4%EC%BD%94%EB%93%9C-%EC%9B%B9-%ED%9B%85%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%8B%A0%EA%B3%A0-%EC%95%8C%EB%A6%BC-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0)

## 노션 데이터베이스 API

[[노션 API] 노션 API 연동으로 데이터베이스 사용하기](https://wooncloud.tistory.com/131)
[노션 API 자동화 완전 정복! 데이터 연동부터 업무 최적화까지(노션5편) - MONAMU](https://monamuu.com/%EB%85%B8%EC%85%98-api-%EC%9E%90%EB%8F%99%ED%99%94-%EC%99%84%EC%A0%84-%EC%A0%95%EB%B3%B5-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%97%B0%EB%8F%99%EB%B6%80%ED%84%B0-%EC%97%85%EB%AC%B4-%EC%B5%9C%EC%A0%81/)

## 외부 API

[[SpringBoot + OpenAI(ChatGPT)] SpringBoot에서 OpenAI API를 이용해 연동하기](https://developer-anxi.tistory.com/64)
[[Spring Cloud] Feign: 선언적 REST Client](https://developer-anxi.tistory.com/70)
[[Reactive Spring] 리액티브 프로그래밍과 오퍼레이션 (Flux, Mono)](https://developer-anxi.tistory.com/72)

## 비동기 처리

[동기/비동기 & 블로킹/논블로킹 진짜 아는 거 맞아요?(Ft.쇼핑몰)](https://chobo-backend.tistory.com/47)
[스프링 이벤트를 활용한 비동기 처리 방법](https://f-lab.kr/insight/spring-event-asynchronous-processing)

---

> [🍎 iOS 다운로드](https://apps.apple.com/kr/app/%EC%9D%BC%EB%8B%A8/id6740790261)
[🤖 안드로이드 다운로드](https://play.google.com/store/apps/details?id=com.poptato.app&pcampaignid=web_share)
[📸 Instagram](https://www.instagram.com/illdan.simpleday?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==)
[📝 disquiet](https://disquiet.io/product/%EC%9D%BC%EB%8B%A8%E3%85%A3%EA%B3%84%ED%9A%8D%EC%9D%80-%EC%A0%81%EA%B2%8C-%ED%96%89%EB%8F%99%EC%9D%80-%EB%B9%A0%EB%A5%B4%EA%B2%8C)
[👋🏻 앱 소개 페이지](https://mountain-fang-96a.notion.site/1c3d60b563cc8068a8efd24c4ca2e36e)

![](https://velog.velcdn.com/images/hsh111366/post/f75a4ac6-c43d-46ab-9118-910b13dfc9b2/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/f65eedb5-0c45-43af-83df-616e3916d1d6/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/f59a46b2-5142-4554-a087-67720aae4fe9/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/e29dd27d-3ad6-4091-bfbc-87bccc020333/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/24ec0d54-f618-4a82-a64d-1f0f9e8865f7/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/03f6cfe8-5d71-47af-b618-cd4ab0b894c9/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/e2b04ca2-1a37-4119-89cf-9c24d312f59c/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/d39da3d5-4a19-40e7-b10c-1ad985fd2676/image.png)

