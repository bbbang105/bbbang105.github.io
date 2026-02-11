---
date: 2025-12-10
description: 카카오 소셜 로그인 시 전화번호 가입 계정의 email이 null로 들어오는 문제 해결
tags:
- backend
- troubleshooting
---

---

# 🎬 서론

평화롭게 [OneTime](https://www.onetime-with-members.com) 서비스를 운영하던 중에, **디스코드에 500 서버 에러 알림이 날라왔다.**

<img src="https://velog.velcdn.com/images/hsh111366/post/c1219fec-64a3-455b-9ce9-668313dfb595/image.png" width=50%>

온보딩 과정에서는 500 에러가 뜬 것이 처음이었기 때문에, 해당 오류를 파악해보았다.

---

# 🕵🏻‍♂️ 문제 파악

로그를 조금 더 상세하게 까보니, 아래와 같은 문제를 파악할 수 있었다.

```bash
{"@timestamp":"2025-12-07T22:17:49.58406966+09:00","@version":"1","message":"Column 'email' cannot be null","logger_name":"org.hibernate.engine.jdbc.spi.SqlExceptionHelper","thread_name":"http-nio-8090-exec-75","level":"ERROR","level_value":40000}

{"@timestamp":"2025-12-07T22:17:49.60493136+09:00","@version":"1","message":"could not execute statement [Column 'email' cannot be null] [insert into users ...
```

즉, **새로운 유저를 DB에 쓰는데 NOT NULL인 email이 null이기 때문에 발생한 DB 상 에러였다.**

처음에는 로직 상 그럴 수가 없다고 생각해, 외부 서비스의 문제로 여기고 넘어가려고 했다.
왜냐하면 현재 로직 상 소셜 로그인(구글, 카카오, 네이버)에 성공하면 필수적으로 이메일을 받아서 유저를 등록하고 있기 때문이었다.

> 로그인에 성공했는데 이메일이 없다는 것은 한 번도 생각해 보지 못 했다.

그렇게 다음에 재발하면 찾아봐야지..하려다가 그래도 현재 사용중인 소셜 로그인 플랫폼 3사(구글, 카카오, 네이버)에서 비슷한 사례가 있는지 찾아보았다. 
웹에서 사례를 찾는 것이기 때문에 구글 Gemini를 시켰고, 역시 잘 찾아주었다.

---

# 😵 전화번호로 가입한 계정은 이메일이 없을 수 있다?

3사 중에서 가장 유력해 보이는 것이 바로 `카카오`였다. 물론 이메일을 필수 동의 항목으로 설정해두었지만, 그럼에도 데이터를 받을 수 없는 경우가 있다고 한다.

<img src ="https://velog.velcdn.com/images/hsh111366/post/c9d7df5c-5715-45a3-90a0-de41e0fd31cc/image.png" width=70%>

[카카오 디벨로퍼스 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope-collection)

"수집하고 있지 않은 정보는 필수 동의를 하였더라도 제공할 수 없다."
**카카오는 전화번호로만 가입한 계정도 존재하기 때문에, 이 경우에는 이메일이 들어오지 않을 수 있던 것이었다.**

> 비슷한 사례들을 찾아볼 수 있다.
>
https://devtalk.kakao.com/t/null/125989
https://devtalk.kakao.com/t/api-email-null/139027

---

# ✅ 해결

만약 디벨로퍼스에 등록된 앱이 비즈 앱이라면, 해결 방법은 간단하다.

<img src="https://velog.velcdn.com/images/hsh111366/post/a1c35d58-60cd-4193-8c82-41df6d0e8a6e/image.png" width=70%>

위처럼 필수 동의 항목에 더불어, **'수집' 옵션을 활성화 해주면 된다!**
이렇게 하면 데이터가 들어오지 않은 값들에 대해서는, 유저에게 수동으로 입력하도록 하여 데이터 유실을 방지해 준다.

![](https://velog.velcdn.com/images/hsh111366/post/a333a275-7849-49f6-b126-50c41e2c62da/image.png)

그러면 이렇게 `필수 동의 [수집]` 으로 상태가 변경된다.

----

# 🏁 마무리

1. 처음 보는 에러였고, 이와 관련한 사례들을 찾아서 조치한 것이 재미있었다.
2. 완전히 해결한 것은 아니기 때문에, 앞으로 경과를 지켜봐야 할 것 같다.
3. 서버에서 해당 로직에 대한 예외 처리를 더 추가해야겠다.