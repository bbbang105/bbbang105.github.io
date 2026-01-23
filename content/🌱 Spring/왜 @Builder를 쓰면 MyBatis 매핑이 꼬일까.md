---
date: 2025-08-29
tags:
  - springboot
  - backend
---

---

# 1. 기존 방식 문제점

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="kr.co.logosai.assistant.api.admin.document.repository.mapper.DocumentMapper">

	...

    <select id="findReferenceDocumentByConversationUid" resultType="kr.co.logosai.assistant.api.admin.document.repository.dto.DocumentDto$RagReferenceDto">
        SELECT
            lrs.embedding_score,
            rd.content,
        FROM
            LOG_RAG_SEARCH_RESULTS lrs
                JOIN
            RAG_DOCUMENT rd ON lrs.document_uid = rd.uid
        WHERE
            lrs.bot_uid = #{botUid}
          AND lrs.parent_chat_uid = #{conversationUid}
          AND lrs.document_uid != 0
        ORDER BY
            lrs.embedding_score DESC
    </select>

</mapper>

```

```java
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class DocumentDto {

	...

    @Getter
    @Builder
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
}

```

- SELECT 구문에서의 필드 순서와, DTO의 순서가 다르다면 자동으로 매핑이 되지 않는다.
    - 1번째로 가져오는 값이 embedding_score이기 때문에 → DTO에서 content 필드에 매핑되어 버린다.
    
    ```java
    16:14:12.235 ERROR k.c.l.a.a.c.r.ApiExceptionAdvice - Unhandled runtime exception: null
    Caused by: org.apache.ibatis.executor.result.ResultMapException: Error attempting to get column 'content' from result set.  Cause: java.lang.NumberFormatException: For input string: "![￬ﾆﾔ￫ﾣﾨ￫ﾅﾸ￭ﾊﾸ ￫ﾡﾜ￪ﾳﾠ￬ﾝﾴ￫ﾯﾸ￬ﾧﾀ](https://xv-ncloud.pstatic.net/images/marketplace/BI@2x_1754559522849.png)
    ```
    
    - String 타입인 content에 Number 타입을 매핑하려 하기 때문에 에러가 발생한다.
- 그렇기에 기존 방식을 사용한다면
    1. DTO의 필드 순서에 맞게 쿼리도 함께 맞춰주어야 하기에 효율성이 떨어지고
    2. 휴먼 에러로 순서가 바뀌어 쿼리가 제대로 작동하지 않는 등의 문제도 발생할 수 있다.

---

# 2. 해결 방법

> 해결 방법은 간단하다. DTO 클래스에 붙어 있는 `@Builder` 어노테이션을 제거함으로써 해결할 수 있다.
> 

```java
import lombok.Getter;

import java.time.LocalDateTime;

public class DocumentDto {

	...

    @Getter
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
}

```

```json
{
  "timestamp": "2025-08-27T16:18:27.335429",
  "code": "SUCCESS",
  "message": "정상 처리되었습니다.",
  "data": [
    {
      "content": " ... "
      "similarityScore": 67.34
    }
  ]
}
```

- 응답이 정상적으로 오는 것을 확인할 수 있다.

## @Builder

> 그렇다면 왜 `@Builder`를 사용했을 때는 되지 않았던 것일까?
> 
1. @Builder를 사용하면, 빌더에서 사용하기 위한 생성자를 만들어 낸다.
    1. 이는 모든 필드를 인자로 받는 `private` 생성자이다.
2. Java에서는, 클래스에 생성자가 1개도 없는 경우에는 인자가 없는 ‘기본 생성자’를 만들어 준다.
    1. 이 때문에 생성자를 따로 만들지 않아도, MyBatis에서 `@Setter`를 호출해 DB에서 가져온 값을 DTO에 넣어줄 수가 있다.
    2. 하지만 개발자가 생성자를 1개라도 만드는 순간, 기본 생성자는 만들어지지 않는다.
3. 즉, `@Builder`로 인해서 기본 생성자는 만들어 지지 않았고, `private` 모든 필드 생성자만 만들어 지기에 순서를 맞추어 넣어줘야 했던 것이다.

## 모든 필드 생성자

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="kr.co.logosai.assistant.api.admin.document.repository.mapper.DocumentMapper">

	...

    <select id="findReferenceDocumentByConversationUid" resultType="kr.co.logosai.assistant.api.admin.document.repository.dto.DocumentDto$RagReferenceDto">
        SELECT
            lrs.embedding_score
        FROM
            LOG_RAG_SEARCH_RESULTS lrs
                JOIN
            RAG_DOCUMENT rd ON lrs.document_uid = rd.uid
        WHERE
            lrs.bot_uid = #{botUid}
          AND lrs.parent_chat_uid = #{conversationUid}
          AND lrs.document_uid != 0
        ORDER BY
            lrs.embedding_score DESC
    </select>

</mapper>

```

```java
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class DocumentDto {

	...

    @Getter
    @Builder
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
}

```

- 빌더만 있는 상태에서, 모든 DTO 필드에 매핑하지 않고 1개만 하도록 테스트해보았다.
    - embedding_score 컬럼만 조회해서 리턴한다.

