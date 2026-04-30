---
date: 2024-07-05
description: Effective Java의 toString 재정의 원칙과 Cloneable/clone의 주의사항을 정리합니다.
tags:
  - books
  - backend
  - java
---

---

# 📌 Item 12. toString을 항상 재정의하라

## 1. toString 규약

- Object의 기본 `toString` 메서드는 우리가 보고 싶은 문자열을 반환해주지 않음
  - ex) `클래스_명@16진수로_표현한_해시코드` 
  - 이는 간결하지만, 유익한 정보라고 하기는 어려움
  - `010-5892-6693` 과 같은 형태가 훨씬 유익한 형태라 할 수 있음

>`toString`의 일반 규약 : "**간결하면서도 사람이 읽기 쉬운 형태의 유익한 정보**를 반환하라."

=> 때문에 모든 하위 클래스에서 `toString` 메서드를 **재정의**해야 함

## 2. toString을 잘 구현(= 재정의) 해야 하는 이유

- 이를 잘 구현했다면, 사용하기에 훨씬 용이하고 디버깅하기가 좋아짐
- `toString` 메서드는 객체를 `printf`, `println`, `+`, `assert` 구문에 넘길 때, 또는 디버거가 객체를 출력할 때 자동으로 호출됨
- 그렇기에 메서드를 잘 구현했다면, 아래 코드만으로도 문제를 진단하기에 충분한 메시지를 남길 수 있음

```java
System.out.println(phoneNumber + "에 연결할 수 없습니다.");

// 예상 결과 값 : 010-5892-6693에 연결할 수 없습니다.
```
- 대개 실전에서는, `toString` 메서드가 객체의 주요 정보를 모두 반환하게 하도록 하는 것이 좋음
  - **객체가 거대**하거나 **문자열로 표현하기에 적합하지 않을 시**에는 예외

## 3. 반환값의 포맷을 문서화할 것인가?

- `toString` 을 구현할 때는 반환값의 포맷을 문서화할 지 결정해야 함
  - 전화번호나 행렬 같은 값 클래스라면 문서화하기를 권장
- 포맷을 명시하기로 결정했다면, 포맷에 맞는 문자열과 객체를 상호 전환할 수 있는 `정적 팩터리`나 `생성자`를 함께 제공해주면 좋음
  - `BigInteger`, `BigDecimal` 과 같은 대부분의 기본 타입 클래스가 이러한 방식을 따름
- 포맷을 한 번 명시에 하게 되면, 계속해서 해당 포맷에 맞춰야 한다는 점이 단점으로 작용할 수도 있음
  - 만약 이후 릴리스에서 포맷 자체가 변경된다면, 이에 따랐던 모든 코드와 데이터들이 엉망이 될 것임

> 결론적으로, 포맷을 명시하느냐 마느냐는 개인의 선택이며, **중요한 것은 의도를 명확히 밝히는 것임**

### 가. 포맷을 명시한 경우

```java
public class PhoneNumber {
    private final int areaCode;
    private final int prefix;
    private final int lineNumber;

    public PhoneNumber(int areaCode, int prefix, int lineNumber) {
        this.areaCode = areaCode;
        this.prefix = prefix;
        this.lineNumber = lineNumber;
    }

    /**
     * 이 전화번호의 문자열 표현을 반환합니다.
     * 문자열은 "XXX-YYY-ZZZZ" 형식입니다.
     * XXX는 지역 코드, YYY는 프리픽스, ZZZZ는 가입자 번호입니다.
     * 각각의 대문자는 10진수 숫자 하나를 가리킵니다.
     * 
     * @return 이 전화번호의 문자열 표현
     */
    @Override
    public String toString() {
        return String.format("%03d-%03d-%04d", areaCode, prefix, lineNumber);
    }

    /**
     * 문자열 표현으로부터 PhoneNumber 객체를 생성합니다.
     * 문자열은 "XXX-XXX-XXXX" 형식이어야 합니다.
     *
     * @param phoneNumber 전화번호의 문자열 표현
     * @return PhoneNumber 객체
     * @throws IllegalArgumentException 문자열이 올바른 형식이 아닌 경우
     */
    public static PhoneNumber fromString(String phoneNumber) {
        String[] parts = phoneNumber.split("-");
        if (parts.length != 3) {
            throw new IllegalArgumentException("잘못된 전화번호 형식");
        }
        int areaCode = Integer.parseInt(parts[0]);
        int prefix = Integer.parseInt(parts[1]);
        int lineNumber = Integer.parseInt(parts[2]);
        return new PhoneNumber(areaCode, prefix, lineNumber);
    }
}
```

