---
date: 2025-12-27
tags:
  - json
  - troubleshooting
---

---
# 🚨 문제 상황

```bash
11:39:38.226 WARN  o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Resolved [kr.co.logosai.assistant.api.common.exception.CommonException: LLM 서비스 호출 중 오류가 발생했습니다.]
11:39:39.913 ERROR k.c.l.a.a.c.service.LlmChatService - 🚨[ERROR] LLM error ← duration: 14300ms, url: <http://101.79.10.38:8000/api/v1/rag/query>, botUid: 66, room: web-a804bcad-be30-4dde-8025-2f0cfbe822ea
org.springframework.web.client.RestClientException: Error while extracting response for type [kr.co.logosai.assistant.api.chat.service.bo.ChatBo$LlmResponse] and content type [application/json]
	
...
	
Caused by: org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: Illegal unquoted character ((CTRL-CHAR, code 13)): has to be escaped using backslash to be included in string value

...

Caused by: com.fasterxml.jackson.databind.JsonMappingException: Illegal unquoted character ((CTRL-CHAR, code 13)): has to be escaped using backslash to be included in string value
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 13051] (through reference chain: kr.co.logosai.assistant.api.chat.service.bo.ChatBo$LlmResponse["content_origin"]->kr.co.logosai.assistant.api.chat.service.bo.ChatBo$RAGJsonResponse["response"]->java.util.ArrayList[30]->kr.co.logosai.assistant.api.chat.service.bo.ChatBo$ContentItem["data"])
	
...

Caused by: com.fasterxml.jackson.core.JsonParseException: Illegal unquoted character ((CTRL-CHAR, code 13)): has to be escaped using backslash to be included in string value
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 13051]
	
...

11:39:39.934 ERROR k.c.l.a.a.c.r.ApiExceptionAdvice - [500] E00003 - LLM 서비스 호출 중 오류가 발생했습니다.
kr.co.logosai.assistant.api.common.exception.CommonException: LLM 서비스 호출 중 오류가 발생했습니다.
rBase.java:52)

```

## **`JsonParseException`**

- `RestClient`가 **데이터를 스트리밍으로 끝까지 다 받았는데**, RAG API가 보낸 JSON 자체에 '깨진 데이터(비표준 문자)'가 포함되어 있어서 Jackson 파서가 객체로 변환하다 실패하는 상황.

## 로그 분석

```bash
> Caused by: com.fasterxml.jackson.core.JsonParseException: Illegal unquoted character ((CTRL-CHAR, code 13)): has to be escaped using backslash...
> 
> 
> at [Source: ... line: 1, column: 13051]
>
```

RAG API가 보낸 JSON 데이터의 13,051번째 글자쯤에, 이스케이프(`\\`) 처리되지 않은 '제어 문자(Code 13, 캐리지 리턴 `\\r`)'가 포함되어 있다는 뜻

>💡 `\\r`은 **눈에 보이지 않는 '제어 문자(Control Character)'**입니다.
>
'a', 'b', 'c'처럼 화면에 '인쇄(print)'되는 문자가 아니라, "커서(cursor)야, 이제 동작해!"라고 명령을 내리는 문자입니다.
>
`\\r`의 정확한 명령은 "커서를 현재 줄의 맨 앞으로 이동시켜라"입니다. (== Carriage Return)

---

# ✅ 해결 방법

## 코드 수정

## `RestClientConfig.java`

```java
	@Bean
	@Qualifier("longTimeoutRestClient")
	public RestClient longTimeoutRestClient(ObjectMapper objectMapper) {
		JdkClientHttpRequestFactory requestFactory = createRequestFactory(Duration.ofMinutes(5));
		
		// 기본 ObjectMapper를 복사해서 ALLOW_UNESCAPED_CONTROL_CHARS 설정 추가
		ObjectMapper relaxedObjectMapper = objectMapper.copy();
		relaxedObjectMapper.getFactory().enable(ALLOW_UNESCAPED_CONTROL_CHARS.mappedFeature());
		
		// 위 ObjectMapper를 사용하는 HttpMessageConverter 생성
		MappingJackson2HttpMessageConverter relaxedConverter = new MappingJackson2HttpMessageConverter(relaxedObjectMapper);
		
		return RestClient.builder()
			.requestFactory(requestFactory)
			.messageConverters(converters -> {
				converters.clear(); // 새로 만든 컨버터만 사용하도록 설정
				converters.add(relaxedConverter);
			})
			.build();
	}
```

- `longTimeoutRestClient` Bean을 생성할 때, `ALLOW_UNESCAPED_CONTROL_CHARS` 옵션을 가진 `ObjectMapper`를 직접 주입해 줌

---

# 🔗 레퍼런스

[Jackson JSON 파싱 오류 해결하기: JsonParseException](https://velog.io/@cosmoss/Jackson-JSON-%ED%8C%8C%EC%8B%B1-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0-JsonParseException)
