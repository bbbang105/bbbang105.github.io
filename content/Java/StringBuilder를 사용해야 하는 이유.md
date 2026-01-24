---
date: 2023-10-01
tags:
  - java
  - backend
---

---

얼마 전 프로그래머스에서 문자열을 갖고 노는 문제를 풀고 있었는데, 문자열을 합하는 과정에서 `+`를 사용하니 `시간초과`가 발생했다.

그래서 답을 찾아본 후 `StringBuilder`라는 방법을 사용하니, 넉넉한 시간으로 통과할 수 있었다. 대체 어떤 차이점 때문에 이런 것일까?

# String 객체는 변경 불가능

말 그대로 `Java`에서는 `String` 객체가 변경 불가능하기 때문에, `+`를 사용하여 새로운 문자열을 만들어내기 위해서는 아예 새로운 객체를 생성해야 한다. 

그리고 이 과정에서 사용된 기존 두 문자열들은 가비지 컬렉터로 들어가게 된다.

만약 합하는 과정이 적다면 큰 문제는 되지 않겠지만, 많은 수가 될수록 메모리를 기하급수적으로 잡아먹게 된다.

그렇기 때문에, 변경 가능한 문자열을 생성해주는 `StringBuilder`를 사용하는 것이다.

# StringBuilder

프로그래머스 숫자 짝꿍 문제를 예로 들어서 설명해보겠다.

https://school.programmers.co.kr/learn/courses/30/lessons/131128

```java
class 숫자짝꿍 {
    public String solution(String X, String Y) {
        StringBuilder answer = new StringBuilder();
        int[] x = {0,0,0,0,0,0,0,0,0,0};
        int[] y = {0,0,0,0,0,0,0,0,0,0};

        for (int i = 0; i < X.length(); i++) {
            x[X.charAt(i) - 48] += 1;
        }
        for (int i = 0; i < Y.length(); i++) {
            y[Y.charAt(i) - 48] += 1;
        }
        for (int i = 9; i >= 0; i-- ) {
            for (int j = 0; j < Math.min(x[i],y[i]); j++) {
                answer.append(i);
            }
        }
        if ("".equals(answer.toString())) {
            return "-1";
        } else if (answer.toString().charAt(0) == 48) {
            return "0";
        } else {
            return answer.toString();
        }
    }
}
```

`StringBuilder`를 사용하여 `answer` 객체를 만들어 주었다.

```java
StringBuilder answer = new StringBuilder();
```

이제부터 `answer`에는 `append`를 사용하여 문자열을 추가해줄 수 있다.

``` java
answer.append(i);
```

또한 현재 `i`는 정수임에도, 문자열로 자동 변환되어 들어감을 확인할 수 있다.

주의해야할 점은, `StringBuilder`와 `String`은 다르기에, 비교를 위해서는 `toString()`을 사용하여 변환해주어야 한다.

```java
if ("".equals(answer.toString()))
```

이런 방식으로 메모리 낭비 없이 간편하게 문자열을 변경할 수 있다.

## StringBuilder 메소드

- `append()` : 문자열 추가

- `insert(i,str)` : `i` 위치에 `str` 삽입

- `delete(start,end)` : `start`부터 `end - 1`까지 삭제

- `deleteCharAt(i)` : `i` 위치 삭제

- `toString()` : 문자열로 변환

- `reverse()`: 문자 전체 뒤집기

- `setCharAt(i,str)` : `i` 위치 문자열 `str`로 변경

---

**참고한 블로그**

- https://da2uns2.tistory.com/entry/Java-StringBuilder-%EC%82%AC%EC%9A%A9%EB%B2%95%EA%B3%BC-%EC%A3%BC%EC%9A%94-%EB%A9%94%EC%86%8C%EB%93%9C

- https://onlyfor-me-blog.tistory.com/317
