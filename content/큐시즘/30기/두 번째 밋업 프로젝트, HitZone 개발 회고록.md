---
date: 2024-12-21
description: "야구 구역 추천 서비스 HitZone의 DDD 리팩토링과 REST Docs+Swagger 적용 과정을 회고합니다."

tags:
  - backend
  - kusitms
  - crew
---

---

# ✍🏻 서론

3주 전인 11월 30일 토요일, 밋업 프로젝트가 공식적으로 종료되었다.

`한국대학생IT경영학회(KUSITMS)` 큐시즘에서는 약 두 달간 진행하는 메인 프로젝트인 `밋업 프로젝트`를 진행하는데, 보통 3명의 기획자 + 2명의 디자이너 + 2명의 프론트엔드 + 2명의 백엔드로 팀이 결성된다.
물론 이는 각 기수마다 변동 가능성이 존재한다.

이전 [29기 때 밋업 프로젝트](https://bbbang105.github.io/%ED%81%90%EC%8B%9C%EC%A6%98/29%EA%B8%B0/2%EA%B0%9C%EC%9B%94-%EA%B0%84%EC%9D%98-%EB%B0%8B%EC%97%85-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%9A%8C%EA%B3%A0%EB%A1%9D-%F0%9F%8F%BB) 이후로 나의 두 번째 밋업 프로젝트인데, 여러 부분에서 느끼고 배운 점들을 정리해보려고 한다 ✍🏻

---

# ⚾️ 나에게 가장 Fit한 Zone에서 야구를 즐겨보세요, HitZone!

우리 서비스의 도메인은 `야구`였다.
도메인 자체가 눈에 띄고 재미있어보였기 때문에 많은 사람들의 관심을 받았었고, 나는 야구를 잘 알지는 못했지만 딱 보았을 때 재미있겠다라는 생각이 들었었다.

기획 & 디자인 친구들이 너무 열심히 만들어줘서 모든 내용을 넣기에는 무리라, 일부분만 가져와서 아래에 적어보려고 한다.

만약 모든 내용이 궁금하다면 아래 깃허브에 들어가서 확인해볼 수 있다! 또한 현재 배포되어있기 때문에 서비스도 이용해 볼 수가 있다❗️

[⚾️ HitZone 바로가기](https://www.hitzone.site)
[🧑🏻‍💻 HitZone GitHub](https://github.com/KUSITMS-30th-TEAM-A)
[💥 HitZone 전시회 소개](https://www.chemical-synergy-with-kusitms.com/archive/1-HitZone)

## ⚾️ 서비스 소개

> **서비스 이름 : 히트존 (HitZone)**

`Hit(히트)`는 야구에서 가장 짜릿한 순간 중 하나를 상징합니다.

타자가 공을 정확히 맞히는 타격은 경기의 흐름을 바꾸고, 관중을 열광시키는 핵심 키워드입니다. 실제로 멀티히트, 싸이클링 히트, 런앤히트 등 타자의 좋은 타격 성적을 포함하는 많은 야구 용어에도 ‘Hit(히트)’가 포함되어 있습니다.

`Zone(존)`은 야구장의 수많은 구역(좌석)들을 의미합니다. 또한, ‘특정한 목적을 위한 지역으로 정해두다’ 라는 뜻을 가진 ‘Zone’을 서비스명에 포함하여 유저의 니즈를 반영한 구역 추천 결과를 제공한다는 점을 드러내고자 합니다.

따라서 `HitZone(히트존)`은 유저가 우리의 서비스를 통해
우리의 유저들이 야구 직관 시 자신의 니즈에 적합한 구역에 앉아
야구 직관의 가장 흥미로운 순간을 관람하도록 나아가고 있습니다! 😉

> **서비스 메인 슬로건**

![슬로건](https://github.com/user-attachments/assets/e28c1bf5-3e66-427d-bf96-00b43f6a363e)


**‘나에게 가장 Fit한 Zone에서 야구를 즐겨보세요, HitZone!’**

`Fit(피트)`는 서비스 명인 Hit(히트)와도 유사한 발음을 가진 동시에, 유저의 야구 직관 성향과 방문 니즈에 가장 적합한 구역을 추천하겠다는 자신감을 의미합니다.
각 구역의 특성과 관람 목적을 고려해 **개인화된 추천**을 제공함으로써,
유저가 자신에게 가장 적합한 좌석을 선택할 수 있도록 돕는 ‘HitZone(히트존)’의 서비스를 상징하는 키워드입니다.

따라서 `HitZone(히트존)`은 단순한 좌석 추천 서비스가 아니라,
**우리 서비스만의 추천 과정을 통해** 팬들에게 가장 '타격감 있는 순간'을 제공하는 공간을 선사하겠다는 약속을 담은 이름입니다.
즉, 야구장에서의 생생한 경험과 설렘을 한 단어에 함축한 강렬한 브랜드를 구축하고자 합니다! ⚾🔥


> **서비스 한 줄 설명**

유저가 ‘히트존’을 통해 **야구장** **방문 니즈에 딱! 맞는 구역**을 추천받을 수 있습니다.

> **문제 인식**

💡 **문제 인식**

- **아이디어 발제 기획 배경**
    - 프로야구 관중 수가 1,000만 명을 돌파한 지금, 야구를 직관하며 겪는 불편함은 여전히 해결되지 못한 과제로 남아 있습니다. ‘구장마다 다른 구역 특성과 유형’, ‘홈/원정 좌석 위치의 변화’, ‘복잡한 층별 안내도’와 같은 다양한 변수는 관람객의 직관 경험을 혼란스럽게 만듭니다.

    - 이러한 문제점에서 출발하여, ‘이 모든 변수들을 한곳에서 편리하게 확인할 수 있는 서비스’를 만들자는 아이디어를 발제했습니다.
    - **히트존(HitZone)** 은 야구 팬뿐만 아니라 야구 문화에 입문하고자 하는 사람들까지 모두가 직관을 더 쉽게 즐길 수 있도록 돕고자 하는 서비스입니다.
    - 야구장에 갈 때, 재밌는 응원과 같은 야구의 매력에만 집중할 수 있도록

      `직관 시 편리함`을 제공하는 서비스를 만들어보고자 합니다.

## 👤 서비스 타겟층 정의

> **유저리서치 인사이트**

![리서치](https://github.com/user-attachments/assets/b5555ca0-b3ba-4e1c-ad3c-66cf6e1809ba)

> **유저 행동 매핑 (Behavior Mapping)**

1️⃣ **설문조사 바탕으로 265명의 응답자를 5개 그룹으로 나누고, 행동변수 도출**

→ **A** : 야구 열성팬, **B** : 가벼운 관람, **C** : 정보 중심, **D** : 먹거리 중시, **E** : 편의성 중시

![매핑1](https://github.com/user-attachments/assets/7cf70b79-9c90-44b4-b2eb-575ae3637be4)

![매핑2](https://github.com/user-attachments/assets/9aca46e7-4308-4705-aa7d-16908504f70f)

2️⃣ **설문조사 데이터 바탕으로 유저 그룹 별 주요 행동 패턴 추출**

→ **A** : 야구 열성팬, **B** : 가벼운 관람, **C** : 정보 중심, **D** : 먹거리 중시, **E** : 편의성 중시

![매핑3](https://github.com/user-attachments/assets/59bdd96d-4bed-48a6-b040-2f89285eecf4)

3️⃣**분포도 바탕으로 주요 그룹 `A+C` / `B+E` 패턴 분석**

![매핑4](https://github.com/user-attachments/assets/982e27e3-82c8-4e4c-9162-5d8eda54d0fa)|![매핑5](https://github.com/user-attachments/assets/2945fa9b-7e45-4e68-98ba-6a5d4bffadfc)
---|---|

4️⃣ **분포도 바탕으로 주요 그룹 `A+C` / `B+E` 유저 표본 분석**

→ **`A+C` :** 높은 야구 관심도와 세부적인 정보를 바탕으로 야구 관람을 하고자 하는 유저 표본

→ **`B+E` :** 비교적 낮은 야구에 대한 관심을 가지고 있으며, 간편하고 편리한 서비스 선호하는 유저 표본

![매핑6](https://github.com/user-attachments/assets/041ce0b6-04e6-4801-a814-daf0747b248c)|![매핑7](https://github.com/user-attachments/assets/97928b7f-5ef9-419b-919a-c3fe7b514f85)
---|---|

💡 **`A+C` / `B+E` 유저 표본의 패턴 분석을 기반으로 아래와 같이 서비스 타겟층을 도출했습니다.**

- `A+C` → 메인 타겟
- `B+E` → 서브 타겟

> **서비스 타겟층 도출**

⭐ **메인 타겟** : 원정경기를 보러 가는 야구 팬

➕ **서브 타겟** : 야구에 대해서 잘 모르지만, 야구 경기를 즐기고 싶은 초보자

## **⭐️ 서비스 핵심 기능**

> **MVP 포함 핵심 기능**

1️⃣ 저희 히트존의 MVP는 **'유저의 니즈에 맞는 각 구장 별 구역 추천'** 입니다.

2️⃣ 2번째 핵심 기능은 ‘**구장별 구역 가이드**’ 입니다.

➕ 저희 서브 기능은 ‘**야구 문화 가이드**’ 입니다.

✳️ 핵심 기능에 이어서 코치마크를 구현했고, 추후 서브 기능과 온보딩, 마이페이지도 함께 구현할 예정입니다.

## 🌟 디자인

> **Branding**

💡 **HitZone**
- ‘HitZone’ 의 ‘n’을 의자 모양으로 형상화 + 야구공을 합쳐서 만든 로고
의자 모양을 형상화해서 유저에게 알맞는 자리(구역)를 추천해주겠다는 의미를 담음

- **‘n’ > 로고 디테일 수정**

![로고수정](https://github.com/user-attachments/assets/adc2fa2f-c0c8-43a6-83a0-2a8ba200d161)

> **Character**

🔥 유형별 5가지 3D캐릭터 제작 완료

![캐릭터](https://github.com/user-attachments/assets/c0bdbb99-e4a8-4367-a8ff-cc8d255a34ea)


> **Design System**

<img width="1920" alt="Design System" src="https://github.com/user-attachments/assets/bb4e8a6c-381b-46e4-8b82-fbfa25d5cc3f">

💡 **Color**
-핑크(피그마>main color>50)가 조화를 상징하는 컬러이기도 하고 (신규) 팬들이 팀에 대한 애정이나 경기에 대한 열정을 표현할 수 있는 컬러로 활용할 수 있음
- 그레이 스케일을 주로 쓰되 메인 컬러는 포인트를 주는 방향으로 활용
- 구장별 다양한 좌석을 구장별로 쓰고 있는 좌석 색상으로 구분

<img width="1453" alt="Color System" src="https://github.com/user-attachments/assets/4406d292-c192-48fe-a4ce-cdd0b94e5e26">

> **구장 컴포넌트**

⛳ **잠실종합운동장**

![잠실](https://github.com/user-attachments/assets/4c9590e3-a851-4571-bc76-6632d9794835)

⛳ **KT위즈파크**

![kt](https://github.com/user-attachments/assets/37537da2-88ef-4cb4-a1b2-aab1506b7cf9)

---

# 🚀 개발 과정

## 목표 설정

저번 29기 밋업 프로젝트를 하면서 배운 점도 많았지만, 개인적으로는 아쉬운 점도 많았었다.

> 1) 기능 구현에 급급해 기획 단계부터 의견을 적극적으로 내지 못 했던 것
2) 코드 리뷰를 적극적으로 하지 못 한 것
3) 리팩토링을 하지 못 한 것
4) 어떠한 기술을 사용할 때 충분한 고민 과정을 거치지 못 한 것 
=> 왜 이걸 사용해야 하는가? 장점과 리스크는 무엇이 있는가? 등..

그래서 이번 30기 밋업 프로젝트에서는 이러한 부분들을 많이 해소하고 싶었고, 나의 개인적인 목표로 삼았었다.

![](https://velog.velcdn.com/images/hsh111366/post/74eb0ad0-a92f-4e45-82c4-56ac994b35ab/image.png)

함께 백엔드 파트를 맡았던 준형이형과 첫 회의 때 나누었던 내용이다.
템플릿 및 PR 룰 설정, 패키지 & 응답 구조, CI/CD 방식 등을 정했고, 마지막으로 각자 얻어가고 싶은 점들을 공유했다.

![](https://velog.velcdn.com/images/hsh111366/post/262bf1a1-1eb0-4aa5-b30f-45221c251e92/image.png)

위와 같았는데, 공통적으로 코드리뷰와 리팩토링에 열망이 있었고 테스트코드의 필요성도 느끼고 있었다. 또한 이번 30기도 NCP와 협업을 진행하며 감사하게도 크레딧 100만원을 받을 수 있었기에, 이를 잘 활용해서 아키텍처에도 많은 고민을 해 보고 싶었다.

## 설계

### ERD

![](https://velog.velcdn.com/images/hsh111366/post/75cd1b60-f892-4cee-a9b0-c4dd18a2d98c/image.png)

ERD는 위와 같았고, 우리는 유저의 접근성을 위해 로그인을 필수로 구현하지 않았기 때문에 유저보다는 다른 도메인이 중심이 된 모습을 띄었다.

### 시스템 아키텍처

![](https://velog.velcdn.com/images/hsh111366/post/43af4864-865b-4d49-ba75-7faf0dd524d5/image.png)

위에서 NCP를 적극 활용해 보고 싶었다고 했으나..사실상 기존에 주로 사용했던 스택들을 그대로 사용하게 되었다. 이 부분이 개인적으로 아쉽기는 했다.

사용 스택 및 선정 이유는 아래와 같다.

🛠 **Stacks**

- `Spring Boot 3.3.4`
- `JDK 17`
- `MySQL`
- `NCP Object Storage` : 정적 리소스 파일을 관리하기 위해 사용하였습니다.
- `NCP Clova Studio` : 챗봇 답변을 도출하기 위한 AI 기능으로 활용하였습니다.
- `Redis` : Refresh Token 관리 & 분산 락에 활용하였습니다.
- `Jwt Token & Cookie` : 유저를 인증하고, 토큰을 안전하게 보관 및 전달하기 위해 사용하였습니다.
- `Nginx` : 웹 서버, 리버스 프록시 등을 사용해 `블루 ↔ 그린 무중단 배포`에 활용하였습니다.
- `Docker` : 프로젝트를 빌드하고 NCP 인스턴스 내부에서 서버 컨테이너를 실행하는데 활용하였습니다.
- `Docker Compose` : 여러 컨테이너가 동일한 환경 & 네트워크에서 실행되도록 하며, 간편하게 컨테이너들을 관리하기 위해 사용하였습니다.
- `NCP Container Registry` : Docker Image를 관리하는데 사용하였습니다.
- `Github Actions` : CICD 작업을 수행하는데 활용하였습니다.

## 기능 구현

사실 구현해야 할 API 자체는 굉장히 적었다!
2달이라는 기간 동안 1달씩 나누어 1 & 2차 기획을 진행했고, 빠르게 개발을 한 후 유저 배포를 해서 점진적으로 개선하는 것이 목표였기에 기능을 많이 잡지 않았었다.

하다 보니 일정이 조금씩 미뤄져 초기 생각했던 기능보다 더 적어졌고, 대부분 조회 로직이었기 때문에 API를 만드는 데에는 시간이 오래 걸리지는 않았다.

![](https://velog.velcdn.com/images/hsh111366/post/72dcd96d-d997-4af7-8848-4f709ec4069e/image.png)

위에 보이는 API가 이번 프로젝트에서 만든 것들의 전부이다. 거의 3주정도 진행한 기업 프로젝트보다 적은 느낌..? 하지만 API를 빠르게 많이 짤 줄 아는 것이 개발을 잘한다는 것의 척도가 아님을 이제는 알았기 때문에, 이 부분에서 전혀 불만은 없었다.

여기서 사실상 내가 구현한 건 Chatbot 부분 밖에 없는 듯 하다..😅
나머지는 함께 한 준형이 형이 아주 빠르게 잘 만들어주었고, 나는 이외에 초기 세팅 & 에러 처리 & CICD 등을 진행했다.

준형이 형은 CICD 과정을 접해본 적이 없었기에 게더에서 화면을 공유하며 실시간으로 배포 및 파이프라인 구축을 함께 진행했었다.

나도 완벽히 아는 것이 아니라 생각한 것보다 시간도 조금 더 걸리고 매끄럽지는 않았으나.. 그래도 누군가에게 설명을 해주며 진행할 수 있음에 뿌듯하기도 했었고 배운 점들도 있었다!

## REST Docs + Swagger

나는 지금까지 프로젝트를 하면서 API 문서화를 `노션`으로만 진행했었다.
Swagger나 Postman 등 다양한 툴이 있는데 왜 노션만 사용했냐...처음에 하던 걸 그대로 지금까지 사용했기 때문이다 😅

이제는 그러지 않고 변화를 주어야겠다는 생각을 했고, `Swagger`를 처음으로 사용해 보려고 했다. 또한 큐시즘 초반 `큐토리얼` 커리큘럼에서 알게 된 `Rest Docs`를 함께 적용하여 여러 부분에서 이점을 취하고자 했다.

처음에는 적응도 잘 안되고 테스트코드도 계속해서 작성해야 해서 번거로웠지만.. 하다 보니 적응도 되었고 굳이 수동으로 문서를 수정하지 않아도 되어서 매우 편리했다.
기존에는 API에 변화가 생기면 노션에 들어가 직접 동기화를 시켜주어야 했고, 혹시나 잊게 된다면 프론트엔드 측에서 잘못된 코드를 작성할 수 있기 때문에 문제가 있었다.

[📄 API 문서](https://git.hitzone.store/swagger-ui/index.html#/)

프론트엔드 측에 위 링크만 넘겨주면 되었고, 자유로운 커스터마이징이나 직접 테스트도 가능해서 이점이 많았다. 왜 이제서야 이러한 방법들을 사용했는지 그동안의 나의 모습을 반성하게 되었다 🥲

또한 프로젝트를 하던 중 이와 관련해서 [트러블 슈팅을 한 내용](https://bbbang105.github.io/%ED%8A%B8%EB%9F%AC%EB%B8%94%EC%8A%88%ED%8C%85/%EB%B0%B0%ED%8F%AC-%EC%84%9C%EB%B2%84%EC%97%90%EC%84%9C%EB%8A%94-%EC%99%9C-REST-Docs%EA%B0%80-%EC%A0%81%EC%9A%A9%EB%90%98%EC%A7%80-%EC%95%8A%EC%95%98%EC%9D%84%EA%B9%8C)도 블로그에 작성하며, 조금 더 이해도를 높일 수 있었다 😄

## Record 사용

기존에는 DTO를 일반 클래스로 만들었었는데, 이를 Record로 만들면 여러 이점이 있다는 것을 알게 되어 이번에는 도입해보았다.

![](https://velog.velcdn.com/images/hsh111366/post/7cf9f0a4-6716-4911-a547-a49ea32bf19c/image.png)|![](https://velog.velcdn.com/images/hsh111366/post/dc3f98e0-85eb-4b96-aae7-982c9e7bd3e0/image.png)
---|---|

그리고 이런 식으로 무언가를 새롭게 도입하려 할 때는 형과 이야기를 많이 나누었다! 이 기술이 어떤 것이고 우리 상황에서 왜 좋은지, 사용하게 되면 어떤 점들을 바꾸어야 하는지 등 대화를 나누며 자연스럽게 학습할 수 있었다.

둘 다 대충 넘어가려는 성격이 아니었고, 뇌피셜이 아닌 여러 자료들을 가져와 설명해서 더욱 대화가 잘 통했던 것 같다 👍🏻

> RequestDto

```java
public record SaveTopRankedZoneRequestDto(
        @NotBlank(message = "스티디움명은 공백 또는 빈 값일 수 없습니다.") String stadium,
        @NotBlank(message = "선호 구역은 공백 또는 빈 값일 수 없습니다. 또한, 1루석 혹은 3루석으로 입력해주세요.") String preference,
        @NotEmpty(message = "키워드 배열은 빈 값이어선 안됩니다.") @Size(min = 1, message = "키워드 배열은 최소 한 개 이상의 값이 있어야 합니다.") String[] clientKeywords
) {
}

```
> ResponseDto

```java
public record GetEntertainmentsResponseDto(
        List<EntertainmentDto> entertainments
) {
    public record EntertainmentDto(
            String imgUrl,
            Boundary boundary,
            String name,
            List<String> explanations,
            List<String> tips
    ) {
        public static EntertainmentDto from(Entertainment entertainment) {
            return new EntertainmentDto(
                    entertainment.getImgUrl(),
                    entertainment.getBoundary(),
                    entertainment.getName(),
                    entertainment.getExplanations(),
                    entertainment.getTips()
            );
        }
    }

    public static GetEntertainmentsResponseDto of(List<EntertainmentDto> entertainments) {
        return new GetEntertainmentsResponseDto(entertainments);
    }
}

```

위와 같은 구조로 DTO를 구성하였고, 어노테이션을 붙일 필요가 없어 이전에 비해 간결한 코드를 유지할 수가 있었다! 

또한 Record에서 `Builder`는 지원하지 않기 때문에 이를 굳이 사용하지 않고, 정적 팩토리 메서드를 만들어서 새로운 객체를 반환해주었다.

개인적으로 Record를 사용하는 것이 마음에 들기 때문에 앞으로도 사용하려고 한다 😁

## 전역 에러 처리

이번 프로젝트를 하며 많이 알아보고 또 가장 많이 배운 부분이지 않나 싶다!

원래도 `GlobalExceptionHandler`를 두어 전역 에러 처리를 하는 방식을 사용했었는데, 도메인마다 `UserException` 이런식으로 클래스를 따로 만들어주었기에 코드가 너무 길어지는 경향이 있었다.

때문에 준형이 형이 `CustomException`으로 통일하자는 의견을 내고 구현해주었고, 그 방식을 채택하며 각 도메인 별 예외는 `CustomException`으로 묶어서 처리할 수가 있었다.

또한 이번에는 유효성 에러 등을 처리하며 잘 알지 못 했던 여러 에러들에 대한 처리 방식도 알 수 있었는데, 결론적으로 아래와 같은 에러 처리를 할 수 있었다.

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // 커스텀 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleCustomException(CustomException e) {
        logError(e.getMessage(), e);
        return ApiResponse.onFailure(e.getErrorCode());
    }

    // Security 인증 관련 처리
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleSecurityException(SecurityException e) {
        logError(e.getMessage(), e);
        return ApiResponse.onFailure(ErrorStatus._UNAUTHORIZED);
    }

    // IllegalArgumentException 처리 (잘못된 인자가 전달된 경우)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleIllegalArgumentException(IllegalArgumentException e) {
        String errorMessage = "잘못된 요청입니다: " + e.getMessage();
        logError("IllegalArgumentException", errorMessage);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // NullPointerException 처리
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleNullPointerException(NullPointerException e) {
        String errorMessage = "서버에서 예기치 않은 오류가 발생했습니다. 요청을 처리하는 중에 Null 값이 참조되었습니다.";
        logError("NullPointerException", e);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._INTERNAL_SERVER_ERROR, errorMessage);
    }

    // NumberFormatException 처리
    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleNumberFormatException(NumberFormatException e) {
        String errorMessage = "숫자 형식이 잘못되었습니다: " + e.getMessage();
        logError("NumberFormatException", e);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // IndexOutOfBoundsException 처리
    @ExceptionHandler(IndexOutOfBoundsException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleIndexOutOfBoundsException(IndexOutOfBoundsException e) {
        String errorMessage = "인덱스가 범위를 벗어났습니다: " + e.getMessage();
        logError("IndexOutOfBoundsException", e);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // ConstraintViolationException 처리 (쿼리 파라미터에 올바른 값이 들어오지 않은 경우)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleValidationParameterError(ConstraintViolationException ex) {
        String errorMessage = ex.getMessage();
        logError("ConstraintViolationException", errorMessage);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // MissingRequestHeaderException 처리 (필수 헤더가 누락된 경우)
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleMissingRequestHeaderException(MissingRequestHeaderException ex) {
        String errorMessage = "필수 헤더 '" + ex.getHeaderName() + "'가 없습니다.";
        logError("MissingRequestHeaderException", errorMessage);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // DataIntegrityViolationException 처리 (데이터베이스 제약 조건 위반)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        String errorMessage = "데이터 무결성 제약 조건을 위반했습니다: " + e.getMessage();
        logError("DataIntegrityViolationException", e);
        return ApiResponse.onFailureWithCustomMessage(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // MissingServletRequestParameterException 처리 (필수 쿼리 파라미터가 입력되지 않은 경우)
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex,
                                                                          HttpHeaders headers,
                                                                          HttpStatusCode status,
                                                                          WebRequest request) {
        String errorMessage = "필수 파라미터 '" + ex.getParameterName() + "'가 없습니다.";
        logError("MissingServletRequestParameterException", errorMessage);
        return ApiResponse.onFailureForOverrideMethod(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // MethodArgumentNotValidException 처리 (RequestBody로 들어온 필드들의 유효성 검증에 실패한 경우)
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        String combinedErrors = extractFieldErrors(ex.getBindingResult().getFieldErrors());
        logError("Validation error", combinedErrors);
        return ApiResponse.onFailureForOverrideMethod(ErrorStatus._BAD_REQUEST, combinedErrors);
    }

    // NoHandlerFoundException 처리 (요청 경로에 매핑된 핸들러가 없는 경우)
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex,
                                                                   HttpHeaders headers,
                                                                   HttpStatusCode status,
                                                                   WebRequest request) {
        String errorMessage = "해당 경로에 대한 핸들러를 찾을 수 없습니다: " + ex.getRequestURL();
        logError("NoHandlerFoundException", errorMessage);
        return ApiResponse.onFailureForOverrideMethod(ErrorStatus._NOT_FOUND_HANDLER, errorMessage);
    }

    // HttpRequestMethodNotSupportedException 처리 (지원하지 않는 HTTP 메소드 요청이 들어온 경우)
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                         HttpHeaders headers,
                                                                         HttpStatusCode status,
                                                                         WebRequest request) {
        String errorMessage = "지원하지 않는 HTTP 메소드 요청입니다: " + ex.getMethod();
        logError("HttpRequestMethodNotSupportedException", errorMessage);
        return ApiResponse.onFailureForOverrideMethod(ErrorStatus._METHOD_NOT_ALLOWED, errorMessage);
    }

    // HttpMediaTypeNotSupportedException 처리 (지원하지 않는 미디어 타입 요청이 들어온 경우)
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
                                                                     HttpHeaders headers,
                                                                     HttpStatusCode status,
                                                                     WebRequest request) {
        String errorMessage = "지원하지 않는 미디어 타입입니다: " + ex.getContentType();
        logError("HttpMediaTypeNotSupportedException", errorMessage);
        return ApiResponse.onFailureForOverrideMethod(ErrorStatus._UNSUPPORTED_MEDIA_TYPE, errorMessage);
    }

    // HttpMessageNotReadableException 처리 (잘못된 JSON 형식)
    @Override
    public ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                                                               HttpHeaders headers,
                                                               HttpStatusCode status,
                                                               WebRequest request) {
        String errorMessage = "요청 본문을 읽을 수 없습니다. 올바른 JSON 형식이어야 합니다.";
        logError("HttpMessageNotReadableException", ex);
        return ApiResponse.onFailureForOverrideMethod(ErrorStatus._BAD_REQUEST, errorMessage);
    }

    // 내부 서버 에러 처리 (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorReasonDto>> handleException(Exception e) {
        logError(e.getMessage(), e);
        return ApiResponse.onFailure(ErrorStatus._INTERNAL_SERVER_ERROR);
    }

    // 유효성 검증 오류 메시지 추출 메서드 (FieldErrors)
    private String extractFieldErrors(List<FieldError> fieldErrors) {
        return fieldErrors.stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
    }

    // 로그 기록 메서드
    private void logError(String message, Object errorDetails) {
        log.error("{}: {}", message, errorDetails);
    }
}

```

코드를 구현하면서 여러 부분들에서 고민을 많이 하고 블로그 글들도 많이 찾아봤었는데, 이는 아래 PR들에서 확인해볼 수가 있다!

[전역 에러 처리 관련 PR1](https://github.com/KUSITMS-30th-TEAM-A/backend/pull/4)
[전역 에러 처리 관련 PR2](https://github.com/KUSITMS-30th-TEAM-A/backend/pull/24)
[전역 에러 처리 관련 PR3](https://github.com/KUSITMS-30th-TEAM-A/backend/pull/36)

또한 학습한 내용들을 까먹지 않고 기록해두고 싶어서, 아래 글들로도 남겨두었다! 
특히 세 번째 글의 경우에는 우리 팀이 아닌 다른 팀의 트러블 슈팅을 도와준 경험이었는데, 이 과정을 통해서 스프링 MVC의 요청 처리 과정에 대해서도 학습할 수 있어서 아주 유익했다 😄

![](https://velog.velcdn.com/images/hsh111366/post/8e377e5d-88b0-441b-b49a-68025bd7a5dc/image.png)

[에러를 쥐잡듯이 잡아보자1](https://bbbang105.github.io/Spring/%EC%97%90%EB%9F%AC%EB%A5%BC-%EC%A5%90%EC%9E%A1%EB%93%AF%EC%9D%B4-%EC%9E%A1%EC%95%84%EB%B3%B4%EC%9E%90-1)
[에러를 쥐잡듯이 잡아보자2](https://bbbang105.github.io/Spring/%EC%97%90%EB%9F%AC%EB%A5%BC-%EC%A5%90%EC%9E%A1%EB%93%AF%EC%9D%B4-%EC%9E%A1%EC%95%84%EB%B3%B4%EC%9E%90-2)
[에러를 쥐잡듯이 잡아보자3](https://bbbang105.github.io/Spring/%EC%97%90%EB%9F%AC%EB%A5%BC-%EC%A5%90%EC%9E%A1%EB%93%AF%EC%9D%B4-%EC%9E%A1%EC%95%84%EB%B3%B4%EC%9E%90-3)

## 테스트코드

이번에는 위에서 언급한 것처럼 Rest Docs를 사용했기 때문에 테스트 코드 작성이 반강제(?)적이었다.

그래서 아래와 같이 컨트롤러와 서비스단 테스트 코드를 작성했다.

![](https://velog.velcdn.com/images/hsh111366/post/14ac15d7-7178-4510-a302-f9bfc6b14a43/image.png)

```java
@WebMvcTest(ChatbotController.class)
public class ChatbotControllerTest extends ControllerTestConfig {

    @MockBean
    private ChatbotApplicationService chatbotApplicationService;

    @Test
    @DisplayName("가이드 챗봇 답변 조회")
    public void getGuideChatbotAnswer() throws Exception {
        // given
        GetGuideChatbotAnswerResponseDto response = new GetGuideChatbotAnswerResponseDto(
                """
                    각 구장에 위치한 굿즈샵에서 원하는 응원 도구를 구매할 수 있어요!
                    잠실 야구장의 경우, 지하철 2호선 '종합운동장역' 6번 출구 앞에 위치한 야구 용품샵 '유니크 스포츠'를 이용할 수 있어요! 홈팀인 엘지 트윈스와 두산 베어스의 굿즈 뿐만 아니라, 원정팀들의 굿즈도 있으니 한 번 방문해보세요!
                    종합운동장역을 나가기 전, 역사에 위치한 ‘라커디움파크 종합운동장역점’에서도 굿즈를 판매 중이에요!""",
                null,
                null,
                null);

        Mockito.when(chatbotApplicationService.getGuideChatbotAnswer(anyString(), anyString(), anyInt()))
                .thenReturn(response);

        // when
        ResultActions resultActions = this.mockMvc.perform(RestDocumentationRequestBuilders.get("/api/v1/chatbot/guide")
                .param("stadiumName", "lg")
                .param("categoryName", "stadium")
                .param("orderNumber", "3")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        // then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.message").value("가이드 챗봇 답변을 가져오는 데 성공했습니다."))
                .andExpect(jsonPath("$.payload.answer").value("""
                    각 구장에 위치한 굿즈샵에서 원하는 응원 도구를 구매할 수 있어요!
                    잠실 야구장의 경우, 지하철 2호선 '종합운동장역' 6번 출구 앞에 위치한 야구 용품샵 '유니크 스포츠'를 이용할 수 있어요! 홈팀인 엘지 트윈스와 두산 베어스의 굿즈 뿐만 아니라, 원정팀들의 굿즈도 있으니 한 번 방문해보세요!
                    종합운동장역을 나가기 전, 역사에 위치한 ‘라커디움파크 종합운동장역점’에서도 굿즈를 판매 중이에요!"""))
                .andExpect(jsonPath("$.payload.imgUrl").isEmpty())
                .andExpect(jsonPath("$.payload.linkName").isEmpty())
                .andExpect(jsonPath("$.payload.link").isEmpty())

                // docs
                .andDo(MockMvcRestDocumentationWrapper.document("chatbot/guide",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        resource(
                                ResourceSnippetParameters.builder()
                                        .tag("Chatbot")
                                        .description("가이드 챗봇 답변을 조회한다.")
                                        .queryParameters(
                                                parameterWithName("stadiumName").description("경기장 이름 [예시: lg]"),
                                                parameterWithName("categoryName").description("카테고리 이름 [예시: stadium]"),
                                                parameterWithName("orderNumber").description("질문 번호 [예시: 3 (NUMBER type)]")
                                        )
                                        .responseFields(
                                                fieldWithPath("isSuccess").type(JsonFieldType.BOOLEAN).description("성공 여부"),
                                                fieldWithPath("code").type(JsonFieldType.STRING).description("응답 코드"),
                                                fieldWithPath("message").type(JsonFieldType.STRING).description("응답 메시지"),
                                                fieldWithPath("payload").type(JsonFieldType.OBJECT).description("응답 데이터"),
                                                fieldWithPath("payload.answer").type(JsonFieldType.STRING).description("답변"),
                                                fieldWithPath("payload.imgUrl").type(JsonFieldType.STRING).description("이미지 URL").optional(),
                                                fieldWithPath("payload.linkName").type(JsonFieldType.STRING).description("링크 버튼 이름").optional(),
                                                fieldWithPath("payload.link").type(JsonFieldType.STRING).description("링크 URL").optional()
                                        )
                                        .responseSchema(Schema.schema("GetGuideChatbotAnswerResponse"))
                                        .build()
                        )
                ));
    }
```

API 문서화를 위해서는 컨트롤러 테스트 코드만 작성해도 가능하며, 코드 중 `// docs` 주석 부터가 문서화를 위한 코드이다.

전반적인 테스트 코드를 작성했다는 점에서는 뿌듯했지만 아래와 같은 점들이 아쉬움에 남았다.

> 1) API 문서화를 위한 테스트 코드를 작성한 것만 같았다.
2) 테스트 코드에 대한 명확한 이해로 구성된 코드들이 아니다. 대부분 AI의 힘을 빌렸다.
3) 에러 시나리오 등 다양한 상황을 고려하지 못 했다. 단순히 성공 시의 테스트만 진행했다.

시간이 부족해서 그랬다는 변명을 하고 싶기는 하지만, 테스트 코드의 중요성을 점점 깨닫고 있기 때문에 앞으로 진행하는 프로젝트들에서는 이런 부분의 큰 개선이 이루어져야할 것이다.

## 코드 리뷰

이번에는 둘 다 코드리뷰에 열망이 컸고, 또한 협업 스타일이 잘 맞았기 때문에 그 열망을 해소할 수가 있었다!

![](https://velog.velcdn.com/images/hsh111366/post/a43c15ed-b1c3-439a-bf0b-2f119ceb9883/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/d7b122cf-b9da-4895-b0d2-113a6403279b/image.png)

대화를 나눈 내용이 너무 많아 일부분만 가져와 보았다..
이런 식으로 상대가 올린 PR에 대한 코드리뷰를 진행했고, 최종적으로 `Approve`를 받아야만 `Merge`할 수 있도록 하였다. 

룰을 설정해두었기 때문에 자연스럽게 상대방과 소통하며 서로의 코드를 꼼꼼히 보게 되었고, 내가 작성한 코드가 아니라도 함께 작성한 것처럼 이해도를 높일 수 있었다.

![](https://velog.velcdn.com/images/hsh111366/post/570db295-843d-45f2-9d68-efe579a4d286/image.png)

가장 많이 나눈 코멘트는 60개... 솔직히 가끔은 시간이 없어서 `대충 보고 Approve 할까?` 라는 생각이 든 적도 있었는데, 생각보다 이 과정에서 배우는 점이 너무나도 많았고 함께 하는 준형이형이 너무 열심히 해주었기에 포기할 수가 없었다.

또한 PR 자체를 꼼꼼히 적어 두니, 나중에 다시 보고 참고하기에도 용이했다.

이정도로 코드리뷰를 제대로 진행한 적은 처음이었던 것 같은데, 개인적으로 아주 만족도가 높았고 형과 성향이 잘 맞아서 다행이었다고 생각한다 👍🏻👍🏻

## 리팩토링

![](https://velog.velcdn.com/images/hsh111366/post/7e9d812c-7ab4-4fb9-8e8a-0f80c20e344f/image.png)


밋업 프로젝트 개발 종료 약 3주 전쯤, 백엔드 심사위원 분께 [코드리뷰](https://github.com/KUSITMS-30th-TEAM-A/backend/pull/44)를 받을 수 있었다.
A팀이라 첫 순서여서 그런지, 무려 24개나 코멘트를 정성스럽게 남겨주셔서 감사했다. 

하지만 생각지 못하게 DDD에 대한 내용들이 주로 이어졌는데, 우리는 DDD 구조로 개발했다고 생각하지 못 했지만 심사위원 분께서는 그렇게 판단하신 듯 했다.

때문에 처음에는 코멘트 자체를 이해도 못 하고, 리팩토링은 손도 못 대고 있다가... 프로젝트 후반부에 시간이 조금 남아서 형과 함께 대대적으로 리팩토링을 진행했다.

`하는 김에 남겨주신 코멘트들에 대해서는 다 리팩토링 하고 답을 남겨보자!` 라는 둘의 목표를 설정했고, 아래와 같이 PR에 어떤 코멘트에 대해서 해결했는지를 남겨두었다.

![](https://velog.velcdn.com/images/hsh111366/post/a5153f9f-e0d3-475a-b55c-26a71cd99a9f/image.png)

![](https://velog.velcdn.com/images/hsh111366/post/eace056e-47ef-4a28-a3ca-e80d3b8e626c/image.png)

리팩토링 한 부분들은 아래와 같다.

### 1. DDD 구조로 변경

우선은 기존에 애매했던 패키지 구조를 아예 DDD 구조로 변경하였다.

> 기존

```
- global
- user
    - application
    - domain
        - entity
            - entity
            - enum
        - repository
            - ~repository
            - custom
                - ~customRepository
                - ~impl
    - dto
        - request
        - response
    - presentation (= controller)
    - exception
        - ~Exception
        - ~ErrorResult
        
        …
        
- board
```

> 변경 후

```
- global
- result
    - application
        - dto
            - request
            - response
        - service
    - domain
        - enums
        - model
        - repository
        - service
        - util
    - presentation
    - status
    - infra
        - jpa
            - entity
            - repository
            - repositoryImpl
        - mapper
- stadium
- user
```

대표적인 변경점은 아래와 같다.

> 1) Application Service와 Domain Service로 구분
2) domain과 entity로 구분
3) domain <-> entity 변환을 위해 mapper 도입
4) 애그리거트, 애그리거트 루트 개념 도입
5) 직접 참조 -> 간접 참조로 변경

패키지 구조를 변경하는 것이 가장 큰 난제였는데..준형이 형이 정말 열심히 먼저 해줘서 나는 따라서 잘할 수 있었다. 

![](https://velog.velcdn.com/images/hsh111366/post/a2aecbf8-a9ad-4b89-a6ee-b0e4511976df/image.png)

이렇게 학습한 내용을 노션에도 정리해주었고,

![](https://velog.velcdn.com/images/hsh111366/post/999e7beb-4b53-42bb-946a-712a9d4589e1/image.png)

[PR](https://github.com/KUSITMS-30th-TEAM-A/backend/pull/84)에도 자세히 알려주어 큰 도움이 되었다! 

### 2. Javadoc 주석 작성

![](https://velog.velcdn.com/images/hsh111366/post/c18ba6c0-ea62-4e39-b81e-dca2b1fa95ee/image.png)

### 3. Handler의 명확한 역할 설정

![](https://velog.velcdn.com/images/hsh111366/post/fdf31b67-36e3-4aa0-b03e-831a4e131d41/image.png)

### 4. 클라이언트의 프로토콜은 컨트롤러 단에서 처리

![](https://velog.velcdn.com/images/hsh111366/post/59de30b1-9c75-4e7f-9d7d-fcaffa5dd8d1/image.png)

### 5. reactive 기술의 block 제거 -> 비동기 방식 사용

챗봇 기능을 위해서는 외부 API (네이버 클로바 스튜디오) 연동이 필요했고, 이를 위해서 `WebClient`를 사용했다. 해당 스택에 대한 깊은 이해가 있지는 않았기에 `block` 을 사용해서 원하는 정보를 얻은 후 바로 연결을 끊어버렸었는데 아래와 같은 코멘트를 받게 되었다.

```
reactive 기술을 사용하셨는데요.
여기서 block을 하게되면 reactive의 장점을 누리지 못할 가능성이 큽니다.
(관련해서 reactive 방식의 프로그래밍을 했을때 왜 빨라지는지 알아보셔도 좋을거 같아요)

하지만, webClient는 편하기 때문에 비슷한 대안으로 RestClient라는게 있으며 FeignClient를 사용하시는것도 매우 편하기 때문에 추천드려요.
```

때문에 block을 사용하지 않으며 reactive 방식의 장점을 살려보기 위해 리팩토링을 진행했다!

> 기존 코드

```java
    @Override
    public String requestChatbot(ChatbotRequest request) {
        if (!(request instanceof ClovaRequest clovaRequest)) {
            throw new CustomException(ChatbotErrorStatus._INVALID_CHATBOT_REQUEST);
        }

        try {
            ClovaChatbotAnswer clovaChatbotAnswer = webClient.post()
                    .bodyValue(clovaRequest)
                    .retrieve()
                    .bodyToMono(ClovaChatbotAnswer.class)
                    .block();

            if (clovaChatbotAnswer == null || clovaChatbotAnswer.result() == null || clovaChatbotAnswer.result().message() == null) {
                throw new CustomException(ChatbotErrorStatus._NOT_FOUND_GUIDE_CHATBOT_ANSWER);
            }

            return clovaChatbotAnswer.result().message().content();

        } catch (WebClientResponseException e) {
            // 외부 API 응답 처리 중 발생한 예외 처리
            throw new CustomException(ChatbotErrorStatus._CHATBOT_API_COMMUNICATION_ERROR);
        } catch (Exception e) {
            // 기타 예외 처리
            throw new CustomException(ChatbotErrorStatus._CHATBOT_API_COMMUNICATION_ERROR);
        }
    }
```

> 변경 코드

```java
    @Override
    public Mono<String> requestChatbot(ChatbotRequest request) {
        if (!(request instanceof ClovaRequest clovaRequest)) {
            return Mono.error(new CustomException(ChatbotErrorStatus._INVALID_CHATBOT_REQUEST));
        }

        return webClient.post()
                .bodyValue(clovaRequest)
                .retrieve()
                .bodyToMono(ClovaChatbotAnswer.class)
                .flatMap(clovaChatbotAnswer -> {
                    if (clovaChatbotAnswer == null || clovaChatbotAnswer.result() == null || clovaChatbotAnswer.result().message() == null) {
                        return Mono.error(new CustomException(ChatbotErrorStatus._NOT_FOUND_GUIDE_CHATBOT_ANSWER));
                    }
                    return Mono.just(clovaChatbotAnswer.result().message().content());
                })
                .onErrorMap(WebClientResponseException.class, e -> new CustomException(ChatbotErrorStatus._CHATBOT_API_COMMUNICATION_ERROR))
                .onErrorMap(Exception.class, e -> new CustomException(ChatbotErrorStatus._CHATBOT_API_COMMUNICATION_ERROR));
    }
```

기존에는 `block`을 사용했는데, 이는 비동기가 아닌 동기 처리로 응답이 올 때까지 기다리게 된다.

만약 1,000명의 유저가 챗봇을 동시 사용할 때, 1명의 유저를 처리하는 과정에서 처리가 늦어지면 비동기 처리에 비해 월등하게 속도가 느려진다는 단점이 존재한다. 때문에 `block`을 제거하고 reactive 기술의 흐름을 살리는 방향으로 변경하게 되었다.

[참고 블로그](https://daydayplus.tistory.com/41)

이 과정에서 테스트 코드 또한 아래와 같이 일부 변경해야만 했다.

> 기존 코드

```java
        // when
        ResultActions resultActions = this.mockMvc.perform(RestDocumentationRequestBuilders.post("/api/v1/chatbot/clova")
                .content(clovaChatbotAnswerJsonRequest)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        // then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.message").value("네이버 클로바 챗봇 답변을 가져오는 데 성공했습니다."))
                .andExpect(jsonPath("$.payload.answer").value("안녕하세요! 저는 야구 가이드 챗봇 '루키'에요! 야구에 대한 궁금한 점이 있다면 언제든지 물어봐 주세요!"))
```

> 변경 코드

```java
        // when
        MvcResult mvcResult = this.mockMvc.perform(
                        RestDocumentationRequestBuilders.post("/api/v1/chatbot/clova")
                                .content(clovaChatbotAnswerJsonRequest)
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andExpect(request().asyncStarted()) // 비동기 처리 시작 확인
                .andReturn();

        this.mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.message").value("네이버 클로바 챗봇 답변을 가져오는 데 성공했습니다."))
                .andExpect(jsonPath("$.payload.answer").value(
                        "안녕하세요! 저는 야구 가이드 챗봇 '루키'에요! 야구에 대한 궁금한 점이 있다면 언제든지 물어봐 주세요!"
                ))
```

중요 변경점은 아래와 같았다.

>1) `.andExpect(request().asyncStarted())` : 비동기 처리를 시작합니다.
2) `asyncDispatch(mvcResult)` : 비동기 작업이 종료될 때까지 기다리고 최종 응답을 가져옵니다.
3) `.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))` : application/json 이 아닌 application/json;charset=UTF-8 의 경우에도 호환 허용합니다.

이전에도 WebClient를 두 번 정도 사용하면서 깊이 이해해보려고 하지는 않았는데, 이번 기회로 조금은 알 수 있어서 좋았던 것 같다! 👍🏻

리팩토링 한 부분들은 이외에도 더 많지만, 내가 진행했던 부분들 중 중요한 것들은 이정도로 말할 수 있을 것 같다.
함께 학습하며 더 나은 코드를 만들기 위한 노력의 과정들이 개인적으로 너무 재미있었고 뿌듯했다 🙃

---

# 🎬 마무리

## 느낀 점 & 배운 점

### 1. REST Docs + Swagger를 활용한 API 문서화

개인적으로 이번에 제대로 써볼 수 있어서 아주 좋았던 것 같다! 때문에 진행 중인 다른 사이드 프로젝트에도 이를 적용해서 문서화를 적용할 수가 있었다. 자연스레 테스트 코드를 작성하게 되었고, 테스트 코드에 더욱 관심이 생긴 점도 추가적인 수확인 것 같다.

### 2. DTO를 Record로 구성

이번 프로젝트에서 처음 도입해 본 부분인데 개인적으로 마음에 들었다! 특히 무조건적으로 좋아서 선택한 것이 아니고 장점과 리스크 등을 고려한 후에 선택한 것이라 더욱 좋았다.

### 3. 에러 처리에 대한 이해도

이전에도 에러 처리를 진행하기는 했었지만 깊은 이해를 가지지는 못 했던 것 같다. 하지만 이번에는 어느 정도 시간적 여유도 있었기에, 내부 구조까지 파악해 보며 이해도를 높일 수가 있었다. 에러 처리를 꼼꼼히 하는 것이 개인적인 성향에도 잘 맞기 때문에, 만족스러운 부분이다.

기능을 빠르게 잘 찍어내는 것보다, 서비스를 운영하면서 필연적으로 생길 여러 문제들을 잘 해결할 수 있는 것이 개발자에게는 더 중요하다고 생각한다. 이를 위해서는 어느 지점 그리고 어떤 상황에서 문제가 생긴 것인지를 파악하는 것이 시간을 많이 단축시켜주는데, 에러 처리와 로깅이 잘 되어있다면 효율성이 많이 올라가게 된다.

다음에는 좋은 로깅에 대해서도 학습하고 적용해 보고 싶다!

### 4. DDD 구조의 도입

사실 정확히 DDD가 무엇인지, 무엇이 좋은지를 알고 도입한 것은 아니기 때문에 약간은 아쉽기는 하나 그래도 따라해보기라도 해봤다는 것에 의의를 두고 싶다.
기존 구조를 변경하는 경험도 머리가 많이 아팠지만 의미가 있었고, 이러한 경험들을 통해 초기 설계가 정말 중요하다는 점을 다시금 느낄 수 있었다.

다음에 DDD를 적용할 때에는 학습을 좀 더 진행한 후에 제대로 해 보고 싶다!

### 5. 명확한 역할 분배

이전에는 대부분의 로직을 서비스에 두고, 컨트롤러에서는 요청을 받고 서비스로 넘겨 다시 응답을 반환하는 역할만을 주었다. 반면 이번에는 리팩토링을 하며 HTTP 프로토콜(쿠키 설정)은 컨트롤러 단에서 처리하는 것이 낫다는 것도 알게 되었고, 핸들러에 있는 과도한 역할을 나누어 보기도 했다.

전에 사용하던 코드를 그대로 재사용하는 것이 아니고, 변화를 줄 수 있었다는 점에서 큰 의의가 있다고 본다!

### 6. 적극적인 코드리뷰

위에서 많이 말했던 것처럼 이번에는 함께 한 준형이형과 거의 매일 연락하고 PR에서 코멘트를 남기며 적극적으로 코드리뷰를 진행했다. 간단한 PR이어도 꼭 확인하고 Approve를 하도록 하여 상대가 작성한 코드여도 이해하고 넘어가도록 했다.

그렇게 하니 형이 작성한 코드여도 내가 금방 파악하여 트러블 슈팅과 리팩토링도 진행할 수가 있었다. 또한 평소에는 그냥 넘어갈 수 있는 디테일한 부분들까지 궁금증을 가지며 학습을 진행할 수가 있었다.

형은 이번에 백엔드가 처음이었기에 새로운 눈으로 코드를 바라봐주며 많은 질문들을 해주었는데, 덕분에 나도 내 코드에 대해 다시 고민해 보게 되고 이러한 과정을 거쳐 더욱 좋은 코드들을 작성할 수 있었다고 생각한다.

형이 백엔드를 처음 해서 불편함을 느끼거나 피해를 입은 적은 단 한번도 없었다고 자신있게 말할 수 있다. 오히려 그 누구와 할 때보다 많은 부분에서 학습을 진행할 수 있었고, 나도 동기부여를 얻을 수 있었다. 

나보다 몇 배는 더 고생했을 것 같은데.. 이 글을 빌려 정말 고생 많았다고 말해주고 싶다 👍🏻👍🏻

## 아쉬운 점

### 1. 볼륨 부족

물론 좋은 점만 존재하지는 않았을 것이다. 앞서 말한 것처럼 근본적인 기능의 볼륨 자체가 적어 해볼 수 있는 것들이 적은 점은 아쉬움으로 남았다. 사실 나는 이미 다른 프로젝트에서 많은 볼륨을 경험해보았기에 이번의 작은 볼륨이 오히려 좋았지만, 함께 한 준형이형은 아쉽게 느낄 수도 있겠다고 생각했다.

하지만 프로젝트를 거의 10개 정도 해 보니...API를 많이 만드는 게 절대 좋은 게 아니라는 걸 알았고, 이번에 한 경험이 많은 볼륨을 찍어내는 것보다 훨씬 어렵고 값진 경험이라고 개인적으로 확신한다.

### 2. 소통 부족

나는 소통이 정말 정말 중요하다고 생각을 한다. 개발 실력 자체가 좋은 것도 물론 중요하겠지만, 이보다 좋은 소통에서 얻을 수 있는 시너지 효과가 더 크다.

또한 나는 원래 경영쪽에 있다가 개발로 들어서서 그런지, 기본적으로 사람들을 만나는 걸 좋아해서 그런지 나름 개발자들 중에서는(?) 소통 능력이 좋은 편이라 주도적으로 진행을 하곤 한다. 하지만 나의 능력으로도 소통이 어려웠기에...어떻게 하면 더 잘 소통할 수 있을까를 많이 고민하게 되었던 것 같다.

사실 답은 없는 것 같다. 근본적인 성향 자체가 다르다면 맞추는 건 사실상 불가능하고, 처음 만나는 9명 모두가 잘 맞고 소통이 잘 된다는 것 자체가 운이 굉장히 좋은 것이기에 일부분은 포기하는 것이 맞다고 생각을 한다.

하지만 그래도 다들 끝까지 책임감과 애정을 가지고 마무리 한 모습들은 멋있고 뿌듯했다 👍🏻

### 3. 애매한 타겟 설정

이번에는 초기부터 의견을 많이 내기는 했지만..내가 야구를 보러 간 적이 아예 없기도 하고 도메인에 대한 이해도가 낮았기에 타겟을 설정하는 데까지는 영향을 미칠 수 없었다.

최종적으로 나온 결과물이나 심사위원 피드백을 들어 보면 타겟을 정확히 모르겠다, 애매한 것 같다 라는 말들이 많았다. 개인적으로 동의한다. 

이는 기획이나 우리 팀이 잘못했다기 보다는...야구라는 너무 큰 도메인에서 나오는 어려움일수도 있겠다라는 생각이 들었다.

우리가 정확히 어떤 문제를 어떻게 해결해야하는지를 꽉 잡고 시작해야하는데, 문제는 생각할 수 있어도 `어떻게` 해결할 지가 너무 어려운 것 같다. 왜냐면 `할 수 있는 게 너무 많다.`

이것도 괜찮아 보이고..이런 기능을 만들어도 괜찮을 것 같고..이렇게 하나씩 붙이다 보면 서비스의 정체성이 사라진다. 때문에 핵심 기능을 무엇으로 잡아야 할지 정하는 게 많이 어려운 것 같다. 

때문에 앞으로도 해당 도메인으로 이어가기 위해서는 정말 많은 이야기를 나누며 정해보아야할 것 같다! 막막하기도 하지만 선택지가 많다는 점이 흥미롭기도 하기에 개인적으로는 재미있을 것 같다 😁
 
---

# 🏟️ 팀 소개

마지막으로 두 달간 고생한 우리 `쓰리피트` 팀을 소개하며 마무리하려고 한다!

![팀소개](https://github.com/user-attachments/assets/a1ed2227-f984-4a98-a264-f523435b2d78)

> **📍 팀명: 쓰리피트 ⚾**
>
저희 밋업프로젝트 A팀의 팀명은 ‘쓰리피트’ 입니다. 저희 팀의 메인 도메인인 야구의 룰에서 착안한 팀명인데요!
야구의 3-peat 룰처럼 밋업 프로젝트를 통해 **모든 팀원의 마음이 3-peat 만큼 가까워지고** 싶은 마음을 담아 팀명을 정했습니다.
저희는 단순한 팀을 넘어, 모든 팀원이 열정을 다해 단기간에 IT 서비스를 구현하는 과정에서 함께 도전하고 성취하는 과정을 지나가고 있습니다.
더 나아가 저희 서비스인 `HitZone(히트존)`이 우리 팀의 끈끈한 유대와 협력의 상징이 되기를 기대합니다.

![](https://velog.velcdn.com/images/hsh111366/post/90a85b5e-80da-4795-9905-d206571d37b8/image.jpeg)

![](https://velog.velcdn.com/images/hsh111366/post/1f92ca3a-bbe7-4248-8352-e50f7d9f6e13/image.jpeg)

![](https://velog.velcdn.com/images/hsh111366/post/ec503b1c-191c-4eb4-b9b2-2bf28079c3e7/image.jpeg)

![](https://velog.velcdn.com/images/hsh111366/post/6aa76b9f-3b1f-4a3d-83c7-5a5b895c7181/image.jpeg)

![](https://velog.velcdn.com/images/hsh111366/post/d614fe59-8e56-4699-b5e4-9e10d614b7ab/image.jpeg)

> 🧑🏻‍💻 중요한 것은 결과가 아니라 **과정에서 얼마나 최선을 다했느냐**라고 생각한다.
나는 이런 부분에서 후회가 없고, 우리 팀원들도 그랬으면 좋겠다! 
무엇 하나라도 얻어가는 프로젝트였기를 🙏🏻 다들 너무 고생 많았고 멋있었다 👍🏻👍🏻