### 나. 사용 예시

```java
public class Main {
    public static void main(String[] args) {
        PhoneNumber phoneNumber = new PhoneNumber(123, 456, 7890);
        String phoneString = phoneNumber.toString();
        System.out.println("Phone number as string: " + phoneString);

        PhoneNumber parsedPhoneNumber = PhoneNumber.fromString(phoneString);
        System.out.println("Parsed phone number: " + parsedPhoneNumber);
    }
}

// 예상 결과 값
// Phone number as string: 123-456-7890
// Parsed phone number: 123-456-7890
```

## 4. 반환값에 포함된 정보를 얻어올 수 있는 API를 제공하자

- 위의 예시에서, PhoneNumber 객체는 지역 코드 `area`, 프리픽스 `prefix`, 가입자 번호 `lineNumber` 용 접근자를 제공해주어야 함
- 그렇지 않다면, 객체에서 직접 파싱을 해야 하는데 이는 성능 상 좋지 않고 필요하지도 않은 작업임
  - 또한 향후 포맷을 바꾸게 되었을 때 시스템이 망가질 우려도 존재함

```java
    /**
     * 지역 코드를 반환합니다.
     *
     * @return 지역 코드
     */
    public int getAreaCode() {
        return areaCode;
    }

    /**
     * 프리픽스를 반환합니다.
     *
     * @return 프리픽스
     */
    public int getPrefix() {
        return prefix;
    }

    /**
     * 라인 번호를 반환합니다.
     *
     * @return 라인 번호
     */
    public int getLineNumber() {
        return lineNumber;
    }
```
- 그렇기에 이러한 접근자를 제공해 주어 코드 가독성 및 유지 보수성을 높이고, 버그를 줄일 수 있음

## 5. 정리

> 🧑🏻‍💻 모든 구체 클래스에서 `toString` 메서드를 재정의하자. 상위 클래스에서 이미 알맞게 재정의했다면 하지 않아도 된다.
> `toString` 메서드를 잘 정의한다면 사용하기에도 좋고 디버깅에도 효과적이다.
> `toString` 메서드는 해당 객체에 관한 명확하고 유용한 정보를 읽기 좋은 형태로 반환하는 데 목적을 두어야 한다.

---

# 📌 Item 13. clone 재정의는 주의해서 진행하라

## 1. Cloneable 의 한계

- `Cloneable` 은 복제해도 되는 클레스임을 명시하는 용도의 믹스인 인터페이스이지만, 아쉽게도 의도한 목적으르 제대로 이루지 못 함
- 가장 큰 문제는 `clone` 메서드가 선언된 곳이 `Cloneable` 이 아닌 `Object` 이고, 그마저도 `protected` 이기에 외부 객체에서 `clone` 메서드를 호출할 수 없음
- 하지만 이러한 문제점에도, `Cloneable` 방식은 널리 쓰이고 있기 때문에 알아두면 유용함

## 2. Cloneable 인터페이스가 하는 일

- 해당 인터페이스에서는 놀랍게도 `Object` 의 `protected` 메서드인 `clone` 의 동작 방식을 결정함
  - 인터페이스를 구현한다는 것은, 일반적으로 해당 클래스가 그 인터페이스에서 정의한 기능을 제공한다고 선언하는 행위임
  - 그러나 `Cloneable` 경우에는 상위 클래스에 정의된 `protected` 메서드의 동작 방식을 변경하므로, 상당히 이례적인 방식임
- 실무에서 `Cloneable` 을 구현한 클래스는 `clone` 메서드를 `public` 으로 제공하며, 사용자는 당연히 복제가 제대로 이루어지리라 기대함
  - 이러한 기대를 만족시키기 위해서는, 해당 클래스 및 모든 상위 클래스는` 1) 복잡하고 2) 강제할 수 없고 3) 허술하게 기술된` 프로토콜을 지켜야 함
  - 그렇게 되면 `1) 깨지기 쉽고 2) 위험하고 3) 모순적인 메커니즘`이 탄생함 -> 생성자를 호출하지 않고도 객체 생성이 가능하기 때문

## 3. 가변 상태를 참조하지 않는 클래스용 `clone` 메서드

- 제대로 동작하는 clone 메서드를 가진 상위 클래스를 상속해 `Cloneable` 인터페이스를 구현했다고 가정
- 여기서 `super.clone` 을 호출하여 얻은 객체는 원본의 완벽한 복제본임
  - 클래스에 정의된 모든 필드는 원본 필드와 똑같은 값을 가짐
