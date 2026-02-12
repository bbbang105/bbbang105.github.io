---
date: 2024-07-06
description: 캡스톤 디자인에서 가상화폐 백테스팅 및 자동매매 서비스 BAMOWL을 개발한 회고입니다.
tags:
  - project
  - backend
---

---

드디어 18학번 화석의 마지막 학기가 끝이 났다 👴🏻 

그래도 막학기라 11학점 (전공2 + 캡스톤1 + 싸강)을 들어서 널널할 줄 알았더니..

큐시즘 + 창업 동아리 + 캡스톤 + 데보션영 + 과기정통부 정책 서포터즈 + 조교 + 파이썬 프로그래밍 TA + 스터디 + 재택 알바 등... 수많은 할 일 들이 쏟아지게 되어서 정말 정말 힘들었다.

사실 다 내가 자초한 일이기는 한데.. 연초에 지원했던 것들이 운 좋게 다 합격하게 되어 행복했지만 쉽지 않은 한 학기를 보내게 되었다 💀

그래도 대부분 성공적으로 마무리를 했고! 특히 캡스톤에서는 배운 점도, 뿌듯한 점도 많았기에 이렇게 회고록을 작성해보고자 한다.

(Github 링크 : https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4)

---

# 🎨 1. 캡스톤 디자인

나는 연계전공으로 `융합소프트웨어` 를 하고 있기에 해당 전공의 졸업을 위해서는 정확히 `융합 캡스톤 디자인` 이라는 강의를 수강해야 한다.

졸업 작품으로 개발 프로젝트를 하나 만든다고 생각하면 된다!

## 가. 팀 빌딩

우선은 첫 수업부터 바로 팀 빌딩이 시작됐다.

수업 시작 전에 이미 이력서도 제출했었고, 한 명씩 앞에 나와 간단히 본인 PR을 진행했다.

다만... 수업 자체 정원이 13명 밖에 안되어서... 4 3 3 3 명으로 총 4팀밖에 구성을 하지 못했다.

지인들이 있는 사람들은 이미 팀 빌딩을 하기도 해서, 나에게는 많은 선택지가 있지는 않았다.

결국 나 포함 남자 2 여자 1 명으로 팀을 구성을 하게 되었고, 
다행히 남자 한 분께서 프론트엔드도 가능했기에
프론트엔드1 백엔드1 딥러닝1 이렇게 팀 빌딩을 완료하게 되었다!

기획 & 디자인도 없고 개발 기간도 짧은데 3명이서 하는 게 맞나 ... 싶었지만
학교에서 하는 프로젝트가 그렇지 뭐 😟
그래도 졸작이니만큼 정말 열심히 해봐야겠다는 생각을 했다!

그리고 다행히 다들 의지와 열정이 있어 보였다.

## 나. 주제 선정

이번에는 새롭게 캡스톤 디자인에 각 팀마다 멘토님이 한 분씩 붙어서 진행이 되었다!

그래서 이미 멘토님들께서 함께 해 보고 싶은 프로젝트 주제를 제안해 주신 상태였고, 학생들은 이를 보고 팀원들의 이력서 및 선정 이유 등을 제출하여 최종적으로 매칭이 되는 방식이었다.

멘토님들이 하나 같이 스펙이 좋으셔서... 신기하기도 했고 많이 배울 수 있겠다라는 생각이 들어서 좋았다!

주제를 선정함에 있어서 `1) 우리의 역량으로 개발이 가능한가` `2) 주제가 매력적인가` `3) 프로젝트를 하면서 얻을 점이 있는가` 등을 고려하였고, 그 결과 카카오뱅크 김도현 멘토님의 가상화폐 24시간 자동매매 서비스에 지원하게 되었다!

멘토님께서만 유일하게 PDF로 제안서를 따로 만들어 첨부해주셨는데, 이러한 점에서 멘토님의 열정이 크게 느껴졌던 것 같다.
엄청나게 열심히 해야할 것 같기는 했지만 ... 그래도 도전해 보고 싶었다!

그리고 백테스팅, 가상화폐, 자동매매, 트레이딩 등... 생소한 도메인이었지만, 그래서 더욱 재밌을 것 같다는 생각도 한 것 같다.

단순 학점 이수를 위한 개발이 아닌 실 서비스를 만들어 보고 싶은 멘티, 그리고 이것저것 물어볼 줄 아는 멘티를 좋아하신다고 하시기에 마음이 더 갔던 것 같다 🙃

그래서 꼭 함께 했으면 좋겠다라는 생각을 하고 있었는데, 감사하게도 멘토님께서 좋게 봐주셔서 프로젝트를 함께 할 수 있게 되었다!

## 다. 팀 명

팀이름은 올빼미🦉로 지었다!

24시간 자동매매 서비스라 야간에도 운영이 되고, 개발자 특성상 새벽 늦게까지 할 일을 하기에 😂 잘 맞을 것 같아서 이렇게 짓게 되었다.

그리고 추가적으로 매주 수요일마다 수업이 끝나고 나서 정기 회의를 진행하였고, 꼭 프로젝트 얘기가 아니더라도 사적인 얘기라도 하며 친밀감을 쌓기로 했다!

## 라. 도메인 공부

하지만 시작부터 많은 난관에 봉착했다.
백테스팅, 트레이딩 등 제대로 아는 게 하나도 없었다.

다행히 첫 온라인 미팅에서 멘토님께서 많이 설명도 해주시고 자료도 공유해주셔서 조금 감을 잡기는 했지만, 그래도 세부적으로 기획을 하기에는 역부족이었던 것 같다.

기획자도 없는 상태이고, 어느 정도 알고 기능을 짜야 시간 내로 개발을 완수할 수 있는지 감이 올 텐데 그런 게 하나도 되지를 않았다.

그래서 우리 팀은 우선 기획 및 개발을 하기 전에 도메인에 대한 공부를 먼저 하기로 결정했다.
자료 조사를 각자 하여 노션에 공유하였고, 비슷한 개발 사례가 있다면 참고하였다.
그리고 인프런에서 아래 강의를 구매하여 수강하며 백테스팅, 매매법, 이동평균선 등에 대한 지식을 습득했다.

