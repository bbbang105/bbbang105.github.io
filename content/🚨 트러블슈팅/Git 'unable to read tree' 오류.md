---
date: 2025-11-19
tags:
  - troubleshooting
  - git
---
Trouble Shooting

---

# 🚨 문제 상황

## Git 오류가 발생

![](https://velog.velcdn.com/images/hsh111366/post/23107e22-be23-477d-86ef-21b28477e094/image.png)

```bash
Error updating changes: unable to read tree 5c45767595a01c5d6288c486daf12105006a1083
```

회사에서 열심히 개발을 하던 중에, 인텔리제이에서 위와 같은 에러가 발생하며 Git이 제대로 동작하지 않았다.

코드 변경 내역도 추적하지 못 하고, 기존에 있던 커밋들을 푸시하거나 하는 등의 동작도 모두 불가했다.

## git fsck --full 커맨드

```bash
git fsck --full
Checking object directories: 100% (256/256), done.
Checking objects: 100% (190/190), done.
error: refs/heads/main: invalid sha1 pointer 8dbbfc0cbd7f7211f305c42e217804844712a468
error: refs/remotes/origin/HEAD: invalid sha1 pointer 8dbbfc0cbd7f7211f305c42e217804844712a468
error: refs/remotes/origin/customer/sb: invalid sha1 pointer 6834ad373ed0259fd133aa7815424edea1f25ae6
error: refs/remotes/origin/feature/SCRUM-100: invalid sha1 pointer 8e3e53e340033b86bfcddf99a96889d5b447bec2
error: refs/remotes/origin/feature/SCRUM-53: invalid sha1 pointer 10d90edfc5a0b1a1aeda1389a0b0a93310c29b11
error: refs/remotes/origin/feature/SCRUM-53-TEST: invalid sha1 pointer ef91f01c5bd983b3155f1c5b79a6ce52165bbf41
error: refs/remotes/origin/feature/SCRUM-56: invalid sha1 pointer 48d31b4ad21f8c58bdee6b4ee9fbb491c3c1b354
error: refs/remotes/origin/feature/SCRUM-58: invalid sha1 pointer 7c28f328fc6052810e0611bcb47c64d680dccc96
error: refs/remotes/origin/feature/SCRUM-67: invalid sha1 pointer 008f989d7539e7a18c74ab4dd74cc5af108f7b26
error: refs/remotes/origin/feature/SCRUM-96: invalid sha1 pointer bdcf45063eb0501300724c37acdaa2cd05cd0b50
error: refs/remotes/origin/feature/SCRUM-99: invalid sha1 pointer 9302d26d14f4928c69fd6d8e05ceab4901a50f39
error: refs/remotes/origin/main: invalid sha1 pointer 8dbbfc0cbd7f7211f305c42e217804844712a468
error: HEAD: invalid reflog entry 8dbbfc0cbd7f7211f305c42e217804844712a468
error: HEAD: invalid reflog entry 8dbbfc0cbd7f7211f305c42e217804844712a468
...

```

위 커맨드를 통해서 문제가 있는 트리들을 찾아보았다.
모든 부분에서 문제가 있었고..해결을 위해서 웹을 서칭해보았다.

## 웹 서칭

[Git 관련 오류 해결](https://1onelog.tistory.com/7)

-> 다시 Clone 받아라

![](https://velog.velcdn.com/images/hsh111366/post/bdee69e8-5ce7-4f62-8d38-a33e4293472f/image.png)


[관련 PR](https://github.com/desktop/desktop/issues/8673)

-> Cloud에 저장소가 있으면, Git 저장소가 손상될 수 있다는 사실을 파악하게 되었다. 이 때부터 `클라우드`가 문제일 수 있겠다 라는 생각을 가지고 사례를 더욱 찾아보았다.

[국내 커뮤니티](https://www.clien.net/service/board/cm_app/15272321)

-> 얼마 없는 Git과 클라우드 국내 관련 사례를 찾을 수 있었다. 

> 이전에는 단 한 번도 이러한 문제가 발생한 적이 없었는데, **몇 달 전에 무심코 iCloud에 데스크탑 파일들을 모두 동기화 시킨 후로** 해당 문제가 발생하기 시작했다.
>
사실 이 문제는 이번이 두 번째인데, 처음에는 대수롭지 않게 생각을 하고 아깝지만 코드를 날리고 다시 clone 받아 작업을 했었다. 하지만 문제가 반복해서 발생했고, 특히나 작업의 볼륨이 클 때 터지는 경우가 많은 것 같아서 이번에는 조치를 취하기로 결정했다.

---

# ✅ 해결 방법

## iCloud확인

![](https://velog.velcdn.com/images/hsh111366/post/e640273f-38bc-4998-a556-09c4a8037f5d/image.png)

문제가 발생한 프로젝트(socc-assistant-api)가 클라우드에 동기화 되어 있는 상태임을 확인했다.

![](https://velog.velcdn.com/images/hsh111366/post/0232c627-58c6-47b5-a08a-74d0528a6346/image.png)

iCloud 설정으로 들어가서, 동기화 옵션을 꺼준다.

`iCloud Drive 동기화`를 끄면 하위 까지 모두 꺼진다. -> 파일은 냅두고 싶다면, 데스크탑 및 문서 폴더 옵션만 꺼준다.

> **끄기 전에 `데스크탑 & 문서 폴더`를 백업해 두어야 한다!! → 안 하면 다 날라가는 불상사가 생길 수 있다.**

![](https://velog.velcdn.com/images/hsh111366/post/72cfab12-6ec4-4b79-8831-6a98dbaf7433/image.png)


## 로컬 데스크탑에 다시 Clone

슬프지만 이전 변경 내역은 살릴 수 없는 듯하다...

기존 프로젝트를 복제해 두고, 복사 붙여 넣기 하는 방법도 있기는 한데
-> Git에 문제가 생겨서인지 변경 내역이 깔끔하게 안 나와서 그냥 다시 하는 게 더 편했던 것 같다 😂

> 해당 방법으로 완전히 해결이 된 것인지는 추후 확인해보아야 한다.
어찌되었든 **클라우드에 Git 프로젝트를 넣는 것은 예상치 못 한 문제가 발생할 수도 있으니, 지양하도록 하자!**

---