```java
16:30:38.645 ERROR k.c.l.a.a.c.r.ApiExceptionAdvice - Unhandled runtime exception: null
Caused by: java.lang.IndexOutOfBoundsException: Index 1 out of bounds for length 1
	at java.base/jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
	at java.base/jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
	at java.base/jdk.internal.util.Preconditions.checkIndex(Preconditions.java:266)
	at java.base/java.util.Objects.checkIndex(Objects.java:361)
	at java.base/java.util.ArrayList.get(ArrayList.java:427)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.applyColumnOrderBasedConstructorAutomapping(DefaultResultSetHandler.java:787)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.applyConstructorAutomapping(DefaultResultSetHandler.java:776)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.createByConstructorSignature(DefaultResultSetHandler.java:727)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.createResultObject(DefaultResultSetHandler.java:689)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.createResultObject(DefaultResultSetHandler.java:659)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.getRowValue(DefaultResultSetHandler.java:411)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.handleRowValuesForSimpleResultMap(DefaultResultSetHandler.java:366)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.handleRowValues(DefaultResultSetHandler.java:337)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.handleResultSet(DefaultResultSetHandler.java:310)
	at org.apache.ibatis.executor.resultset.DefaultResultSetHandler.handleResultSets(DefaultResultSetHandler.java:202)
	at org.apache.ibatis.executor.statement.PreparedStatementHandler.query(PreparedStatementHandler.java:66)
	at org.apache.ibatis.executor.statement.RoutingStatementHandler.query(RoutingStatementHandler.java:80)
	at org.apache.ibatis.executor.SimpleExecutor.doQuery(SimpleExecutor.java:65)
	at org.apache.ibatis.executor.BaseExecutor.queryFromDatabase(BaseExecutor.java:336)
	at org.apache.ibatis.executor.BaseExecutor.query(BaseExecutor.java:158)
	at org.apache.ibatis.executor.CachingExecutor.query(CachingExecutor.java:110)
	at com.github.pagehelper.PageInterceptor.intercept(PageInterceptor.java:169)
	at org.apache.ibatis.plugin.Plugin.invoke(Plugin.java:59)
	at jdk.proxy2/jdk.proxy2.$Proxy158.query(Unknown Source)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:154)
	... 174 common frames omitted
16:30:38.656 WARN  o.s.w.s.m.m.a.ExceptionHandlerExceptionResolver - Resolved [org.mybatis.spring.MyBatisSystemException]
```

- `Index 1 out of bounds for length 1` 에러가 발생한다.
- 현재 DTO는 모든 필드 생성자만 존재하기 때문에, DB 결과에서 2개의 컬럼을 가져와 매핑하려고 한다.
    - 하지만 실제로 가져오는 컬럼은 embedding_score 하나이기 때문에, 해당 에러가 발생하는 것이다.

```java
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class DocumentDto {

	...

    @Getter
    // @Builder
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
}

```

- 이렇게 빌더를 사용하지 않게 되면, 아래와 같이 결과가 반환된다.

```json
{
  "timestamp": "2025-08-27T17:16:24.127897",
  "code": "SUCCESS",
  "message": "정상 처리되었습니다.",
  "data": [
    {
      "content": null,
      "similarityScore": 63.42
    }
  ]
}
```

- DB에서 가져오지 않은 값(content)는 null로 들어가고, 가져온 값은 제대로 들어가는 것을 확인할 수 있다.
- 이는 MyBatis에서 기본 생성자에 setter로 값을 할당해주었기 때문이다.

---

# 3. Reflector 클래스

> **MyBatis에서 기본 생성자에 setter를 활용해 값을 할당한다고 설명하였다.
하지만 한 가지 이상한 점은, 현재 `@Setter`가 없는데도 불구하고 기능이 잘 돌아간다는 것이다.**
> 
- 이는 리플렉션이라는 기능 때문이다. `Reflector` 클래스가 resultType 의 클래스에 대한 필드정보와 getter/setter의 매핑 정보를 만들어 두고 이를 통해서 바인딩 시 해당 필드를 찾게 된다.
- 자세한 내용은 아래 블로그에 잘 정리되어 있다.

[MyBatis가 setter/getter를 찾는 방법](https://jasper-rabbit.github.io/posts/mybatis-refector/)

[Spring + MyBatis에서 쿼리의 결과와 객체가 매핑이 되는 과정](https://zzang9ha.tistory.com/420)

---

# 4. 결론

```java
import lombok.Getter;

import java.time.LocalDateTime;

public class DocumentDto {

	...

    @Getter
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
}
```

- 현재 로직 상 DTO는 MyBatis 매핑용이기 때문에 별다른 기능이 필요하지 않아, `@Getter` 로 충분하다고 판단했다.
    - `@Setter` 의 경우에는 리플렉션 기능 덕분에 생략이 가능하다.

```java
	@Getter
    @NoArgsConstructor
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;

        @Builder
        public RagReferenceDto(String content, Double embeddingScore) {
            this.content = content;
            this.embeddingScore = embeddingScore;
        }
    }
```

- 만약에 해당 DTO에 빌더 패턴을 적용해야 할 일이 생긴다면, 위와 같이 정의하는 것이 좋다.
    - `@NoArgsConstructor` 를 붙여 주어야, 기본 생성자가 생겨 순서에 상관 없이 MyBatis가 매핑해 줄 수 있다.

```java
    @Getter
    @Builder
    @NoArgsConstructor
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
```

- 위처럼 하게 되면, `@Builder` 와 `@NoArgsConstructor` 이 충돌하여 컴파일 에러가 발생한다.

```java
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RagReferenceDto {
        private String content;
        private Double embeddingScore;
    }
```

- ~~`@AllArgsConstructor` 를 추가로 붙여서 해결할 수 있으나, 불필요한 어노테이션이 늘어나기 때문에 필요한 생성자를 임의로 만들고 `@Builder` 를 붙이는 방식이 더 좋다.~~

> 🧑🏻‍💻 생각을 해 보니, 함께 일하는 개발자가 