- 만약 모든 필드가 기본 타입이거나 불변 객체를 참조한다면, 이미 완벽히 원하는 상태이므로 더이상 손 볼 것이 없음

> 그러나, 쓸데없는 복사를 지양한다는 관점에서 보면 불변 클래스는 굳이 `clone` 메서드를 제공하지 않는 것이 좋음

```java
@Override public PhoneNumber clone() {
    try {
        return (PhoneNumber) super.clone();
    } catch (CloneNotSupportedException e) {
      throw new AssertionError(); // 발생할 수 없는 일
    }
}
```

- `Object` 의 `clone` 메서드는 `Object` 를 반환하지만, `PhoneNumber` 의 `clone` 메서드는 `PhoneNumber` 를 반환함
  - 이를 통해서 클라이언트가 형변환 하지 않아도 됨
- `super.clone` 으로 얻은 객체를 반환하기 전에, `(PhoneNumber)` 로 형변환을 해주기에 절대 실패하지 않아, 사실상 에러 처리는 무의미함

> 이처럼 불변 객체를 참조하는 경우에는 간단하게 구현할 수 있는데, 가변 객체를 참조하게 되는 순간 여러 가지를 고려해주어야 함

## 4. 가변 상태를 참조하는 클래스용 `clone` 메서드

```java
public class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;
    
    public Stack() {
      this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }
    
  ... (생략)
  
}
```

- `elements` 배열 타입 필드를 가지고 있는 `Stack` 클래스를 복제한다고 가정
  - 이는 원본 `Stack` 와 동일한 배열을 참조하므로, 원본 or 복제본 중 하나를 수정하면 다른 하나도 수정되어 불변식을 해치게 됨
  - 때문에 가변 필드는 생성자를 호출하여 이러한 상황을 방지해야 함

> `clone` 메서드는 사실상 생성장와 동일한 효과를 냄 <br>
> 즉, `clone` 은 **원본 객체에 아무런 해를 끼치지 않는 동시에, 복제된 객체의 불변식을 보장해야 함**

- 생성자를 통해서는 빈 배열만 가지게 되므로, 제대로 동작하려면 스택 내부 정보를 복사해야 함
  - 여러 가지 방법이 있는데, 가장 쉬운 방법으로는 `elements` 배열의 `clone` 을 재귀적으로 호출해주는 것임

### 가. 배열용 clone 메서드

```java
@Override public Stack clone() {
    try {
      Stack result = (Stack) super.clone();
      result.elements = elements.clone();
      return result;
    } catch (CloneNotSupportedException e) {
      throw new AssertionError();
    }
}
```

- 여기서 `elements.clone()` 의 결과를 형변환 할 필요가 없음
  - 왜냐하면 배열의 `clone` 은 런타임 타입과 컴파일 타입 모두가 원본 배열과 똑같은 배열을 반환하기 때문
  - 따라서 배열을 복제할 때는 `clone` 메서드를 사용하는 것이 권장되며, 사실상 배열이 `clone` 기능을 제대로 사용하는 유일한 예임

### 나. 해시테이블용 clone 메서드

#### 해시테이블 클래스
```java
public class HashTable implements Cloneable {
    private Entry[] buckets = ...;
    
    private static class Entry {
        final Object key;
        Object value;
        Entry next;

      Entry(Object key, Object value, Entry next) {
          this.key = key;
          this.value = value;
          this.next = next;
      }
    }
    
  ... (생략)
  
}
```

#### 잘못된 clone 메서드

```java
@Override public HashTable clone() {
    try {
      HashTable result = (HashTable) super.clone();
      result.buckets = buckets.clone();
      return result;
    } catch (CloneNotSupportedException e) {
      throw new AssertionError();
    }
}
```

- 복제본은 고유한 버킷 배열을 가지지만, 해당 배열은 원본과 같은 연결 리스트를 참조하기에 문제가 발생할 수 있음
  - 이를 해결하기 위해서는 각 버킷을 구성하는 연결 리스트를 복사해야 함

#### 해시테이블 클래스에 deepCopy() 메서드 추가
```java
public class HashTable implements Cloneable {
    private Entry[] buckets = ...;
    
    private static class Entry {
        final Object key;
        Object value;
        Entry next;

        Entry(Object key, Object value, Entry next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
        
        // 엔트리가 가리키는 연결 리스트를 재귀적으로 복사
        Entry deepCopy() {
            return new Entry(key, value,
                    next == null ? null : next.deepCopy());
        }
    }

  @Override public HashTable clone() {
    try {
      HashTable result = (HashTable) super.clone();
      result.buckets = new Entry[buckets.length]; // 새로운 엔트리 배열 생성
      for (int i = 0; i < buckets.length; i++) {
        if (buckets[i] != null) {
          result.buckets[i] = buckets[i].deepCopy(); // 연결 리스트까지 복사
        }
      }
      return result;
    } catch (CloneNotSupportedException e) {
      throw new AssertionError();
    }
  }
}
```

