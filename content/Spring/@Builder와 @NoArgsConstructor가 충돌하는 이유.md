---
date: 2025-10-04
tags:
  - springboot
  - backend
---

---

# 🏁 서론

Spring으로 개발을 하다보면, DTO 등에 생성자를 직접 만드는 대신 `@Builder` 어노테이션을 붙인 빌더 패턴을 주로 이용하고는 한다.

```java
@Getter
@Builder
public class UserDto {
	String name;
	String email;
	int age;
}

```

위처럼 어노테이션을 붙이면, 원하는 필드에만 값을 넣어서 객체를 생성할 수가 있다.
허나, 생성자 패턴을 사용한다면 모든 경우에 대해서 생성자를 만들어 주어야 하기 때문에 코드가 길어진다.

![](https://velog.velcdn.com/images/hsh111366/post/85bc09be-c38b-454e-92b0-a52d44012aee/image.png)

경우에 따라서 `@Builder` 와 `@NoArgsConstructor`를 함께 붙여야 할 때가 있는데, 그럴 때는 위와 같이 컴파일 에러가 발생한다.

![](https://velog.velcdn.com/images/hsh111366/post/09385ef7-79bb-4d42-a0bf-4ca5c539bf24/image.png)

때문에 이를 해결하기 위해서 `@AllArgsConstructor` 어노테이션을 함께 붙여준다.

이전에는 이에 대한 이유를 모른 채로 사용을 했고, 이후에는 Record를 활용해서 DTO를 구성하다 보니 신경을 쓰지 않게 되었다. 

하지만 [최근에 회사에서 `@Builder`와 관련된 조사](https://velog.io/@hsh111366/왜-Builder를-쓰면-MyBatis-매핑이-꼬일까)를 하게 되었고, 이 참에 정확한 이유를 알아보아야겠다는 생각이 들어 글을 적게 되었다.

---

# 🪏 빌더 클래스 까보기

이에 대한 이유는 빌더 클래스 내부를 확인해 보면 쉽게 알 수 있다.

## 1. 클래스에 @Builder 적용 시 동작 방식

```
 * If a member is annotated, it must be either a constructor or a method. If a class is annotated,
 * then a package-private constructor is generated with all fields as arguments
 * (as if {@code @AllArgsConstructor(access = AccessLevel.PACKAGE)} is present
 * on the class), and it is as if this constructor has been annotated with {@code @Builder} instead.
```
> 
- 만약 클래스에 @Builder를 붙이면, Lombok은 모든 필드를 인수로 받는 package-private생성자를 자동으로 만듭니다.
- 마치 @AllArgsConstructor(access = AccessLevel.PACKAGE)를 사용한 것과 같습니다.
- 그리고 Lombok은 이 생성자에 @Builder가 붙은 것처럼 처리합니다.


```java
public class UserDto {
    String name;
    String email;
    int age;

    UserDto(final String name, final String email, final int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public int getAge() {
        return this.age;
    }

    public static class UserDtoBuilder {
        private String name;
        private String email;
        private int age;

        UserDtoBuilder() {
        }

        public UserDtoBuilder name(final String name) {
            this.name = name;
            return this;
        }

        public UserDtoBuilder email(final String email) {
            this.email = email;
            return this;
        }

        public UserDtoBuilder age(final int age) {
            this.age = age;
            return this;
        }

        public UserDto build() {
            return new UserDto(this.name, this.email, this.age);
        }

        public String toString() {
            return "UserDto.UserDtoBuilder(name=" + this.name + ", email=" + this.email + ", age=" + this.age + ")";
        }
    }
}
```

위는 UserDto의 빌드파일로, @Builder 어노테이션에 의해 자동으로 다양한 로직이 추가된 것을 볼 수 있다.

```java
UserDto(final String name, final String email, final int age) {
	this.name = name;
	this.email = email;
	this.age = age;
}
```

주요하게 보아야 할 점은 위 부분으로, 모든 필드 생성자를 자동으로 만들어 준다는 것이다. 그리고 이를 활용해서 객체의 필드 값을 구성하게 된다.


## 2. 유의사항: 컴파일 에러

```
 * Note that this constructor is only generated if you haven't written any constructors and also haven't
 * added any explicit {@code @XArgsConstructor} annotations. In those cases, lombok will assume an all-args
 * constructor is present and generate code that uses it; this means you'd get a compiler error if this
 * constructor is not present.
```

> - 주의: 이 생성자는 사용자가 아무런 생성자도 만들지 않았고 명시적인 @XArgsConstructor 어노테이션(예: @NoArgsConstructor)도 사용하지 않았을 때만 생성됩니다. 
- 만약 사용자가 이미 생성자를 만들었다면, Lombok은 모든 필드를 받는 생성자가 존재한다고 가정하고 이를 사용하도록 코드를 생성합니다. 
- **따라서 실제로 그런 생성자가 없다면 컴파일 오류가 발생합니다.**

빌더가 자동으로 만들어 주는 모든 필드 생성자는, 해당 클래스에 어떠한 생성자도 없을 때에만 적용된다.

만약 생성자가 1개라도 존재하는 경우에는, 빌더가 `개발자가 생성자를 만들었으니, 당연히 모든 필드 생성자도 만들었겠지` 라고 여기며 이를 생략하게 된다.

> 🧑🏻‍💻 그렇기 때문에 @NoArgsConstructor 어노테이션을 붙이게 되면, 기본 생성자가 생기게 되고 이를 빌더에서 감지하고 모든 필드 생성자를 만드는 것을 생략하게 되는 것이다. 
모든 필드 생성자가 없다면 빌더가 제대로 작동할 수 없기 때문에, 컴파일 에러가 발생하게 된다.

```java
@Getter
@Builder
public class UserDto {
	String name;
	String email;
	int age;

	public UserDto(String name, int age) {
		this.name = name;
		this.age = age;
	}
}

```

물론 이렇게 명시적으로 부분 필드 생성자를 만드는 경우에도 아래와 같이 컴파일 에러가 발생하게 된다.

```
> Task :compileJava
/Users/hansangho/Desktop/legacy_backend/src/main/java/server/poptato/user/api/request/UserDto.java:9: error: constructor UserDto in class UserDto cannot be applied to given types;
@Builder
^
  required: String,int
  found:    String,String,int
  reason: actual and formal argument lists differ in length
Note: /Users/hansangho/Desktop/legacy_backend/src/main/java/server/poptato/global/interceptor/LoggingInterceptor.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
1 error

> Task :compileJava FAILED

FAILURE: Build failed with an exception.
```

---

# 🎬 마무리

1. 이유를 모른 채로 사용하는 것은 좋지 않다. 지금부터라도 의문이 드는 것은 꼭 알고 넘어가도록 노력하자.
2. 단순히 @Builder와 @NoArgsConstructor의 충돌을 피하기 위해서 @AllArgsConstructor를 남발하는 것은 좋지 않다.
3. @NoArgsConstructor를 꼭 사용해야 하는 상황(JPA에서의 Entity)이라면, @AllArgsConstructor를 함께 붙이는 것보다 생성자를 만들고 @Builder를 붙이는 방향을 고려해 보자.

> 참고한 블로그

1. https://velog.io/@yoojkim/lombok-Builder-NoArgsConstructor%EB%A5%BC-%EA%B0%99%EC%9D%B4-%EC%82%AC%EC%9A%A9%ED%95%A0-%EC%88%98-%EC%97%86%EB%8A%94-%EC%9D%B4%EC%9C%A0

2. https://develop-706.tistory.com/25
