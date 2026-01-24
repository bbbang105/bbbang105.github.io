---
date: 2024-08-26
tags:
  - troubleshooting
  - database
---
Trouble Shooting

---

어느 날 로컬에서 돌아가던 MySQL이 접속이 끊겼다. (3306 포트)

# 에러 1

에러는 아래와 같았다.

`
 Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`

도커 컨테이너랑 이미지를 다 정리하긴 했는데.. 그거 때문일리는 없고,

이유를 모르겠어서 검색을 해보니, MySQL 자체를 제거하고 디렉토리도 제거하라고 한다.
즉, 완전히 새롭게 깔라는 것!

(참고 블로그 : https://velog.io/@hyebinnn/MySQL-%EC%97%90%EB%9F%AC-ERROR-2002-HY000-Cant-connect-to-local-MySQL-server-through-socket-tmpmysql.sock)

하라는 대로 했지만,

`brew uninstall mysql` 부분에서 아래와 같은 다른 에러가 발생했다.

# 에러2

`Error: Unexpected method 'appcast' called on Cask adoptopenjdk8.`

이 또한 찾아보았고, 아래 링크대로 alfred를 설치했지만 해결이 되지 않았다.

(참고 블로그 : https://dalpanglog.tistory.com/119)

여기서 `adoptopenjdk8`에 주목해야 하는데,
이는 `Java8` 으로 평상시라면 전혀 깔 일이 없었겠지만 현재 큐시즘에서 데보션 개선 과제를 진행 중이기에 brew로 `adoptopenjdk8`를 깔아 사용중이었다.

아마 이 때문에 자바 버전이 여러 개가 충돌하며 문제가 생긴 것으로 추정되었다.

그래서 조금 더 찾아본 결과 아래 링크를 발견했고,
`adoptopenjdk8` 패키지를 삭제하며 해결할 수 있었다!

(참고 블로그 : https://vesselsdiary.tistory.com/m/215)

![](https://velog.velcdn.com/images/hsh111366/post/23fe3b65-16f0-4709-9868-f7ed00f55a6d/image.png)

위처럼 패키지 삭제 후, mysql도 깔끔하게 삭제 후 재설치를 진행했다.

그리고 `brew services start mysql`로 실행을 하며 MySQL을 켤 수 있었다.


