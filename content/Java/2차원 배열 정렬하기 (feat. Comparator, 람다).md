---
date: 2023-10-07
tags:
  - java
  - backend
---

---

프로그래머스 문제를 풀다보니, 2차원 String 배열을 정렬해야하는 일이 생겼다.

1차원 배열이야 간단히 `Arrays.sort`를 통해 해결할 수 있지만, 2차원은 조금 더 복잡하기에 기록하고자 한다.

# 2차원 배열 정렬

문제와 나의 코드는 다음과 같다.

https://school.programmers.co.kr/learn/courses/30/lessons/12915

```java
import java.util.Arrays;
import java.util.Comparator;

class Solution {
    public String[] solution(String[] strings, int n) {
        String[] answer = new String[strings.length];
        String[][] arr = new String[strings.length][2];
        // 2차원 배열 생성
        for (int i = 0; i < strings.length; i++) {
            arr[i][0] = "" + strings[i].charAt(n);
            arr[i][1] = strings[i];
        }
        // 정렬
        Arrays.sort(arr, new Comparator<String[]>() {
            @Override
            public int compare(String[] o1, String[] o2) {
                if (o1[0].contentEquals(o2[0])) {
                    return o1[1].compareTo(o2[1]);
                } else {
                    return o1[0].compareTo(o2[0]);
                }
            }
        });
        // 원래 문자열만 넣어줌
        for (int i = 0; i < arr.length; i++) {
            answer[i] = arr[i][1];
        }
        return answer;
    }
}
```

- 정렬 부분을 보면 알 수 있듯이 `Comparator`를 사용해주어야 하고, `compare` 메소드를 오버라이딩하여 사용할 수 있다.

- 각 배열간의 비교를 하는 것이기에, `<String[]>`이 타입값이 된다.

- 인덱스가 0인 원소가 동일할 수 있기 때문에, 같다면 인덱스가 1인 원소간 비교를 통해서 정렬을 진행한다.

- 내림차순 정렬을 하고 싶은 경우에는, `o1`과 `o2`의 순서만 바꾸어 간단하게 구현할 수 있다.

## 2차원 String 배열 정렬 코드

### 오름차순

```java
Arrays.sort(arr, new Comparator<String[]>() {
    @Override
    public int compare(String[] o1, String[] o2) {
        if (o1[0].contentEquals(o2[0])) {
            return o1[1].compareTo(o2[1]);
        } else {
            return o1[0].compareTo(o2[0]);
        }
    }
});
```
### 내림차순

```java
Arrays.sort(arr, new Comparator<String[]>() {
    @Override
    public int compare(String[] o1, String[] o2) {
        if (o1[0].contentEquals(o2[0])) {
            return o2[1].compareTo(o1[1]);
        } else {
            return o2[0].compareTo(o1[0]);
        }
    }
});
```

## 2차원 int 배열 정렬 코드

### 오름차순

```java
Arrays.sort(arr, new Comparator<int[]>() {
    @Override
    public int compare(int[] o1, int[] o2) {
        return o1[0] - o2[0]; // 인덱스 0 원소로 정렬
    }
});
```

### 내림차순

```java
Arrays.sort(arr, new Comparator<int[]>() {
    @Override
    public int compare(int[] o1, int[] o2) {
        return o2[0] - o1[0]; // 인덱스 0 원소로 정렬
    }
});
```

### 오름차순 (람다)

```java
Arrays.sort(arr, (o1,o2) -> o1[0] - o2[0]);
```

### 내림차순 (람다)

```java
Arrays.sort(arr, (o1,o2) -> o2[0] - o1[0]);
```

---

2차원 배열과 정렬은 자주 쓰일 것 같으니 기억해두자!
