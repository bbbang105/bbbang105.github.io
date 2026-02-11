---
date: 2025-10-04
description: Java Reflection의 동작 원리와 Spring DI, JPA 등 프레임워크에서의 활용을 정리합니다.
tags:
  - java
  - backend
---

---

# 🏁 서론

JPA에서 Entity에 기본 생성자가 필수적인 이유에 대해서 알아보던 중, `Java Reflection` 이라는 개념에 대해서 알게 되었다. 

조사를 하다 보니, Spring 프레임워크에서 핵심적으로 사용하고 있는 자바의 기능이라는 것을 알게 되었고, 조금 더 자세히 알아보는 게 좋을 것 같아 글을 작성하게 되었다.

---


# 🪞 Java Reflection이란?

> **자바 리플렉션**은 프로그램이 실행 중(runtime)에 자기 자신을 들여다보고 분석하는 기능이다. 
코드가 마치 거울을 보듯 자신의 내부 구조(클래스, 메서드, 필드 등)를 파악하고, 심지어는 그 구조를 변경하거나 조작할 수 있게 해주는 강력한 도구이다.
>
'Reflection'이라는 이름은 '반사', '성찰'이라는 뜻에서 유래하였다.

## 리플렉션의 JVM 동작 원리

이를 더욱 자세히 이해하기 위해서는, 컴파일 시점의 JVM 동작 원리를 알아볼 필요가 있다.

### 1단계: 컴파일 (.java → .class)

예를 들어, `Person.java` 라는 파일이 컴파일되면 `Person.class` 파일이 생성된다. 

이 `.class` 파일 안에는 단순히 실행 가능한 바이트코드(Bytecode)만 있는 것이 아니라, 클래스에 대한 `모든 메타데이터(Metadata)` 가 일종의 설계도처럼 기록되어 있다.

 > - 클래스 이름, 부모 클래스, 구현한 인터페이스 정보
 - 필드(멤버 변수)의 이름, 타입, 접근 제어자(`public`, `private` 등)
 - 메서드의 이름, 파라미터, 리턴 타입, 접근 제어자
 - 생성자 정보, 어노테이션 정보 등

### 2단계: 클래스 로딩 (Loading)

애플리케이션이 실행되다가 `Person` 클래스를 처음 사용해야 하는 시점(예: `new Person()` 또는 `Class.forName("Person")`)이 오면, `JVM의 클래스 로더(Class Loader)` 가 동작한다.

> 1.  클래스 로더는 파일 시스템에서 `Person.class` 파일을 찾아 읽어온다.
2.  `.class` 파일에 담긴 바이트코드와 **메타데이터**를 파싱(분석)한다.
3.  이 분석된 정보를 JVM 메모리의 메서드 영역(Method Area)에 저장합니다. (Java 8 이후로는 Metaspace 영역을 의미함)
-> 메서드 영역은 모든 스레드가 공유하는 영역으로, 클래스의 '설계도 원본'이 보관되는 곳이라고 생각할 수 있다.

### 3단계: Class 객체 생성

클래스 정보가 메서드 영역에 로드될 때, JVM은 이 클래스에 대한 유일한 `java.lang.Class` 객체를 하나 생성해서 **힙(Heap) 영역**에 저장한다.

> - `person.getClass()`, `Person.class`, `Class.forName("Person")` 등으로 얻는 객체가 바로 이 힙 영역에 있는 `Class` 객체이다.
-> 이 `Class` 객체는 메서드 영역에 저장된 실제 메타데이터로 접근할 수 있는 **리모컨 또는 게이트웨이 역할**을 한다.

### 4단계: 리플렉션 API 실행

이후 리플렉션 코드를 실행하면 JVM 내부에서는 아래와 같은 일이 벌어진다.

```java
// personClass는 힙(Heap)에 있는 Class 객체를 가리키는 참조 변수
Class<?> personClass = Class.forName("Person");

// 1. getDeclaredField("age") 호출
// 2. JVM은 personClass 리모컨을 통해 메서드 영역(Method Area)에 저장된
//    Person 클래스의 메타데이터를 뒤짐
// 3. 'age'라는 이름의 필드 정보를 찾아냄
// 4. 이 정보를 바탕으로 'Field' 객체를 힙(Heap)에 생성하여 반환
Field ageField = personClass.getDeclaredField("age");

// Field 객체의 set()이나 Method 객체의 invoke()를 호출하면
// JVM은 이 객체들이 가진 정보를 이용해 메서드 영역의 실제 코드나
// 힙에 있는 실제 인스턴스의 메모리 주소에 접근하여 값을 조작합니다.
```

---

# 🛠️ Reflection API의 주요 기능과 테스트 코드

리플렉션의 거의 모든 작업은 클래스가 로드될 때 JVM이 힙 영역에 저장하는 `java.lang.Class` 라는 특별한 객체에서부터 시작된다. 해당 객체만 얻으면 클래스의 모든 정보를 캐낼 수가 있다.

## 테스트용 Person 클래스