(강의 링크 : https://url.kr/r1nT6F)

그리고 멘토님께서 이전에 진행했던 프로젝트들의 코드와, 블로그에 정리하신 글까지 모두 찾아보았던 것 같다... 그정도로 이해를 하는 데 많은 애를 먹었다 🥲

이렇게까지 하니 그래도 지표 및 기법들에 대한 이해가 되어서, 개발을 진행할 수 있는 상태가 되었다. 

## 마. 멘토님과의 첫 만남

4월 3일 설레는 멘토님과의 첫 만남이 있었다!

이전에 온라인 미팅을 한 번 하기는 했지만 이는 따로 요청을 해서 했던 것이었고, 공식적인 멘토링은 이 날이 처음이었다.

이렇게 현업자와 멘토링을 통해 실제 프로젝트를 함께 하는 것은 처음이었기 때문에 긴장도 많이 되었고, 어느 곳에서 어느 식당을 가야할까.. 부터 걱정이 되었다 😂

다행히 팀원 나은님이 맛집을 잘 아셔서! 동역사에 있는 projec D 라는 맛있는 피자가 있는 펍으로 가게 되었다.

![](https://velog.velcdn.com/images/hsh111366/post/781bd19a-2ff4-431f-9de1-437360bbadc4/image.jpeg)|![](https://velog.velcdn.com/images/hsh111366/post/17bdd28f-7c49-483e-94d9-1efcd34dfc55/image.jpeg)
---|---

요래 맛있는 피자도 먹고 🍕 멘토님이랑 생각보다 어색하지 않게 즐거운 시간을 보냈다! 
만나자마자 프로젝트 얘기를 하지는 않았고, 맥주도 한 잔 마시면서 알아가는 시간도 가지고 어색함을 풀었다 ㅎㅎ

그리고 백엔드와 관련해서 궁금한 이야기나, 취업에 대한 이야기도 나눌 수 있었는데 재미있었고 유익한 시간이었다!

그리고 나서 스타벅스로 이동해 본격적으로 프로젝트에 대한 이야기를 시작했다.

우리가 생각했던 프로젝트의 방향과 개발 방식에 대해 공유를 했고, 멘토님께서는 이에 대해 현실적인 피드백을 해주셨다. 그리고 도메인에 관련해서 의문점이 있던 부분들도 알 수 있었다.

확실히 만나서 피드백을 들으니 어떤 부분에 집중하여 프로젝트를 진행해야할 지 감을 잡게 되었다!

걱정했던 것보다 훨씬 괜찮은 분위기였고, 멘토님께서 좋으신 분이라는 게 느껴져 좋았다 👍🏻

![](https://velog.velcdn.com/images/hsh111366/post/b11a238c-741b-4b95-a5b1-95ef03b7d290/image.png)

그리고 바로 다음 날에 이런 식으로 멘토님께서 각 파트별로 과제를 내 주셨다! 
백엔드가 확실히 많기는 했는데... 그래도 다시 한 번 방향성을 잡아 주셔서 너무 좋았던 것 같다!

멘토님 입장에서 이렇게까지 해주셔서 얻는 게 무엇이 있을까..? 라는 생각이 들 정도로, 프로젝트에 많은 신경을 써주셨고 열정을 보여주셔서 감사했다 🙏🏻

---

# 🦉 2. 서비스 소개

여기서부터는 우리가 이번 프로젝트를 통해 만든 서비스에 대해 소개해보고자 한다.

>**프로젝트명** : `가상화폐 가격 예측 AI 기술을 접목한 백테스팅 & 자동매매 서비스 - "BAMOWL"`

## 가. 개발 동기 및 목표
<img width="1540" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/8602d445-7b93-4595-b1f1-6e34a027864f">

### 1) 개발 동기
- 가상화폐 시장은 전통적인 주식 시장과는 다르게 매우 높은 변동성과 24시간 운영이라는 특성을 가지고 있어, 개인 투자자들이 효과적인 투자 전략을 세우고 이를 실시간으로 검증하며 조정할 수 있는 능력이 필수적임.
- 따라서, 개인이 자신의 투자 전략을 체계적으로 검증하고 테스트할 수 있는 환경이 매우 중요함.
- 최근 딥러닝 기술의 발전은 가상화폐 시장 데이터를 보다 정확하게 예측하는 데 활용되고 있으며, 이를 통해 보다 효율적인 거래가 가능해짐.
- 그러나 가상화폐 시장의 높은 변동성과 예측 불가능성으로 인해 기존 예측 모델의 적용이 어렵고, 딥러닝을 활용한 코인 가격 예측과 백테스팅의 결합을 통한 전략 검증 사례는 드문 상황임.
- 많은 투자자들이 가상화폐 시장의 복잡한 기술적 요소들을 이해하기 어려워하며, 이로 인해 효과적인 투자를 위한 직관적이고 사용하기 쉬운 UI와 도구가 필요함.

### 2) 개발 목표
- 자동화된 거래 시스템과 백테스팅을 결합한 플랫폼의 개발.
- 투자자들은 과거의 데이터를 통해 전략을 검증하고, 딥러닝 예측 모델을 통해 미래의 시장 변동을 파악할 수 있음.
- 이러한 기술력을 바탕으로, 투자 전략을 자동 조정하는 기능을 제공함으로써 성공적인 투자를 이끌어 냄.

## 나. 필요성

<img width="1526" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/a2dc9bda-b951-47f7-9c57-fcb3cb38d5f6">

## 다. 기존 서비스와의 차별점

<img width="1535" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/84e8a104-cda5-499f-9108-b5be19605c04">

## 라. 서비스 메인 프로세스

<img width="1239" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/3604000e-15ca-4bdb-8ff7-46a99155698b">

### 💡 백테스팅? 

우선은 `백테스팅` 이라는 용어 자체가 생소한 사람들이 많을 것 같다.
나 또한 그랬으니 말이다.

백테스팅은 **과거의 데이터를 사용하여 특정 거래 전략이나 투자 모델의 성과를 평가하는 과정**을 말한다. 즉, 우리 서비스에서는 업비트에서 과거 데이터를 가져와 백테스팅을 진행하였다.

백테스팅을 통해 전략이나 모델이 실제 시장 상황에서 어떻게 작동할지를 예측할 수가 있고, 사용자는 이러한 결과를 기반으로 판단하여 자동매매를 진행할 것인지 여부를 판단하게 된다.

서비스의 핵심 로직은 아래와 같다.

1️⃣ 사용자는 백테스팅 전략 선택 및 실행하여 본인이 선택한 전략 (지표)가 얼마나 성과를 내는지를 확인한다.

2️⃣ 결과를 포트폴리오화하여 관리한다.

3️⃣ 포트폴리오 중, 실제 자동매매를 진행하고 싶다면 등록절차를 거쳐 24시간 자동매매를 진행하게 된다.

## 마. 세부 기획

<img width="1644" alt="스크린샷 2024-06-24 오후 4 41 00" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/c7f0d3a0-558b-4f54-895a-e94c1e7684f9">

더욱 자세한 내용은 상단 깃허브 링크에서 확인해볼 수 있다!

---

# 💻 3. 개발 과정

## 가. 설계

### 1) 플로우 차트

<img width="1260" alt="BAMOWL_플로우차트" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/affe947c-6ee2-45b4-8d25-aa3f950a3190">

플로우차트는 위처럼 로그인 or 비로그인으로 구분을 하였고, 서비스 핵심 기능들은 주황색으로 눈에 잘 들어오게 표현을 하였다.

플로우차트를 내가 짜본 것은 거의 처음이었던 것 같은데, 그리 어렵지도 않았고 생각보다 재미있었다!
그리고 어떤 플로우로 서비스가 진행되고, 그래서 난 어떤 기능을 개발해야 하는지 조금 감이 오는 것 같아서 좋았던 것 같다.

### 2) 프로젝트 아키텍처

<img width="1305" alt="BAMOWL_아키텍처" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/2a300ad6-ce83-4db7-b42b-06fa84cde033">

백엔드는 Spring Boot 프레임워크를 사용하였고
`1) Upbit 외부 API 2) Flask 딥러닝 3) 프론트엔드` 와 통신을 진행했다.

`Docker & Github Actions` 를 사용하여 `CI/CD` 파이프라인을 구축했다.

딥러닝은 `TensorFlow` 및 `Flask` 서버를 통해 구축하여, 하루에 1번씩 백엔드와 API 통신하며 새로운 가격 예측 값을 받았다.

### 3) ERD

<img width="1382" alt="스크린샷 2024-06-24 오후 4 16 56" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/ea955bd5-5c9a-466d-93a4-d8c328383d7b">

우측에 있는 캔들 데이터는 차트 및 백테스팅 기능에 필수적인 데이터였다.
때문에 업비트 API를 활용하여 DB를 구축하였고, 가상화폐의 종류 & 캔들 종류와 매핑함으로써 모든 가상화폐와 캔들 종류에 따라 필터링을 통해 원하는 데이터를 가져올 수 있도록 설계를 진행했다.

유저와 관련된 중요 정보로는 서비스 약관 동의여부 & 업비트 키 & 자동매매 옵션 등이 존재한다.

유저와 포트폴리오를 1:N 매핑함으로써, 소유한 포트폴리오 지표 및 결과 등을 다시 확인할 수 있으며 언제든지 원하는 지표로 자동매매를 진행할 수 있도록 하였다.

딥러닝 예측 가격은 하루에 1번씩 Flask 서버와 통신하여 업데이트를 진행했고, 이를 프론트엔드에서 API 요청 시 보내주는 식으로 설계하였다.

## 나. 구현 기능 (백엔드)

지금부터는 백엔드로써 구현한 기능들에 대해 다루어보려고 한다.

(자동매매 기능은 따로 빼서 작성할 예정이다!)

### 1) 업비트 API 통신 & DB 구축

첫번째로는 외부 API인 업비트와 통신하며 서비스에 필요한 DB를 구축했다는 점이 있다.

(업비트 API 레퍼런스 : https://url.kr/RnaESP)

#### 시세 캔들 조회 로직


```java
package org.dgu.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.Candle;
import org.dgu.backend.domain.CandleInfo;
import org.dgu.backend.domain.Market;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.repository.CandleInfoRepository;
import org.dgu.backend.repository.CandleRepository;
import org.dgu.backend.repository.MarketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class CandleInfoServiceImpl implements CandleInfoService {
    @Value("${upbit.url.candle-minute}")
    private String UPBIT_URL_CANDLE_MINUTE;
    @Value("${upbit.url.candle-etc}")
    private String UPBIT_URL_CANDLE_ETC;
    private final CandleInfoRepository candleInfoRepository;
    private final MarketRepository marketRepository;
    private final CandleRepository candleRepository;
    private final UpbitApiClient upbitApiClient;

    // 업비트 API를 통해 캔들 정보를 가져오는 메서드
    @Override
    public void getCandleInfo(String koreanName, LocalDateTime to, int count, String candleName) {
        Market market = marketRepository.findByKoreanName(koreanName);
        Candle candle = candleRepository.findByCandleName(candleName);
        String marketName = market.getMarketName();

        String url;
        if (candleName.startsWith("minutes")) {
            // 분봉인 경우
            int unit = Integer.parseInt(candleName.substring(7));
            url = String.format(UPBIT_URL_CANDLE_MINUTE, candleName.substring(0,7), unit, marketName, count);
        } else {
            // 그 외 (일봉, 주봉, 월봉)
            url = String.format(UPBIT_URL_CANDLE_ETC, candleName, marketName, count);
        }

        if (!Objects.isNull(to)) {
            // 마지막 캔들 시각도 지정한 경우
            String formattedTo = to.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
            url += ("&to=" + formattedTo);
        }

        UpbitDto.CandleInfoResponse[] responseBody = upbitApiClient.getCandleInfoAtUpbit(url);
        for (UpbitDto.CandleInfoResponse candleInfoResponse : responseBody) {
            CandleInfo candleInfo = CandleInfo.toEntity(candleInfoResponse, market, candle);
            candleInfoRepository.save(candleInfo);
        }
    }
}
```

위 서비스 구현체에서는 캔들 데이터를 가져오는 로직을 담당한다.

마켓 한글이름 (ex. 비트코인, 이더리움), 기간, 데이터 개수, 캔들 종류 (1분봉, 5분봉..)를 인자로 받아서 이에 따라 원하는 데이터를 가져올 수 있다.

실질적으로 업비트 API와 통신하여 응답을 받아 오는 기능은 아래의 `upbitApiClient`에서 구현하였다.

#### upbitApiClient

```java
package org.dgu.backend.service;

import com.nimbusds.jose.shaded.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.domain.UpbitKey;
import org.dgu.backend.domain.User;
import org.dgu.backend.dto.UpbitDto;
import org.dgu.backend.exception.UpbitErrorResult;
import org.dgu.backend.exception.UpbitException;
import org.dgu.backend.exception.UserErrorResult;
import org.dgu.backend.exception.UserException;
import org.dgu.backend.repository.UpbitKeyRepository;
import org.dgu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UpbitApiClient {
    @Value("${upbit.url.account}")
    private String UPBIT_URL_ACCOUNT;
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;
    private final UpbitKeyRepository upbitKeyRepository;

    // HTTP GET 요청을 보내고 결과를 처리하는 메서드
    public <T> T sendHttpGetRequest(String url, Class<T> responseType, Optional<String> token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("accept", MediaType.APPLICATION_JSON_VALUE);
        token.ifPresent(t -> headers.add("Authorization", "Bearer " + t));

        try {
            ResponseEntity<T> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    responseType
            );

            // HTTP 요청이 성공적으로 처리되었지만, 응답 본문이 null인 경우 예외 처리
            if (Objects.isNull(responseEntity.getBody())) {
                throw new UpbitException(UpbitErrorResult.FAIL_GET_RESPONSE);
            }

            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            UpbitErrorResult errorResult = mapToUpbitErrorResult((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString());
            throw new UpbitException(errorResult);
        }
    }

    // HTTP POST 주문 요청을 보내고 결과를 처리하는 메서드
    private <T> T sendHttpPostRequest(String url, Class<T> responseType, String token, Map<String, String> params) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
        headers.set("Authorization", "Bearer " + token);

        try {
            ResponseEntity<T> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(new Gson().toJson(params), headers),
                    responseType
            );
            if (Objects.isNull(responseEntity.getBody())) {
                throw new UpbitException(UpbitErrorResult.FAIL_GET_RESPONSE);
            }
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            UpbitErrorResult errorResult = mapToUpbitErrorResult((HttpStatus) e.getStatusCode(), e.getResponseBodyAsString());
            throw new UpbitException(errorResult);
        }
    }

    // 유저 업비트 계좌 정보를 조회하는 메서드
    public UpbitDto.Account[] getUpbitAccounts(User user) {
        UpbitKey upbitKey = upbitKeyRepository.findByUser(user);
        if (Objects.isNull(upbitKey)) {
            throw new UserException(UserErrorResult.NOT_FOUND_KEY);
        }

        String token = jwtUtil.generateUpbitToken(upbitKey);
        return getUserAccountsAtUpbit(UPBIT_URL_ACCOUNT, token);
    }

    // 캔들 차트 조회 업비트 API와 통신하는 메서드
    public UpbitDto.CandleInfoResponse[] getCandleInfoAtUpbit(String url) {
        return sendHttpGetRequest(url, UpbitDto.CandleInfoResponse[].class, Optional.empty());
    }

    // 가상화폐 조회 업비트 API와 통신하는 메서드
    public UpbitDto.MarketResponse[] getAllMarketsAtUpbit(String url) {
        return sendHttpGetRequest(url, UpbitDto.MarketResponse[].class, Optional.empty());
    }

    // 전체 계좌 조회 업비트 API와 통신하는 메서드
    public UpbitDto.Account[] getUserAccountsAtUpbit(String url, String token) {
        return sendHttpGetRequest(url, UpbitDto.Account[].class, Optional.of(token));
    }

    // 시세 현재가 조회 업비트 API와 통신하는 메서드
    public UpbitDto.Ticker[] getTickerPriceAtUpbit(String url) {
        return sendHttpGetRequest(url, UpbitDto.Ticker[].class, Optional.empty());
    }

    // 주문 생성 업비트 API와 통신하는 메서드
    public UpbitDto.OrderResponse createNewOrder(String url, String token, Map<String, String> params) {
        return sendHttpPostRequest(url, UpbitDto.OrderResponse.class, token, params);
    }
    // HTTP 상태 코드에 따라 UpbitErrorResult를 반환하거나 에러 코드를 출력하는 메서드
    private UpbitErrorResult mapToUpbitErrorResult(HttpStatus statusCode, String responseBody) {
        for (UpbitErrorResult errorResult : UpbitErrorResult.values()) {
            if (errorResult.getHttpStatus() == statusCode && responseBody.contains(errorResult.getCode())) {
                return errorResult;
            }
        }

        // 그 외의 경우, 에러 코드만 출력
        System.out.println("Upbit error code: " + statusCode.toString() + " " + responseBody);
        return null;
    }
}
```

위 서비스에 있는 메서드를 호출하여 업비트에서 응답 객체를 가져올 수 있고, 여기서 필요한 정보를 DB에 저장하거나 프론트엔드로 반환하는 식으로 구현하였다.

이러한 로직을 통해서 업비트와 통신하는 부분은 잘 구현되었으나, 문제는 업비트가 1초에 10회 요청 제한이 있다는 점이었다. 또한 1회 요청 당 데이터를 200개까지만 가져올 수 있었다.
즉, 1초에 최대 2,000개의 데이터만 가져올 수 있는 것이다.

만약 1초에 10회 요청이 넘어가게 되면, 에러가 발생하며 데이터를 제대로 가져올 수 없었다.

1분봉 데이터를 2018년부터 받아오게 되면 수백만개 이상의 데이터의 요청이 필요하기 때문에, 에러가 발생하지 않으면서도 최대한 빠르게 데이터를 가져올 방법이 필요했다.

### 2) Guava 라이브러리 활용 - 비동기처리

<img width="1639" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/c838aea3-e0b5-4481-ad86-6b4e9446450c">

때문에 Google의 Guava 라이브러리를 활용해 이를 비동기처리함으로써 해결하였다.

#### CandleDataCollector

```java
package org.dgu.backend.util;

import lombok.RequiredArgsConstructor;
import org.dgu.backend.service.CandleInfoService;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import com.google.common.util.concurrent.RateLimiter;

@Component
@RequiredArgsConstructor
public class CandleDataCollector {
    private final CandleInfoService candleInfoService;
    private final CandleUtil candleUtil;
    private final int batchSize = 200;
    private final RateLimiter rateLimiter = RateLimiter.create(10.0); // 초당 요청 허용량 10개로 제한
    private final long retryDelayMillis = 100; // 재시도 대기 시간 (0.1초)

    public void collectCandleData(String koreanName, String candleName, LocalDateTime startDate, LocalDateTime endDate) {
        // 캔들을 분 기준으로 변환
        int candleInterval = candleUtil.calculateCandleInterval(candleName);

        // 시작 시간부터 종료 시간까지의 총 분 수 계산
        long totalMinutes = Duration.between(startDate, endDate).toMinutes();

        // 한 번의 API 요청에서 지나는 시간
        long oneAPI = (long) candleInterval * batchSize;

        // 반복 횟수 계산
        long numIterations = (long) Math.ceil((double) totalMinutes / oneAPI);

        CompletableFuture<Void>[] futures = new CompletableFuture[(int) numIterations];

        for (int i = 0; i < numIterations; i++) {
            LocalDateTime currentStartTime = startDate.plusMinutes((long) i * oneAPI);
            LocalDateTime currentEndTime = currentStartTime.plusMinutes(oneAPI);

            // 종료 시간이 endDate을 넘어가면 endDate으로 설정
            if (currentEndTime.isAfter(endDate)) {
                currentEndTime = endDate;
            }

            final LocalDateTime intervalEnd = currentEndTime;

            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                // candleInfoService를 사용하여 데이터 수집
                boolean requestSuccess = false;
                while (!requestSuccess) {
                    // 초당 요청 허용량을 초과하지 않을 때까지 대기
                    rateLimiter.acquire();

                    try {
                        candleInfoService.getCandleInfo(koreanName, intervalEnd, batchSize, candleName);
                        requestSuccess = true; // 성공적으로 완료됨
                    } catch (Exception e) {
                        // 오류 발생 시 재시도
                        System.out.println("재시도 중...");
                        try {
                            Thread.sleep(retryDelayMillis); // 0.1초 대기
                        } catch (InterruptedException ex) {
                            ex.printStackTrace();
                        }
                    }
                }
            });

            futures[i] = future;
        }

        // 모든 CompletableFuture가 완료될 때까지 대기
        CompletableFuture<Void> allOfFuture = CompletableFuture.allOf(futures);
        try {
            allOfFuture.get(); // 모든 작업이 완료될 때까지 대기
            System.out.println("모든 작업이 완료되었습니다.");
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

코드는 위와 같다.
1회 요청당 최대 데이터 개수는 200개이므로 batchSize는 200으로 설정하였고, 초당 요청 허용량도 10회로 제한하였다.

로직은 아래와 같다.

1️⃣ 인자로 들어온 캔들 네임(종류)를 분 기준으로 변환한다. 예를 들어 `days` 라면 1440으로 변환된다. 이는 `candleInterval` 이 된다.

2️⃣ 시작 시간과 종료 시간의 차이, 즉 데이터를 가져올 기간을 분 기준으로 변환한다.

3️⃣ 위에서 변환한 `candleInterval` 은 각각 1개의 데이터이며, 1회 요청당 200개의 데이터를 가져올 수 있으므로, 한 번의 API 요청에서 지나는 시간은 아래와 같다.
```java
long oneAPI = (long) candleInterval * batchSize;
```

4️⃣ 기간을 `oneAPI` 로 나누어 몇 번의 API 요청을 진행해야 하는지 계산한다.

```java
long numIterations = (long) Math.ceil((double) totalMinutes / oneAPI);
```

5️⃣ 필요 요청 횟수만큼의 반복을 비동기처리하여 데이터를 가져온다.


비동기처리를 해본 것은 이번이 처음이라 미숙해 제대로 구현하지 못한 탓인지, 이렇게 해도 데이터를 받아오던 중 요청 제한 에러가 발생해 멈추게 되었다.

```java
                    try {
                        candleInfoService.getCandleInfo(koreanName, intervalEnd, batchSize, candleName);
                        requestSuccess = true; // 성공적으로 완료됨
                    } catch (Exception e) {
                        // 오류 발생 시 재시도
                        System.out.println("재시도 중...");
                        try {
                            Thread.sleep(retryDelayMillis); // 0.1초 대기
                        } catch (InterruptedException ex) {
                            ex.printStackTrace();
                        }
                    }
```

그렇기에 위처럼 에러가 발생한다면 0.1초를 대기한 후에 다시 실행하는 방식으로 진행을 하여 에러를 해결했다.

또한 데이터를 거의 다 받아갈 즈음에는 중복된 데이터가 많이 쌓이게 되었는데, 아마 이는 비동기 처리함으로써 병렬적으로 진행이 되었는데 서로 어느 기간의 데이터를 가져오는지 공유가 되지 않았기 때문이 아닌가.. 싶다.
이를 해결하기 위해서 콜백을 사용해야 했을까? 비동기 처리에 대해서는 공부가 필요할 것 같다.

> 🧑🏻‍💻 멘토님께서 말씀하시기를 `Thread.sleep(retryDelayMillis)` 같은 방식은 현업에서는 지양한다고 하셨다. 하지만 해결 방법을 잘 모르겠고, 시간이 부족하여 이를 그대로 사용하게 되었다. 그렇다면 어떻게 하는 게 좋았을까?
또한 위처럼 비동기처리를 진행하는 방식이 옳은 것일까?
 
### 3) 백테스팅 기능 구현

![](https://velog.velcdn.com/images/hsh111366/post/9810df48-ef49-4dd0-87c7-a794a75e0e0b/image.png)

타 라이브러리를 사용하지 않고 백테스팅 기능을 직접 구현했다는 점도 특징이다.
대개 라이브러리는 파이썬에 존재했고, 우리 팀은 조금 더 간단하고 편리한 백테스팅 기능을 만드는 것이었기에 직접 만들어보자는 생각이 들어 결정했다.

물론 너무너무 어려웠고.. 시간도 많이 들었다😂

우리 서비스에서는 백테스팅에서 `지수 가중 이동평균`과 `물타기 매매법` 을 채택하였는데, 백테스팅 로직에 대해 설명하기 전에 이 둘에 대해 설명해보도록 하겠다.

`지수 가중 이동평균` 은 일반적인 이동평균에 지수 가중치를 추가하는데, 이는 점점 최신 데이터로 갈 수록 가중치가 커진다. 그러므로 최신 데이터의 가격 추세에 더욱 영향을 많이 받게 되어, 최신 경향을 조금 더 잘 반영할 수 있다는 장점이 있다.

다음으로 `물타기 매매법` 은 가격이 떨어지면 매수하고, 가격이 오르면 매도하여 추세를 따라가며 이익을 보는 매매법이라 할 수 있다. 어쩔 수 없이 가격의 추세에 의존하게 되지만, 24시간동안 빠르게 매매를 진행할 수 있는 서비스 특성 상 이익을 보기 유리할 것 같아 채택하였다.

#### 백테스팅 결과 생성 로직

```java
    // 최신화된 캔들 정보를 사용해 백테스팅 결과를 생성하는 메서드
    @Transactional
    protected BackTestingDto.BackTestingResponse fetchBackTestingResult(String authorizationHeader, BackTestingDto.StepInfo stepInfo) {
        Market market = marketRepository.findByKoreanName("비트코인");
        Candle candle = candleRepository.findByCandleName(stepInfo.getCandleName());
        LocalDateTime startDate = dateUtil.convertToLocalDateTime(stepInfo.getStartDate());
        LocalDateTime endDate = dateUtil.convertToLocalDateTime(stepInfo.getEndDate());
        if (startDate.isAfter(endDate)) {
            throw new BackTestingException(BackTestingErrorResult.START_DATE_AFTER_END_DATE);
        }
        if (stepInfo.getNDate() > stepInfo.getMDate()) {
            throw new BackTestingException(BackTestingErrorResult.N_DAY_LONGER_THAN_M_DAY);
        }

        List<CandleInfo> candles = candleInfoRepository.findFilteredCandleInfo(market, candle, startDate, endDate);
        if (candles.isEmpty()) {
            throw new CandleException(CandleErrorResult.NOT_FOUND_CANDLES);
        }
        candles = candleUtil.removeDuplicatedCandles(candles);

        // 골든 크로스 지점 찾기
        List<LocalDateTime> goldenCrossPoints = backTestingCalculator.findGoldenCrossPoints(candles, stepInfo);

        // 백테스팅 시작
        List<BackTestingDto.BackTestingResult> backTestingResults = backTestingCalculator.run(candles, stepInfo, goldenCrossPoints);

        // 백테스팅 결과 집계
        BackTestingDto.BackTestingResponse backTestingResponse = backTestingCalculator.collectResults(backTestingResults, stepInfo.getInitialCapital());

        // 회원인 경우 포트폴리오 임시 저장
        if (authorizationHeader != null) {
            saveTempBackTestingResult(authorizationHeader, stepInfo, backTestingResponse);
        }

        return backTestingResponse;
    }
```

백테스팅 결과를 생성하는 주요 메서드는 위와 같다.

우선 기능 고도화를 위해 가상화폐는 `비트코인` 하나만으로 한정을 하였다.

에러 처리 및 필요한 객체들을 불러온 후에, 필터링 된 캔들 데이터를 가져온다.
그리고 중복 데이터를 제거해주어 최종적으로 백테스팅을 진행할 데이터를 준비한다.

매매 지점을 파악하기 위하여, 유저가 입력한 `N일(단기선)` `M일(장기선)` 을 기반으로 골든 크로스 지점을 모두 찾아준다.

![](https://velog.velcdn.com/images/hsh111366/post/3c9b6fa5-d2b8-48bb-9bd2-1e53625a1726/image.png)

(출처 : https://m.blog.naver.com/dysaghwls/223228083628)

위처럼 단기선이 장기(or 중기)선을 뚫는 순간을 골든 크로스 지점이라고 하며, 해당 지점부터는 상승 추세를 예상할 수 있기 때문에 여기서부터 거래를 시작하게 된다.

#### 골든 크로스 지점을 찾는 로직

```java
    // 골든 크로스 지점을 찾아 반환하는 메서드
    public List<LocalDateTime> findGoldenCrossPoints(List<CandleInfo> candles, BackTestingDto.StepInfo stepInfo) {
        List<BackTestingDto.EMAInfo> nDateEMAs = calculateEMA(candles, stepInfo.getNDate());
        List<BackTestingDto.EMAInfo> mDateEMAs = calculateEMA(candles, stepInfo.getMDate());

        int diff = nDateEMAs.size() - mDateEMAs.size();
        List<LocalDateTime> goldenCrossPoints = new ArrayList<>();

        boolean crossed = false; // 골든 크로스가 발생했는지 여부

        for (int i = 0; i < mDateEMAs.size(); i++) {
            Long nPrice = nDateEMAs.get(i + diff).getPrice();
            Long mPrice = mDateEMAs.get(i).getPrice();

            if (nPrice > mPrice && !crossed) {
                goldenCrossPoints.add(mDateEMAs.get(i).getDate());
                crossed = true;
            } else if (nPrice <= mPrice && crossed) {
                crossed = false;
            }
        }

        return goldenCrossPoints;
    }
```

골든 크로스 지점은 위 메서드를 사용하여 계산해주었다. 계산을 위해서는 단기선, 장기선 각각의 이동평균선 데이터가 필요하다. 

![](https://velog.velcdn.com/images/hsh111366/post/f73d2227-378f-46da-b7c2-f04fba4a4cfc/image.png)

예를 들어 위와 같은 형태이다.
날짜와 해당 날짜의 비트코인 가격을 계산하고, 이를 비교하여 골든 크로스를 찾아낸다.

골든 크로스는 단순히 단기선이 장기선보다 가격이 높을 때가 아니라, 가격이 더 낮았다가 높아져 뚫는 순간이기 때문에, 아래 변수를 활용해 구분하였다.

```java
boolean crossed = false; // 골든 크로스가 발생했는지 여부
```

골든 크로스 지점까지 찾아주었으니, 이제 백테스팅을 진행하게 된다.

#### 백테스팅 실행 로직

```java
    // 백테스팅을 실행하는 메서드
    public List<BackTestingDto.BackTestingResult> run(List<CandleInfo> candles, BackTestingDto.StepInfo stepInfo, List<LocalDateTime> goldenCrossPoints) {
        capital = stepInfo.getInitialCapital();        // 초기 자본
        tradingUnit = capital / stepInfo.getTradingUnit(); // 한 번 매수당 금액
        buyingPoint = stepInfo.getBuyingPoint();     // 매수 지점
        sellingPoint = stepInfo.getSellingPoint();   // 익절 지점
        stopLossPoint = stepInfo.getStopLossPoint(); // 손절 지점

        List<BackTestingDto.BackTestingResult> backTestingResults = new ArrayList<>();

        for (LocalDateTime goldenCrossPoint : goldenCrossPoints) {
            int startIndex = findStartIndex(candles, goldenCrossPoint);

            executeTrade(candles, startIndex, stepInfo.getTradingUnit(), backTestingResults);
        }

        return backTestingResults;
    }
```

유저가 입력한 백테스팅 전략 (지표)를 기반으로 진행된다. 모든 골든 크로스 지점에서부터 매매를 진행하며 그 결과를 DTO로 묶어 리스트에 저장한 후 반환한다.

#### 거래 진행 로직

```java
    // 거래를 실행하는 메서드
    private void executeTrade(List<CandleInfo> candles, int startIndex, int tradingCnt, List<BackTestingDto.BackTestingResult> backTestingResults) {
        // 초기 세팅
        coin = BigDecimal.ZERO;
        executeBuy("BUY", candles.get(startIndex).getDateTime(), candles.get(startIndex).getTradePrice(), backTestingResults);
        buyingCnt = 1;
        List<Double> tradePrices = new ArrayList<>();
        tradePrices.add(candles.get(startIndex).getTradePrice());
        Double avgPrice = candles.get(startIndex).getTradePrice();
        startDate = null;

        for (int i = startIndex + 1; i < candles.size(); i++) {
            LocalDateTime currentDate = candles.get(i).getDateTime();
            Double currentPrice = candles.get(i).getTradePrice();

            if (startDate == null) {
                startDate = currentDate;
            }

            Long initialCapital = capital + tradingUnit * buyingCnt;
            Double curRate = calculateRate(capital, initialCapital, currentPrice, coin);
            String action = determineAction(currentPrice, avgPrice, tradingCnt, buyingCnt, buyingPoint, sellingPoint, stopLossPoint, curRate);
            // 매수 처리
            if (action.equals("BUY")) {
                executeBuy(action, currentDate, currentPrice, backTestingResults);
                buyingCnt++;
                tradePrices.add(currentPrice);
                avgPrice = tradePrices.stream().mapToDouble(Double::doubleValue).sum() / buyingCnt;
            }
            // 익절 처리
            else if (action.equals("SELL")) {
                executeSell(action, currentDate, currentPrice, backTestingResults);
                break;
            }
            // 손절 처리
            else if (action.equals("STOP_LOSS")) {
                executeStopLoss(action, currentDate, currentPrice, backTestingResults);
                break;
            }

            // 마지막 남은 코인 매도 처리
            if (i == candles.size() - 1 && !Objects.equals(coin, BigDecimal.ZERO)) {
                executeSell(action, currentDate, currentPrice, backTestingResults);
            }
        }
    }
```

거래를 진행하는 메서드이다. 
우선 1회 매수를 시작하며 초기 세팅을 해준다.

이제부터는 실제 비트코인 가격 데이터를 기반으로 가격이 오르면 매도하고, 가격이 떨어지면 매수를 진행하며 수익을 본다.

```java
String action = determineAction(currentPrice, avgPrice, tradingCnt, buyingCnt, buyingPoint, sellingPoint, stopLossPoint, curRate);
```

위 메서드를 호출하여 현재 데이터에서 매수 or 매도 (=익절) or 손절할 것인지 액션을 결정한다.

```java
    // 액션을 판단하는 메서드
    public String determineAction(Double currentPrice, Double avgPrice, int tradingCnt, int buyingCnt, Double buyingPoint, Double sellingPoint, Double stopLossPoint, Double curRate) {
        // 매수 조건 판단
        if (buyingCnt < tradingCnt && currentPrice < avgPrice * (100 - buyingPoint) / 100) {
            return "BUY";
        }
        // 익절 조건 판단
        else if (curRate > sellingPoint) {
            return "SELL";
        }
        // 손절 조건 판단
        else if (curRate < -stopLossPoint) {
            return "STOP_LOSS";
        }

        return "STAY";
    }
```

아직 매수 횟수가 남아 있고, `현재 가격 < 현재 평단가에서 매수 포인트만큼 떨어진 가격` 이라면 `BUY` 액션을 리턴한다.

`curRate` 는 현재 수익률로, 내가 지금까지 매수한 비트코인을 현재 가격으로 판매한다면 매수 당시 자본의 비해 얼마의 수익률을 볼 수 있는지를 계산한 수치이다.

만약 `curRate` 가 `sellingPoint`, 즉 매도 포인트보다 크다면 매도를 할 타이밍이기에 `SELL` 액션을 리턴한다.

반대로 `curRate` 가 `stopLossPoint`, 즉 손절 포인트보다 작다면 손절을 할 타이밍이기에 `STOP_LOSS` 액션을 리턴한다.

마지막으로 위 3가지 경우에 모두 해당하지 않는다면 아무 행동도 취하지 않아야 하므로, `STAY` 액션을 리턴한다.

액션을 리턴 받았다면, 이에 따라 매매를 진행한다. 자세한 메서드는 아래와 같다.

```java
    // 매수 처리 메서드
    private void executeBuy(String action, LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        coin = coin.add(BigDecimal.valueOf(tradingUnit).divide(BigDecimal.valueOf(currentPrice), 10, RoundingMode.HALF_UP));
        capital -= tradingUnit;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, action, currentPrice, coin, capital, 0.0, 0L, null));
    }

    // 익절 처리 메서드
    private void executeSell(String action, LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        Long initialCapital = capital + tradingUnit * buyingCnt;
        capital += (BigDecimal.valueOf(currentPrice).multiply(coin)).longValue();
        coin = BigDecimal.ZERO;
        Long income = capital - initialCapital;
        Double rate = ((double) income / initialCapital) * 100;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, action, currentPrice, coin, capital, rate, income, currentDate.compareTo(startDate)));
    }

    // 손절 처리 메서드
    private void executeStopLoss(String action, LocalDateTime currentDate, Double currentPrice, List<BackTestingDto.BackTestingResult> backTestingResults) {
        Long initialCapital = capital + tradingUnit * buyingCnt;
        capital += (BigDecimal.valueOf(currentPrice).multiply(coin)).longValue();
        coin = BigDecimal.ZERO;
        Long income = capital - initialCapital;
        Double rate = ((double) income / initialCapital) * 100;

        backTestingResults.add(BackTestingDto.BackTestingResult.of(currentDate, action, currentPrice, coin, capital, rate, income, currentDate.compareTo(startDate)));
    }
