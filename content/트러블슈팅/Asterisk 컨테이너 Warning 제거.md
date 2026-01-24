---
tags:
  - VG
  - asterisk
  - troubleshooting
date: 2025-12-28
---

### 1. `extensions.conf` 문법 오류 해결

- 문제 상황:
    
    전역 변수(CONSOLE, TRUNK)가 섹션 헤더 없이 파일 중간에 덩그러니 선언되어 있어, Asterisk가 이를 인식하지 못하고 Unknown directive 에러를 발생시킴.
    
- 해결 방법:Ini, TOML
    
    변수 선언부 바로 위에 [globals] 헤더를 추가하여 전역 변수임을 명시.
    
    ```bash
    ; /home/socc/asterisk-docker/config/extensions.conf 수정
    
    [globals]                ; <--- [추가] 이 헤더를 넣어주어야 아래 변수가 정상 인식됨
    CONSOLE=Console/dsp
    TRUNK=Zap/g2
    TRUNKMSD=1
    ```
    

### 2. 불필요한 모듈 에러 및 경고 제거

- 문제 상황:
    
    현재 아키텍처(PJSIP/Websocket)에서 사용하지 않는 물리 전화기(phoneprov)와 구형 기능(ADSI, AEL) 모듈이 로드되면서, 의존성 깨짐(ERROR)과 다수의 WARNING 로그 발생.
    
- 해결 방법:Ini, TOML
    
    modules.conf 파일에 해당 모듈들을 noload 처리하여 비활성화.
    
    ```bash
    ; /home/socc/asterisk-docker/config/modules.conf 수정 (아래 내용 추가)
    
    ; [ERROR 제거] 물리 전화기 자동 프로비저닝 및 의존성 모듈 비활성화
    noload => res_phoneprov.so
    noload => res_pjsip_phoneprov_provider.so
    
    ; [WARNING 제거] 사용하지 않는 AEL 언어 엔진 비활성화
    noload => pbx_ael.so
    
    ; [WARNING 제거] Deprecated 된 ADSI 관련 모듈 비활성화
    noload => res_adsi.so
    noload => app_adsiprog.so
    noload => app_getcpeid.so
    ```
    

### 3. `users.conf` 경고 제거

- 문제 상황:
    
    로그에 users.conf is deprecated 경고가 지속적으로 발생.
    
    파일을 확인해 본 결과, 주석에 **"This configuration file is deprecated"**라고 명시되어 있고, 내용 또한 New User, 1234 같은 사용하지 않는 기본 예제 데이터임이 확인됨.
    
- 해결 방법:Bash
    
    시스템에 불필요한 파일이므로 과감하게 삭제 (또는 내용 비우기).
    
    ```bash
    # 터미널 명령어
    rm /home/socc/asterisk-docker/config/users.conf
    ```
---