```java
public class Person {
    public String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void sayHello() {
        System.out.println("Hello, my name is " + name);
    }

    private void whisperAge() {
        System.out.println("Actually... I'm " + age + " years old.");
    }
}
```

  - `public` 필드(`name`)
  - `private` 필드(`age`)
  - `public` 메서드(`sayHello`)
  - `private` 메서드(`whisperAge`)

## 핵심 기능과 예제 코드

아래 코드는 `Person` 클래스를 리플렉션으로 분석하고 조작하는 과정을 보여준다.

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectionExample {
    public static void main(String[] args) throws Exception {
        // 1. 클래스 정보 가져오기 (Class 객체 로드)
        // 문자열 이름만으로 클래스의 모든 정보를 담은 객체를 얻습니다.
        Class<?> personClass = Class.forName("Person");
        System.out.println("1. 로드된 클래스: " + personClass.getName());

        // 2. 생성자를 이용해 객체(인스턴스) 만들기
        // 파라미터 타입(String, int)을 지정하여 원하는 생성자를 찾습니다.
        Constructor<?> constructor = personClass.getConstructor(String.class, int.class);
        // 찾은 생성자로 새 인스턴스를 만듭니다. 'new Person("상호", 25)'과 같습니다.
        Object personObject = constructor.newInstance("상호", 25);
        System.out.println("2. 생성된 객체: " + personObject);

        // 3. 필드(멤버 변수)에 접근하고 값 변경하기
        // 'age'라는 이름의 필드를 찾습니다. private이므로 getDeclaredField()를 사용합니다.
        Field ageField = personClass.getDeclaredField("age");
        // private 필드에 접근하려면 접근 제한을 풀어야 합니다.
        ageField.setAccessible(true);
        // personObject의 age 필드 값을 26으로 변경합니다.
        ageField.set(personObject, 26);
        System.out.println("3. 변경된 private 필드 값(age): " + ageField.get(personObject));

        // 4. 메서드 호출하기
        // 'whisperAge'라는 이름의 메서드를 찾습니다. private이므로 getDeclaredMethod()를 사용합니다.
        Method whisperMethod = personClass.getDeclaredMethod("whisperAge");
        // private 메서드를 호출하기 위해 접근 제한을 풉니다.
        whisperMethod.setAccessible(true);
        // personObject의 whisperAge() 메서드를 실행합니다.
        System.out.print("4. 호출된 private 메서드: ");
        whisperMethod.invoke(personObject);
    }
}
```

> **실행 결과**
```
1. 로드된 클래스: Person
2. 생성된 객체: Person@1b6d3586  // (객체의 해시코드)
3. 변경된 private 필드 값(age): 26
4. 호출된 private 메서드: Actually... I'm 26 years old.
```

이처럼 리플렉션을 사용하면 문자열 이름만으로 클래스를 제어할 수 있다. 심지어 **`private` 접근 제한까지 우회**하여 내부 상태를 읽고 수정할 수 있다. 

---

# 🚀 리플렉션이 사용되는 곳

리플렉션은 일반적인 애플리케이션 코드보다는, 특정 기술이나 규약에 의존하지 않는 범용적인 기능을 만들어야 하는 **프레임워크나 라이브러리에서 핵심적인 역할**을 하게 된다.

## 1. Spring에서 의존성 주입 (DI)

스프링 프레임워크의 핵심적인 기능인 **IoC(제어의 역전) 컨테이너**와 **DI(의존성 주입)**는 리플렉션 기술 없이는 구현이 불가능하다.

스프링 컨테이너가 `UserService` 객체에 `UserRepository`를 주입(`@Autowired`)하는 과정을 리플렉션 관점에서 살펴보면 아래와 같다.

> 1.  **컴포넌트 스캔**: 애플리케이션이 시작되면, 스프링은 `@Component`, `@Service`, `@Repository` 같은 어노테이션이 붙은 클래스들을 찾는다. 
-> 이 과정에서 클래스의 메타데이터를 읽기 위해 리플렉션이 사용된다.

> 2.  **Bean 인스턴스 생성**: 스프링은 찾아낸 클래스를 바탕으로 객체(Bean)를 생성해야 한다. 
-> 이때 리플렉션의 `Constructor.newInstance()`를 사용하여 각 클래스의 인스턴스를 만든다.

> 3.  **의존성 주입 실행**: `UserService` Bean을 생성한 후, 스프링은 해당 클래스를 스캔하여 `@Autowired` 어노테이션이 붙은 필드(`userRepository`)를 찾는다.

> 4.  **필드 정보 분석**: 리플렉션으로 `userRepository` 필드의 타입이 `UserRepository`라는 것을 알아낸다.

> 5.  **Bean 찾기 및 주입**: 스프링 컨테이너에서 `UserRepository` 타입의 Bean을 찾은 뒤, 리플렉션의 `Field.set()` 메서드를 사용하여 `UserService` 객체의 `userRepository` 필드에 해당 Bean을 주입한다.
-> 이때 필드가 `private`이라도 `field.setAccessible(true)`를 통해 강제로 값을 설정할 수 있다.

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserValidator userValidator;
    private final ApplicationEventPublisher eventPublisher;
    private final UserRepository userRepository;
    private final DeleteReasonRepository deleteReasonRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final MobileRepository mobileRepository;
    
    ...
```

