---
date: 2025-09-19
tags:
  - java
  - backend
---

---


# 1. 서론

얼마 전 2025년 09월 16일, [Java 25 LTS 버전이 새롭게 릴리즈](https://openjdk.org/projects/jdk/25/)되었다.

회사에서 얼마 전에 Java 17 → 21로 마이그레이션을 진행하였는데, 내가 작업했던 것은 아니라서 버전 간 차이를 명확히 알지 못 하고 있는 점이 아쉬웠다.

때문에 LTS 버전이 마침 새롭게 나온 겸, 주요한 변경점은 어떤 것들이 있고 기존 LTS 버전들과 비교해서 어떤 점들에 중점을 두었는지 알아보고자 한다.

> 🧑🏻‍💻 [해당 글](https://www.baeldung.com/java-25-features)을 참고했음을 밝히며, 작성하는 과정에서 잘못된 내용이 포함되었을 수도 있다.

---

# 2. 변경점 및 개선사항

## **언어 및 컴파일러 기능 (Language & Compiler Features)**

### **📌 1. JEP 507: 패턴의 기본 타입 (Primitive Types in Patterns) (Third Preview)** - `switch` 및 `instanceof` 문에서 `int`와 같은 원시 타입을 직접 패턴 매칭할 수 있다.

해당 업데이트를 통해서, 패턴 매칭 기능을 `int, double` 과 같은 원시 타입에도 똑같이 편리하게 사용할 수 있게 되었다.

> **Before**
> 

```java
// Java 25 이전
void checkType(Object obj) {
    // 1. 참조 타입인 'Integer'인지 확인
    if (obj instanceof Integer) {
        // 2. 'int'로 사용하기 위해 직접 형변환 (unboxing)
        int i = (Integer) obj;
        System.out.println("This is an Integer, value doubled: " + (i * 2));
    } else if (obj instanceof String s) {
        System.out.println("This is a String of length: " + s.length());
    }
    // long, double 등 모든 숫자 타입에 대해 이걸 반복해야 했습니다.
}

// 테스트
checkType(100);       // "This is an Integer, value doubled: 200"
checkType("Hello");   // "This is a String of length: 5"
```

지금까지는, `instanceof, switch` 를 통한 패턴 매칭이 오직 레퍼런스 타입에서만 작동했다. 그렇기 때문에 Object 타입으로 무언가를 받게 되면, 확인하기 위해서 래퍼 클래스를, 그리고 사용하기 위해서는 형변환을 해야만 했다.

> **After**
> 

```java
// Java 25 (JEP 507)
void checkTypeWithInstanceOf(Object obj) {
    // obj가 Integer 타입이면, 자동으로 int로 언박싱되어 i에 할당됩니다.
    if (obj instanceof int i) {
        System.out.println("It's an int, value doubled: " + (i * 2));
    } else if (obj instanceof double d) {
        System.out.println("It's a double, value halved: " + (d / 2));
    } else if (obj instanceof String s) {
        System.out.println("It's a String of length: " + s.length());
    }
}

// 테스트
checkTypeWithInstanceOf(100);    // "It's an int, value doubled: 200"
checkTypeWithInstanceOf(99.8);   // "It's a double, value halved: 49.9"
```

하지만 이제는 컴파일러가 자동으로 언박싱을 처리해 준다. 그렇기에 개발자는 바로 원시타입을 패턴 매칭에 활용할 수가 있다.

```java
// Java 25 (JEP 507)
void checkTypeWithSwitch(Object obj) {
    switch (obj) {
        // obj가 Integer 타입이면, 이 case와 매칭되어 int i로 언박싱됩니다.
        case int i -> System.out.println("An int with value: " + i);
        // obj가 Long 타입이면, 이 case와 매칭되어 long l로 언박싱됩니다.
        case long l -> System.out.println("A long with value: " + l);
        // obj가 Double 타입이면, 이 case와 매칭되어 double d로 언박싱됩니다.
        case double d -> System.out.println("A double with value: " + d);
        case String s -> System.out.println("A String: " + s);
        default -> System.out.println("Something else.");
    }
}

// 테스트
checkTypeWithSwitch(100);
checkTypeWithSwitch(123456789L);
checkTypeWithSwitch(3.14);
checkTypeWithSwitch("Java 25");
```

이는 위처럼 `switch` 문에서도 굉장히 유용하게 활용할 수가 있다.

### **📌 2. JEP 511: 모듈 가져오기 선언 (Module Import Declarations) (Preview)** - 기존 `import` 문과 유사하게 `import module` 구문을 사용하여 모듈 종속성을 선언할 수 있어 가독성을 높인다.

> **Before**
> 

```java
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.stream.XMLInputFactory;
// ... java.xml 모듈의 여러 클래스를 개별적으로 import
```

> **After**
> 

```java
// 'java.xml' 모듈 전체를 가져오면, 해당 모듈이 외부에 공개(export)하는
// 모든 패키지의 클래스를 바로 사용할 수 있습니다.
import module java.xml;

// 이제 개별 import 없이 바로 사용 가능
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
// ...
```

위처럼 모듈 전체를 가져와서 이용할 수가 있다. 이를 통해서 import 부분을 간결하게 유지할 수가 있다.

> **주의할 점: 이름 충돌**
> 

```java
import module java.base; // java.util.Date가 포함된 모듈
import module java.sql;  // java.sql.Date가 포함된 모듈

public class DateExample {
    public void test() {
        // 컴파일 에러! 컴파일러는 Date가 java.util.Date인지
        // java.sql.Date인지 알 수 없습니다.
        Date myDate = new Date();
    }
}
```

하지만 이런식으로 다른 모듈 내에 같은 클래스명이 포함되어 있어서 충돌이 발생할 수 있으므로, 무분별 하게 사용하는 것은 지양해야 한다.

### **📌 3. JEP 512: 컴팩트 소스 파일 및 인스턴스 메인 메서드** - 클래스 선언 없이 `void main()` 메서드만으로 간단한 Java 프로그램을 작성할 수 있어 학습 및 스크립팅이 용이해진다.

> **Before**
> 

```java
// Java 25 이전
// 초보자는 public, class, static, void, String[] args의 의미를
// 하나도 모른 채 그냥 외워서 따라 쳐야만 했습니다.
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

이 부분이 가장 크게 와닿았던 것 같다.

이전에는 위와 같이 메인 클래스를 만들기 위해서는, 무조건적으로 `public static void main(String[] args)` 라는 문법을 작성해야만 했다. 지금이야 어느정도 이해가 되지만, Java를 처음 접했을 때에는 무슨 의미인지도 모르고 암기를 했었다.

> **After**
> 

```java
// Java 25 (JEP 512)

void main() {
    System.out.println("Hello from Java 25!");
}
```

이제는 이렇게만 해서 손 쉽게 실행을 할 수 있다! 이로 인해서 입문자들에게 이전보다는 비교적 쉽게 다가갈 수 있는 언어가 되었다. (여전히 어려운 편이지만..)

### **📌 4. JEP 513: 유연한 생성자 본문 (Flexible Constructor Bodies) (Final)** - 생성자에서 `super()` 또는 `this()`를 첫 줄에 호출하지 않아도 되어, 유효성 검사 등의 로직을 생성자 내에서 더 유연하게 처리할 수 있다.

> **Before**
> 

```java
// 부모 클래스
class Person {
    final int age;
    Person(int age) {
        // 이 생성자가 호출되기 전에 age가 유효한지 검증하고 싶다!
        this.age = age;
    }
}

// Java 25 이전 - 자식 클래스
class Employee extends Person {
    final String name;

    Employee(String name, int age) {
        // super()가 반드시 첫 줄이어야 하므로, 여기서 age를 검증할 방법이 없다.
        // 어쩔 수 없이 static 헬퍼 메서드를 만들어서 호출하는 방식을 사용한다.
        super(validateAge(age));
        this.name = name;
    }

    // 유효성 검사를 위한 별도의 static 헬퍼 메서드 (코드가 분리되고 번거롭다)
    private static int validateAge(int age) {
        if (age < 18 || age > 67) {
            throw new IllegalArgumentException("Age must be between 18 and 67");
        }
        return age;
    }
}
```

자식 클래스에서 생성자를 만드는 경우, super()가 무조건 첫 번째 줄에 나와야 하므로 파라미터의 유효성을 확인할 때 위와 같이 static 헬퍼 메서드를 만들어서 검증해야만 했다.

> **After**
> 

```java
// 부모 클래스는 동일
class Person {
    final int age;
    Person(int age) {
        this.age = age;
    }
}

// Java 25 (JEP 513) - 자식 클래스
class Employee extends Person {
    final String name;

    Employee(String name, int age) {
        // super()를 호출하기 전에 유효성 검사를 바로 수행!
        if (age < 18 || age > 67) {
            throw new IllegalArgumentException("Age must be between 18 and 67");
        }

        // 유효성 검사를 통과한 후에 안전하게 부모 생성자를 호출한다.
        super(age);
        this.name = name;
    }
}
```

하지만 이제는 생성자 내에서 super()를 가장 먼저 호출하지 않아도 되므로, 검증 로직을 먼저 추가할 수가 있게 되었다.

## **API 개선 사항 (API Enhancements)**

### **📌 1. JEP 506: `Scoped Values` (Final)** - 가상 스레드와 함께 사용하기 좋은 경량의 불변(immutable) ThreadLocal 대안이 **정식 기능**이 되었다.

이 기능의 핵심 목표는 기존 ThreadLocal의 여러 문제점을 해결하는, 더 안전하고 예측 가능한 데이터 공유 방식을 제공하는 것이다.

- `ThreadLocal` 은 사무실의 **공용 화이트보드**에 비유할 수 있다. 누구나 쓸 수 있지만, 누가 내용을 바꾸거나 지우는 것을 잊어버리면 다음 사람이 엉뚱한 정보를 보게 될 위험이 존재한다.
- `ScopedValue` 는 봉인된 읽기 전용 메모와 같다. 특정 회의(코드 블록)에 참여한 사람들에게만 전달되고, 내용은 절대 바꿀 수 없으며, 회의가 끝나면 메모는 자동으로 파기된다.

> **Before**
> 

```java
// Java 25 이전 - ThreadLocal 사용
public class LegacyTransactionManager {

    // 누구나 접근해서 값을 바꿀 수 있는 static final 변수
    public static final ThreadLocal<String> TRANSACTION_ID = new ThreadLocal<>();

    public void processRequest() {
        String txId = "tx-" + System.nanoTime();
        TRANSACTION_ID.set(txId);
        System.out.println("Transaction started: " + txId);

        try {
            // 이 메서드 또는 여기서 호출되는 모든 하위 메서드에서
            // TRANSACTION_ID의 값을 조회하거나, 심지어 변경할 수도 있다.
            step1();
            step2();
        } finally {
            // 이 부분을 깜빡하는 순간, 메모리 누수가 발생한다!
            System.out.println("Transaction ended: " + TRANSACTION_ID.get());
            TRANSACTION_ID.remove();
        }
    }

    private void step1() {
        System.out.println("Step 1 with TX_ID: " + TRANSACTION_ID.get());
    }

    private void step2() {
        System.out.println("Step 2 with TX_ID: " + TRANSACTION_ID.get());
    }
}
```

`ThreadLocal`은 스레드별로 데이터를 저장하는 유용한 기능이었지만, 아래와 같은 고질적인 위험을 안고 있었다.

1. **가변성(Mutable)**: 스레드 로컬 변수는 언제 어디서든 `set()` 메서드로 값을 바꿀 수 있어 데이터 흐름을 예측하기 어렵다.
2. **메모리 누수 위험**: `remove()`를 명시적으로 호출하지 않으면 값이 계속 남아있게 된다. 특히 스레드 풀 환경에서는 심각한 메모리 누수를 유발하는 주범이었다.
3. **복잡한 상속**: 자식 스레드에 값을 전달하려면 `InheritableThreadLocal`을 써야 하는 등, 특히 수많은 가상 스레드가 생겨나는 환경에서는 관리가 복잡했다.

> **After**
> 

```java
// Java 25 (JEP 506) - ScopedValue 사용
import java.lang.ScopedValue;
import java.util.concurrent.Executors;

public class NewTransactionManager {

    // 불변 값을 다루는 ScopedValue. newInstance()로 생성.
    public static final ScopedValue<String> TRANSACTION_ID = ScopedValue.newInstance();

    public void processRequest() {
        String txId = "tx-" + System.nanoTime();

        // where()로 값을 바인딩하고, run()으로 실행 범위를 지정한다.
        ScopedValue.where(TRANSACTION_ID, txId)
                   .run(() -> {
                       System.out.println("Transaction started: " + TRANSACTION_ID.get());
                       step1();
                       step2();
                       // 가상 스레드를 사용한 비동기 작업도 자연스럽게 값을 공유한다.
                       try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
                           executor.submit(NewTransactionManager::asyncStep);
                       }
                   });
        // run() 블록이 끝나면 txId 값은 자동으로 소멸된다.
    }

    private void step1() {
        // isBound()로 값이 바인딩 되었는지 안전하게 확인할 수 있다.
        if (TRANSACTION_ID.isBound()) {
            System.out.println("Step 1 with TX_ID: " + TRANSACTION_ID.get());
        }
    }

    private void step2() {
        System.out.println("Step 2 with TX_ID: " + TRANSACTION_ID.get());
    }

    private static void asyncStep() {
        System.out.println("Async Step in virtual thread with TX_ID: " + TRANSACTION_ID.get());
    }
}
```

1. **불변성(Immutable)**: 값은 `where` 절에서 한번 **바인딩**되면, `run` 메서드가 실행되는 동안 절대 변경할 수 없다.
2. **자동 리소스 관리**: `run` 코드 블록이 끝나면 바인딩된 값은 **자동으로 사라진다.** `finally`나 `remove()`가 전혀 필요 없어 메모리 누수의 위험이 원천적으로 차단된다.
3. **구조적 상속**: `run` 블록 내에서 생성되는 모든 자식 스레드(특히 가상 스레드)는 부모의 `ScopedValue`를 자동으로 물려받아 사용할 수 있다.

### **📌 2. JEP 505: 구조적 동시성 (Structured Concurrency) (Fifth Preview)** - 관련된 여러 스레드를 단일 작업 단위로 처리하여 동시성 프로그래밍을 단순화한다.

이 기능의 핵심 목표는 **여러 갈래로 나뉘어 동시에 실행되는 작업들을 하나의 논리적인 단위로 묶어 관리**하는 것이다.

- `기존 방식`은 아이들에게 "방 청소 시작!"이라고 외친 뒤, 각자 알아서 하도록 내버려 두는 것과 같다. 누가 청소를 끝냈는지, 누가 하다가 다쳤는지(오류), 누가 아예 놀러 나가버렸는지(스레드 누수) 부모가 일일이 확인해야 했다.
- `구조적 동시성`은 아이들에게 "모두 함께 방 청소를 끝내기 전까지는 아무도 이 방을 나갈 수 없어!"라고 규칙을 정해주는 것과 같다. 그룹 전체가 하나의 작업 단위가 되며, 한 명에게 문제가 생기면 즉시 다른 아이들에게 청소를 멈추라고 지시할 수 있다.

> **Before**
> 

```java
// Java 25 이전
// '사용자 정보'와 '주문 정보'를 동시에 가져와서 조합하는 상황
class OldOrderService {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    // 두 작업 중 하나라도 실패하면 어떻게 될까요?
    public String getUserAndOrder() throws Exception {
        // 1. 각 작업을 개별적으로 실행 요청
        Future<String> userFuture = executor.submit(this::findUser);
        Future<String> orderFuture = executor.submit(this::fetchOrder);

        // 2. 각 작업의 결과를 따로따로 기다림
        // 만약 findUser()가 여기서 예외를 던지면, fetchOrder() 작업은
        // 백그라운드에서 불필요하게 계속 실행될 수 있다!
        String user = userFuture.get();
        String order = orderFuture.get();

        return user + " | " + order;
    }

    private String findUser() throws InterruptedException {
        Thread.sleep(100); // 가정: 0.1초 걸리는 작업
        System.out.println("사용자 찾기 성공!");
        return "UserA";
    }
    private String fetchOrder() throws InterruptedException {
        Thread.sleep(200); // 가정: 0.2초 걸리는 작업
        System.out.println("주문 가져오기 성공!");
        return "Order123";
    }
}
```

기존에는 `ExecutorService`를 사용해 여러 작업을 동시에 실행했다. 이 방식은 코드를 복잡하게 만들고 여러 위험을 내포했다.

1. **스레드 누수(Leak)**: 작업을 요청한 메인 스레드에 문제가 생겨도, 백그라운드에서 실행되던 작업들은 계속 실행될 수 있어 자원 낭비의 원인이 된다.
2. **복잡한 오류 처리**: 여러 작업 중 하나에서 오류가 발생해도 나머지 작업들은 계속 실행된다. 실패한 작업을 감지하고 나머지 작업들을 일일이 취소(`cancel()`)하는 로직을 직접 구현해야 했다.
3. **가독성 저하**: 코드의 구조와 스레드의 실제 실행 흐름이 달라 코드를 이해하고 디버깅하기 어려웠다.

> **After**
> 

```java
// Java 25 (JEP 505)
import java.util.concurrent.StructuredTaskScope;

class NewOrderService {
    // 이제 ExecutorService를 필드로 가질 필요가 없다.
    public String getUserAndOrder() throws Exception {
        // 1. 작업 단위를 정의하는 Scope를 생성
        // ShutdownOnFailure: 자식 작업 중 하나라도 실패하면 즉시 모두를 중단시키는 정책
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // 2. Scope 안에서 두 작업을 동시에 실행 (fork)
            var userTask = scope.fork(this::findUser);
            var orderTask = scope.fork(this::fetchOrder);

            // 3. 두 작업이 모두 끝날 때까지 대기 (join)
            // 이 시점에 만약 findUser()가 실패했다면, fetchOrder()는 자동으로 취소된다.
            scope.join();

            // 4. join() 후, 실패한 작업이 있었다면 예외를 던짐
            scope.throwIfFailed();

            // 이 라인에 도달했다는 것은 두 작업 모두 성공했음을 의미한다.
            return userTask.get() + " | " + orderTask.get();
        }
        // try 블록을 벗어나는 순간 scope가 닫히며 모든 것이 깔끔하게 정리된다.
    }
    // findUser(), fetchOrder() 메서드는 이전과 동일
    private String findUser() throws InterruptedException { /* ... */ return "UserA"; }
    private String fetchOrder() throws InterruptedException { /* ... */ return "Order123"; }
}
```

JEP 505는 `StructuredTaskScope`를 도입하여 이 모든 문제를 해결한다. `try-with-resources` 구문과 함께 사용되어 코드 블록과 동시성 작업의 생명주기를 일치시킨다.

1. **명확한 생명주기**: `try` 블록이 끝나면 `scope`가 자동으로 닫히고, `scope` 내에서 시작된 모든 작업(자식 스레드)은 **완료되거나 취소되는 것이 보장된다.** 때문에 스레드 누수가 원천적으로 방지된다.
2. **간결한 오류 처리**: `ShutdownOnFailure` 정책을 사용하면, 여러 작업 중 **하나라도 실패하면 나머지 모든 작업이 자동으로 취소된다.**
3. **뛰어난 가독성**: 코드가 마치 단일 스레드 코드처럼 순차적으로 읽힌다. (작업 분리 → 결과 취합 → 처리)

### **📌 3. JEP 508: Vector API (Tenth Incubator)** - 최신 CPU의 벡터 하드웨어 명령을 효율적으로 사용해 데이터 병렬 계산 성능을 극대화한다.

이 기능의 핵심 목표는 최신 CPU가 가진 `SIMD(Single Instruction, Multiple Data)` 라는 강력한 하드웨어 기능을 Java 코드에서 안정적으로 활용하는 것이다.

- `기존 방식`은 계산대 직원 한 명이 손님 한 명씩 차례대로 계산하는 것과 같다. (Scalar 연산)
- `Vector API`는 여러 개의 바코드를 동시에 스캔해서 한 번에 계산하는 **셀프 계산대 여러 대**를 동시에 사용하는 것과 같다. (Vector 연산)

즉, '하나의 명령으로, 여러 데이터를 동시에 처리'하여 데이터 집약적인 계산 속도를 극적으로 끌어올리는 기술이다.

> **Before**
> 

```java
// Java 25 이전 - 일반적인 스칼라(Scalar) 연산
// 두 개의 큰 배열 a와 b를 더해서 c에 저장하는 코드
void scalarComputation(float[] a, float[] b, float[] c) {
    for (int i = 0; i < a.length; i++) {
        // 덧셈 연산이 배열의 길이만큼 순차적으로 하나씩 실행된다.
        c[i] = a[i] + b[i];
    }
}
```

기존에는 대규모 배열 계산 같은 데이터 병렬 처리 작업을 일반적인 `for` 루프를 사용해 구현했다.

이런 코드는 JVM의 JIT 컴파일러가 알아서 최적화를 시도하기는 하지만, 성공 여부를 보장할 수 없고 코드 구조가 조금만 바뀌어도 최적화가 실패하는 등 **성능이 매우 불안정하고 예측하기 어려웠다.**

> **After**
> 

```java
// Java 25 (JEP 508) - 명시적인 벡터(Vector) 연산
import jdk.incubator.vector.*;

