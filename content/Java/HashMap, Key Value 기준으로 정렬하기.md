---
date: 2023-09-27
tags:
  - java
  - backend
---

---

`Java`를 사용하다보면, `Python`의 `dictionary`와 같은 `HashMap`을 사용해야 할 일이 많다.

`Python`에서는 간단하게 정렬할 수 있지만.. 역시 우리의 `Java`는 쉽지가 않다.

다음에도 사용할 것 같으니 까먹지 않게 정리해두겠다!

# HashMap 정렬하기

우선은 `Key`들을 `ArrayList`로 변환하여 저장해준다.

`Key`로 정렬을 하려면, 바로 `sort`나 `reverse` 메소드를 사용하면 된다.

`value`로 정렬하는 데에는 여러 방법이 있지만, 개인적으로 람다함수를 사용하는 것이 깔끔하여 이 방법으로 적도록 하겠다.

`compareTo` 메소드도 사용해야 하기에, `Collections` 라이브러리를 `import`해준다.

## Key 기준 오름차순 정렬

```java
import java.util.*;

List<Integer> list = new ArrayList<>(map.keySet());
Collections.sort(list); // sort 메소드
```

## Key 기준 내림차순 정렬

```java
import java.util.*;

List<Integer> list = new ArrayList<>(map.keySet());
Collections.reverse(list); // reverse 메소드
```

## Value 기준 오름차순 정렬


```java
import java.util.*;

List<Integer> list = new ArrayList<>(map.keySet());
Collections.sort(list, (o1,o2) -> map.get(o1).compareTo(map.get(o2))); // 람다 활용

```

## Value 기준 내림차순 정렬

```java
import java.util.*;

List<Integer> list = new ArrayList<>(map.keySet());
Collections.sort(list, (o1,o2) -> map.get(o2).compareTo(map.get(o1))); // 람다 활용
``` 

---

생각보다 어렵지 않으니 잘 기억해두자!
