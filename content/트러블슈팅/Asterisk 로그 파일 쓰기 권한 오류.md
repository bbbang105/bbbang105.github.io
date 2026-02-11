---
date: 2025-12-22
description: Docker Asterisk 컨테이너에서 CDR CSV 로그 파일 쓰기 권한 오류 해결
tags:
  - troubleshooting
  - asterisk
  - VG
---

---

# 🚨 문제 상황

```bash
[root@assist-vg-test ~]# docker ps
CONTAINER ID   IMAGE                     COMMAND             CREATED        STATUS                    PORTS     NAMES
203c12a59e22   andrius/asterisk:latest   "asterisk -f -vv"   23 hours ago   Up 23 hours (unhealthy)             asterisk-local

```

```bash
Sent RTP packet to      168.86.137.81:17340 (type 00, seq 059142, ts 107040, len 000160)
  == End MixMonitor Recording PJSIP/twilio-endpoint-00000021
[Oct 30 15:53:29] ERROR[28]: cdr_csv.c:275 writefile: Unable to open file /var/log/asterisk//cdr-csv//Master.csv : Permission denied
[Oct 30 15:53:29] WARNING[28]: cdr_csv.c:308 csv_log: Unable to write CSV record to master '/var/log/asterisk//cdr-csv//Master.csv' : Permission denied
[Oct 30 15:53:29] ERROR[28]: cdr_csv.c:275 writefile: Unable to open file /var/log/asterisk//cdr-csv//Master.csv : Permission denied
[Oct 30 15:53:29] WARNING[28]: cdr_csv.c:308 csv_log: Unable to write CSV record to master '/var/log/asterisk//cdr-csv//Master.csv' : Permission denied

```

- 로그 파일을 써야 하는데 권한이 없는 상태

```bash
docker exec -it asterisk-local sh

```

- 도커 컨테이너 내부로 접속

```bash
$ ls -ld /var/log/asterisk/cdr-csv
drwxr-xr-x 2 root root 6 Oct 15 08:00 /var/log/asterisk/cdr-csv

```

- 권한을 확인해 보니, 로그를 써야 하는 디렉터리의 소유자가 root 로 되어 있음

---

# ✅ 해결 방법

## **docker-compose.yaml**

```yaml
version: '3.8'

services:
  asterisk:
    image: andrius/asterisk:latest
    container_name: asterisk-local
    network_mode: "host"

    # 포트 매핑
    #    ports:
    #  - "5060:5060/udp"              # SIP
    #  - "5061:5061/tcp"              # SIP over TLS
    #  - "8088:8088/tcp"              # ARI/WebSocket
    #  - "10000-60000:10000-60000/udp" # RTP (음성)

    # 볼륨 마운트 (설정 영구 저장)
    volumes:
      - ./config:/etc/asterisk
      - ./logs:/var/log/asterisk
      - ./sounds:/var/lib/asterisk/sounds/custom
      - ./record:/var/spool/asterisk/recording

    # 환경 변수
    environment:
      - ASTERISK_UID=1000
      - ASTERISK_GID=1000
      - EXTERNAL_IP=175.45.202.16
      - LOCAL_NET=10.0.0.0/16

    # 재시작 정책
    restart: unless-stopped
    command: asterisk -f -vv

    # 컨테이너가 사용할 명령
    # command: asterisk -cvvvvv  # 콘솔 모드, 디버그 레벨 5

```

- 도커 컴포즈 파일 확인

```yaml
    # 환경 변수
    environment:
      - ASTERISK_UID=1000
      - ASTERISK_GID=1000
      - EXTERNAL_IP=175.45.202.16
      - LOCAL_NET=10.0.0.0/16

```

- 해당 부분을 통해서, 컨테이너 내부의 사용자 ID가 1,000으로 설정됨

```bash
sudo chown -R 1000:1000 ./logs
sudo chown -R 1000:1000 ./sounds
sudo chown -R 1000:1000 ./config

```

- 마운트 한 호스트 디렉터리에 ID가 1,000인 사용자의 권한을 부여함
    - sounds 디렉터리에서도 권한 문제 발생 → 모든 마운트 디렉터리의 권한을 변경해 줌

```bash
docker-compose down
docker-compose up -d

```

- asterisk-local 컨테이너를 재시작

```bash
[root@assist-vg-test asterisk-docker]# docker exec -it asterisk-local sh
$ ls -ld /var/log/asterisk/cdr-csv
drwxr-xr-x 2 asterisk 1000 24 Oct 31 05:51 /var/log/asterisk/cdr-csv

```

- 컨테이너 내부에 재접속하여 확인 → 로그를 써야 하는 디렉터리의 소유자가 asterisk로 변경된 것을 확인

---

# 🔗 레퍼런스