void vectorComputation(float[] a, float[] b, float[] c) {
    // 1. 현재 CPU 아키텍처에 가장 적합한 벡터 크기를 정의
    // (예: 256비트 SIMD를 지원하면 float 8개를 동시에 처리)
    final VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED;

    // 2. 루프를 벡터 크기(SPECIES.length())만큼 건너뛰며 실행
    for (int i = 0; i < a.length; i += SPECIES.length()) {
        // 배열 끝부분 처리를 위한 마스크 생성
        var mask = SPECIES.indexInRange(i, a.length);

        // 3. 배열의 일부를 벡터 객체로 로드
        var va = FloatVector.fromArray(SPECIES, a, i, mask);
        var vb = FloatVector.fromArray(SPECIES, b, i, mask);

        // 4. 벡터 연산 수행 (CPU는 이 한 줄을 통해 여러 개의 덧셈을 동시에 처리)
        var vc = va.add(vb, mask);

        // 5. 결과 벡터를 다시 배열에 저장
        vc.intoArray(c, i, mask);
    }
}
```

JEP 508은 개발자가 "이 부분은 벡터 연산으로 처리해 줘!"라고 JVM에게 **명시적으로 지시**할 수 있는 API를 제공한다. 코드는 조금 더 복잡하지만, 그 구조는 명확하며 **항상 안정적인 고성능을 보장한다.**

> **주의할 점: 인큐베이터 모듈**
> Vector API는 아직 열 번째 '인큐베이터' 단계에 있다. 이는 아래와 같은 의미를 가진다.


- **프로덕션 환경 사용은 권장되지 않습니다.**
- API가 향후 버전에서 **사전 공지 없이 변경되거나 제거될 수 있습니다.**
- 컴파일 및 실행 시 `-add-modules jdk.incubator.vector` 같은 특별한 플래그가 필요합니다.

### **📌 4. JEP 510: 키 유도 함수 API (Key Derivation Function API) (Final)** - PBKDF2와 같은 암호 기반 키 유도 함수를 위한 표준 API가 **정식 기능**으로 제공된다.

이 기능의 핵심 목표는 사용자의 비밀번호처럼 상대적으로 취약한 정보를, 해독하기 어려운 강력한 암호화 키로 변환하는 **'키 유도 함수(KDF)'를 위한 표준 API를 제공**하는 것이다.

> 🔒 **KDF(Key Derivation Function)란?**
>
- "password123"과 같은 간단한 비밀번호에 '솔트(salt)'라는 임의의 값을 추가하고, 수만 번 이상 해시 함수를 반복 적용하여(stretching) 복잡한 암호화 키를 만들어내는 알고리즘이다. (예: **PBKDF2**, scrypt, bcrypt)
- 이 과정은 의도적으로 느리게 만들어 무차별 대입 공격(brute-force attack)을 매우 어렵게 만든다.
</aside>

> **Before**
> 

```java
// Java 25 이전
// -> 많은 프로젝트에서 이런 기능을 직접 구현하기보다는
//    아래와 같은 외부 라이브러리를 build.gradle이나 pom.xml에 추가했습니다.
//
// implementation 'org.bouncycastle:bcprov-jdk18on:1.77'
// implementation 'org.springframework.security:spring-security-crypto:6.3.0'
```

Java에 KDF를 구현하는 기능이 없었던 것은 아니다. `SecretKeyFactory`를 사용하면 PBKDF2를 구현할 수 있었지만, API가 이 작업을 위해 특별히 설계된 것이 아니라서 직관적이지 않고 복잡하다는 단점이 존재했다.

이 때문에 많은 개발자들은 Java의 내장 API 대신, 더 사용하기 쉬운 **Bouncy Castle이나 Spring Security 같은 외부 라이브러리**에 의존하는 경우가 많았다. 비밀번호 처리라는 매우 기본적인 보안 기능을 구현하기 위해 외부 의존성을 추가해야 했던 것이다.

> **After**
> 

```java
// Java 25 (JEP 510) - 표준 API를 사용한 키 유도
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.HexFormat;

