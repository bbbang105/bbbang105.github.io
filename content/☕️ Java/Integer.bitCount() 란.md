---
date: 2024-01-26
tags:
  - java
  - backend
---

---

해당 메소드는 아래 프로그래머스 문제를 풀다가 알게 되었다.

https://school.programmers.co.kr/learn/courses/30/lessons/12911\

## 문제 설명

자연수 n이 주어졌을 때, n의 다음 큰 숫자는 다음과 같이 정의 합니다.

- 조건 1. n의 다음 큰 숫자는 n보다 큰 자연수 입니다.
- 조건 2. n의 다음 큰 숫자와 n은 2진수로 변환했을 때 1의 갯수가 같습니다.
- 조건 3. n의 다음 큰 숫자는 조건 1, 2를 만족하는 수 중 가장 작은 수 입니다.
예를 들어서 78(1001110)의 다음 큰 숫자는 83(1010011)입니다.

자연수 n이 매개변수로 주어질 때, n의 다음 큰 숫자를 return 하는 solution 함수를 완성해주세요.

우선은 정수를 이진수로 변환해주고, 이후 1의 개수를 세어 리턴해주는 메소드를 만들어 문제를 해결했었다. 코드는 다음과 같다.

## 코드

```java
public class Solution {
    public int solution(int first) {
        int firstCnt = convertToBinaryNumberAndCountNumberOne(first);
        int answer = first + 1;
        int answerCnt;

        while (true) {
            answerCnt = convertToBinaryNumberAndCountNumberOne(answer);
            if (firstCnt == answerCnt) {
                break;
            }
            answer++;
        }

        return answer;
    }

    private int convertToBinaryNumberAndCountNumberOne(int number) {
        int cnt = 0;

        while (number > 0) {
            if (number % 2 == 1) cnt++;
            number /= 2;
        }

        return cnt;
    }
}
```

## Integer.bitCount()❓

해결 후에 다른 사람들의 코드를 보다가, 다음과 같은 멋진 메소드를 발견했다.

바로 `Integer.bitCount()`라는 메소드였고, 해당 메소드를 사용하면 바로 1의 개수만을 알아낼 수 있었다.

즉, `answer = Integer.bitCount(13)` 라 하면, 13의 이진수인 `1101`에서 1의 개수인 3만을 변수에 저장하게 된다.

이것이 가능한 이유는, `Integer.bitCount()` 메소드가 `true(=1)`인 비트의 개수만을 리턴해주기 때문이다.

![](https://velog.velcdn.com/images/hsh111366/post/ac2e554a-299f-47c3-af05-3099e884bcc1/image.png)

해당 메소드를 활용하여 다음과 같이 코드를 줄일 수 있었다.

```java
public class Solution {
    public int solution(int first) {
        int firstCnt = Integer.bitCount(first);
        int answer = first + 1;

      while(true) {
        if(Integer.bitCount(answer) == firstCnt) break;
        answer++;
      }

      return answer;
    }
}
```


