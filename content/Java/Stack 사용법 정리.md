---
date: 2023-09-19
tags:
  - java
  - backend
---

---

### Stack 생성

`Stack<타입> stk = new Stack<>();`

### Stack 안에 값 넣기

`stk.push(값); `

`add()`도 가능하지만, `push()`를 권장함


### Stack 크기 확인

`stk.size();`

### Stack에 특정 값 있는지 확인

`stk.contains(값)`

 
### Stack 출력 시 나올 값 확인

`stk.peek();`


### Stack 값 변경하기

`stk.set(인덱스, 값);`


### Stack 값 제거하기

`stk.remove(인덱스);`


### Stack 인덱스에 해당하는 값 확인

`stk.elementAt(인덱스);`


### Stack 특정 값이 어느 인덱스에 들었나 확인

`stk.indexOf(값);`


### Stack 값 뽑아내기

`stk.pop();`


### Stack 비우기

`stk.clear();`

 
### Stack 비었는지 확인

`stk.isEmpty();`


```java
import java.util.Stack;
public class StackExample {
    public static void main(String args[]) {
        Stack<String> stk = new Stack<>(); // stack 생성
        stk.push("철수");
        stk.push("영희");
        stk.push("미애");
        // stack 크기 확인
        System.out.println(stk.size());
        // stack에 특정 값이 있는지 확인
        String name = "영희";
        if (stk.contains(name)) System.out.println("stack 안에 " + name + "가 있습니다.");
        // stack 출력 시 값 확인
        System.out.println(stk.peek());
        // stack 값 변경하기
        stk.set(0,"길동");
        // stack 값 제거하기
        stk.remove(1);
        // stack 인덱스에 해당하는 값 확인
        System.out.println(stk.elementAt(0));
        // stack 특정 값이 어느 인덱스에 들었나 확인
        System.out.println(stk.indexOf("길동"));
        // stack 값 뽑아내기
        System.out.println(stk.pop());
        // stack 비우기
        stk.clear();
        // stack 비었는지 확인
        if (stk.isEmpty()) System.out.println("stack이 비었습니다.");
    }
}
```

(참고한 블로그: https://wakestand.tistory.com/197)
