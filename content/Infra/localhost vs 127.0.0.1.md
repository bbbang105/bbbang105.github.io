---
date: 2025-12-14
tags:
- backend
- infra
---

---

# 🎬 서론

## 글을 작성하는 이유

웹 개발을 하다 보면, `localhost`라는 용어는 굉장히 자주 접하게 된다.

로컬 환경에서 앱을 실행하면, 보통 localhost:3000 or localhost:8080 등으로 접속하여 테스트를 진행하기 때문이다. 

만약 localhost:8080으로 앱이 열려있다면, 127.0.0.1:8080으로 접속하여도 동일하게 연결이 될 것이다.

> 그렇다면 `localhost == 127.0.0.1`인 것일까??
> 

**일반적인 경우에서는 그럴 수 있지만, 엄밀히 따지자면 둘은 완전히 다른 개념이다.**

이 둘의 차이를 명확히 알지 못 한다면, 언젠가 한 번은 이와 관련해서 `왜 안 되지?` 상황이 발생하게 될 것이다.

> 그렇기에 이번 글에서는 둘의 핵심적인 차이와 유의사항, 그리고 개념을 혼동했을 때 발생할 수 있는 문제에 대해서 다루어 보려고 한다.
> 

---

# localhost / 127.0.0.1이란?

## localhost

localhost는 특수한 도메인이라고 볼 수 있다. 도메인이란 기억하기 어려운 IP 주소를 사람이 알아보기 쉬운 이름표와 같은 역할을 한다.

> 예를 들어 `www.naver.com`로 사용자가 접속을 하게 되면, 컴퓨터는 DNS 시스템을 통해서 해당 이름표가 실제로 가리키는 IP주소(ex. 223.130.xxx.xxx)를 찾아내어 연결한다.