```

매수를 할 때는 현재 가격만큼 현재 자본에서 빼준다. 그리고 비트코인 개수를 계산하여 더해준다.

익절 및 손절을 할 때에는 일괄적으로 가지고 있는 모든 비트코인을 판매하게 된다. 
때문에 `현재 가격 * 비트코인` 개수를 현재 자본에 더해준다. 
그리고 비트코인은 다시 0개로 초기화한다.

이러한 과정들을 통해 백테스팅이 모두 완료가 되었다면, 이제 거래 로그가 쌓여 있을 것이다. 하지만 이 로그만 보여준다고 해서 유저가 성능을 파악하기는 쉽지 않기 때문에, 유의미한 지표 결과를 만들어 줄 필요가 있다.

이를 위해 아래 메서드를 통해 결과 집계를 진행하며 다양한 지표들을 계산하게 된다.

```java
   // 백테스팅 결과를 집계하는 메서드
    public BackTestingDto.BackTestingResponse collectResults(List<BackTestingDto.BackTestingResult> backTestingResults, Long capital) {
        Double initialCapital = Double.parseDouble(String.valueOf(capital));
        Long finalCapital = backTestingResults.get(backTestingResults.size() - 1).getCapital();
        List<BackTestingDto.TradingLog> tradingLogs = new ArrayList<>();
        positiveTradeCount = 0;
        negativeTradeCount = 0;
        tradingPeriodSum = 0;
        positiveRatioSum = 0.0;
        negativeRatioSum = 0.0;
        highValueStrategy = 0L;
        lowValueStrategy = 1_000_000_000L;
        highLossValueStrategy = 0L;

        // 거래 결과 집계
        calculateTradeStats(backTestingResults, tradingLogs);

        // 거래 파트 생성
        BackTestingDto.Trading trading = createTradingPart(capital, finalCapital);

        // 성능 파트 생성
        BackTestingDto.Performance performance = createPerformancePart(initialCapital, finalCapital);

        return BackTestingDto.BackTestingResponse.builder()
                .trading(trading)
                .performance(performance)
                .tradingLogs(tradingLogs)
                .build();
    }

    // 거래 결과 집계 메서드
    private void calculateTradeStats(List<BackTestingDto.BackTestingResult> backTestingResults, List<BackTestingDto.TradingLog> tradingLogs) {
        for (BackTestingDto.BackTestingResult backTestingResult : backTestingResults) {
            if (!backTestingResult.getAction().equals("BUY")) {
                Long income = backTestingResult.getIncome();
                // 이익인 경우
                if (income > 0) {
                    positiveTradeCount++;
                    positiveRatioSum += backTestingResult.getRate();
                    highValueStrategy = Math.max(highValueStrategy, income);
                    lowValueStrategy = Math.min(lowValueStrategy, income);
                }
                // 손해인 경우
                else {
                    negativeTradeCount++;
                    negativeRatioSum += backTestingResult.getRate();
                    highLossValueStrategy = Math.min(highLossValueStrategy, income);
                }
                tradingPeriodSum += backTestingResult.getTradingPeriod();
            }

            // 거래 로그 생성
            tradingLogs.add(createTradingLog(backTestingResult));
        }
    }

    // 거래 파트 생성 메서드
    private BackTestingDto.Trading createTradingPart(Long capital, Long finalCapital) {
        int totalTradeCount = positiveTradeCount + negativeTradeCount;
        int averageTradePeriod = (int) Math.ceil((double) tradingPeriodSum / totalTradeCount);
        Double averagePositiveTrade = positiveTradeCount != 0 ? numberUtil.round(positiveRatioSum / positiveTradeCount, 2) : 0.0;
        Double averageNegativeTrade = negativeTradeCount != 0 ? numberUtil.round(negativeRatioSum / negativeTradeCount, 2) : 0.0;

        return BackTestingDto.Trading.builder()
                .initialCapital(capital)
                .finalCapital(finalCapital)
                .totalTradeCount(totalTradeCount)
                .positiveTradeCount(positiveTradeCount)
                .negativeTradeCount(negativeTradeCount)
                .averageTradePeriod(averageTradePeriod)
                .averagePositiveTrade(averagePositiveTrade)
                .averageNegativeTrade(averageNegativeTrade)
                .build();
    }

    // 성능 파트 생성 메서드
    private BackTestingDto.Performance createPerformancePart(Double initialCapital, Long finalCapital) {
        int totalTradeCount = positiveTradeCount + negativeTradeCount;
        Double totalRate = numberUtil.round(((finalCapital - initialCapital) / initialCapital) * 100, 2);
        Double winRate = positiveTradeCount != 0 ? numberUtil.round((double) positiveTradeCount / totalTradeCount * 100, 2) : 0.0;
        Double lossRate = negativeTradeCount != 0 ? numberUtil.round((double) negativeTradeCount / totalTradeCount * 100, 2) : 0.0;
        Double winLossRatio = negativeTradeCount != 0 ? numberUtil.round((double) positiveTradeCount / negativeTradeCount * 100, 2) : 0.0;

        return BackTestingDto.Performance.builder()
                .totalRate(totalRate)
                .winRate(winRate)
                .lossRate(lossRate)
                .winLossRatio(winLossRatio)
                .highValueStrategy(highValueStrategy)
                .lowValueStrategy(lowValueStrategy)
                .highLossValueStrategy(highLossValueStrategy)
                .build();
    }

    // 거래 로그 생성 메서드
    private BackTestingDto.TradingLog createTradingLog(BackTestingDto.BackTestingResult backTestingResult) {
        Double rate = numberUtil.round(backTestingResult.getRate(), 2);
        backTestingResult.updateRate(rate);

        return BackTestingDto.TradingLog.of(backTestingResult);
    }
