## 목차

1. [Amazon Connect란?](#1-amazon-connect란)
2. [이번 실습에서 사용한 기술 스택](#2-이번-실습에서-사용한-기술-스택)
3. [우리가 만든 것](#3-우리가-만든-것)
4. [구축 과정 및 트러블슈팅](#4-구축-과정-및-트러블슈팅)
5. [결과물](#5-결과물)
6. [앞으로의 개선점](#6-앞으로의-개선점)
7. [도입 가능성 검토](#7-도입-가능성-검토)

---

## 1. Amazon Connect란?

### 한 줄 요약

**AWS 기반의 클라우드 네이티브 컨택센터(CCaaS) 플랫폼으로, AI 에이전트를 활용한 고객 응대 자동화를 지원하는 서비스입니다.**

>[Amazon Connect 서비스 소개 페이지](https://aws.amazon.com/ko/connect/)

### 탄생 배경

Amazon Connect는 Amazon.com이 자체 고객센터를 운영하기 위해 2007년부터 내부에서 직접 개발한 시스템에서 출발했습니다. 당시 아마존은 기존 콜센터 솔루션으로는 급증하는 고객 문의를 감당할 수 없었고, 결국 자체 시스템을 만들기로 결정했습니다.

이렇게 약 10년간 아마존 내부에서 실전 검증을 거친 뒤, 2017년 외부에 AWS 서비스로 공개되었습니다. 즉, 세계 최대 이커머스 기업의 고객센터가 실제로 사용해온 시스템을 누구나 쓸 수 있게 된 것입니다.

### 왜 주목받고 있나요?

기존 콜센터를 구축하려면 CTI(전화 연동), PBX(교환기), IVR(음성 안내), PSTN 망, 녹취 장비 등 값비싼 장비를 설치해야 했습니다. 구축에만 수개월이 걸리고, 초기 비용만 수억 원이 드는 경우도 많았습니다.

Amazon Connect는 이런 물리적 인프라가 전혀 필요 없습니다. 웹 브라우저에서 인스턴스를 생성하면 즉시 콜센터가 구성되고, **사용한 만큼만 비용을 내는 구조**입니다. 인스턴스 자체에는 유지비가 없고, 통화나 채팅이 발생한 만큼만 과금됩니다. 다만 전화번호를 할당(claim)해 놓으면 통화가 없어도 번호 유지비(서울 리전 DID 기준 ~$0.0864/일, 월 ~$2.6)는 발생합니다. 그래도 에이전트 수 기반으로 월 수백만 원의 고정비를 내야 했던 기존 콜센터와 비교하면 비용 구조가 완전히 다릅니다.

| 구분 | 기존 콜센터 (온프레미스) | Amazon Connect (클라우드) |
|------|------------------------|--------------------------|
| 초기 비용 | 수억 원 (장비, 설치, 라이선스) | 0원 (사용한 만큼만 과금) |
| 구축 기간 | 수개월 ~ 1년 | 수 시간 ~ 수일 |
| 필요 장비 | CTI, PBX, IVR, PSTN 망, 녹취 장비 | 없음 (웹 브라우저만 있으면 됨) |
| 상담원 확장 | 장비 추가 구매 필요 | 자동 확장 (제한 없음) |
| AI 연동 | 별도 구축 필요 | 네이티브 내장 |
| 과금 방식 | 월 고정비 (에이전트당 $75~150+) | 분당 과금 ($0.038/분) + 번호 유지비(~$0.03/일) |

### AI와의 결합 - AICC(AI Contact Center)

최근 Amazon Connect가 특히 주목받는 이유는 **AI 기능이 플랫폼에 깊이 통합되어 있기 때문**입니다.

단순히 ARS 버튼("1번을 누르세요")을 거치는 게 아니라, AI가 고객의 말을 직접 듣고 이해한 뒤 스스로 판단해서 업무를 처리합니다. 예를 들어:

- 고객: "지난주에 주문한 제품 환불하고 싶어요"
- AI: 주문 내역 조회 → 환불 규정 확인 → 고객에게 확인 후 → 환불 처리 → 이메일 발송

이런 과정이 사람 개입 없이 자동으로 이루어집니다. 물론 AI가 처리하기 어려운 복잡한 문의는 실제 상담원에게 바로 연결(에스컬레이션)됩니다.

**AI와 콜센터가 결합되는 두 가지 방식이 있습니다:**

| 방식 | 설명 | 예시 |
|------|------|------|
| **AI가 직접 응대** | AI가 고객과 대화하며 문제를 해결하고, 처리 불가 시 상담원에게 넘김 | "환불 요청" → AI가 직접 처리 |
| **AI가 상담원을 보조** | 상담원이 통화하는 동안 AI가 관련 정보를 실시간으로 제공 | 통화 중 AI가 관련 FAQ/이전 이력을 화면에 표시 |

이번 실습에서는 **첫 번째 방식(AI 직접 응대)을** 구현했고, 해결이 어려운 경우 상담원에게 에스컬레이션하는 로직도 포함되어 있습니다.

### 주요 기능 한눈에 보기

| 기능 | 설명 |
|------|------|
| **옴니채널** | 전화, 채팅, 이메일, SMS 등 다양한 채널을 하나로 통합 관리 |
| **IVR 플로우 편집기** | 드래그 앤 드롭으로 상담 흐름을 만들 수 있어요 (코딩 불필요) |
| **Amazon Lex 연동** | 음성 인식(STT), 음성 합성(TTS), 자연어 이해(NLU) 기능을 제공합니다 |
| **Contact Lens** | 통화 녹음, 실시간 텍스트 전사, 감정 분석, 상담 후 자동 요약 |
| **AI Agent** | Bedrock 기반 AI가 고객 요청을 분석하고 도구를 호출해 직접 처리 |
| **예측/스케줄링** | ML 기반으로 콜량을 예측하고 상담원 일정을 자동으로 계획 |
| **아웃바운드 캠페인** | 고객 리스트를 업로드하면 자동으로 전화를 발신해줍니다 |
| **모니터링/BI** | 대시보드, 실시간 지표, QuickSight/Tableau 연동 가능 |
| **글로벌 운영** | 여러 리전에 컨택센터를 분산 구축할 수 있습니다 |

### AWS 서비스와의 네이티브 연동

Amazon Connect의 큰 강점 중 하나는 **AWS의 다른 서비스들과 자연스럽게 연동된다는 점**입니다.

- **Lambda**: 전화가 오면 자동으로 코드를 실행 (고객 조회, 티켓 생성 등)
- **DynamoDB**: 고객 정보, 상담 이력 등을 저장
- **S3**: 통화 녹음 파일, FAQ 문서 등을 저장
- **Bedrock**: AI 모델(Claude 등)을 연결해서 지능형 응대
- **SES**: 상담 결과를 이메일로 자동 발송
- **CloudWatch**: 콜센터 운영 지표를 실시간 모니터링

이 모든 연동이 별도 미들웨어 없이 가능하기 때문에, AWS를 이미 사용하고 있는 조직이라면 도입 장벽이 매우 낮습니다. 실제로 토스증권은 자체 CRM에 Connect API/SDK를 직접 연동해서 사용하고 있습니다.

### 현재 시장에서의 위치

| 지표 | 내용 |
|------|------|
| Gartner 2025 Magic Quadrant | CCaaS(클라우드 컨택센터) 부문 **리더** 선정 |
| Forrester 2025 Wave | CCaaS 부문 **리더** 선정 |
| 신기능 출시 속도 | 2023년 171개 → 2024년 200개 → 2025년 235개+ (매 워킹데이 1개 이상) |
| 사용 고객 | 전 세계 수만 개 기업 |
| 한국 리전 | 서울(ap-northeast-2) 지원, 한국어 TTS/STT 지원 |

### 국내 도입 현황

국내에서는 2023년 말~2024년 초부터 본격적인 도입 사례가 나오고 있습니다.

- **대한항공**: 전 세계 45개국 콜센터를 통합하여 약 900명의 상담사가 운영 중이며, AI 상담 자동화를 도입했습니다
- **토스증권**: 자체 CRM과 Amazon Connect를 직접 연동하여 고객센터를 운영 중입니다. 전화 인입 시 고객 원장 정보를 자동 조회하고, 온프레미스 STT 대비 Transcribe 도입으로 80% 이상 비용을 절감했습니다 ([AWS 기술 블로그 사례](https://aws.amazon.com/ko/blogs/tech/toss-securities-amazon-connect-migration-journey/))
- **카카오스타일**: 메가존클라우드와 함께 Amazon Connect 기반 AI 컨택센터(AICC)를 구축했으며, 음성/챗봇 IVR, 실시간 감정 분석, 통화 요약 등을 활용 중입니다
- **웅진**: Amazon Connect 기반 차세대 컨택센터를 구축했습니다 ([AWS 기술 블로그 사례](https://aws.amazon.com/ko/blogs/tech/woongjin-amazon-connect-contact-center/))

글로벌로는 Capital One, Intuit, American Airlines, Fujitsu 등 대기업의 대규모 운영 사례가 다수 있으며, 기술적 성숙도는 충분한 수준입니다.

---

## 2. 이번 실습에서 사용한 기술 스택

### 전체 아키텍처 흐름

```
  고객 전화
     │
     ▼
┌─────────────────┐
│ Amazon Connect   │
│ (Contact Flow)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Amazon Lex Bot   │────▶│ AI Agent         │
│ (음성 인식)      │     │ (Self-service    │
└─────────────────┘     │  Orchestration)  │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │ MCP 서버  │ │ AI 프롬프트│ │Knowledge │
            │(AgentCore │ │(비즈니스  │ │  Base    │
            │ Gateway)  │ │ 규칙)     │ │(FAQ)    │
            └─────┬────┘ └──────────┘ └──────────┘
                  │
                  ▼
            ┌──────────┐
            │ API GW   │
            │ + Lambda  │
            │ + DynamoDB│
            └──────────┘
```

### 기술별 설명

| 기술 | 비유 | 역할 | 왜 이걸 썼나요? |
|------|------|------|----------------|
| **Amazon Connect** | 콜센터 건물 | 전화 수발신, 상담 흐름 관리 | 클라우드 네이티브, 즉시 구축 가능 |
| **Contact Flow** | 안내 데스크 매뉴얼 | "전화 오면 이렇게 처리해라"는 흐름도 | 드래그 앤 드롭으로 만들 수 있습니다 |
| **Amazon Lex** | 통역사 | 고객 음성 → 텍스트 변환(STT) + 의도 파악 | Connect와 네이티브 연동 |
| **AI Agent (Q in Connect)** | AI 상담원의 두뇌 | 고객 요청을 분석하고 어떤 도구를 써야 할지 판단 | Bedrock 기반, 동적 계획 수립 |
| **MCP Server** | AI의 손 | AI가 외부 시스템(API)을 호출할 수 있게 연결 | 표준 프로토콜, 보안 인증 내장 |
| **API Gateway** | 건물 출입구 | 외부 요청을 받아서 적절한 Lambda로 전달 | API 키 인증, 속도 제한 |
| **Lambda** | 실무 담당자 | 실제 비즈니스 로직 실행 (조회, 생성, 이메일 등) | 서버 관리 불필요, 호출 시에만 과금 |
| **DynamoDB** | 파일 캐비닛 | 고객 정보, 티켓 데이터 저장 | 서버리스, 자동 확장 |
| **CloudFormation** | 설계 도면 | 위 인프라를 코드 한 장으로 자동 배포 | 클릭 한 번으로 전체 인프라 생성 |
| **Knowledge Base (S3)** | 매뉴얼 책장 | FAQ 문서를 저장, AI가 검색해서 답변 | RAG 기반 정확한 답변 제공 |
| **Claude (Bedrock)** | AI 엔진 | AI Agent의 언어 모델 | 한국어 능숙, 복잡한 추론 가능 |

### MCP(Model Context Protocol)란?

MCP는 AI가 외부 시스템과 통신하기 위한 **표준 프로토콜**입니다.

기존에는 AI가 각 시스템마다 다른 방식으로 연결해야 했는데요, MCP를 사용하면 하나의 표준 규격으로 여러 시스템에 연결할 수 있습니다. 마치 USB-C 하나로 여러 기기를 충전할 수 있는 것과 비슷합니다.

이번 실습에서는 **AgentCore Gateway**(AWS 관리형 MCP 서버)를 사용해서, AI Agent가 우리가 만든 API를 안전하게 호출할 수 있도록 구성했습니다.

### AICC Builder란?

> aicc builder image

이번 워크샵에서는 AWS SA(솔루션 아키텍트)가 개발한 **AICC Builder**라는 내부 도구를 사용했습니다. 이 도구에 "어떤 콜센터를 만들고 싶은지" 대화형으로 입력하면, Claude 기반의 AI가 약 8개의 서브 에이전트를 조율하면서 필요한 모든 코드와 설정 파일을 자동으로 생성해줍니다.

생성되는 에셋:
- CloudFormation 템플릿 (인프라 코드)
- Lambda 함수 코드 (비즈니스 로직)
- AI 프롬프트 (상담원 페르소나)
- Contact Flow (상담 흐름 JSON)
- OpenAPI 명세 (API 규격서)
- DynamoDB 스키마 (데이터베이스 구조)
- FAQ 문서 (Knowledge Base용)

다만, 자동 생성된 코드가 100% 완벽하지는 않기 때문에 **반드시 리뷰 과정을 거쳐야 합니다**.

---

## 3. 우리가 만든 것

### 시나리오: LogosAI 기술지원 AI 컨택센터

이번 실습에서는 가상의 **"LogosAI 기술지원 AI 상담원"을** 구축했습니다.

- **AI 상담원 이름**: 박봉식 (LogosAI 기술지원 전문가)
- **역할**: 고객이 전화하면 AI 상담원 "박봉식"이 자동으로 응대하여 기술 문의를 처리합니다

### 전체 상담 흐름

> Contact Flow 편집기 캡처

```
1. 고객 전화 인입
      ↓
2. 전화번호로 고객 자동 조회
      ↓
   ┌─ 기존 고객 → "안녕하세요, OO회사 OOO님"  (개인화 인사)
   └─ 신규 고객 → 이름/이메일/전화번호 순차 수집
      ↓
3. AI 상담원(박봉식)이 문의 내용 파악
      ↓
4. Knowledge Base(FAQ)에서 답변 검색
      ↓
5. 답변 제공 + 티켓 자동 생성
      ↓
6. 상담 내역 이메일 발송
      ↓
7. 해결 불가 시 → 실제 상담원에게 에스컬레이션
```

> AI Agent 설정 화면 캡처

### 구현한 기능 (Lambda 5개)

| 기능 | 설명 | 사용 예시 |
|------|------|----------|
| **고객 조회** (customer_lookup) | 전화번호로 고객 정보를 자동 검색합니다 | "010-1234-5678로 전화 → 삼성전자 김민수님 확인" |
| **티켓 생성** (create_ticket) | 상담 내용을 티켓으로 자동 등록합니다 | "ERP 로그인 오류 → TKT-20260312-A1B2 생성" |
| **티켓 조회** (get_customer_tickets) | 고객의 과거 상담 이력을 확인합니다 | "이전에 접수하신 건이 2건 있네요" |
| **이메일 발송** (send_email) | 상담 결과를 이메일로 발송합니다 | "상담 요약을 이메일로 보내드렸습니다" |
| **Q 세션 업데이트** (update_q_session) | AI에게 고객 컨텍스트를 전달합니다 | (내부 처리: AI가 고객 정보를 인지하는 과정) |

### Knowledge Base (FAQ 15건)

LG전자 세탁기 기술지원 FAQ를 Knowledge Base에 등록했습니다:
- 오류 코드 해결 가이드 (LE, IE, OE, UE, DE)
- 세탁기 관리/청소 가이드
- 설치 및 사용법
- 문제 해결 (소음, 냄새, 동파 방지 등)

### 샘플 데이터

DynamoDB에 아래 샘플 데이터를 자동으로 시딩(초기 투입)했습니다:
- **고객 5건**: 케빈테크, 삼성전자, LG전자, 현대자동차, 네이버
- **티켓 6건**: 다양한 카테고리/상태의 기술지원 티켓

---

## 4. 구축 과정 및 트러블슈팅

> cloudFormation 스택 배포 완료 화면 캡처

### 구축 타임라인

| 시간 | 작업 | 소요 시간 |
|------|------|----------|
| 11:00 | AICC Builder로 에셋 생성 (대화형) | ~1시간 |
| 12:00~13:00 | 점심 식사 | - |
| 13:00 | CloudFormation 인프라 배포 | ~20분 |
| 13:30 | Amazon Connect 인스턴스 생성 및 설정 | ~30분 |
| 14:00 | MCP 서버 구성 (AgentCore Gateway) | ~20분 |
| 14:20 | AI Agent 설정 (프롬프트, 도구 연결) | ~30분 |
| 14:50 | Contact Flow 구성 | ~30분 |
| 15:20~ | 테스트 및 트러블슈팅 | ~1시간 30분+ |

### 트러블슈팅 기록

실습 과정에서 3건의 에러가 발생했고, 모두 현장에서 해결했습니다.

#### Issue 1: Update Q Session Lambda 권한 오류 (403 AccessDeniedException)

**증상**:
```
AccessDeniedException: User: ...assumed-role/aws-aicc-logosai-update-qsession-role-dev/...
is not authorized to perform: connect:DescribeContact
```

**원인**:
AICC Builder가 자동 생성한 CloudFormation의 IAM 역할에는 `connect:UpdateContact`, `UpdateContactAttributes`, `GetContactAttributes` 권한만 부여되어 있었습니다. 그런데 실제 Lambda 코드는 `DescribeContactCommand`와 `UpdateSessionDataCommand`를 사용하고 있었어요. CloudFormation 인라인 코드와 실제 배포된 Lambda 코드가 서로 다른 로직이라서, **권한이 코드를 따라가지 못한 상태**였습니다.

**해결**:
IAM 콘솔에서 해당 역할의 인라인 정책에 `connect:DescribeContact`, `wisdom:UpdateSession`, `wisdom:GetSession` 권한을 추가했습니다.

**교훈**: AI가 자동 생성한 코드와 IAM 정책 사이에 불일치가 발생할 수 있으므로, 배포 전에 Lambda 코드가 사용하는 AWS API 호출과 IAM 권한을 반드시 대조 검증해야 합니다.

---

#### Issue 2: Customer Lookup Lambda 핸들러 이름 불일치 (HandlerNotFound)

**증상**:
```
Runtime.HandlerNotFound: Handler 'lambda_handler' missing on module 'index'
```

**원인**:
CloudFormation에서 Lambda 핸들러를 `index.lambda_handler`로 설정했는데, AICC Builder가 생성한 실제 코드의 함수명은 `handler`였습니다. 이름이 달라서 Lambda 런타임이 함수를 찾지 못한 것입니다.

**해결**:
Lambda 코드의 함수명을 `def handler` → `def lambda_handler`로 수정한 후 재배포했습니다.

**교훈**: Lambda의 핸들러 설정(Runtime Settings)과 실제 코드의 함수명이 일치하는지 배포 전에 확인이 필요합니다.

---

#### Issue 3: CustomerEndpoint가 None으로 들어오는 케이스 (AttributeError)

**증상**:
```
AttributeError: 'NoneType' object has no attribute 'get'
```

**원인**:
Amazon Connect에서 Lambda를 호출할 때, `CustomerEndpoint` 필드가 `null`로 전달되는 경우가 있었습니다. 코드에서는 이 값이 항상 존재한다고 가정하고 있어서 에러가 발생했습니다.

**해결**:
`or {}` 구문을 추가해서 `None`일 때도 안전하게 빈 딕셔너리로 처리되도록 수정했습니다.

**교훈**: AWS 서비스에서 전달하는 이벤트 데이터는 필드가 존재하더라도 값이 `null`인 경우가 있어서, 방어적 코딩이 필요합니다.

---

## 5. 결과물

> ![TODO: Lambda 함수 목록 캡처](./images/lambda-functions-list.png)
> *캡처 위치: AWS 콘솔 → Lambda → Functions (aws-aicc-logosai 검색)*

> ![TODO: DynamoDB 테이블 캡처](./images/dynamodb-tables.png)
> *캡처 위치: AWS 콘솔 → DynamoDB → Tables (Customers/Tickets 테이블)*

### 배포된 인프라

| 리소스 | 상세 |
|--------|------|
| AWS 리전 | ap-northeast-2 (서울) |
| API Gateway | `https://1wzqf12mkd.execute-api.ap-northeast-2.amazonaws.com/dev` |
| Lambda 함수 | 5개 (Python 4 + Node.js 1) |
| DynamoDB 테이블 | 2개 (Customers, Tickets) |
| S3 버킷 | 1개 (Knowledge Base FAQ + OpenAPI 스펙) |
| MCP 서버 | AgentCore Gateway 1개 |
| Connect 인스턴스 | 1개 (AI Agent + Contact Flow 포함) |
| AI Agent | 박봉식 (Orchestration Agent, Claude 기반) |
| Knowledge Base | LG전자 세탁기 FAQ 15건 |

### 실제 동작 확인

> ![TODO: 실제 전화 테스트 화면 캡처](./images/call-test-demo.png)
> *캡처 위치: Amazon Connect CCP(Contact Control Panel) 화면 또는 전화 테스트 중 스크린샷*

> ![TODO: AI Agent 대화 로그 캡처](./images/ai-agent-conversation.png)
> *캡처 위치: Amazon Connect 콘솔 → Contact search → 해당 통화의 AI 대화 로그*

- 전화 인입 → AI 자동 응대 (한국어 음성 인식/합성)
- 기존 고객 자동 인식 + 개인화 인사
- FAQ 기반 답변 제공
- 티켓 자동 생성 (DynamoDB 저장 확인)
- 해결 불가 시 상담원 에스컬레이션

### 소요 비용

워크샵 실습 기준 약 **$2~5** 수준이었습니다 (테스트 통화 수 건 기준).

---

## 6. 앞으로의 개선점

### 단기 개선

| 항목 | 현재 상태 | 개선 방향 |
|------|----------|----------|
| 이메일 발송 | 로그만 기록 (SES 미연동) | SES를 연동하여 실제 이메일 발송 |
| Knowledge Base | LG 세탁기 FAQ 15건 | 실제 서비스 FAQ로 교체 |
| AI 프롬프트 | 워크샵용 범용 | 실제 비즈니스 시나리오에 맞게 고도화 |
| 에러 핸들링 | 기본 수준 | 재시도 로직 및 알림 연동 |

### 중기 개선 (1~3개월)

| 항목 | 설명 |
|------|------|
| 상담원 대시보드 | Connect CCP 기반 커스텀 상담원 화면을 구축합니다 |
| 실시간 모니터링 | Contact Lens를 활성화하여 감정 분석, 통화 전사, 상담 요약을 제공합니다 |
| 멀티채널 | 전화 외에 채팅, 이메일 채널을 추가합니다 |
| CRM 연동 | 기존 CRM 시스템과 API로 연동합니다 |
| 음성 품질 | ElevenLabs(TTS) + Deepgram(STT) 서드파티 연동으로 더 자연스러운 음성을 제공합니다 |

### 장기 개선 (3개월~)

| 항목 | 설명 |
|------|------|
| 아웃바운드 캠페인 | 고객 리스트 기반 자동 발신 기능을 추가합니다 |
| 분석/리포팅 | 통화 데이터 기반 BI 대시보드를 구축합니다 |
| Voice ID | 음성 생체 인증 기능을 도입합니다 (서울 리전 지원 확인됨) |
| 다국어 | 영어/일본어 등 멀티 언어 지원을 확대합니다 |

---

## 7. 도입 가능성 검토

### Amazon Connect 시장 성숙도

| 지표 | 현황 |
|------|------|
| Gartner 2025 | CCaaS **리더** |
| Forrester 2025 | CCaaS **리더** |
| [TrustRadius](https://www.trustradius.com/products/amazon-connect/reviews) | 8.4/10 (53개 리뷰) |
| 신기능 출시 속도 | 2025년 235개+ |
| 서울 리전 | 지원 (대부분 기능 사용 가능) |

### 경쟁사 비교

| 항목 | Amazon Connect | Genesys Cloud | NICE CXone | Five9 |
|------|---------------|---------------|------------|-------|
| 과금 모델 | **분당 과금** (미사용 시 0원) | 에이전트 월정액 | 에이전트 월정액 | 에이전트 월정액 |
| AI 기능 | Bedrock 기반 (포함) | 자체 AI | Enlighten AI | 외부 연동 |
| AWS 연동 | **네이티브** | 커넥터 필요 | 커넥터 필요 | 커넥터 필요 |
| 커스터마이징 | 높음 (Lambda, SDK) | 보통 | 보통 | 보통 |
| 상담원 UI | 기본적 (커스텀 필요) | 풍부 | 풍부 | 좋음 |
| 리포팅 | 기본적 (보완 필요) | 강력 | 매우 강력 | 좋음 |

### 도입 적합 시나리오

**Connect가 유리한 경우:**
- 이미 AWS 인프라를 사용 중인 조직
- 콜량이 유동적이거나 소규모로 시작하려는 경우
- AI 자동 응대를 핵심으로 두고 싶은 경우
- 초기 투자 비용을 최소화하고 싶은 경우
- 자체 개발 역량이 있어서 커스텀 연동이 가능한 경우

**Connect가 불리한 경우:**
- 고정 대규모 상담원(1,000명+) 운영 시 → 월정액 모델이 더 저렴할 수 있습니다
- 풍부한 기본 UI/리포팅이 즉시 필요한 경우 → Genesys/NICE가 더 나을 수 있습니다
- AWS 기술 역량이 없는 조직

### 서울 리전 제약사항

| 기능 | 서울 리전 지원 여부 |
|------|-------------------|
| 핵심 기능 (음성/채팅/AI Agent) | O 지원 |
| Contact Lens (분석) | O 지원 |
| 예측/스케줄링 | O 지원 |
| 아웃바운드 캠페인 | O 지원 (한국 번호 대상만) |
| Voice ID (음성 생체인증) | O 지원 |
| Customer Profiles / Cases | O 지원 |
| SMS / WhatsApp | O 지원 |
| Generative Voice (생성형 음성) | X 미지원 (US, EU만 지원) |
| Global Resiliency (DR) | X 미지원 (APAC은 도쿄만) |

> 출처: [Availability of Amazon Connect features by Region](https://docs.aws.amazon.com/connect/latest/adminguide/regions.html)

### 비용 시뮬레이션 (참고)

**서울 리전(ap-northeast-2) 기준 통화 비용 구성:**

| 항목 | 단가 |
|------|------|
| Connect 서비스 요금 | $0.038/분 |
| 통신 요금 (인바운드 DID) | $0.002/분 |
| **분당 합계** | **$0.040/분** |
| 전화번호 유지비 (DID) | $0.0864/일 (~$2.6/월) |

| 시나리오 | 월 예상 비용 |
|----------|-------------|
| 일 50건, 평균 5분 통화 | ~$300/월 + 번호 유지비 |
| 일 200건, 평균 5분 통화 | ~$1,200/월 + 번호 유지비 |
| 일 500건, 평균 5분 통화 | ~$3,000/월 + 번호 유지비 |

> AI 기능(Conversational Analytics, Amazon Q 등)은 기본 포함이며 별도 과금이 없습니다. Lambda/DynamoDB 등 AWS 서비스 비용은 별도이지만 소규모에서는 거의 무시할 수 있는 수준입니다. 출처: [Amazon Connect Pricing](https://aws.amazon.com/connect/pricing/)

---

## 종합 의견 (수정 필요)

Amazon Connect는 **기술적으로 충분히 성숙한 서비스**이며, 특히 AI 자동 응대 분야에서는 Bedrock 생태계를 활용한 경쟁 우위가 있습니다. 이번 실습에서 약 반나절 만에 AI 컨택센터를 구축하고 실제 전화 테스트까지 완료한 것이 이를 잘 보여줍니다.

다만 아래 사항은 고려가 필요합니다:

1. **상담원 UI/리포팅은 추가 개발이 필요합니다** - 기본 제공 화면이 타사 대비 빈약한 편이에요
2. **AWS 기술 역량이 전제됩니다** - Lambda, IAM, DynamoDB 등에 대한 이해가 필요합니다
3. **국내 공개 레퍼런스가 아직 많지 않습니다** - 다만 대한항공/토스증권 등 대형 사례가 나오고 있어 시장 확대 초기 단계로 보입니다

우리 팀은 이미 AWS 인프라를 운영 중이고 개발 역량이 있으므로, **소규모 POC부터 시작해서 검증 후 확대하는 접근**이 적절하다고 생각합니다. Connect의 분당 과금 모델 덕분에 POC 비용 부담도 매우 낮습니다.

---

## 레퍼런스

### AWS 공식 문서
- [Amazon Connect 서비스 소개 (한국어)](https://aws.amazon.com/ko/connect/)
- [Amazon Connect 요금](https://aws.amazon.com/connect/pricing/)
- [리전별 기능 지원 현황](https://docs.aws.amazon.com/connect/latest/adminguide/regions.html)
- [Amazon Connect 릴리즈 노트](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-release-notes.html)
- [2024년 Amazon Connect 신규 기능 총정리](https://aws.amazon.com/blogs/contact-center/whats-new-with-amazon-connect-in-2024-empowering-cx-transformation/)

### 국내 도입 사례
- [토스증권 - Amazon Connect 고객 센터 혁신 사례 (AWS 기술 블로그)](https://aws.amazon.com/ko/blogs/tech/toss-securities-amazon-connect-migration-journey/)
- [웅진 - Amazon Connect 기반 차세대 컨택센터 (AWS 기술 블로그)](https://aws.amazon.com/ko/blogs/tech/woongjin-amazon-connect-contact-center/)

### 시장 평가
- [TrustRadius - Amazon Connect 리뷰](https://www.trustradius.com/products/amazon-connect/reviews)

### 워크샵 자료
- [Amazon Connect AICC Builder Agent Workshop 가이드](https://sukwonie.gitbook.io/amazon-connect-aicc-builder-agent-workshop/gWzCDnQYz8mQUQ0GtYa4)