localhost는 `자기 자신을 가리키는 예약된 도메인 이름` 으로, [RFC 6761](https://en.wikipedia.org/wiki/Special-use_domain_name)에서 정의한 `Special-Use Domain Name`이다.

> **대표적으로 아래의 특징을 가진다.**
>
- OS가 DNS 조회 없이 직접 처리한다.
- 보통 127.0.0.1 또는 ::1(IPv6)로 해석된다.
- /etc/hosts 파일이나 OS 내부 로직에서 매핑된다.

## 127.0.0.1

> `127.0.0.1`은 **루프백(Loopback) 주소**로, 네트워크 패킷이 외부로 나가지 않고 **자기 컴퓨터 안에서 되돌아오는(loop back) 특수한 IP 주소**이다.

### 루프백 주소란?

루프백 주소는 **네트워크 통신을 테스트**하거나, **같은 컴퓨터 내에서 프로세스 간 통신**을 할 때 사용한다.

실제 네트워크 장비를 거치지 않고 OS 내부에서 처리되기 때문에, 인터넷 연결이 없어도 정상적으로 동작한다는 점이 특징이다.

```
[앱 A] → 127.0.0.1:8080 요청
    ↓
[네트워크 스택] → 외부로 안 나감, 내부에서 처리
    ↓
[앱 B (8080 리스닝)] → 응답
```

### 왜 127.0.0.1인가?

> 수많은 IP 주소 중에서 왜 127.0.0.1을 사용할까?

이는 1981년 RFC 790에서 **IPv4의 Class A 마지막 블록(127.0.0.0/8)을 루프백용으로 통째로 예약했기 때문이다.**

> 그렇기 때문에, 127.0.0.1 뿐만 아니라 127.x.x.x 대역 전체(약 1,600만 개)를 루프백 주소로 이용할 수 있다.
>
```
# 전부 자기 자신으로 돌아옴
ping 127.0.0.1
ping 127.0.0.2
ping 127.123.45.67
ping 127.255.255.254
```

당시에는 IP 주소가 고갈될 것이라는 생각을 하지 못해서 이렇게 넉넉하게 할당을 했는데, 지금은 1600만개나 할당된 것이 낭비라는 말이 있다.
어차피 로컬에서 사용할 때, `127.0.0.1:8080 / 127.0.0.1:3000` 이런식으로 포트로 구분해도 되기 때문이다.

때문에 IPv6에서는 이 실수를 반복하지 않고 `::1` 단 하나만 루프백 주소로 지정했다.

---

# 도달하는 과정(Resolution)에서의 차이

## 127.0.0.1

루프백 주소는 그대로가 IP 주소이기 때문에, 해석할 필요가 없다. 

> 앱 → "127.0.0.1:8080 연결해줘" → OS → 루프백 인터페이스 → 도착

## localhost

`localhost`는 도메인이기 때문에, 도메인 네임을 IP 주소로 해석하는 과정이 필요하다.

> 앱 → "localhost:8080 연결해줘" → OS → "localhost가 뭐지?"
    → /etc/hosts 확인 → 127.0.0.1 찾음 → 루프백 인터페이스 → 도착

## OS의 해석 우선순위

대부분의 OS는 아래 순서로 해석하게 된다.

1. /etc/hosts
2. DNS 서버

localhost의 경우에는 일반적으로 /etc/hosts 파일 내에 정의되어 있기 때문에, DNS 서버에 질의하지 않고도 바로 해석하게 된다.

```
# /etc/hosts 기본 내용
127.0.0.1   localhost
::1         localhost
```

> ⚠️ 질의하지 않고 파일에 적혀 있는 그대로 해석하기 때문에, **만약 파일 내용이 수정되면 다른 IP로 연결될 수도 있다는 점을 유의해야 한다.**

---

# localhost: IPv4 vs IPv6

`127.0.0.1`은 명시적인 IPv4주소이다. 하지만 `localhost`는 IPv4일 수도, IPv6(::1)일 수도 있다.

이러한 부분에서 이슈가 발생한 실제 사례들을 공유해보고자 한다.

## 사례 1: Node.js v17 이후 Breaking Change

> 🔗 https://github.com/nodejs/node/issues/40537

> **💡 Breaking Change?**
`기존 코드가 깨지는 변경` 이라는 뜻이다.

Node.js v17부터 localhost 해석 방식이 변경되었다. **이전에는 IPv4를 우선했지만, v17부터는 OS 설정을 따르게 되었다.**

```javascript
// 서버: IPv4로 리스닝
server.listen(3000, '127.0.0.1');

// 클라이언트: localhost로 요청
http.request('http://localhost:3000/ping');
```

- **Node v16**: 정상 동작
- **Node v17+**: `Error: connect ECONNREFUSED ::1:3000`

즉, v16까지는 Node.js에서 알아서 localhost를 127.0.0.1로 연결하였지만,
이후로는 OS에게 쿼리하게 되었고 OS에서는 IPv6를 우선 반환함으로써 위와 같은 문제가 발생한 것이다.

### 해결법

이를 해결하기 위해서,
```bash
node --dns-result-order=ipv4first app.js
```

옵션을 지정하여 IPv4를 우선하도록 정해줄 수가 있다.

또는 

```js
// AS-IS: IPv4만
server.listen(3000, '127.0.0.1');

// TO-BE: 모든 인터페이스
server.listen(3000);  // 기본값, IPv4/IPv6 둘 다 리스닝
```

와 같이 모든 인터페이스에 대해서 리스닝하면 되는데, 일반적으로 TO-BE 처럼 사용하기 때문에 해당 이슈를 만날 일은 잘 없을 것으로 보인다.

## 사례 2: 로컬 MySQL 연결 실패

> 🔗 https://dev.to/amitiwary999/localhost-not-point-to-correct-ip-address-in-node-18-4onl

Node 18 환경에서 MySQL에 연결할 때, host를 localhost로 설정하면 연결이 실패하는 문제가 발생했다. 이는 Node 18에서 localhost가 IPv6(::1)로 해석되는데, MySQL 서버는 IPv4(127.0.0.1)로만 리스닝하고 있었기 때문이다.

```javascript
// 실패
const connection = mysql.createConnection({
  host: 'localhost',  // ::1로 해석됨
  user: 'root',
  password: 'password'
});

// 성공
const connection = mysql.createConnection({
  host: '127.0.0.1',  // 명시적 IPv4
  user: 'root',
  password: 'password'
});
```

![](https://velog.velcdn.com/images/hsh111366/post/637ea5d6-ff2e-4e24-8f96-f065ef5d6926/image.png)

로컬에서 확인해 본 결과, **MySQL은 기본적으로 IPv4만 리스닝하고 있음을 확인했다.**

### 해결법

때문에 이를 해결하기 위해서는,
1) Node에서 IPv4로 직접적으로 명시를 해주거나
2) MySQL에서 IPv6도 리스닝하도록 설정할 수 있다.

