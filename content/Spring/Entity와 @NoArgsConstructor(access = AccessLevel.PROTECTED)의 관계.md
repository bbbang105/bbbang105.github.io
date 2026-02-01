---
date: 2025-10-04
tags:
  - springboot
  - backend
  - database
  - jpa
---

---

# 🏁 서론

```java
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "members")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Builder
    public Member(String name, String email) {
        this.name = name;
        this.email = email;
    }
}
```

JPA 사용을 위한 엔터티를 정의하는 과정에서, 습관적으로 위와 같은 어노테이션 조합을 사용하고는 한다.

특히 여기서, `@NoArgsConstructor(access = AccessLevel.PROTECTED)` 을 가장 알지 못한 채로 사용을 했는데, 이에 대해서 반성하며 그 이유에 대해 조사하고자 글을 작성하게 되었다.

---

# 🤔 JPA는 왜 기본 생성자를 필요로 할까?

![](https://velog.velcdn.com/images/hsh111366/post/f83f1e40-7601-4677-b137-fb38b12882c9/image.png)

위와 같이 `@NoArgsConstructor`를 제거하게 되면 컴파일 에러가 발생한다. 해석해 보면, `public or protected`의 기본 생성자가 필요하다는 의미이다.

> 과연 그 이유가 무엇일까?

## 1. 리플렉션 (Reflection)

> 리플렉션에 대한 자세한 내용은 [해당 글](https://bbbang105.github.io/Java/Reflection%EC%9D%B4%EB%9E%80)에서 살펴볼 수 있다.

JPA 구현체는 데이터베이스에서 조회한 데이터를 바탕으로 엔티티 객체를 동적으로 생성한다.

> 1.  JPA는 DB에서 `id`가 1인 `member` 데이터를 가져온다.
2.  가져온 데이터(`id`, `name`, `email` 등)를 담을 `Member` 객체의 인스턴스가 필요한 상황. 하지만 JPA는 개발자가 `Member` 클래스에 어떤 생성자를 만들어 뒀는지 알 수 없다.
3.  때문에 JPA는 리플렉션 API를 사용하여 `Member.class.getDeclaredConstructor().newInstance()` 와 같은 방식으로 객체를 생성하며, 이 방식은 **기본 생성자를 호출**한다.
4.  이렇게 텅 빈 객체가 생성되면, 그 후에 각 필드에 리플렉션을 통해 조회한 데이터를 채워 넣는다. **이때 Setter가 없이도, 값을 주입해줄 수 있다.**

이처럼 JPA가 동적으로 엔티티 객체를 생성하고 값을 넣어주기 위해서, 어떤 상황에서든 호출 가능한 **기본 생성자가 반드시 필요**한 것이다.

## 2. 프록시 (Proxy)

JPA의 중요한 기능 중 하나로, `지연 로딩(Lazy Loading)` 이 존재한다.
이는 연관관계에 있는 엔티티를 처음부터 다 조회하는 것이 아니라, 실제로 그 엔티티를 사용하는 시점에 조회하는 기술이다.

이때 JPA는 실제 엔티티 객체 대신, 가짜 객체인 **프록시(Proxy) 객체**를 만들어 사용하게 된다. 이 프록시 객체는 아래와 같이 실제 엔티티 클래스를 **상속받아서** 만들어진다.

```java
// MemberProxy는 Member를 상속받는, 하이버네이트가 동적으로 생성한 클래스
class MemberProxy extends Member {
    // ... 내부 구현 ...
}
```

자바에서 자식 클래스의 생성자는 반드시 부모 클래스의 생성자를 호출 `super()` 해야 한다. 
그런데 만약 부모 클래스인 `Member`에 기본 생성자가 없다면, 자식 클래스인 `MemberProxy`는 객체를 생성할 수가 없게 된다.

따라서 지연 로딩 시 프록시 객체를 원활하게 생성하기 위해서는, 부모 클래스가 될 엔티티에 **기본 생성자가 필수적**인 것이다.

-----

# 🧐 왜 `protected` 접근 제어자를 사용할까?

지금까지 엔터티에서 기본 생성자가 필요한 이유에 대해서는 알아보았다.
여기서 한 단계 더 나아가서, 그렇다면 왜 `public`이나 `private`이 아닌 `protected`를 사용하는 것일까?

## `public` 대신 `protected`를 쓰는 이유

`public`으로 기본 생성자를 열어두면 어디서든 `new Member()`와 같이 객체를 생성할 수 있게 된다. 하지만 이렇게 생성된 객체는 `name`이나 `email` 같은 필수 값이 누락된, 일관성이 깨진 객체일 수 있다.

그렇지 않고 `protected`로 설정하면, **외부 패키지에서 `new Member()`를 직접 호출하는 것을 막을 수 있다.** 이는 개발자의 실수를 방지하고 객체 생성의 책임을 특정 메서드(Builder 등)로 강제하는 효과가 있어 코드의 안정성을 높여줄 수 있다.

## `private` 대신 `protected`를 쓰는 이유

`private`으로 설정하면 외부에서는 물론, 클래스 내부를 제외한 어디서도 생성자를 호출할 수 없다. 

> 이는 위에서 설명한 **프록시 문제**를 다시 일으키게 된다.

프록시 객체는 엔티티를 상속받은 자식 클래스인데, 자식 클래스에서 부모의 `private` 생성자를 호출할 수는 없기 때문이다. 
프록시 메커니즘은 상속을 기반으로 하므로 부모의 기본 생성자에 `protected` 이상의 접근 권한이 필요하다.

---

# 🕵🏻‍♂️ @NoArgsConstructor(access = AccessLevel.PROTECTED)를 안쓸 수 있는 경우는 없을까?

> 정말로 없을까?

## 여러 시도

```java
@Getter
@Entity
@Table(name = "members")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;
}
```

만약에 위와 같이 클래스에 생성자를 하나도 만들지 않는 경우에는, 컴파일러가 자동적으로 기본 생성자를 만들어준다. 때문에 이 경우에는 컴파일 에러가 발생하지는 않는다.

```java
@Getter
@Setter
@Entity
@Table(name = "members")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;
}

```

하지만 이상태로는 할 수 있는 게 없으니.. 기본 생성자를 호출한 후 값을 넣어주기 위해서 `@Setter`를 사용해야 한다.

그러나 많은 사람들이 알다시피 엔터티에 `@Setter`를 사용하는 것은 지양해야 한다. 누구나 어디서든 무분별하게 객체 내부의 필드 값을 변경하여 데이터 불변성과 정합성을 깰 수 있기 때문이다.

![](https://velog.velcdn.com/images/hsh111366/post/3a9c097d-8885-4968-99e4-d342fd49ab87/image.png)

그렇다면 @Setter말고 빌더를 사용해보자. 

그러면 위와 같이 동일한 컴파일 에러가 발생하게 되는데, `@Builder` 를 붙이게 되면 빌더 내부적으로 사용하기 위한 모든 필드 생성자(AllArgsConstructor)를 만들어내기 때문이다.

그렇기에 컴파일러는 `생성자가 있네? 그렇다면 기본 생성자는 만들지 않아도 되겠군` 이라고 생각하며 해당 과정을 생략해버리게 되고, 엔터티에서 필수적인 기본 생성자가 다시 없어지며 컴파일 에러가 발생하는 것이다.

![](https://velog.velcdn.com/images/hsh111366/post/0446e43f-76e4-41ed-bca6-e2ecf9577b63/image.png)

그럼 기본 생성자를 명시적으로 만들어주기 위해서, `@NoArgsConstructor` 를 붙여보자! 

그러면 또 다시 컴파일 에러가 발생하는데, 이번에는 엔터티가 아닌 빌더와 `@NoArgsConstructor` 때문이다. 이에 대해서는 [해당 글](https://bbbang105.github.io/Spring/@Builder%EC%99%80-@NoArgsConstructor%EA%B0%80-%EC%B6%A9%EB%8F%8C%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0)을 읽어 보면 이해할 수 있다.

![](https://velog.velcdn.com/images/hsh111366/post/56e02e36-9e29-494a-8fd9-182525ed1fa8/image.png)

여기에다가 추가로 `@AllArgsConstructor` 를 붙여주면 문제가 해결되기는 한다. 그래서 이런 식으로 어노테이션 조합을 사용하는 경우도 더러 보았다.

하지만 엔터티에 `@AllArgsConstructor` 사용을 지양해야 하는 이유 또한 존재한다. 이는 아래와 같다.
(빌더를 사용하는 경우에는 아래의 문제들을 어느정도 예방할 수는 있기는 하다.)

> **1. 매개변수 순서로 인한 버그 발생 가능성**
`@AllArgsConstructor`는 클래스에 정의된 필드 순서대로 매개변수를 받는 생성자를 만든다. 만약 비슷한 타입의 필드가 여러 개 있다면, 개발자가 실수로 순서를 바꿔 입력해도 컴파일러는 이를 잡아내지 못해 런타임 에러가 발생할 수 있다.

```java
// email, name 순서라고 가정
new Member("test@email.com", "한상호"); // OK

// 실수로 순서를 바꿔도 컴파일 에러가 발생하지 않음!
// name 필드에 이메일이, email 필드에 이름이 들어가는 끔찍한 버그 발생
new Member("한상호", "test@email.com"); // Not OK, but compiles!
```

> **2. 불필요한 필드까지 생성자에 포함**
@AllArgsConstructor는 id처럼 데이터베이스가 생성해주는 값이나, 다른 엔티티와의 연관관계 필드까지 전부 생성자의 매개변수로 포함시켜 버린다.

```java
// @AllArgsConstructor가 만든 생성자의 모습
public Member(Long id, String name, String email, Team team) { ... }

// 개발자가 Member를 생성할 때 id 값을 직접 넣게 됨
Member member = new Member(1L, "한상호", "test@email.com", new Team());
```

> **3. 코드의 취약성 증가**
엔티티에 새로운 필드를 하나 추가하게 되면, @AllArgsConstructor는 즉시 생성자의 시그니처를 변경한다. 
-> 그 결과, 기존 코드에서 이 생성자를 사용하던 모든 곳에서 컴파일 에러가 발생하며 전부 수정해야 하는 참사가 발생한다. 이는 리팩토링을 매우 번거롭게 만들며, 엔티티의 확장을 어렵게 한다.

## 결론

```java
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "members")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Builder
    public Member(String name, String email) {
        this.name = name;
        this.email = email;
    }
}
```

그렇기 때문에 위와 같이 사용해 주는 것이 지금으로써는 가장 좋다고 생각이 든다.

`@Builder` 를 클래스 단에 붙여버리게 되면, `@AllArgsConstructor` 도 함께 붙여주어야 할 뿐더러 생성자에 포함될 필요가 없는 id와 같은 필드들도 자동적으로 포함되기 때문이다.

```java
@Getter
@Entity
@Table(name = "members")
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Builder
    public Member(String name, String email) {
        this.name = name;
        this.email = email;
    }
	
	protected Member() {}
}
```

죽어도 `@NoArgsConstructor(access = AccessLevel.PROTECTED)` 를 못 쓰겠다고 한다면 위와 같이 쓸 수는 있을 것 같다..

---

# 🎬 마무리

지금까지 스프링의 엔터티에서 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 사용하는 이유들에 대해서 알아보았다.

리플렉션, 프록시 등 생각보다 다양한 개념들과 연결돼 있어서 학습하는데 흥미로웠던 것 같다. 또한 이번 기회로, `@Builder` `@NoArgsConstructor` 등 평소에는 아무렇지 않게 사용하던 어노테이션들의 동작 원리를 알 수 있어서 뜻 깊은 시간이었다.

> 참고한 블로그

1. https://dev-green.tistory.com/128
