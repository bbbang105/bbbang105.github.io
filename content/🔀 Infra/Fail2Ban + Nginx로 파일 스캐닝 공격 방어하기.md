---
date: 2025-05-18
tags:
  - infra
  - backend
---

---

# 🎬 서론

최근 [OneTime](https://www.onetime-with-members.com/) 서비스에 [Spring Filter & Interceptor를 적용한 로깅 개선 작업](https://velog.io/@hsh111366/Spring-조악한-로깅-개선해-보기)을 진행했었다.

로그를 보던 중, 짧은 시간 안에 무수히 많은 요청이 들어온 것을 확인했다.
모두 정상적인 API 호출은 아니었기에 에러 로그로 찍혔지만, 누군가의 악의적인 공격 시도라고 판단하여 이를 막아보기로 결정했다.

이번 글은 이에 대한 내용으로 이어질 예정이다.

---

# 🚨 공격 시도 정황

```
2025-05-15T16:28:10.610+09:00 ERROR 1 --- [nio-8090-exec-6] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-public-config, 메서드: GET
2025-05-15T16:28:10.611+09:00 ERROR 1 --- [nio-8090-exec-6] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:10.864+09:00 ERROR 1 --- [nio-8090-exec-5] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-readme, 메서드: GET
2025-05-15T16:28:10.864+09:00 ERROR 1 --- [nio-8090-exec-5] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:11.117+09:00 ERROR 1 --- [nio-8090-exec-9] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-defaults, 메서드: GET
2025-05-15T16:28:11.117+09:00 ERROR 1 --- [nio-8090-exec-9] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:11.371+09:00 ERROR 1 --- [io-8090-exec-10] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-sample-data, 메서드: GET
2025-05-15T16:28:11.372+09:00 ERROR 1 --- [io-8090-exec-10] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:11.693+09:00 ERROR 1 --- [nio-8090-exec-1] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-dev-data, 메서드: GET
2025-05-15T16:28:11.694+09:00 ERROR 1 --- [nio-8090-exec-1] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:11.954+09:00 ERROR 1 --- [nio-8090-exec-3] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-dump.sql, 메서드: GET
2025-05-15T16:28:11.954+09:00 ERROR 1 --- [nio-8090-exec-3] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:12.207+09:00 ERROR 1 --- [nio-8090-exec-4] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-backup.tar, 메서드: GET
2025-05-15T16:28:12.207+09:00 ERROR 1 --- [nio-8090-exec-4] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:12.460+09:00 ERROR 1 --- [nio-8090-exec-2] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-backup.gz, 메서드: GET
2025-05-15T16:28:12.460+09:00 ERROR 1 --- [nio-8090-exec-2] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:12.713+09:00 ERROR 1 --- [nio-8090-exec-7] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-snapshot.tar, 메서드: GET
2025-05-15T16:28:12.713+09:00 ERROR 1 --- [nio-8090-exec-7] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.
2025-05-15T16:28:12.967+09:00 ERROR 1 --- [nio-8090-exec-8] side.onetime.global.filter.JwtFilter     : ❌ JWT 필터 예외 발생 - 요청 URI: /.env-snapshot.gz, 메서드: GET
2025-05-15T16:28:12.967+09:00 ERROR 1 --- [nio-8090-exec-8] side.onetime.global.filter.JwtFilter     : ❌ JWT 예외 발생 - status: 400, code: TOKEN-008, message: Authorization 헤더가 존재하지 않거나 형식이 잘못되었습니다.

...
```

5월 15일 오후 4시 경, 위와 같은 로그가 무수히 찍혀 있는 것을 발견했다.
현재는 일부만 발췌했지만, 어림 잡아도 이에 약 100배가 넘는 호출이 이루어졌었다.

다행히 JwtFilter에서 막히며 예외 처리는 된 모습이다.

## 무슨 공격일까?

이와 유사한 사례들을 찾아보니, `Directory Traversal`이라는 공격 방식에 대해서 알게 되었다.

> ### Directory Traversal? 
웹 애플리케이션에서 사용자 입력을 통해 파일 경로를 처리할 때,
`../` 또는 `%2e%2e/`와 같은 상대 경로를 삽입해 웹 루트 밖의 시스템 파일에 접근하려는 공격 방식이다.
주로 download?file=과 같이 파일 경로를 파라미터로 받는 기능에서 발생하며,
이를 통해 공격자는 /etc/passwd, .ssh/, .env 등의 민감 파일을 탈취할 수 있다.
>
>`ex) GET /download?file=../../../../etc/passwd`

[참고 블로그 1](https://www.lgcns.com/blog/cns-tech/security/51408/) | [참고 블로그 2](https://news.hada.io/topic?id=13086)
 
**하지만 이번에 감지된 공격은 디렉터리 트래버설처럼 경로를 탈출하려는 시도는 확인되지 않았다.**
대신 .env, config.sql, backup.tar.gz 등 존재 가능성이 높은 **민감 파일명을 브루트포스 방식으로 요청하는 방식**이었다.

즉, **`파일명 기반 스캐닝 공격`**으로 판단하였다.

공격자는 주로 dirsearch, gobuster, nikto 등의 툴을 이용해 수천 개의 경로를 탐색하며,
응답 코드(200/403/404)나 응답 시간 등을 통해 파일 존재 여부를 유추하는 방식으로 동작한다.

이러한 스캐닝 공격은 실수로 업로드된 설정 파일이나 백업 파일이 노출될 경우
심각한 보안 위협으로 이어질 수 있기 때문에, 웹 서버 차원에서 선제적으로 차단하는 것이 효과적인 대응책이다.

---

# ✅ 해결 방법

## 📌 0. Nginx 활용

![](https://velog.velcdn.com/images/hsh111366/post/1efa31b1-972f-498f-a240-0cf95c63c37c/image.png)

현재 OneTime은 위와 같은 아키텍처를 구성하여 서비스를 운영하고 있다.

애플리케이션으로 들어오는 모든 요청은 Nginx 웹 서버를 거치기 때문에, 해당 부분에서 공격을 막기로 결정했고 이에 대한 이유들은 아래와 같다.

> **1. 애플리케이션 리소스 낭비 방지**
- 요청이 JwtFilter까지 도달하면 Spring의 필터 체인, 인증 로직, 예외 핸들러가 실행됨
- 이는 CPU, 메모리, GC 등 불필요한 리소스를 소모하게 되어 **서비스 성능에 악영향**을 줄 수 있음

> **2. Nginx가 더 빠르고 가볍게 차단 가능**
- Spring보다 빠르게 응답을 종료할 수 있어 DoS 또는 스캐닝 공격에 더 강함

> **3. 보안 로그 관리 및 스팸 방지**
- 애플리케이션에서 로그가 계속 찍히면 중요한 운영 로그가 묻힘
- 로그 디스크 용량 증가 & 로그 탐색 효율 저하

## 📌 1. Fail2Ban

또한 Nginx와 함께 `Fail2Ban`이라는 기술을 활용하기로 결정했다.

### Fail2Ban?

Fail2Ban은 로그 파일을 모니터링하여 반복적인 비정상 요청을 감지하고, 자동으로 IP를 차단하는 리눅스 기반 보안 도구이다.

### 사용 예시

```
GET /resources/env.dev HTTP/1.1 → 403
GET /config.tar.gz HTTP/1.1 → 403
... (5회 반복)

→ Fail2Ban이 해당 IP를 탐지하고 1시간 동안 차단
```

### 선정 이유

> **1. Nginx와 좋은 연동성**
- Nginx 로그 기반으로 동작
- `.env, ../, /config.sql` 등 경로 기반 공격 탐지에 최적화

> **2. 가볍고 간단하며 실시간 IP 차단 가능**
- 별도 에이전트 없이 동작함 -> 시스템 리소스를 거의 소모하지 않음
- 설치만 하면 즉시 적용 가능하고 실시간으로 IP 차단 가능

> **3. DoS, 디렉터리 트래버설, 로그인 공격까지 모두 방어**
- 다양한 공격에 대응 가능한 다목적 보안 툴
- `sshd, nginx, wordpress, mysql` 등 주요 서비스에 플러그인처럼 적용 가능

> **4. 방화벽 설정과 연동**
- `iptables, ufw, nftables` 등 리눅스 기본 방화벽과 연동됨

## 📌 2. Fail2Ban 설치

```bash
sudo apt update
sudo apt install fail2ban -y
```

위 명령어로 설치를 해준다.

```bash
sudo systemctl status fail2ban
```

```
ubuntu@ip-172-31-9-125:~$ sudo systemctl status fail2ban
● fail2ban.service - Fail2Ban Service
     Loaded: loaded (/usr/lib/systemd/system/fail2ban.service; enabled; preset: enabled)
     Active: active (running) since Sat 2025-05-17 11:56:09 UTC; 23s ago
       Docs: man:fail2ban(1)
   Main PID: 853098 (fail2ban-server)
      Tasks: 5 (limit: 2338)
     Memory: 28.2M (peak: 28.5M)
        CPU: 308ms
     CGroup: /system.slice/fail2ban.service
             └─853098 /usr/bin/python3 /usr/bin/fail2ban-server -xf start

May 17 11:56:09 ip-172-31-9-125 systemd[1]: Started fail2ban.service - Fail2Ban Service.
May 17 11:56:09 ip-172-31-9-125 fail2ban-server[853098]: 2025-05-17 11:56:09,737 fail2ban.configreader   [853098]: WAR>
May 17 11:56:10 ip-172-31-9-125 fail2ban-server[853098]: Server ready
```

설치 후 테스트 해서 위처럼 뜨면 성공이다!

## 📌 3. Fail2Ban 기본 설정 파일 구조

```bash
cd /etc/fail2ban
```

Fail2Ban 설정 파일은 위 디렉토리에 존재한다.

```bash
ubuntu@ip-172-31-9-125:/etc/fail2ban$ ls
action.d       fail2ban.d  jail.conf  paths-arch.conf    paths-debian.conf
fail2ban.conf  filter.d    jail.d     paths-common.conf  paths-opensuse.conf
```

여기서 `jail.conf` 파일은 기본 템플릿이므로 손대지 않는다.

## 📌 4. `jail.d/nginx-scan.conf` 파일 생성

```bash
sudo vi /etc/fail2ban/jail.d/nginx-scan.conf
```

`/etc/fail2ban/jail.d` 디렉토리에, 아래의 `nginx-scan.conf` 파일을 생성해준다.

```
[nginx-scan]
enabled = true
filter = nginx-scan
action = iptables[name=NGINX-SCAN, port=http, protocol=tcp]
logpath = /var/log/nginx/access.log
maxretry = 5
findtime = 60
bantime = 604800
backend = polling
```

> **[nginx-scan]**
- jail의 이름이다.
- jail은 Fail2Ban에서 특정 서비스(예: nginx, ssh 등)에 대한 감시 규칙을 하나의 단위로 정의한 것을 의미한다.
- `fail2ban-client status nginx-scan` 명령으로 상태 확인할 때 이 이름을 사용한다.

> **enabled = true**
- 해당 jail을 활성화하겠다는 의미이다.
- 당연하게도 false로 설정하면 비활성화된다.

> **filter = nginx-scan**
- /etc/fail2ban/filter.d/nginx-scan.conf 파일을 사용하겠다는 의미이다.
- 해당 파일에는 어떤 로그 패턴을 감지할지 정규식으로 정의되어 있다.
- 기본적으로 생성되어 있는 파일이 아니기에, 이후 추가할 것이다.
```bash
ubuntu@ip-172-31-9-125:/etc/fail2ban/filter.d$ ls
3proxy.conf                courier-auth.conf   haproxy-http-auth.conf  openwebmail.conf        sieve.conf
apache-auth.conf           courier-smtp.conf   horde.conf              oracleims.conf          slapd.conf
apache-badbots.conf        cyrus-imap.conf     ignorecommands          pam-generic.conf        softethervpn.conf
apache-botsearch.conf      directadmin.conf    kerio.conf              perdition.conf          sogo-auth.conf
apache-common.conf         domino-smtp.conf    lighttpd-auth.conf      php-url-fopen.conf      solid-pop3d.conf
apache-fakegooglebot.conf  dovecot.conf        mongodb-auth.conf       phpmyadmin-syslog.conf  squid.conf
apache-modsecurity.conf    dropbear.conf       monit.conf              portsentry.conf         squirrelmail.conf
apache-nohome.conf         drupal-auth.conf    monitorix.conf          postfix.conf            sshd.conf
apache-noscript.conf       ejabberd-auth.conf  mssql-auth.conf         proftpd.conf            stunnel.conf
apache-overflows.conf      exim-common.conf    murmur.conf             pure-ftpd.conf          suhosin.conf
apache-pass.conf           exim-spam.conf      mysqld-auth.conf        qmail.conf              tine20.conf
apache-shellshock.conf     exim.conf           nagios.conf             recidive.conf           traefik-auth.conf
assp.conf                  freeswitch.conf     named-refused.conf      roundcube-auth.conf     uwimap-auth.conf
asterisk.conf              froxlor-auth.conf   nginx-bad-request.conf  scanlogd.conf           vsftpd.conf
bitwarden.conf             gitlab.conf         nginx-botsearch.conf    screensharingd.conf     webmin-auth.conf
botsearch-common.conf      grafana.conf        nginx-http-auth.conf    selinux-common.conf     wuftpd.conf
centreon.conf              groupoffice.conf    nginx-limit-req.conf    selinux-ssh.conf        xinetd-fail.conf
common.conf                gssftpd.conf        nsd.conf                sendmail-auth.conf      znc-adminlog.conf
counter-strike.conf        guacamole.conf      openhab.conf            sendmail-reject.conf    zoneminder.conf
ubuntu@ip-172-31-9-125:/etc/fail2ban/filter.d$ cat nginx.scan
cat: nginx.scan: No such file or directory
```

> **action = iptables[name=NGINX-SCAN, port=http, protocol=tcp]**
- Fail2Ban이 공격 IP를 차단할 때 사용할 iptables 명령 템플릿을 지정하는 부분이다.
- 즉, Fail2Ban 내부의 기본 액션 템플릿인 `/etc/fail2ban/action.d/iptables.conf`를 불러와서 아래와 같은 명령을 실행하게 된다.
```bash
iptables -I f2b-NGINX-SCAN 1 -s <공격자 IP> -p tcp --dport 80 -j REJECT
```
- 만약 아예 응답 없이 무시하고 싶다면 아래와 같이 변경해줄 수도 있다.
```bash
action = iptables[name=NGINX-SCAN, port=http, protocol=tcp, blocktype=DROP]
```

> **logpath = /var/log/nginx/access.log**
- 분석의 대상이 되는 로그 파일 경로이다.
- Nginx 로그 파일 내부에서 지정된 정규식과 일치하는 요청이 maxretry를 넘으면 차단하게 된다.

> **maxretry = 5**
- 같은 IP가 로그 패턴에 5번 이상 매칭되면 차단한다.

> **findtime = 60**
- maxretry 횟수가 얼마나 빠르게 발생해야 차단할지를 지정한다.
- 즉, 60초(1분) 안에 5번 매칭이 되면 차단한다.

> **bantime = 604800**
- 얼마나 차단할지를 지정하며, 604800초(7일) 동안 해당 IP를 차단한다.
- 이후에는 차단이 해제된다.

> **backend = polling**
- Fail2Ban이 로그 파일을 감시하는 방식 중 하나이다.
- 기본 backend는 `auto`로, 로그가 journald에 있으면 사용하기에 nginx의 로그가 제대로 감시되지 않을 수 있다.
- 때문에 `backend = polling`을 명시함으로써 Fail2Ban이 로그 파일을 직접 감시하도록 강제한다.

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client get nginx-scan logpath
```

파일을 생성했다면, 재시작 후 로그 패스가 잘 설정되었는지 확인해준다.

```bash
ubuntu@ip-172-31-9-125:/etc/fail2ban/jail.d$ sudo fail2ban-client get nginx-scan logpath
Current monitored log file(s):
`- /var/log/nginx/access.log
```

위와 같이 나온다면 성공이다!

## 📌 5. `filter.d/nginx-scan.conf` 파일 생성

```bash
sudo vi /etc/fail2ban/filter.d/nginx-scan.conf
```

위 명령어를 통해서 필터 파일을 생성한다.
4번이 fail2ban의 동작에 대한 설정이라면, 5번 필터 파일은 좀 더 세부적으로 어떤 로그에 대해 필터링을 진행하는지에 대한 설정이다.

```bash
[Definition]
failregex = ^<HOST> - - \[.*\] "(GET|POST|HEAD) /\S*\.?(env|sql|tar|gz|zip|conf|bak|old|backup|inc|log|db|mdb|ini|git|svn|htpasswd|htaccess|yml|yaml|xml|json|lock|swp|bin|exe)\S* HTTP/1\.[01]" 403
ignoreregex =
```

> **failregex**
- 해당 정규식에 매칭되고, HTTP 403 응답이 발생하면 IP를 추적한다.
- `<HOST>`는 Fail2Ban이 자동으로 IP 주소로 치환해 사용하게 된다.

> **ignoreregex**
- 필요하다면 정규식을 통해서 특정 IP나 요청은 허용해줄 수 있다.
- 지금은 지정하지 않았기에, 모든 요청에 대해서 감시한다.

```bash
sudo chmod 644 /etc/fail2ban/filter.d/nginx-scan.conf
sudo fail2ban-client reload

```

권한 설정 이후, 리로드 해주어 설정을 적용한다.

## 📌 6. nginx.conf 수정

```bash
# 🔒 민감 파일 접근 차단 (403 응답)
access_log /var/log/nginx/access.log;

location ~* (\.env|\.sql|\.tar|\.gz|\.zip|\.conf) {
    return 403;
}
```

위 부분을 `nginx.conf` 파일에 추가해준다.

```bash
http {
    include mime.types;

    server {
        server_name onetime-deploy.store;

        # 🔒 민감 파일 접근 차단 (403 응답)
        access_log /var/log/nginx/access.log;
        
        location ~* (\.env|\.sql|\.tar|\.gz|\.zip|\.conf) {
            return 403;
        }
        
        ...
```

추가해 줄 위치는 위와 같다.

```bash
ubuntu@ip-172-31-9-125:/etc/nginx$ sudo nginx -t
sudo systemctl reload nginx
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

추가 이후 리로드하여 변경 사항을 설정해준다.

## 📌 7. 테스트

이제 403 응답과 IP 차단이 잘 동작하는지 한 번 테스트 해보자.

### 6회 요청

```bash
 hansangho  ~/Desktop  for i in {1..6}; do
  curl -I {도메인}/.env-test
done
HTTP/1.1 403 Forbidden
Server: nginx/1.24.0 (Ubuntu)
Date: Sat, 17 May 2025 13:23:03 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive

HTTP/1.1 403 Forbidden
Server: nginx/1.24.0 (Ubuntu)
Date: Sat, 17 May 2025 13:23:03 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive

HTTP/1.1 403 Forbidden
Server: nginx/1.24.0 (Ubuntu)
Date: Sat, 17 May 2025 13:23:03 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive

HTTP/1.1 403 Forbidden
Server: nginx/1.24.0 (Ubuntu)
Date: Sat, 17 May 2025 13:23:04 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive

HTTP/1.1 403 Forbidden
Server: nginx/1.24.0 (Ubuntu)
Date: Sat, 17 May 2025 13:23:04 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive

HTTP/1.1 403 Forbidden
Server: nginx/1.24.0 (Ubuntu)
Date: Sat, 17 May 2025 13:23:04 GMT
Content-Type: text/html
Content-Length: 162
Connection: keep-alive
```

`.env~` 로 시작하는 요청을 보내자, 모두 403 응답으로 받은 것을 볼 수 있다.

### sudo fail2ban-client status nginx-scan


```bash
ubuntu@ip-172-31-9-125:/etc/fail2ban/jail.d$ sudo fail2ban-client status nginx-scan
Status for the jail: nginx-scan
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	6
|  `- File list:	/var/log/nginx/access.log
`- Actions
   |- Currently banned:	1
   |- Total banned:	1
   `- Banned IP list:	175.192.6.69
```

해당 명령어를 통해서 로그가 잘 감지되고, IP 차단이 정상적으로 이루어졌는지 확인해볼 수 있다.

위 상태를 보면 6번 요청에 대해서 fail이 되었고, 5분 내로 5번 이상 403 응답을 받는 요청을 하였기에 `Banned IP list:	175.192.6.69` 가 추가된 것을 볼 수 있다.

---

# 👇🏻 DROP 시도

하지만 한 가지 문제가 있었다.
IP 차단 자체에는 성공이 되었지만, 내가 원하는 것은 요청조차 오지 않도록 막는 것(=DROP)이었다.

지금부터는 이를 어떻게 해결했는지 과정을 적어보려고 한다.

## 1. REJECT -> DROP

`jail.d/nginx-scan.conf` 파일이 기본 설정인 REJECT로 되어있기에 당연하게도 DROP이 되지 않았다.

때문에 action 부분을 아래와 같이 수정했다.

```
action = iptables[name=NGINX-SCAN, port="80,443", protocol=tcp, blocktype=DROP]
```

## 2. Docker 

**그러나 Fail2Ban 설정을 DROP으로 바꿨음에도 차단된 IP에서 계속 요청을 보낼 수 있었다.**

현재 OneTime은 애플리케이션을 Docker 컨테이너로 띄워 운영중이다.
찾아본 결과 Docker는 iptables 체인을 별도로 관리하며 DOCKER 및 DOCKER-USER 체인을 우선 처리한다고 한다.

[참고 블로그 1](https://velog.io/@composite/fail2ban-부정행위-적발-시-Docker-접속-막기) | [참고 블로그 2](https://www.codenary.co.kr/discoveries/17922)

이를 해결하기 위해서는 Docker의 iptables 체인 처리 순서를 우선 이해해야 한다.

### 🔗 Docker의 iptables 체인 처리 순서

Docker는 컨테이너 네트워크를 격리시키기 위해 자체 iptables 체인을 생성하고, FORWARD 체인을 통해 트래픽을 전달한다.

```
[외부 요청]
   ↓
[FORWARD 체인]
   ↓
[DOCKER-USER → DOCKER → 컨테이너]
```

그렇기에 `f2b-*`, 즉 Fail2Ban이 생성한 체인 (예: f2b-NGINX-SCAN)은 따로 연결하지 않으면 위 체인들에 포함되지 않는다.

결과적으로, Fail2Ban이 f2b-NGINX-SCAN이라는 체인에서 DROP 명령을 등록하더라도,
Docker 네트워크 체인을 통과한 이후에야 적용되므로 실질적 차단이 이뤄지지 않았던 것이다.

### FORWARD 체인에 직접 연결

Fail2Ban의 차단이 Docker 컨테이너에 적용되도록 하려면, 생성된 `f2b-*` 체인을 FORWARD 체인에 명시적으로 연결해야 한다.

```bash
sudo iptables -nL | grep f2b
```

위 명령어로 `f2b-*` 체인을 모두 확인해보자.

```bash
ubuntu@ip-172-31-9-125:~$ sudo iptables -nL | grep f2b
Chain f2b-NGINX-SCAN (0 references)
```

현재 `f2b-NGINX-SCAN` 이라는 체인이 존재하지만, 이를 호출하고 있지 않다.

```bash
sudo iptables -L f2b-NGINX-SCAN -n --line-numbers
```

위 명령어로 해당 체인의 룰을 확인할 수 있다.

```bash
ubuntu@ip-172-31-9-125:~$ sudo iptables -L f2b-NGINX-SCAN -n --line-numbers
Chain f2b-NGINX-SCAN (0 references)
num  target     prot opt source               destination         
1    DROP       0    --  175.192.6.69         0.0.0.0/0           
2    RETURN     0    --  0.0.0.0/0            0.0.0.0/0 
```

이전에 6번 호출하여 DROP이 되었던 IP를 확인할 수 있다.

```bash
sudo iptables -I FORWARD 1 -j f2b-NGINX-SCAN
```

위 명령어를 통해서 체인을 FORWARD로 연결하자.
`-I FORWARD 1` 는 FORWARD 체인의 맨 앞에 연결한다는 뜻으로, 가장 먼저 실행되도록 하는 설정이다.

```bash
ubuntu@ip-172-31-9-125:~$ sudo iptables -I FORWARD 1 -j f2b-NGINX-SCAN
ubuntu@ip-172-31-9-125:~$ sudo iptables -nL | grep f2b
f2b-NGINX-SCAN  0    --  0.0.0.0/0            0.0.0.0/0           
Chain f2b-NGINX-SCAN (1 references)
```

이후 다시 확인해 보면 `Chain f2b-NGINX-SCAN (1 references)` 부분을 통해 연결된 것을 볼 수 있다.


```bash
sudo iptables-save
```

로 영구저장 한 후,

```bash
sudo iptables -nL
```

로 확인해 보았을 때 아래와 같이 나오면 연결 성공이다!

```bash
ubuntu@ip-172-31-9-125:~$ sudo iptables -nL
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         

Chain FORWARD (policy DROP)
target     prot opt source               destination         
f2b-NGINX-SCAN  0    --  0.0.0.0/0            0.0.0.0/0

...
```

만약 포트포워딩을 사용하지 않고, 앱 컨테이너를 1개만 운용하고 있다면 여기까지만 해도 대부분 해결이 될 것이다.

## 3. 포트포워딩 제거

하지만 그럼에도 완전히 차단이 이루어지지는 않았다... 
이에 대해 원인을 추적한 결과, 기존에 사용 중이던 Docker의 포트포워딩 설정이 문제였음을 확인했다.

```yaml
services:
  blue:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: onetime-test-blue
    restart: always
    env_file:
      - .env
    ports:
      - 8091:8090
    environment:
      - TZ=Asia/Seoul
      - SPRING_PROFILES_ACTIVE=test
```

현재 블루-그린 무중단 배포 구조를 사용 중이었으며, 각 컨테이너에 트래픽을 전달하기 위해 Docker의 포트포워딩 설정을 활용하고 있었다.

Docker는 iptables의 nat 테이블을 사용해 외부 포트 → 컨테이너 포트로 포워딩한다. 이때 **패킷의 출발지 IP가 DOCKER 체인을 거치면서 변경(NAT) 되는 경우가 존재한다.**

```
[ 클라이언트 IP → NAT → 127.0.0.1 ] 으로 변경됨
```

즉, 실제 요청은 외부에서 왔지만, 컨테이너 안에서는 “localhost”로 보이게 되고, 그 결과 **Fail2Ban이 차단한 IP는 이미 NAT로 가려져서, DROP이 안 되었던 것이다.**

때문에 포트포워딩 부분을 제거하고, 컨테이너명을 각각 `onetime-blue`와 같이 지정했다.

스프링부트와 레디스 컨테이너를 하나의 네트워크로 묶었고, Nginx에서도 `proxy_pass`를 아래와 같이 수정했다.

`proxy_pass http://127.0.0.1:8091;` -> `proxy_pass http://onetime-blue:8090;`

## 4. Nginx 호스트 -> 컨테이너화

이번에는 Nginx에서 문제가 발생했다.
`http://onetime-blue:8090`로 연결해주어야 하는데, 이를 모르고 있다는 것이다.

기존에는 Nginx를 호스트 위에서 구동이었는데, `onetime-blue`는 컨테이너 명이기에 호스트에서 동작하고 있는 Nginx가 알 수가 없기에 당연한 결과였다.

그렇기에 이 참에 Nginx도 컨테이너화 한 후, 같은 도커 네트워크로 묶기로 결정했다.
그대로 호스트에서 운용할지, 컨테이너화 할 지에 대한 결정은 [해당 블로그 글](https://infinitecode.tistory.com/80)을 읽으며 할 수 있었다.

### docker-compose.yaml 일부

```yml
  nginx:
    image: nginx:latest
    container_name: onetime-nginx
    restart: always
    ports:
      - 80:80
      - 443:443
    volumes:
      - /home/ubuntu/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /home/ubuntu/nginx/logs:/var/log/nginx
    networks:
      - onetime-net
```

`volumes` 부분을 통해서, 
>1)	블루-그린 무중단 배포에 필요한 conf 파일,
2) SSL 인증서 파일,
3)	에러 및 접근 로그

등을 컨테이너와 호스트 간에 마운트하였다.

## 5. 내 IP 차단

4번까지 진행을 했는데, 배포 서버에서 갑자기 API 요청을 처리하지 못 했다.
서비스에 장애가 난 줄 알았는데.. 알고 보니 이전에 테스트하면서 내 IP가 차단되어 있던 것이었다 😂

```bash
ubuntu@ip-172-31-9-125:~$ sudo iptables -L -n --line-numbers | grep 175.192.6.69
1    DROP       0    --  175.192.6.69         0.0.0.0/0    
```

아마 수동으로 iptables에 FORWARD 체인을 연결하고 영구 저장하는 과정에서, IP 차단 내역까지 저장된 듯하다.

```bash
sudo iptables -D f2b-NGINX-SCAN 1
```
위 명령어를 통해서 IP 차단을 풀어주었고 정상적으로 이용할 수 있었다.

## 6. Nginx 컨테이너 로그 심볼릭 링크 제거

마지막으로 하나 빼먹은 것이 있었다.

기존에는 Nginx가 호스트 위에서 동작했기에, fail2ban의 logpath를 `/var/log/nginx/error.log`으로 두어 감지하도록 하였다.

하지만 Nginx를 컨테이너화하면서 해당 방식으로는 접근이 불가능 했고, 컨테이너 내부에 있는 로그 파일을 호스트에서 확인하기 위해서는 마운트가 필요했다. (위 4번에서 진행)

```bash
 sudo mkdir -p /home/ubuntu/nginx/logs
 ```
 
해당 명령어를 통해서 마운트 대상 디렉토리를 생성해주고 Nginx 컨테이너 재시작을 하였지만 로그 파일은 생기지 않았다. 왜일까?

그 이유는 기본 Nginx Docker 이미지의 `/var/log/nginx/access.log`, `/error.log`가 **심볼릭 링크로 설정**되어 있기 때문이다. 
이 심볼릭 링크는 `/dev/stdout`, `/dev/stderr`를 가리키고 있어, 로그가 실제 파일로 쓰이지 않고 표준 출력으로 흘러간다.

따라서 fail2ban이 해당 경로의 파일을 감시할 수 없으며, 이를 해결하려면 **심볼릭 링크를 제거하고 빈 로그 파일을 생성해 주는 커스텀 도커 이미지를 사용해야 한다.**

### `nginx/Dockerfile` 생성

```dockerfile
FROM nginx:latest

# 🔧 기존 심볼릭 링크 제거
RUN rm /var/log/nginx/access.log /var/log/nginx/error.log

# 📄 빈 파일 생성 및 권한 설정
RUN touch /var/log/nginx/access.log /var/log/nginx/error.log && \
    chmod 644 /var/log/nginx/access.log /var/log/nginx/error.log
```

### 커스텀 Dockerfile을 사용하여 Nginx 컨테이너를 생성하도록 변경

```yaml
  nginx:
    build:
      context: ./nginx	     # 해당 부분
      dockerfile: Dockerfile # 해당 부분
    container_name: onetime-nginx
    restart: always
    ports:
      - 80:80
      - 443:443
    volumes:
      - /home/ubuntu/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /home/ubuntu/nginx/logs:/var/log/nginx
    networks:
      - onetime-net
```

### `jail.d/nginx-scan.conf` 파일 수정

```bash
[nginx-scan]
enabled = true
filter = nginx-scan
action = iptables-multiport[name=NGINX-SCAN, chain=DOCKER-USER, port="80,443", protocol=tcp, blocktype=DROP]
logpath = /home/ubuntu/nginx/logs/access.log
maxretry = 5
findtime = 60
bantime = 604800
backend = polling
```

- 80, 443 두 개의 포트이므로 `iptables` -> `iptables-multiport` 로 수정하였다.
- logpath를 `/var/log/nginx/access.log` -> `/home/ubuntu/nginx/logs/access.log` 로 수정하였다.

---

# 🏁 마무리

## 💫 결과

그럼 이제 처음부터 다시 테스트를 하며 방화벽이 잘 구축되었는지 확인해보자.

### 1. 6회 403 응답

```bash
175.192.6.69 - - [18/May/2025:11:47:31 +0000] "HEAD /.env-test HTTP/1.1" 403 0 "-" "curl/8.7.1"
175.192.6.69 - - [18/May/2025:11:47:31 +0000] "HEAD /.env-test HTTP/1.1" 403 0 "-" "curl/8.7.1"
175.192.6.69 - - [18/May/2025:11:47:31 +0000] "HEAD /.env-test HTTP/1.1" 403 0 "-" "curl/8.7.1"
175.192.6.69 - - [18/May/2025:11:47:32 +0000] "HEAD /.env-test HTTP/1.1" 403 0 "-" "curl/8.7.1"
175.192.6.69 - - [18/May/2025:11:47:32 +0000] "HEAD /.env-test HTTP/1.1" 403 0 "-" "curl/8.7.1"
175.192.6.69 - - [18/May/2025:11:47:32 +0000] "HEAD /.env-test HTTP/1.1" 403 0 "-" "curl/8.7.1"
```

### 2. sudo fail2ban-client status nginx-scan

```bash
ubuntu@ip-172-31-9-125:~/nginx$ sudo fail2ban-client status nginx-scan
Status for the jail: nginx-scan
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	30
|  `- File list:	/home/ubuntu/nginx/logs/access.log
`- Actions
   |- Currently banned:	1
   |- Total banned:	4
   `- Banned IP list:	175.192.6.69
```

현재 Ban 된 리스트를 확인할 수 있으며, 내 IP가 리스트에 들어있는 것을 볼 수 있다.

### 3. sudo tail -f /var/log/fail2ban.log | grep 'Ban'

```bash
2025-05-18 11:47:32,638 fail2ban.actions        [870355]: NOTICE  [nginx-scan] Ban 175.192.6.69
```

좀 더 구체적으로 확인할 수 있다.

### 4. sudo iptables -L f2b-NGINX-SCAN -n --line-numbers

```bash
ubuntu@ip-172-31-9-125:~/nginx$ sudo iptables -L f2b-NGINX-SCAN -n --line-numbers
Chain f2b-NGINX-SCAN (4 references)
num  target     prot opt source               destination         
1    DROP       0    --  175.192.6.69         0.0.0.0/0   
```

내 IP가 DROP 되어 있는 것을 확인할 수 있다.

### 5. 30번 더 요청

그럼 정말로 DROP 되는지 6번 더 요청을 해 보자.

```bash
 hansangho  ~  for i in {1..6}; do
  curl -I {}/.env-test
done
curl: (28) Failed to connect to onetime-deploy.store port 443 after 7793 ms: Couldn't connect to server
curl: (28) Failed to connect to onetime-deploy.store port 443 after 7823 ms: Couldn't connect to server
curl: (28) Failed to connect to onetime-deploy.store port 443 after 7823 ms: Couldn't connect to server
curl: (28) Failed to connect to onetime-deploy.store port 443 after 7785 ms: Couldn't connect to server
curl: (28) Failed to connect to onetime-deploy.store port 443 after 7787 ms: Couldn't connect to server
curl: (28) Failed to connect to onetime-deploy.store port 443 after 7785 ms: Couldn't connect to server
```

6번 모두 요청이 DROP되어 도달조차 못 하는 것을 볼 수 있다.

### 6. sudo iptables -L f2b-NGINX-SCAN -v -n

```bash
ubuntu@ip-172-31-9-125:~/nginx$ sudo iptables -L f2b-NGINX-SCAN -v -n
Chain f2b-NGINX-SCAN (4 references)
 pkts bytes target     prot opt in     out     source               destination         
 1498  163K DROP       0    --  *      *       175.192.6.69         0.0.0.0/0    
```

해당 명령어를 통해 DROP된 패킷의 개수와 트래픽을 확인할 수 있다.

- Fail2Ban이 정상적으로 IP 175.192.6.69를 차단하고 있음
- 실제로 1498건의 요청이 DROP 처리되었고, 총 163KB의 트래픽이 차단되었음
- 방화벽 차단이 정상적으로 작동 중임

> 🧑🏻‍💻 결과적으로 기존에는 `Nginx -> WAS -> Spring Security`에서 처리되던 **불필요한 트래픽들을 커널 레벨에서 차단하며 감소**시킬 수 있었다. 
이로 인해 **WAS 부하 감소 & 로그 I/O 최소화** 등의 이점을 취할 수 있게 되었다!

### 7. IP 차단 해제

```bash
sudo fail2ban-client set nginx-scan unbanip {내 IP}
```

위 명령어를 통해서 차단되어 있는 내 IP를 해제해 주자.

```bash
ubuntu@ip-172-31-9-125:~/nginx$ sudo fail2ban-client set nginx-scan unbanip 175.192.6.69
1
ubuntu@ip-172-31-9-125:~/nginx$ sudo fail2ban-client status nginx-scan
Status for the jail: nginx-scan
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	36
|  `- File list:	/home/ubuntu/nginx/logs/access.log
`- Actions
   |- Currently banned:	0
   |- Total banned:	5
   `- Banned IP list:	
```

위와 같이 `Banned IP list`에 없다면 해제 성공이다!

## ⏰ Discord 웹훅 연동

OneTime에서는 Discord를 이용중에 있다.
때문에 여러 부분들을 연동해 놓아 모니터링하고 있는데, 공격 정황 감지 시에도 이를 메시지로 보내준다면 좋을 것 같아 연동을 시도했다.

### 1. 디스코드 웹훅 URL 준비

해당 부분은 나와 있는 블로그 들이 많아 넘어가도록 하겠다.

### 2. `action.d/discord-webhook.conf` 파일 생성

```bash
sudo vi /etc/fail2ban/action.d/discord-webhook.conf
```

```bash
[Definition]

actionstart =

actionstop =

actioncheck =

actionban = /bin/bash -c 'curl -X POST -H "Content-Type: application/json" \
  -d "{\"content\": \"🚫 <ip> 이(가) **<name>** jail에서 차단되었습니다. ($(date +%%Y-%%m-%%dT%%H:%%M:%%S))\"}" \
  {웹훅 URL}'

actionunban = /bin/bash -c 'curl -X POST -H "Content-Type: application/json" \
  -d "{\"content\": \"✅ <ip> 이(가) **<name>** jail에서 차단 해제되었습니다. ($(date +%%Y-%%m-%%dT%%H:%%M:%%S))\"}" \
  {웹훅 URL}'
```

### 3. `jail.d/nginx-scan.conf`에 액션 추가

```bash
sudo vi /etc/fail2ban/jail.d/nginx-scan.conf
```

```bash
[nginx-scan]
enabled = true
filter = nginx-scan
action = # 줄바꿈으로 action이 구분됨
    iptables-multiport[name=NGINX-SCAN, chain=DOCKER-USER, port="80,443", protocol=tcp, blocktype=DROP]
    discord-webhook[name=NGINX-SCAN] # 해당 부분 추가
logpath = /home/ubuntu/nginx/logs/access.log
maxretry = 5
findtime = 60
bantime = 604800
backend = polling
```

### 4. `sudo fail2ban-client reload` - 리로드 이후 테스트

![](https://velog.velcdn.com/images/hsh111366/post/5b1d8ab8-ce60-4cf4-89c4-3b9684a1644e/image.png)

위와 같이 차단된 IP와 타임스탬프가 Discord 메세지로 잘 오는 것을 볼 수 있다!

## 🔀 변경된 아키텍처

![](https://velog.velcdn.com/images/hsh111366/post/a21b7cc2-7772-4207-bc00-c47193e2ac17/image.png)

시스템 아키텍처 또한 일부 수정되었다.
기존에는 Nginx가 호스트에서 직접 구동되고 있었지만, 이를 컨테이너로 이전하고 다른 서비스들과 함께 하나의 docker-compose 네트워크로 통합하였다.

또한 로그를 분석하고 IP를 차단해 주는 Fail2Ban을 배포 서버에 추가해주었다.


## 💡 배운 점 & 느낀 점

### 1. 보안 취약점

- 무작위 공격이기는 하나 이제 원타임에도 공격이 들어온다는 것이 신기하기도 긴장도 되었다. 
- 이번 일을 계기로 앞으로 보안적으로 더 신경을 써야할 것 같다.
- Directory Traversal & 파일 스캐닝 공격 방식에 대해 알고 막을 수 있게 된 것은 큰 수확이다.

### 2. Fail2Ban에 대한 학습

- Fail2Ban은 가볍지만 로그 기반으로 실시간 IP를 탐지하고 차단할 수 있는 훌륭한 방어 도구라는 생각이 들었다. 
- ssh뿐만 아니라 nginx, mysql 등 다양한 서비스에 바로 적용 가능하다는 점과 복잡한 설정 없이도 빠르게 적용할 수 있다는 점에서 좋은 도구를 알게 된 듯하다.

### 3. iptables 차단 → 커널 레벨에서 리소스 절약

- Fail2Ban과 iptables를 연동해 REJECT가 아닌 DROP 정책을 적용함으로써 애플리케이션 레벨에 도달하기 전 트래픽을 커널 레벨에서 차단할 수 있었다. 
- 이로 인해 CPU 사용량, 필터 체인, 인증 로직, 예외 핸들러 등의 불필요한 리소스를 줄이고 서버 부하를 줄일 수 있었던 점이 뿌듯하다.

### 4. Docker 네트워크 체계에 대한 이해

- 이번 작업을 통해 Docker가 자체적으로 생성하는 iptables 체인(DOCKER, DOCKER-USER)의 우선순위와 NAT 동작 방식, 컨테이너 간 통신 처리 방식 등에 대해 이해할 수 있었다. 
- 특히 포트 포워딩 구조로 인해 IP가 127.0.0.1로 변조되는 사례 등 Docker 네트워크 체계에 대해서 배울 수 있는 계기가 되었다.

### 5. Docker 로그와 심볼릭 링크

- 컨테이너에서 /var/log/nginx/access.log 경로가 심볼릭 링크(/dev/stdout)로 연결되어 있다는 점은 알지 못했던 부분이었다.
- Docker 로그 시스템이 파일이 아닌 표준 출력 기반으로 동작함을 이해할 수 있었고, 실제 로그 파일을 필요로 하는 도구(Fail2Ban 등)를 연동하기 위해서는 커스텀 이미지 생성 등의 추가 작업이 필요하다는 것을 배울 수 있었다.
