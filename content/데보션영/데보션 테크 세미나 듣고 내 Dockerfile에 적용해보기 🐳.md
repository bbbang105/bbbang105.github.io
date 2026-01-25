---
date: 2024-09-29
aliases:
tags:
  - career
  - devocean
cssclasses:
---


---

# 🧑🏻‍🏫 발표자 소개
- 염근철님
- 현 당근 SRE팀 소속
- 현 Docker Captain

---

# 🐳 도커의 비전
- `Docker Ecosystem` : 도커를 통해 개발자 생태계를 개선시키고자 함
- Speed, Security, Choice

---

# 👍🏻 Image Building & Best Practice
- `Dockerfile`은 도커에서 독자적으로 만들었고 거듭해서 개선시키고 있음

## Best Practice

### 1. `alpine & slim` 이미지를 사용하라

![](https://velog.velcdn.com/images/hsh111366/post/5ba74d36-8e87-4ee9-b1fd-c36ccbf23c14/image.png)

- 용량도 줄어들지만, 보안적으로도 더 안전해짐
- 물론 빌드하는 시간도 줄어듦

### 2. latest는 이미지는 지양하라

![](https://velog.velcdn.com/images/hsh111366/post/4d968d1f-03c8-4603-a34f-2e696e6f48f9/image.png)

-  항상 신버전을 가져오므로 이미지 버전이 변경됨에 따라, 이미지 시스템이 깨질 우려가 있음
- 때문에 특정 버전을 명시해서 사용할 것

### 3. Multi-Stage 빌드를 사용하라

![](https://velog.velcdn.com/images/hsh111366/post/ee905afa-e518-4e1a-ba5b-062c40182ebe/image.png)

- 이미지에 들어가는 파일들은 최종 스테이지에서 생성된 파일들이 들어감
- 때문에 단계를 나누어 필수적인 파일들만 취한다면 또 한 번 용량을 줄일 수 있음

### 4. HEALTHCHECK를 추가하라

![](https://velog.velcdn.com/images/hsh111366/post/2cb634ed-0b7b-4ca9-b1f4-81ddc470493f/image.png)

### 5. `.dockerignore` 파일을 활용하라

![](https://velog.velcdn.com/images/hsh111366/post/98af68b7-1dec-4cfc-b14a-113945c7ceb2/image.png)

- `.gitignore` 파일과 유사한 기능
- 해당 파일에 추가를 해 두면, 추가한 파일이나 폴더 등은 빌드 시에 검사를 하지 않음
- 이를 통해서 빌드 시의 속도를 향상시킬 수 있을 뿐만 아니라, 보안적으로도 좋음

### 6. `--mount=type=??`을 사용하라

![](https://velog.velcdn.com/images/hsh111366/post/81a27312-cd5f-444b-a4ee-d0147d75ce1e/image.png)

- 다양한 타입들을 지원하고 있음 (ex. 바인딩, 캐시 등..)
- `type=cache` 를 지정하게 되면, 어플리케이션을 빌드할 때 이전 파일들을 재사용하여 빌드 속도를 한층 빠르게 만들 수 있음

---

# 🔄 Inner-Loop Developer Workflow

![](https://velog.velcdn.com/images/hsh111366/post/e4724b82-5ae4-4381-ab3d-f2b409a27f89/image.png)

## Docker Init
- Docker Desktop 4.18 버전 이후로 사용 가능
- 위에서 말한 유용한 기능들을 꽤나 잘 만들어 줌

### Docker Init 사용 모습

![](https://velog.velcdn.com/images/hsh111366/post/2a6ddcd5-bfc4-41b0-af19-5c294470acec/image.png)

### Docker Init을 통해 생성된 `Dockerfile`

![](https://velog.velcdn.com/images/hsh111366/post/2469ef43-d99b-43f4-af7a-bf52517b6ee1/image.png)

## Compose Watch

![](https://velog.velcdn.com/images/hsh111366/post/4d61ff2b-9bb3-4668-9939-c56a014fceff/image.png)

- Docker Compose에 추가된 옵션
- Sync, Rebuild, Sync + Restart

### Compose Watch 사용 모습 

![](https://velog.velcdn.com/images/hsh111366/post/c0bee914-1147-477c-a1a8-929f4a80237c/image.png)

- `Rebuild` : 도커 이미지 리빌딩
- `Sync` : 싱크를 맞춰줌
- 명령어 : `docker compose up --watch`

### Compose Watch를 통한 리빌딩

![](https://velog.velcdn.com/images/hsh111366/post/d20eca54-3b67-4f86-b446-0d46d4b5b4dd/image.png)

### Compose Watch를 통한 동기화 및 재실행

![](https://velog.velcdn.com/images/hsh111366/post/2e964c4a-c477-441d-8ac6-cc7b0ef42799/image.png)

- 옵션을 `sync`만 하면 서버가 재실행되지 않기에 반영이 되지 않음
- 때문에 `sync+restart`를 통해 동기화 후 재실행하면 반영이 됨

## Compose Profile

![](https://velog.velcdn.com/images/hsh111366/post/21e15d7c-9bc5-46ce-a549-dcf8f26f2203/image.png)

- PhpMyAdmin은 로컬에서만 사용하고 싶음
- 그런데 로컬에서만 필요한 컨테이너를 모든 compose 파일에 작성하는 경우 불필요한 설정이 될 수 있음

### profile 옵션 활용 모습

![](https://velog.velcdn.com/images/hsh111366/post/bc3155e0-bea6-488c-8dad-cdd9e6ac65fe/image.png)

- 명령어 : `docker compose --profile dev up`
- 위처럼 하면 `profile` 옵션에 `dev`를 지정한 서비스들만 컨테이너 생성 및 실행함

### profile 컨테이너

![](https://velog.velcdn.com/images/hsh111366/post/521df448-073d-4fa8-9913-51ae25f71dbf/image.png)

---

# 🚀 실제 적용 

## 기존 Dockerfile 및 용량

### Dockerfile

```dockerfile
FROM openjdk:17

COPY ./build/libs/onetime-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 용량

![](https://velog.velcdn.com/images/hsh111366/post/28e92c62-97c1-452c-83ab-4e1e2b22154d/image.png)

- 522 MB

## Docker Init 사용

### docker init

![](https://velog.velcdn.com/images/hsh111366/post/8c90c7a8-6862-4d1c-8f2c-a5ab6c4d4a5f/image.png)

- 이미 있으므로 overwrite

### .dockerignore 생성

```
# Include any files or directories that you don't want to be copied to your
# container here (e.g., local build artifacts, temporary files, etc.).
#
# For more help, visit the .dockerignore file reference guide at
# https://docs.docker.com/engine/reference/builder/#dockerignore-file

**/.DS_Store
**/__pycache__
**/.venv
**/.classpath
**/.dockerignore
**/.env
**/.git
**/.gitignore
**/.project
**/.settings
**/.toolstarget
**/.vs
**/.vscode
**/*.*proj.user
**/*.dbmdl
**/*.jfm
**/bin
**/charts
**/docker-compose*
**/compose*
**/Dockerfile*
**/node_modules
**/npm-debug.log
**/obj
**/secrets.dev.yaml
**/values.dev.yaml
LICENSE
README.md
```

- docker init을 통해 생성됨
- Dockerfile은 Java를 잘 지원해주는 것 같지는 않아, 수동으로 변경하기로 결정함

### 수정된 Dockerfile

```dockerfile
# Alpine & Slim 이미지 사용 (용량 및 보안 개선)
# 버전 명시 (latest 지양)
# 최종 이미지의 경량화를 위해 Multi-Stage 빌드 사용
FROM openjdk:17-jdk-slim as build

WORKDIR /app

COPY ./build/libs/onetime-0.0.1-SNAPSHOT.jar app.jar

# 최종 이미지: 경량화된 Alpine 이미지를 사용하여 빌드된 파일을 실행
FROM openjdk:17-jdk-alpine as final

WORKDIR /app

COPY --from=build /app/app.jar app.jar

# HEALTHCHECK 추가
# 컨테이너가 시작된 후 5초마다, 최대 3초 동안 http://localhost:8090으로 헬스 체크
HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=3 \
  CMD curl --fail http://localhost:8090 || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8090
```

- mount를 제외한 모든 옵션을 활용하여 수정함
- 그 결과 아래와 같이 522 MB -> 376 MB 로 이미지 용량이 축소됨

![](https://velog.velcdn.com/images/hsh111366/post/cbcc941c-57ad-4451-bb03-ef427aa07ef7/image.png)

---

# 💡 느낀 점

1. 이전에는 그저 도커 이미지를 만들어주는 용도인 줄 알았던 도커파일에, 이렇게나 많은 옵션을 붙일 수 있다라는 것을 처음 알게 되었다. 또한 이를 활용하여 이미지 용량을 줄일 수 있을 뿐만 아니라, 보안성도 높일 수 있다라는 점이 놀라웠다. 
2. 그동안 도커를 꽤나 사용해보았지만, 잘 알지 못 하고 기본적인 기능만 사용했구나라는 것을 깨닫게 된 순간이었다. 실질적으로 바로 적용해볼 수 있는 팁들이 많이 있어서 흥미로웠고, 적용 후 성과가 나타나니 뿌듯했다.
3. 도커의 도움을 많이 받고 있는 입장에서, 해당 기술에 대해 더욱 관심을 가지고 제대로 공부해보아야겠다는 생각이 들었다!