public class KeyDerivationExample {
    public SecretKey deriveKey(char[] password, byte[] salt)
            throws NoSuchAlgorithmException, InvalidKeySpecException {

        // 1. 키 생성을 위한 명세(Specification) 정의
        // (패스워드, 솔트, 반복 횟수(iteration count), 생성할 키의 길이(bit))
        // 반복 횟수가 높을수록 보안은 강력해지지만 속도는 느려집니다.
        KeySpec spec = new PBEKeySpec(password, salt, 65536, 256);

        // 2. 사용할 KDF 알고리즘의 팩토리(Factory) 인스턴스 생성
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

        // 3. 팩토리를 사용해 최종 비밀 키(SecretKey) 생성
        return factory.generateSecret(spec);
    }

    public static void main(String[] args) throws Exception {
        var example = new KeyDerivationExample();
        var password = "very-secret-password".toCharArray();
        var salt = "random-salt-123".getBytes(); // 실제로는 각 사용자마다 고유한 솔트를 사용해야 합니다.

        SecretKey derivedKey = example.deriveKey(password, salt);

        System.out.println("Algorithm: " + derivedKey.getAlgorithm());
        System.out.println("Key Format: " + derivedKey.getFormat());
        // 생성된 키 (byte array)
        System.out.println("Derived Key (Hex): " + HexFormat.of().formatHex(derivedKey.getEncoded()));
    }
}
```

JEP 510은 KDF를 Java 플랫폼의 **공식적인 표준 기능**으로 격상시켰다. 이제 개발자들은 외부 라이브러리 없이도, JDK에 내장된 안정적이고 표준화된 API를 사용해 강력한 키 유도 기능을 구현할 수 있다.

## **기타 변경 사항 (JVM, JFR 등)**

### **📌 1. JEP 503: 32비트 x86 포트 제거 (Final)** - 레거시 32비트 x86 아키텍처 지원이 **완전히 제거된다.**

이 기능의 핵심 목표는 더 이상 거의 사용되지 않는 **오래된 32비트 하드웨어 및 운영체제에 대한 지원을 공식적으로 중단**하여, OpenJDK 개발팀이 더 중요한 최신 기술에 집중할 수 있도록 하는 것이다.

> **Before**
> 

```bash
지원 환경:

