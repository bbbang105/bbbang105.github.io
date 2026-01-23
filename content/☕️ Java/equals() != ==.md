---
date: 2023-09-18
tags:
  - java
  - backend
---

---



파이썬으로 백준을 주구장창 풀다가.. 자바로 프로그래머스를 풀고 있는 요즘

파이썬은 거의 다 직관적으로 쓰면 맞는데, 자바는 다른 경우가 많아서 골치가 아프다.

이번에도 문제를 풀다가 이상한 점을 발견했다.

분명히 인텔리제이에서 디버깅을 돌려보아도 답이 맞게 나오는데, 프로그래머스에서 테스트 케이스를 돌리면 틀린 것이었다.

![](https://velog.velcdn.com/images/hsh111366/post/5422962c-9685-4916-8dae-041dbd252540/image.png)


# 문제

프로그래머스 문제는 다음과 같았고, 
https://school.programmers.co.kr/learn/courses/30/lessons/67256

코드는 아래와 같이 작성을 하였다.

```java
class Solution {
    public static String solution(int[] numbers, String hand) {
        String answer = "";
        String[][] keypad = {{"1","2","3"},{"4","5","6"},{"7","8","9"},{"*","0","#"}};
        int[] r_start = {3,0}; int[] l_start = {3,2};

        for (int n : numbers) {
            String str = "" + n;
            boolean find = false;
            for (int i = 0; i < 4; i++) {
                for (int j = 0; j < 3; j++) {
                    if (keypad[i][j].equals(str)) {
                        if (str.equals("1") || str.equals("4") || str.equals("7")) {
                            answer += "L";
                            l_start[0] = i; l_start[1] = j;
                        } else if (str.equals("3") || str.equals("6") || str.equals("9")) {
                            answer += "R";
                            r_start[0] = i; r_start[1] = j;
                        } else {
                            int r_distance = Math.abs(i - r_start[0]) + Math.abs(j - r_start[1]);
                            int l_distance = Math.abs(i - l_start[0]) + Math.abs(j - l_start[1]);
                            if (r_distance > l_distance) {
                                answer += "L";
                                l_start[0] = i; l_start[1] = j;
                            }
                            else if (r_distance < l_distance) {
                                answer += "R";
                                r_start[0] = i; r_start[1] = j;
                            } else {
                                if (hand == "right") {
                                    answer += "R";
                                    r_start[0] = i; r_start[1] = j;
                                } else {
                                    answer += "L";
                                    l_start[0] = i; l_start[1] = j;
                                }
                            }
                        }
                        find = true;
                        break;
                    }
                }
                if (find) break;
            }
        }
        return answer;
    }
}
```

여기서 바로

```java
if (hand == "right") 
```

이 부분이 문제였던 것이다.

습관처럼 `==` 로 표시를 하였는데, 자바에서는 문자열을 `equals`로 비교하여야 한다.

간단하게 이유를 말하자면, `==`는 주소값을 비교하는 것이라 예상치 못한 오류가 발생할 수 있지만, `equals`는 데이터 자체를 가져와 비교하기 때문에 괜찮은 것이다.

# 해결

![](https://velog.velcdn.com/images/hsh111366/post/0d4d7fb4-e633-49fd-aedf-afc9d80c1e18/image.png)

저 부분만 변경을 하니, 바로 통과할 수 있었다!

앞으로는 문자열 비교시에 꼭 `equals`를 사용해야겠다는 교훈을 얻었다.

자바 재밌지만.. 조금 귀찮은 건 사실이다😂
