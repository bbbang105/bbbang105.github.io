---
date: 2024-02-29
tags:
  - java
  - backend
---

---

자바를 사용해서 코테 문제를 풀거나 프로그래밍을 하다 보면, `배열 + 리스트` 의 역할을 할 수 있는 `ArrayList` 를 자주 사용하게 된다.

그리고 `ArrayList` 를 정렬할 때는, `Collctions.sort()` 라는 메서드를 사용하곤 하는데 여기서 `Collections` 에 대해 한 번 알아보고자 한다.

---

# Collections 클래스 

## collection, Collection, Collections? 🤔

가장 먼저 알아두어야 할 점은,

`1) collection`

`2) Collection`

`3) Collections`

이 세가지가 모두 다르다는 것이다.
대소문자만 조금씩 다른 것 같은데, 대체 어떤 점이 다른걸까?

### collection

collection은 '데이터의 집합이나 그룹'을 의미하는 `하나의 용어` 라고 할 수 있다.

이는 객체가 저장되고 반복되는 자료구조이다.

### Collection
 
맨 앞이 대문자로 바뀐 Collection은, 

`java.util.Collection` 프레임워크 내부에 있는 `Collection` 인터페이스이다.

여러 요소를 담기 위해 만들어진, `Container` 객체라고도 부를 수 있다.

하위 인터페이스로 `Set` `List` `Queue`가 있으며, 여기서 다시 `ArrayList` 로 구현할 수 있는 것이다.

### Collections

마지막으로 맨 뒤에 `s` 하나가 추가된 `Collections` 클래스는,

`java.util.Collections` , 즉 유틸리티 클래스이다.

그러므로 `Collection` 인터페이스를 이용하기 위한 클래스로 이해할 수 있고,

내부에는 `sort` `max` 등 관련된 메서드들이 들어가 있게 된다.

---

## Collections 주요 메서드 🛠️

그럼 이제 본격적으로 어떠한 메서드들이 들어있는지 알아보도록 하자.

| 메서드 | 기능 |
| :-: | :-: | 
| max| 지정된 컬렉션에서 최대 요소를 반환 (인덱스 x) |
| min| 지정된 컬렉션에서 최소 요소를 반환 (인덱스 x) |
| sort| 지정된 컬렉션을 오름차순으로 정렬 |
| shuffle| 지정된 컬렉션의 원소들을 무작위로 섞음 |
| synchronizedCollection| 지정된 컬렉션을 래핑하여 Thread-Safe한 collection 객체를 반환|
| binarySearch| 정렬된 컬렉션에서 이진 탐색 알고리즘을 사용해 지정된 객체를 검색해 인덱스를 반환  |
| frequency| 지정된 컬렉션에서 지정된 객체의 개수를 세어 반환 |
| disjoint| 2개의 컬렉션에서 공통 원소가 없는 경우 true를 반환 |
| copy| 지정된 켈렉션의 모든 요소를 새로운 컬렉션으로 복사해 반환 |
| reverse| 지정된 컬렉션에 있는 순서를 역으로 변경 (내림차순 정렬 x) |

---

## 예시

### max(), min()

최대값, 최소값을 반환한다.

``` java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        int max = Collections.max(list); // 최대값
        System.out.println("MAX : " + max);
        
        int min = Collections.min(list); // 최소값
        System.out.println("MIN : " + min);
    }
}

```

