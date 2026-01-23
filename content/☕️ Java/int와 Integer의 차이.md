---
date: 2023-10-09
tags:
  - java
  - backend
---

---

Python과 다르게, Java를 사용하다보면 `int`와 `Integer`를 따로 구분하여 사용할 때가 많다.

개인적인 경험으로는 변수를 선언하거나 형변환을 할 때는 `int`를, ArrayList나 HashMap을 사용할 때에는 `<Integer>`와 같이 사용했던 것 같다.

하지만 정확한 이유는 모르고 있다.

알고 쓰는 건 분명히 다르기 때문에, 한 번 정리해보고자 한다.

---

# int

`int`는 간단하게, **변수의 타입**이라고 말할 수 있다.

**변수(Variable)**은 **값을 저장할 수 있는 메모리 상 공간**이라고 정의할 수 있다.

```java
int a = 30;
char lastName = "H";
```

위의 형태에서 `a`와 `lastName`은 **변수명**이 되며, 그 앞에 있는 `int`와 `char`이 변수의 타입 `(data type == 자료형)`이 된다.

이러한 자료형은 다시 `기본형`과 `참조형`으로 나뉘는데, 여기서 `int`는 기본형에 속한다.

기본형에 속하는 자료형들은 다음과 같다.

![](https://velog.velcdn.com/images/hsh111366/post/3bedc9ff-4ddc-4f63-a161-a6613b4f9046/image.png)

# Integer

그렇다면 `Integer`는 무엇일까?

앞서 서론에서 말한 것처럼, `ArrayList`나 `HaspMap`을 선언하는 과정에서 사용이 된다.

```java
ArrayList<Integer> arrList = new ArrayList<>();

HashMap<Integer,String> map = new HashMap<>();

```

List안에 들어가는 원소의 자료형을 정해주는 것인가..? 싶기는 한데, 아직은 정확히 알 수가 없다.

## 기본형을 객체로

`int`와 같은 기본형을, 객체로 다루어야하는 경우가 있다.

1. 매개변수로 객체를 필요로 할 때

2. 기본형 값이 아닌 객체로 저장해야 할 때

3. 객체 간 비교가 필요할 때

위와 같은 경우들에서 **기본형을 객체로 다루기 위해 사용하는 클래스**들을 `래퍼 클래스 (Wrapper Class)` 라고 부른다.

즉, `Integer`는 `int`를 객체로 다룰 때 사용하는 래퍼 클래스인 것이다.

모든 기본형들은 래퍼 클래스를 생성할 수 있고, 이는 다음과 같다.

![](https://velog.velcdn.com/images/hsh111366/post/92d64d34-641d-4ee5-8337-61e5a0fff2a4/image.png)

# 정리

### int Integer

`int` : 자료형 (Primitive Type)

- 산술 연산이 가능

- `null`로 초기화 불가능

`Integer` : 래퍼 클래스 (Wrapper Class)

- `Unboxing` 하지 않는 경우, 연산 불가능

- `null`값 처리 가능

### Boxing Unboxing

`Boxing`

- Primitive Type `int` => Wrapper Class `Integer`로 변환

`Unboxing`

- Wrapper Class `Integer` => Primitive Type `int`로 변환

---

(참고한 블로그: https://velog.io/@hadoyaji)