- Windows (32-bit, 64-bit)
- Linux (32-bit, 64-bit)
- macOS (64-bit)
```

Java 24를 포함한 이전 버전까지, OpenJDK는 다양한 운영체제와 하드웨어 아키텍처를 지원했다. 여기에는 이제는 레거시가 된 32비트 x86 환경도 포함되어 있었다.

개발팀은 새로운 기능을 추가하거나 버그를 수정할 때마다, 이 오래된 32비트 환경에서도 코드가 문제없이 작동하는지 테스트하고 유지보수해야 하는 부담을 안고 있었다.

> **After**
> 

```bash
지원 환경:

- Windows (64-bit Only)
- Linux (64-bit Only)
- macOS (64-bit)
```

Java 25부터는 32비트 x86 아키텍처에 대한 소스 코드, 빌드 지원, 테스트가 **모두 제거된다.** 이는 JDK를 32비트 환경에 설치하거나 실행할 수 없게 됨을 의미한다.

만약 현재 운영 중인 서비스나 개발 환경이 32비트 운영체제(예: 32비트 Windows Server, 구형 32비트 Linux 배포판)에서 실행되고 있다면, 해당 시스템은 **Java 25로 업그레이드할 수 없다.**

때문에 Java 25를 사용하기 위해서는 반드시 **서버의 하드웨어와 운영체제를 모두 64비트 환경으로 먼저 마이그레이션**해야 한다.

### **📌 2. JEP 509: JFR CPU-Time 프로파일링 (Experimental)** - Java Flight Recorder(JFR)에 CPU 시간 기반 프로파일링 지원이 추가되어 성능 분석이 향상된다.

이 기능의 핵심 목표는 JFR 프로파일러에 **'CPU 시간' 측정 모드**를 추가하여, **'진짜로 CPU를 힘들게 하는' 코드가 무엇인지** 정확하게 찾아낼 수 있도록 하는 것이다.

- `기존 방식`은 요리사가 주문을 받은 순간부터 요리가 완성될 때까지 **스톱워치로 전체 시간을 재는 것**과 같다. (Wall-Clock Time) 여기에는 재료를 손질하는 시간뿐만 아니라, 오븐이 예열되길 기다리거나 식자재가 배달되길 기다리는 '대기 시간'도 모두 포함된다.
- `새로운 방식`은 요리사의 손에 센서를 달아 **오직 칼질하고, 볶고, 접시에 담는 등 '실제로 일하는' 시간만 측정**하는 것과 같다. (CPU Time)

> **Before**
> 

기존 JFR의 기본 프로파일링 방식은 '벽시계 시간(Wall-Clock Time)'을 측정했다. 이는 특정 간격(예: 10ms)마다 "지금 어떤 스레드가 무슨 메서드를 실행 중이지?"라고 확인하는 방식이다.

이 방식의 문제는 **CPU를 사용하는 시간**과 I/O를 기다리는 시간(대기 시간)을 구분하지 못한다는 점이다. 예를 들어, 데이터베이스에서 데이터를 조회하는 작업은 대부분의 시간을 네트워크 응답을 기다리는 데 사용한다.

```bash
- Method Timing -
1. com.mycompany.service.RequestHandler.handle() - 5,000 ms (100%)
    2. com.mycompany.db.DBClient.fetchData()   - 4,800 ms (96%)
        3. java.net.SocketInputStream.socketRead0() - 4,750 ms (95%)
    4. com.mycompany.logic.Processor.parseJson() - 200 ms (4%)