```
# /opt/homebrew/etc/my.cnf
[mysqld]
bind-address = *
mysqlx-bind-address = *
```

> MySQL에서 localhost와 127.0.0.1의 차이로 또 재미있는 부분이 있는데, 이는 다음 글에서 정리해보려고 한다.

---

# `/etc/hosts` 파일 가지고 놀기

지금부터는 위에서 학습한 개념들을 활용하여, `/etc/hosts` 파일을 수정해보면서 어떤 식으로 동작하는지 알아보려고 한다.

```bash
❯ cat /etc/hosts
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
```

주석을 보면 수정하지 말라고 하기 때문에, 기존 파일을 백업해 두고 진행하였다.

```bash
sudo cp /etc/hosts /etc/hosts.backup

```

## 1. 특정 사이트 차단하기

```bash
# /etc/hosts에 추가
127.0.0.1    www.youtube.com
127.0.0.1    youtube.com
127.0.0.1    www.instagram.com
127.0.0.1    instagram.com
```

만약 내가 공부를 하는데 유튜브나 인스타그램을 너무 자주 들어가서 문제라고 해 보자.
그럴 때 위처럼 파일에 추가를 해 둔다면, 접속을 할 수가 없기 때문에 특정 사이트 접속을 차단할 수 있다.

```bash
❯ cat hosts
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost

127.0.0.1    www.youtube.com
127.0.0.1    youtube.com
127.0.0.1    www.instagram.com
127.0.0.1    instagram.com

```

실제로 되는지 테스트 해보자.

![](https://velog.velcdn.com/images/hsh111366/post/84599ef9-f3f2-4a96-857e-4e42f6e7d369/image.png)|![](https://velog.velcdn.com/images/hsh111366/post/86db9dd7-1a6b-43ea-b913-9359e87ba25f/image.png)
--|--|

당연히 접속이 안 되는 것을 볼 수 있다.

```bash
❯ ping www.youtube.com
PING www.youtube.com (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.103 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.165 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.124 ms
q64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.160 ms
c64 bytes from 127.0.0.1: icmp_seq=4 ttl=64 time=0.133 ms
cc64 bytes from 127.0.0.1: icmp_seq=5 ttl=64 time=0.193 ms
64 bytes from 127.0.0.1: icmp_seq=6 ttl=64 time=0.149 ms
64 bytes from 127.0.0.1: icmp_seq=7 ttl=64 time=0.220 ms
```

`ping`으로 테스트를 해 보면 루프백 주소로 잘 보낸다. 이렇게 동작하는 이유는 DNS에 쿼리하여 IP주소를 찾는 것보다, /etc/hosts 파일에 정의된 주소를 우선하기 때문이다.

> 이를 활용해 공부를 할 때 특정 사이트들을 차단해서 집중력을 높인다거나, 자녀의 컴퓨터에 유해사이트들을 직접 차단시키는 등을 할 수 있을 것 같다.

## 2. 로컬에서 앱 도메인 바꾸기

로컬에서 백엔드 앱을 실행하면 Spring 기준 보통 localhost:8080으로 접속하게 된다. (또는 설정한 서버 포트로)

![](https://velog.velcdn.com/images/hsh111366/post/7cc4c6ee-19bb-4c84-9f0e-7f7fcfd1e30b/image.png)

```bash
❯ cat hosts
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost

127.0.0.1 api.myapp.local

```

![](https://velog.velcdn.com/images/hsh111366/post/a3153258-0d42-4816-8418-50fa7e1aab0e/image.png)

이렇게 원하는대로 커스텀하여 로컬에서 접속할 수가 있다.(http라 ⚠️ 표시가 나옴)

> 하지만 로컬호스트로 접속하는 것이 손에 익었기 때문에 굳이? 쓸 일이 있을까 싶다.
>
CORS 테스트를 위해서 설정하는 경우들도 있다고는 하는데, 필요하다면 한 번 찾아보면 좋을 듯하다.

---

# 🏁 마무리

1. 이번 글을 통해서 localhost와 127.0.0.1의 차이점에 대해서 이해하게 되었다.
2. 루프백 주소가 무엇인지 명확히 이해하지 못 했었는데, 이제는 알게 된 것 같다.
3. hosts 파일을 잘 활용한다면 재미있는 것들을 많이 할 수 있을 듯하다.