![](https://velog.velcdn.com/images/hsh111366/post/91d87756-b662-4710-ac78-0eea190fc43f/image.png)

---

### sort(), reverseOrder(), shuffle()

`sort()` 를 통해 오름차순으로 정렬한다.

`reverseOrder()` 를 내부 인자로 넣어주면, 내림차순으로도 정렬할 수 있다.

`shuffle()`을 통해 내부 원소들을 섞어줄 수 있다.

``` java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));

        Collections.shuffle(list); // 무작위로 섞음
        System.out.println("SHUFFLE : " + Arrays.toString(list.toArray()));
        
        Collections.sort(list); // 오름차순 정렬
        System.out.println("ASC : " + Arrays.toString(list.toArray()));

        Collections.sort(list, Collections.reverseOrder()); // 내림차순 정렬
        System.out.println("DESC : " + Arrays.toString(list.toArray()));
    }
}
```

![](https://velog.velcdn.com/images/hsh111366/post/950e42af-4b7c-4d0f-8617-99523bcb68e5/image.png)

---

### binarySearch()

지정된 객체를 이진 탐색을 통해 찾아 인덱스를 반환한다.

단, 여기서 컬렉션은 정렬된 상태여야 한다.

``` java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));

        int index = Collections.binarySearch(list, 3); // 이진 탐색
        System.out.println("INDEX : " + index);
    }
}

```

![](https://velog.velcdn.com/images/hsh111366/post/cfa96a27-9abc-405c-aef1-dd664a0f19dc/image.png)

정렬된 상태에서는 올바르게 인덱스가 나오지만,

![](https://velog.velcdn.com/images/hsh111366/post/d823c937-dc8b-451d-aac3-3ebe36689565/image.png)

그렇지 않은 상태에서는 위와 같이 올바른 인덱스를 반환하지 못함을 볼 수 있다.

---

### frequency()

인자로 넣어준 객체의 개수를 반환해준다.

``` java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);
        
        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));

        int cnt = Collections.frequency(list, 1); // 개수 세어줌
        System.out.println("CNT : " + cnt);
    }
}
```

![](https://velog.velcdn.com/images/hsh111366/post/f7340576-753c-4612-9aa6-8dd6123aa7a6/image.png)

---

### disjoint()

두 컬렉션의 원소들 중 공통된 것이 없으면, `true` 를 반환한다.

```java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        List<Integer> other = new ArrayList<>();
        for (int i = 11; i <= 20; i++) other.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));
        System.out.println("OTHER : " + Arrays.toString(other.toArray()));

        boolean disjoint = Collections.disjoint(list, other); // 서로소 집합 여부
        System.out.println("DISJOINT : " + disjoint);
    }
}
```

![](https://velog.velcdn.com/images/hsh111366/post/a2e32f52-3ac3-48fb-8dfc-f736f8d2e43d/image.png)

---

### copy(복사 대상, 복사될 리스트)

지정된 컬렉션을 복사해서 새로운 컬렉션으로 반환한다.

하지만 여기서 주요한 점은, 두 컬렉션의 크기 `size` 가 같아야만 한다는 것이다.

```java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        List<Integer> other = new ArrayList<>();
        for (int i = 11; i <= 20; i++) other.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));
        System.out.println("OTHER : " + Arrays.toString(other.toArray()));

        List<Integer> copyList = new ArrayList<>(list.size());
        Collections.copy(copyList, list); // 리스트 복사
        System.out.println("COPY_LIST : " + Arrays.toString(copyList.toArray()));
    }
}
```

그래서 위와 같이 사이즈를 미리 지정해서 리스트를 새롭게 만든 후에 복사를 진행한다.

그러나 그럼에도 다음과 같은 에러가 발생한다.

![](https://velog.velcdn.com/images/hsh111366/post/b0a77f83-e23f-4f29-acd2-b1d999e43fe3/image.png)

왜냐하면, 초기 리스트를 생성할 때 지정해주는 것은 `capacity` 일 뿐이고, 실제로 원소가 들어 있는 개수가 `size` 이기 때문이다.

즉, 실제 들어 있는 원소의 개수가 동일한 두 리스트에 대해서만 `copy` 메소드를 정상적으로 사용할 수 있다는 것이다.

```java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        List<Integer> other = new ArrayList<>();
        for (int i = 11; i <= 20; i++) other.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));
        System.out.println("OTHER : " + Arrays.toString(other.toArray()));

        Collections.copy(other, list); // 리스트 복사
        System.out.println("COPY_LIST : " + Arrays.toString(other.toArray()));   
    }
}
```

그렇기에 이미 동일하게 10개의 원소가 들어있던 `other` 리스트로 진행을 하니,

![](https://velog.velcdn.com/images/hsh111366/post/1afa6bd2-7bad-496c-ba69-769987e14e90/image.png)

잘 복사가 되는 모습을 볼 수 있다.

이러한 제한점과 더불어 얕은 복사에 그친다는 단점이 있기 때문에, 유용하게 사용하기는 조금 어려울 듯 하다.

---

### reverse()

지정된 컬렉션의 원소를 역순으로 변경해준다.

```java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);
        
        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));

        Collections.shuffle(list); // 무작위로 섞음
        System.out.println("SHUFFLE : " + Arrays.toString(list.toArray()));

        Collections.reverse(list); // 역순으로 변경
        System.out.println("REVERSE : " + Arrays.toString(list.toArray()));
    }
}

```


![](https://velog.velcdn.com/images/hsh111366/post/ba0ea9e1-632c-464b-a4cd-c45be27c8138/image.png)

위처럼 단순히 원소들을 역순으로 변경해주는 모습을 볼 수 있다.

```java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        List<Integer> other = new ArrayList<>();
        for (int i = 11; i <= 20; i++) other.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));

        Collections.shuffle(list); // 무작위로 섞음
        System.out.println("SHUFFLE : " + Arrays.toString(list.toArray()));

        Collections.sort(list); // 오름차순 정렬
        Collections.reverse(list); // 역순으로 변경
        System.out.println("REVERSE : " + Arrays.toString(list.toArray()));
    }
}

```

![](https://velog.velcdn.com/images/hsh111366/post/a3238f78-e764-432d-b090-5d4ccb6802f6/image.png)

이런식으로 `sort` 와 `reverse`를 둘 다 사용해서, 내림차순 정렬을 할 수도 있다.

---

# 전체 코드 🧑🏻‍💻

```java
import java.util.*;

public class collections {
    public static void main(String args[]) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 10; i++) list.add(i);

        List<Integer> other = new ArrayList<>();
        for (int i = 11; i <= 20; i++) other.add(i);

        System.out.println("ORIGIN : " + Arrays.toString(list.toArray()));
        System.out.println("OTHER : " + Arrays.toString(other.toArray()));

        boolean disjoint = Collections.disjoint(list, other); // 서로소 집합 여부
        System.out.println("DISJOINT : " + disjoint);

        Collections.copy(other, list); // 리스트 복사
        System.out.println("COPY_LIST : " + Arrays.toString(other.toArray()));

        Collections.shuffle(list); // 무작위로 섞음
        System.out.println("SHUFFLE : " + Arrays.toString(list.toArray()));

        int max = Collections.max(list); // 최대값
        System.out.println("MAX : " + max);

        int min = Collections.min(list); // 최소값
        System.out.println("MIN : " + min);

        int cnt = Collections.frequency(list, 1); // 개수 세어줌
        System.out.println("CNT : " + cnt);

        Collections.sort(list); // 오름차순 정렬
        System.out.println("ASC : " + Arrays.toString(list.toArray()));

        Collections.sort(list, Collections.reverseOrder()); // 내림차순 정렬
        System.out.println("DESC : " + Arrays.toString(list.toArray()));

        Collections.reverse(list); // 역순으로 변경
        System.out.println("REVERSE : " + Arrays.toString(list.toArray()));

        int index = Collections.binarySearch(list, 3); // 이진 탐색
        System.out.println("INDEX : " + index);
    }
}
```

---

*참고 블로그*
- https://velog.io/@sw_smj/Java-Collections-%ED%81%B4%EB%9E%98%EC%8A%A4#collection-vs-collection-vs-collections

- https://velog.io/@gillog/Collections-%ED%81%B4%EB%9E%98%EC%8A%A4