```

위 결과를 보면 fetchData() 메서드가 96%의 시간을 차지해서 가장 큰 병목처럼 보인다. 하지만 사실 이 시간의 대부분은 CPU가 아무 일도 하지 않고 **데이터가 오기를 기다린 시간**이다.

진짜 문제는 parseJson()일 수도 있는데, 상대적으로 시간이 적게 걸려 눈에 띄지 않는다.

> **After**
> 

JEP 509는 운영체제(OS) 수준의 타이머를 이용해 **오직 스레드가 CPU 위에서 활발하게 실행된 시간만 측정**하는 새로운 프로파일링 모드를 도입한다.

이제 개발자는 "오래 걸린 메서드"와 "CPU를 많이 쓴 메서드"를 명확하게 구분할 수 있다.

```bash
- CPU Usage -
1. com.mycompany.logic.Processor.parseJson() - 190 ms (95%)
2. com.mycompany.service.RequestHandler.handle() - 5 ms (2.5%)
3. com.mycompany.db.DBClient.fetchData()   - 5 ms (2.5%)
    4. java.net.SocketInputStream.socketRead0() - 0 ms (0%)
```

CPU 시간 기준으로 분석하니 결과가 완전히 달라졌다.

`socketRead0()`는 대기만 했으므로 CPU를 전혀 사용하지 않았고, **실제 CPU 자원을 가장 많이 소모한 범인은 `parseJson()` 메서드**였음을 명확하게 알 수 있다. 이제 개발자는 이 메서드를 최적화하는 데 집중하면 된다.

이 실험적인 기능을 활성화하려면, JFR 실행 시 아래와 같은 새로운 프로파일링 설정을 사용하면 된다.

```bash
# JFR 실행 시 CPU 프로파일링 관련 설정을 활성화 (예시)
# --enable-preview 플래그와 함께 특정 프로파일링 설정을 사용
java -XX:StartFlightRecording=filename=cpu-time.jfr,duration=10s,settings=profile --enable-preview MyApp
```

### **📌 3. JEP 519: 컴팩트 객체 헤더 (Compact Object Headers) (Final)** - 64비트 아키텍처에서 객체 헤더 크기를 줄여 메모리 공간을 절약한다.

이 기능은 64비트 JVM에서 모든 **자바 객체가 기본적으로 차지하는 헤더의 크기를 줄여**, 애플리케이션의 전체 메모리 사용량을 절감하는 최적화 작업이다.

마치 모든 택배 상자에 붙는 **운송장 스티커의 크기를 절반으로 줄이는 것**과 같으며, 상자(객체)가 수백만 개라면, 스티커(헤더) 용지 절약만으로도 엄청난 비용을 아낄 수 있다.

> **Before**
> 

<aside>

이전 64비트 JVM에서는 모든 객체가 최소 **128비트(16바이트) 크기의 헤더**를 가졌습니다. 이 헤더에는 객체의 잠금(Lock) 상태, 가비지 컬렉터(GC)가 사용하는 정보, 그리고 어떤 클래스의 인스턴스인지를 가리키는 정보(Class Pointer) 등이 포함되어 있었다.

</aside>

아주 작은 객체, 예를 들어 필드 하나 없는 `new Object()`를 만들어도, 내용물은 없는데 헤더 때문에 16바이트의 메모리를 차지했다. 수백만 개의 작은 객체가 생성되는 애플리케이션에서는 이 헤더가 차지하는 메모리만 해도 무시할 수 없는 수준이었다.

> **After**
> 

<aside>

Java 25부터는 이 헤더의 크기를 일반적인 경우 **64비트(8바이트)로 줄였다.** 객체 헤더에 정보를 더 압축적이고 효율적으로 저장하는 방식을 도입한 것이다.

</aside>

**어떻게 가능한가?**: 객체의 주소나 클래스 포인터 등을 표현할 때, 전체 64비트 주소 공간을 다 쓰지 않고 압축된 형태로 표현하는 기술(Compressed Oops and Class Pointers)을 더 적극적으로 활용하고, 헤더 레이아웃을 최적화하여 가능해졌다.

### **📌 4. JEP 521: 세대별 셰넌도어 (Generational Shenandoah) (Final)** - Shenandoah GC에 세대별 수집 기능을 추가하여 처리량 및 일시 중지 시간 성능을 개선한다.

> **Before**
> 

초기 Shenandoah GC는 '일시정지 시간(Stop the world) 최소화'라는 단 하나의 목표에 집중했다. 이를 위해 일부러 **단일 세대(Single-Generation)** 방식을 채택했다.

- **동작 방식**
    - 메모리 전체를 하나의 영역으로 보고, GC를 할 때마다 새로 생긴 객체든 오래된 객체든 **전체 힙(Heap)을 대상으로** 정리 작업을 수행했다.
    - 세대 간 객체를 복사하는 비용을 없애고, 구조를 단순화하여 GC 로직 자체를 가볍게 만들었다.
- **결과**
    - **장점:** 힙 크기에 상관없이 매우 짧고 일관된 일시정지 시간을 달성했다.
    - **단점:** 매번 전체를 확인하니 비효율적이었고, 이로 인해 GC가 사용하는 CPU 자원이 많아져, 애플리케이션의 **전체 처리량(Throughput)이 저하**될 수 있었다.

> **After**
> 

최신 Shenandoah GC는 기존의 장점인 '짧은 일시정지'는 유지하면서, 단점이었던 '처리량'을 개선하기 위해 **세대별(Generational)** 방식을 도입했다.

- **동작 방식**
    - 메모리를 Young Generation(어린 세대)과 Old Generation(오래된 세대)으로 나눈다.
    - 금방 생성되고 사라지는 대부분의 객체가 모인 **Young Generation을 집중적으로, 그리고 빠르게 청소한다.**
- **결과**
    - **장점:** 불필요한 전체 영역 스캔이 사라져 GC 효율이 급상승했고, **처리량(Throughput)이 크게 향상**되었다.
    - **결과:** 짧은 일시정지 시간과 높은 처리량, 두 마리 토끼를 모두 잡으며 G1, ZGC와 어깨를 나란히 하는 **GC로 발전했**다.

---

# 3. Java 25 LTS의 핵심 방향성

## **가. 현대적 동시성 모델의 완성**

- Java 21에서 도입된 가상 스레드를 중심으로 한 동시성 모델(Project Loom)을 안정화하고 실용성을 높이는 데 중점을 둔다.
- `Scoped Values`는 스레드 간 데이터 공유를 위한 ThreadLocal의 대안으로, 불변성을 보장하여 안정성을 높인다.
- `Structured Concurrency`는 여러 비동기 작업을 단일 단위로 묶어 오류 처리 및 생명주기 관리를 단순화한다.

## **나. 성능 최적화 및 미래 아키텍처 지원**

- JVM의 성능을 근본적으로 개선하고, 최신 하드웨어 및 클라우드 환경에 대한 지원을 강화한다.
- JFR CPU-Time 프로파일링은 성능 병목 분석의 정밀도를 높이고, 컴팩트 객체 헤더와 세대별 Shenandoah GC는 메모리 사용량을 줄이고 GC 처리량을 향상시킨다.
- 또한 AOT(Ahead-of-Time) 컴파일 관련 기반 기술을 도입하여, 향후 네이티브 이미지 생성을 통한 빠른 시작 시간과 낮은 메모리 요구사항을 목표로 하는 기반을 마련한다.

---

# 4. Java 21에서 25로 마이그레이션 시 주요 고려사항 ⚠️

## **가. 32비트 x86 아키텍처 지원 중단**

- Java 25부터 32비트 x86 환경에 대한 지원이 완전히 제거되었다.
- 현재 운영 중인 시스템이 32비트 운영체제일 경우, Java 25로 업그레이드하기 전에 반드시 64비트 환경으로의 인프라 마이그레이션이 선행되어야 한다.

## **나. 정식 기능으로 반영된 API 검토**

- 이전 버전에서 프리뷰(Preview) 상태였던 기능들이 정식 API로 포함되었다. Scoped Values, 유연한 생성자 본문 등이 이에 해당하며, 정식 버전으로 변경되는 과정에서 API 시그니처나 동작 방식이 일부 수정되었을 수 있다.
- 관련 기능을 사용한 코드는 Java 25의 공식 API 문서와 비교하여 필요한 수정을 진행해야 한다.

## **다. 실험적 기능의 프로덕션 사용 제한**

- Vector API(Incubator), 모듈 가져오기 선언(Preview) 등 일부 기능은 여전히 프리뷰 또는 인큐베이터 단계에 있다.
- 이 기능들은 프로덕션 환경에서의 사용이 권장되지 않으며, 향후 버전에서 호환성이 보장되지 않는 변경이나 제거가 발생할 수 있다. 따라서 기술 검토 및 테스트 목적으로만 제한적으로 사용하는 것이 바람직하다.

---

# 🛎️ Deep Research 문서 및 퀴즈

- **Deep Research 정리 문서:** https://docs.google.com/document/d/1VUjFqO_32EOaWl6RPFAamy0TbneJ7A26vr389oU8cFM/edit?tab=t.0
- **퀴즈 :** https://g.co/gemini/share/a419bda61816

---

# 🔗 참고한 글

- https://openjdk.org/projects/jdk/25/
- https://www.oracle.com/kr/news/announcement/oracle-releases-java-25-2025-09-16/
- https://www.baeldung.com/java-25-features
- https://kchanguk.tistory.com/173