```

설명이 너무 길어지기에 상세한 설명은 생략하도록 하겠다.

![](https://velog.velcdn.com/images/hsh111366/post/5adcd648-b6d3-47a6-8c97-6174308ad076/image.png)

결과적으로 위와 같은 백테스팅 결과 화면을 구성할 지표들을 계산하게 된다.

크게는 이러한 로직으로 백테스팅 기능을 구현 완료했다.
아니, 완료했다고 보기는 힘들다.. 완전히 수학적인 계산이기 때문에 코드가 하나라도 잘못 적히게 되면 아예 다른 결과가 나오기도 했고, 숫자와 관련된 에러도 많이 발생했다.

때문에 개발을 진행하면서 계속해서 수정을 진행했던 것 같다.

깡구현이었기 때문에, 내가 구현한 코드가 적절한 계산법인지에 대한 의문도 남아 있다. 하지만 확실히 처음에 코드를 짰을 때보다는 많이 개선되었음은 확실하다.

특히 `BigDecimal` 타입을 적용하여 수익률을 더 올릴 수 있었다.
비트코인의 경우에는 가격이 굉장히 크기 때문에 (개당 몇천만원 꼴), 매수를 진행할 때 보통 비트코인 개수가 소숫점으로 표현이 된다.

원래는 이를 `Double` 로 하였지만, 그렇게 되면 누락되는 코인의 개수가 발생하게 되고 이들이 쌓인다면 꽤나 큰 금액이 될 수 있음을 인지하였다.

때문에 코인을 계산할 때에는 `BigDecimal` 타입을 활용해 보는 경험도 하였다. 
정확한 계산을 하고 싶어서 숫자를 모두 `BigDecimal` 로 바꾸기도 했는데... 그렇게 하니 기존에 비해 성능이 너무 느려져서 다시 바꾸느라 애먼 시간을 날리기도 했다 🥲

찾아보니 `BigDecimal` 객체는 보다 정밀한 숫자 정보를 저장해야하므로 큰 메모리 공간을 사용하게 되어 기본 자료형에 비해 성능이 느리다고 한다! 사실 당연한 건데 그때는 별 생각이 없었던 것 같다...

구현하고 수정하느라 눈이 빠질 뻔 👀 한 적이 한 두번이 아니지만 그래도 기능을 직접 만들었다는 점, 새로운 타입을 활용해보았다는 점 등은 뿌듯했다!

> 🧑🏻‍💻 멘토님께서 `BigDecimal` 타입에 대한 언급을 해주셔서 사용을 해 볼 수 있었던 것 같다. `BigDecimal`은 정밀한 계산에서 필요하기에 은행과 같은 금융 서비스에서 자주 사용할 것 같다. 실제 현업에서는 어떻게 활용하고 있고, 느린 성능을 개선하기 위해서 어떻게 하고 있는지 궁금하다!

### 4) 보안성1 : 쿠키 사용


![](https://velog.velcdn.com/images/hsh111366/post/fa555668-3402-49c7-b12c-cfb8a701bc52/image.png)

해당 프로젝트에서는 소셜 로그인 (구글, 네이버, 카카오)를 활용해 로그인 및 회원가입을 구현했다. 
액세스 토큰은 로그인 성공 시 프론트엔드로 보내주어 관리하게 되지만, 리프레쉬 토큰의 관리까지 맡기기에는 무리가 있었다.

때문에 리프레쉬 토큰은 쿠키에 담아 관리를 진행하며 편리성 및 보안성을 높이고자 했다.
또한 토큰 탈취 시나리오에 대한 방지도 고려하여 구현하였다.

이에 대해서는 아래 블로그 글을 많이 참고하였다.

(링크 : https://mgyo.tistory.com/832)

### 5) 보안성2 : 업비트 키 암호화

![](https://velog.velcdn.com/images/hsh111366/post/8e9d42f5-1d33-4cad-bb40-d422fb742e59/image.png)

서비스에서 자동매매 기능을 사용하기 위해서는 사용자의 업비트 키 (액세스, 시크릿)을 받아서 이용해야 했다. 하지만 이는 개인정보이기에 탈취당한다면 큰 문제가 발생할 수 있다.

때문에 키 등록 시에, 암호화를 진행한 후에 DB에 저장하는 방식을 결정했다.

순서는 위에 있는 것과 같고, 퍼블릭 키로 암호화를 진행한 후에 키들을 DB에 저장한다.

그리고 프라이빗 키도 저장을 해야 하는데, 만약 이 프라이빗 키도 탈취를 당한다면 업비트 키를 복호화할 수 있기 때문에 대칭키로 프라이빗 키를 암호화 한 후에 DB에 저장했다.

업비트 API 사용을 위해 키를 DB에서 가져와 사용하는 경우에는 위의 과정을 반대로 진행하여 키값들을 얻은 후에, 통신용 JWT 토큰을 발급해서 통신을 진행했다.

암호화/복호화는 이번 학기 네트워크보안 수업을 들으면서 처음 알게 된 것이라..조금 미숙하게 구현한 것 같기는 하다 😂

> 🧑🏻‍💻 패스워드 관리 같은 것들은 해시를 사용해서, 스프링 시큐리티로 많이 사용하는 것 같은데.. 이렇게 원본 키 값을 다시 확인해야 하는 경우에서는 어떤 방식으로 암호화를 진행하는지가 궁금하다..!

### 6) 딥러닝 연동

딥러닝 연동하는 것도 거의 막바지에 겨우 성공을 했던 것 같다...

메인 기능들 구현하는 데에도 쉽지 않았어서, 딥러닝 파트 팀원분이 넘겨 주신 코드를 보고 이해를 어느 정도 한 뒤에 구현을 했다.

Flask를 활용해서 딥러닝 가격 예측 결과 조회 API를 만들었고, 이를 스프링 부트에서 12시에 호출하며 새로운 가격 예측 값을 받았다. 로직은 아래와 같다.

1️⃣ 스프링 부트 스케줄러를 사용하여 매일 12시마다, 딥러닝 서버 API를 자동으로 호출한다. 
이 때, DB에 저장되어 있는 비트코인 가격 데이터를 보내주었고 이는 당일까지 반영하여 새롭게 업데이트 한 후 보내준다.

2️⃣ 받은 비트코인 데이터를 통해서 베이스 모델 학습을 진행한 후에, 새로운 가중치를 저장한다. 

3️⃣ 새로운 가중치를 가지고 앞으로 5일간의 비트코인 종가 예측값을 만들어 낸다.

4️⃣ 예측 데이터를 백엔드 서버로 반환한다.

5️⃣ 예측 데이터를 DB에 저장하여, 프론트엔드 측에서 조회할 시 반환한다.

> 🧑🏻‍💻 Flask도 거의 안써봤는데 어쩌다 보니 창업 동아리 때부터 2번째 사용하고 있다. 
API 구현 자체는 크게 어렵지 않아서 다행이었는데, 여기서도 데이터 타입 때문에 애를 좀 먹었다.. 그래서 `직렬화 & 역직렬화`를 공부해야겠다는 생각이 들었다!
그리고 딥러닝 코드를 돌아가게 해 본 것도 거의 처음이었어서, 신기하고 재미있었다! 🙃


### 7) 전역 에러처리

예전에는 에러 처리를 할 때 그냥 ResponseEntity를 바로 만들어서 반환하고는 했었는데, 뭔가 조금 더 정해진 방식이 있으면 좋겠다는 생각을 했다.

그래서 기존에 사용하고 있던 ApiResponse를 활용해서 응답 포맷을 통일해보기로 하였다.
아래에서는 에러를 던지고 처리하는 순서대로 한 번 설명해보도록 하겠다!

#### 서비스 로직

```java
	// 백테스팅 결과를 저장하는 메서드
    @Override
    @Transactional
    public void saveBackTestingResult(String authorizationHeader, BackTestingDto.SavingRequest savingRequest) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        Portfolio portfolio = portfolioRepository.findByPortfolioId(savingRequest.getPortfolioId())
                .orElseThrow(() -> new PortfolioException(PortfolioErrorResult.NOT_FOUND_PORTFOLIO));

        // 이미 저장된 포트폴리오인 경우
        if (portfolio.getIsSaved()) {
            throw new PortfolioException(PortfolioErrorResult.IS_ALREADY_SAVED);
        }

        // 포트폴리오 저장 처리
        portfolio.savePortfolio(savingRequest.getComment());
        portfolioRepository.save(portfolio);
    }
