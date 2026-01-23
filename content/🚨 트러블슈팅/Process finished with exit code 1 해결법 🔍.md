---
date: 2023-08-01
tags:
  - backend
  - springboot
  - troubleshooting
---
Trouble Shooting

---

## 🚨 Process finished with exit code 1

Java Spring Boot 기초편을 열심히 듣고 있던 중, 애플리케이션을 실행하는 데 다음과 같은 오류가 뜨면서 실행과 동시에 종료가 됐다.

계속해서 반복되는 오류에 Chat GPT님께 공손히 질문을 드려보았다.

### 👨‍💻 Chat GPT

여러줄로 친절하게 답을 해주셨는데.. 가장 첫번째로 말했던 건

> #### 오류 메시지를 확인하세요.

였기에 콘솔을 다시 살펴보았다.

읽어보니** 이미 localhost:8080이 사용중이라 문제**가 되는 것 같았다.

생각해보니 이전에 강의를 들으면서 실행한 애플리케이션을 제대로 종료하지 않아서 포트가 그대로 배정되어 있었던 것이다.

`8080` 포트를 사용한 건 맞는데, 그럼 이걸 어떻게 종료해주어야 하는지가 문제였다.

### 💣 8080 port 사용하는 프로세스 kill 하기

서칭을 해보니 강제로 종료해주는 방법이 있었다!

CMD 창에 아래 두 명령어를 차례로 입력해주면 된다.

1. `netstat -a -o -n` 

- 그럼 아래와 같이 연결된  로컬 주소들이 주루룩 뜨게 된다.

- Kill 해야하는 port는 `8080`이기에 해당하는 `PID`를 찾아준다.


![](https://velog.velcdn.com/images/hsh111366/post/74fe68ad-6a2c-4ccf-ba4d-70e4c164b07c/image.png)

2. `taskkill /F /PID 5408`

- 위에서 찾은 `PID` 를 활용하여 입력해준다. 

- 성공적으로 종료된 것을 볼 수 있다.

![](https://velog.velcdn.com/images/hsh111366/post/2fdac285-82d2-4408-a14d-cdda19d8a605/image.png)


## 💡 느낀 점 

1. Error가 발생하면, 오류 메세지부터 잘 읽어보자...

2. 이런 부분에서 Chat GPT를 잘 사용하는 것은 좋은 듯하다.