- HashTable의 `clone` 메서드는 먼저 적절한 크기의 새로운 버킷을 할당함
- 버킷 배열을 순회하며 비지 않은 각 버킷에 대해서 깊은 복사를 수행함
  - Entry의 `deepCopy()` 메서드는 **자신이 가리키는 연결 리스트 전체를 복사하기 위해 자신을 재귀적으로 호출함**
- 하지만 재귀 호출 때문에 리스트의 원소 수만큼 스택 프레임을 소비하여, **리스트가 길면 `스택 오버플로우`가 일어날 우려가 존재함**
  - 때문에 이를 피하기 위해서 재귀 호출 대신, **`반복자`를 써서 순회하는 방향으로 수정해야 함**

#### 엔트리 자신이 가리키는 연결 리스트를 반복적으로 복사하도록 구현
```java
Entry deepCopy() {
    Entry result = new Entry(key, value, next);
    for (Entry p = result; p.next != null; p = p.next) {
        p.next = new Entry(p.next.key, p.next.value, p.next.next);
    }
    return result;
}
```

## 5. 상속용 클래스는 Cloneable 을 구현해서는 안된다

- 하위 클래스에서 `clone` 을 재정의할 수도 있기에, 아래와 같이 상위 클래스에서 `clone` 을 퇴화시켜 방지할 수 있음

```java
@Override
protected final Object clone() throws CloneNotSupportedException { // final로 선언
    throw new CloneNotSupportedException();
}
```

## 6. 복사 생성자와 복사 팩터리

- `cloneable` 방식은 대체로 복잡하기 때문에, 복제에서는 복사 생성자와 복사 팩터리를 사용하는 것이 권장됨

### 가. 복사 생성자

```java
public class Person {
  private String name;
  private int age;

  // 일반 생성자
  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  // 복사 생성자
  public Person(Person other) {
    this.name = other.name;
    this.age = other.age;
  }

  @Override
  public String toString() {
    return name + " (" + age + ")";
  }
}
```

```java
public static void main(String[] args) {
    Person original = new Person("John", 30);
    Person copy = new Person(original); // 복사 생성자 사용

    System.out.println(original); // John (30)
    System.out.println(copy);     // John (30)
}
```

- `복사 생성자` : 기존 객체를 받아서 새로운 객체를 생성하는 생성자

### 나. 복사 팩터리

```java
public class Person {
  private String name;
  private int age;

  // 일반 생성자
  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  // 복사 팩터리 메서드
  public static Person copyOf(Person other) {
    return new Person(other.name, other.age);
  }

  @Override
  public String toString() {
    return name + " (" + age + ")";
  }
}
```

```java
public static void main(String[] args) {
    Person original = new Person("John", 30);
    Person copy = Person.copyOf(original); // 복사 팩터리 사용

    System.out.println(original); // John (30)
    System.out.println(copy);     // John (30)
}
```

- `복사 팩터리` : 복사 생성자를 모방한 정적 팩터리
  - `정적 팩터리` : 객체를 생성하는 정적 메서드

### 다. 복사 생성자 & 복사 팩터리가 Cloneable/clone 방식보다 나은 점

- 언어 모순적이고 위험한 객체 생성 메커니즘 (생성자를 사용하지 않는 방식)을 사용하지 않음
- 엉성하게 문서화 된 규약에 의존하지 않음
- 정상적인 final 필드 용법과 충돌하지 않음
- 불필요한 검사 예외를 던지지 않음
- 형변환이 필요 없음
- 변환 생성자 & 변환 팩터리를 사용하면, 클라이언트가 복제본의 타입을 직접 선택할 수 있음

## 7. 정리

> 🧑🏻‍💻 새로운 인터페이스를 만들 때 절대 `Cloneable` 을 확장해서는 안되며, 새로운 클래스도 이를 구현해서는 안 된다.
> 복제 기능은 `복사 생성자`와 `복사 팩터리`를 이용하는 것이 가장 좋다.
> 단, 배열만은 `clone` 메서드 방식이 가장 깔끔하게 유용하다.