```

만약에 이렇게 서비스 로직이 있을 때, 포트폴리오를 찾지 못하면 지정해 둔 에러를 던지게 된다.
에러를 던지기만 한다고 처리가 되지는 않기에, 이를 받아서 처리해 줄 다른 로직이 필요하다.

#### GlobalExceptionHandler

```java
package org.dgu.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.dgu.backend.common.ApiResponse;
import org.dgu.backend.common.code.BaseErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Token
    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleTokenException(TokenException e) {
        TokenErrorResult errorResult = e.getTokenErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Header
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<String> handleMissingHeaderException(MissingRequestHeaderException ex) {
        String errorMessage = "Required header '" + ex.getHeaderName() + "' is missing";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
    }
    // User
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleUserException(UserException e) {
        UserErrorResult errorResult = e.getUserErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Portfolio
    @ExceptionHandler(PortfolioException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handlePortfolioException(PortfolioException e) {
        PortfolioErrorResult errorResult = e.getPortfolioErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // BackTesting
    @ExceptionHandler(BackTestingException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleBackTestingException(BackTestingException e) {
        BackTestingErrorResult errorResult = e.getBackTestingErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Number
    @ExceptionHandler(NumberException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleNumberException(NumberException e) {
        NumberErrorResult errorResult = e.getNumberErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Upbit
    @ExceptionHandler(UpbitException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleUpbitException(UpbitException e) {
        UpbitErrorResult errorResult = e.getUpbitErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Encryption
    @ExceptionHandler(EncryptionException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleEncryptionException(EncryptionException e) {
        EncryptionErrorResult errorResult = e.getEncryptionErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Chart
    @ExceptionHandler(ChartException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleChartException(ChartException e) {
        ChartErrorResult errorResult = e.getChartErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Market
    @ExceptionHandler(MarketException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleMarketException(MarketException e) {
        MarketErrorResult errorResult = e.getMarketErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Candle
    @ExceptionHandler(CandleException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleCandleException(CandleException e) {
        CandleErrorResult errorResult = e.getCandleErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Trading
    @ExceptionHandler(TradingException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handleTradingException(TradingException e) {
        TradingErrorResult errorResult = e.getTradingErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
    // Prediction
    @ExceptionHandler(PredictionException.class)
    public ResponseEntity<ApiResponse<BaseErrorCode>> handlePredictionException(PredictionException e) {
        PredictionErrorResult errorResult = e.getPredictionErrorResult();
        return ApiResponse.onFailure(errorResult);
    }
}
```

그래서 이렇게 `GlobalExceptionHandler` 를 구현하여 전역 에러 처리를 진행한다.

`@RestControllerAdvice` 어노테이션을 두었기 때문에, 컨트롤러에서 발생하는 모든 에러에 대해 처리를 해줄 수 있다. 즉, API 요청을 통해서 발생하는 에러에 대해 대처가 가능하다.

이전에는 잘 몰라서 컨트롤러 단에서 try-catch 구문을 쓰는 일도 있었는데.. 잘하는 친구가 조언을 해줘서 이렇게 사용하게 되었다 👍🏻

하나의 핸들러에서 모든 에러 처리를 해줄 수 있으니 편리했던 것 같다!
에러를 받은 후에는, 클라이언트에서도 확인할 수 있도록 `ApiResponse` 를 사용해 반환하였다.

#### ApiResponse

```java
package org.dgu.backend.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.dgu.backend.common.code.BaseCode;
import org.dgu.backend.common.code.BaseErrorCode;
import org.springframework.http.ResponseEntity;

@Getter
@RequiredArgsConstructor
public class ApiResponse<T> {
    @JsonProperty("is_success")
    private final Boolean isSuccess;
    private final String code;
    private final String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final T payload;
    public static <T> ResponseEntity<ApiResponse<T>> onSuccess(BaseCode code, T payload) {
        ApiResponse<T> response = new ApiResponse<>(true, code.getReasonHttpStatus().getCode(), code.getReasonHttpStatus().getMessage(), payload);
        return ResponseEntity.status(code.getReasonHttpStatus().getHttpStatus()).body(response);
    }

    public static <T> ResponseEntity<ApiResponse<T>> onSuccess(BaseCode code) {
        ApiResponse<T> response = new ApiResponse<>(true, code.getReasonHttpStatus().getCode(), code.getReasonHttpStatus().getMessage(), null);
        return ResponseEntity.status(code.getReasonHttpStatus().getHttpStatus()).body(response);
    }

    public static <T> ResponseEntity<ApiResponse<T>> onFailure(BaseErrorCode code) {
        ApiResponse<T> response = new ApiResponse<>(false, code.getReasonHttpStatus().getCode(), code.getReasonHttpStatus().getMessage(), null);
        return ResponseEntity.status(code.getReasonHttpStatus().getHttpStatus()).body(response);
    }
}
```

여기서 첫번째, 두번째는 성공 시 응답 객체를 구성하는 로직이다.
그리고 세번째가 실패했을 때, 즉 에러를 던질 때의 로직이다. 

![](https://velog.velcdn.com/images/hsh111366/post/c95851df-bde0-4cac-b74c-adba4d3583d1/image.png)

클라이언트는 위와 같은 형태로 응답을 받게 되며,
1) 상태 코드 2) 메세지 3) 성공 여부를 확인할 수 있다.

또한 ApiResponse 객체를 ResponseEntity로 한 번 더 말아서 보내기 때문에, 실제 HttpStatus도 반영되어 있는 모습을 확인할 수 있다! (현재 409)

다만 나도 이 방식이 `상태 코드를 중복으로 보내니 불필요한가?` 라는 생각이 들어서 한동안 서칭을 해 본적이 있었다.

찾아 보니 1개만 사용을 하거나, 아니면 나처럼 커스텀 + 상태 코드까지 보내고 싶어 2개를 다 사용하는 경우도 있다고 한다. 그래서 이번에는 후자를 선택해서 진행했었다!

> 🧑🏻‍💻 프론트엔드 측에 최대한 많은 정보를 제공하고자 이렇게 구현했던 것 같다. 
하지만 불필요하게 느껴진다면 응답 객체에서 `code` 필드를 제거하거나 `ResponseEntity`는 사용하지 않는 방식으로 변경해도 좋을 것 같다!

---

# 🏆 결과

최종 발표 때까지 발표 연습도 열심히 하고, 시연 영상 편집까지 했기에.. 그래도 상을 받고 싶다는 생각은 했었다!

다만 너무 아쉬웠던 점은 발표 시간을 고작 시연 포함 6분 밖에 주지 않았다는 것이다...
팀이 10개가 넘기에 시간 상 그런 걸 수도 있고, 학생들이 하는 프로젝트이기에 큰 기대를 하지 않아서 그렇게 한 것일 수도 있겠다. 그래도 한 학기 동안 고생해서 만든 프로젝트를 발표하는 자리이니, 적어도 한 10분은 주면 좋지 않나 싶다 ^^

우리 서비스는 도메인이 어려워서 설명할 것도 많고, 기능이 많아서 보여주고 싶은 것들도 많았는데 시간이 없어서 엄청나게 빠르게 넘어갔던 것 같다. 그래도 발표 자체는 큰 문제 없이 잘 했던 것 같아서 후련했다!

![](https://velog.velcdn.com/images/hsh111366/post/853c94a8-9df4-430b-84df-68c46b871a52/image.jpeg)


그리고 결과적으로 2등을 했다! 사실 1등을 하고 싶었지만, 1등한 팀이 사업성 까지 고려를 해서 좋은 점수를 받았던 것 같다 ㅎㅎ

그래도 이렇게 좋은 성과를 내어 한 학기 동안 고생한 보상을 받은 것 같아서 행복했고, 많이 도와주신 멘토님께도 기분 좋게 말씀 드릴 수 있어서 더 뿌듯했던 것 같다! 🙂

함께 열심히 끝까지 달린 팀원들에게도 너무 고맙다 👍🏻👍🏻
얼른 상금을 받아서 멘토님과 함께 맛있는 걸 먹고 싶다! 🍻

---

# 💡 느낀 점 & 배운 점

## 1. 소셜 로그인 구현

소셜 로그인 구현은 이번 프로젝트까지 해서 총 6번째 해 보는 것 같다!

하지만 사실상 첫 3번은 구현하기에 급급했기에, 이제야 조금은 더 알게 되지 않았나 싶다.
하면서 느끼는 거지만 할수록 더 어렵고 배우는 게 많은 것 같다.

여러가지 시나리오도 생각해보아야 하고, 그래서 보안과 관련된 공부도 반강제적으로 꾸준히 하게 되는데.. 여기서 배우는 점이 많은 것 같아서 좋다 👍🏻

어차피 서비스에 있어서 로그인 & 회원가입과 같은 인증인가는 기본이기에, 나에게 좋은 경험이라고 생각을 한다!

## 2. 보안의 중요성

위에서 언급한 것처럼 보안적인 부분에서 공부를 더 많이 하면 좋을 것 같다고 느꼈다.

프로젝트를 여러 번 하면서 느끼는 건데, 사실 기능을 구현하는 것보다는 `어떻게 문제 없이 잘 돌아가도록 만드느냐`가 더 중요하고 어려운 것 같다.
물론 속도도 중요하지만, 디테일에 더 집착하고 신경을 쓰다 보면은 좀 더 좋은 개발자가 되지 않을까..? 하는 생각이 있다.

그래서 이번에 보안성에 조금 더 시간을 썼던 점은 내 성장에 큰 영양분이 되었던 것 같다! 
하지만 아직도 멀었으니... 스프링 시큐리티 공부를 제대로 해야할 것 같다 😂

## 3. DTO

이번에는 왔다갔다 하는 데이터의 양이나 개수가 많았어서, DTO를 구성하는 데에도 좀 신경을 쓴 것 같다.
`of & to` 메서드를 활용해 보기도 하고.. 어떻게 해야 간결하고 편리하게 사용할 수 있는지 고민을 했다.

그리고 숫자로 된 데이터들이 많았기에, 타입을 맞추는 데에서도 문제가 발생한 적도 꽤나 있었다.

`직렬화 & 역직렬화` ... 라는 것도 알게 된지는 얼마 안되었는데
직렬화는 `DTO -> Json` 로, 역직렬화는 `Json -> DTO` 로 변경하는 작업이라고 이해를 하기는 했다! 물론 꼭 DTO랑 Json은 아니겠지만 말이다.

> 🧑🏻‍💻 업비트 외부 API에서 받은 응답을 바로 DTO로 담으려고 했는데.. 그게 안돼서 애를 먹은 적도 있었다. 분명 레퍼런스에 나와 있는 타입대로 한 것 같은데 왜 안되지..? 
그래서 직렬화 & 역직렬화에 대한 공부를 좀 더 한다면 DTO를 훨씬 잘 다룰 수 있을 것 같다는 생각이 들었다!

## 4. 트레이딩 관련 지식

백테스팅, 물타기 매매법, 지수가중이동평균, 골든 크로스 등등 ... 
공부하고 구현도 해 보고 실제로 자동매매까지 해 보니 어느정도 지식이 습득된 것 같기는 하다! 
지금 당장 나에게 필요한 지식인가를 따져 보았을 때는 아닐 수 있으나, 언젠가는 지금의 경험이 도움이 될 수 있으리라 생각한다 🙃

## 5. 캡스톤 디자인 (은 빡세다)

생각보다 많이 힘들었던 점은, 거의 매주 보고서를 제출해야 했고 발표도 자주 있었다는 점이다.

3명이서 개발을 하는데, 한 분은 딥러닝이셨기에 사실상 프론트 1명 백엔드 1명이서 전반적인 개발을 진행했다.

때문에 시간이 많이 부족했는데.. 그 와중에 이것저것 다른 것들도 많이 시키니까 너무 정신이 없었다. 
그래도 딥러닝 파트 분께서 기획 쪽을 해보셨고 보고서를 잘 쓰셔서 이러한 부분에서는 도움을 많이 받은 것 같다!

사실 서비스에 대한 욕심을 조금 줄이면 쉽게 갈 수도 있는 거였는데.. ㅋㅋㅋㅋ 나랑 프론트 분이랑 둘 다 욕심이 조금 있는 편이라 마지막까지 거의 밤을 새가며 어떻게든 했던 것 같다. 

어찌됐든 한 번 더 하라면 못할 것 같다.. 🤣🤣

---

# 👋🏻 마무리

이렇게 나의 마지막 학기가 끝이 났다!
후련할 겨를도 없이 다른 일들을 하느라 정신이 없었지만...
이렇게 쭉 돌아 보니 바쁜 일정 속에서도 만족할 만한 성과를 냈음에 뿌듯함이 드는 것 같다!

앞으로도 너무 지치지 않고 내가 즐거운 선에서 열심히 개발을 공부해 보고 싶다 🔥