> 🧑🏻‍💻 이러한 특성 때문에, 위와 같이 private으로 설정하여도 의존성 주입을 정상적으로 해줄 수가 있다!


## 2. JPA 등 ORM 프레임워크

JPA 구현체(주로 하이버네이트)가 DB에서 조회한 데이터를 Entity 객체로 만드는 과정은 아래와 같다.

> 1.  **데이터 조회**: `userRepository.findById(1L)` 같은 메서드가 호출되면, 하이버네이트는 DB로 `SELECT * FROM USERS ...` 쿼리를 보내 데이터를 조회한다.

> 2.  **Entity 객체 생성**: 조회된 결과를 담을 Entity 객체의 인스턴스를 만들어야 한다. 하지만 하이버네이트는 개발자가 어떤 생성자를 만들어 뒀을지 전혀 알 수가 없는 상태이다.

> 3.  **기본 생성자 호출**: 그래서 하이버네이트는 가장 안전하고 확실한 방법인 **기본 생성자를 리플렉션으로 호출**하여 '텅 빈' 객체를 먼저 생성한다. (`User.class.getConstructor().newInstance()`)

> 4.  **필드에 값 매핑**: 생성된 객체의 각 필드에 리플렉션(`Field.set()`)을 사용하여 DB에서 가져온 값을 하나씩 채워 넣는다. `id` 컬럼 값은 `id` 필드에, `name` 컬럼 값은 `name` 필드에 설정하는 식이다.

## 3. JUnit 등 테스트 프레임워크

JUnit이 `@Test` 어노테이션 하나만 붙이면 알아서 테스트를 실행해주는 것도 리플렉션 덕분이라 할 수 있다.

> 1.  **테스트 메서드 검색**: JUnit 실행기는 지정된 테스트 클래스(`MyTest.class`)의 모든 메서드를 리플렉션으로 스캔한다.

> 2.  **어노테이션 확인**: 스캔한 메서드들 중 `@Test` 어노테이션이 붙어있는 메서드를 찾아 목록으로 만든다. 또한 `@BeforeEach`, `@DisplayName` 등 다른 어노테이션 정보도 이때 함께 수집한다.

> 3.  **테스트 실행**: JUnit은 찾아낸 테스트 메서드 목록을 순회하며 리플렉션의 `Method.invoke()`를 사용해 각 메서드를 실행한다.
-> `Method.invoke()` 는 Java Reflection API의 핵심 기능 중 하나로, 런타임에 특정 객체의 메서드를 동적으로 호출할 수 있게 해주는 메서드이다.

> 🧑🏻‍💻 이 덕분에 개발자가 테스트 메서드를 일일이 호출하는 `main` 메서드를 만들 필요가 없어진다!

---

# ⚠️ 유의사항

리플렉션 기능을 애플리케이션 단에서 활용할 일은 잘 없으나, 혹시 모르니 유의사항에 대해서 짚고 마무리하면 좋을 듯하다.

## 1. 성능 저하

리플렉션을 통한 메서드 호출은 일반적인 메서드 호출보다 훨씬 느린데, JVM이 컴파일 시점에 최적화를 할 수 없으며 런타임에 클래스, 메서드, 필드의 정보를 하나하나 찾아다니는 과정에서 상당한 오버헤드가 발생하기 때문이다.

때문에 그럴 일은 잘 없겠지만, 성능에 민감한 로직에 리플렉션 API를 포함하는 것은 지양하는 게 좋다.

## 2. 캡슐화 파괴

리플렉션의 `setAccessible(true)` 옵션은 private으로 선언된 필드나 메서드에 대한 접근을 가능하게 하므로, 객체지향 프로그래밍의 핵심 원칙 중 하나인 캡슐화를 무너뜨리게 된다.

그렇기 때문에 프레임워크 단에서와 같이 필수적인 상황이 아니라면 사용을 지양해야 한다.

## 3. 컴파일 타임 안정성 

리플렉션은 주로 문자열(String)로 클래스나 메서드의 이름을 지정하여 사용하며, 이는 컴파일러의 타입 체크 기능을 무력화시켜 런타임 에러를 발생시키는 요인이 된다.

---


# 🎬 마무리

지금까지 Java의 Reflection에 대해서 알아보았다.
그동안에는 Spring 프레임워크가 어떤 식으로 Bean을 생성하고 주입하는지 알지 못 했는데, 이번 기회로 조금 더 이해할 수 있게 되었던 것 같다.

앞으로도 내가 사용하는 기술들의 동작 원리에 대해 이해하도록 더욱 노력해야겠다.

> 참고한 블로그

1. https://jeongkyun-it.tistory.com/225

2. https://curiousjinan.tistory.com/entry/java-reflection-explain

3. https://steady-coding.tistory.com/609

4. https://velog.io/@blackbean99/SpringBoot-%EB%A6%AC%ED%94%8C%EB%A0%89%EC%85%98%EC%9C%BC%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-Autowired
