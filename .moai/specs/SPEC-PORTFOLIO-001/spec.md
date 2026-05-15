---
id: SPEC-PORTFOLIO-001
version: 0.1.0
status: draft
created: 2026-05-15
updated: 2026-05-15
author: MoAI orchestrator (manager-spec)
priority: high
issue_number: 0
---

# SPEC-PORTFOLIO-001 — 랜딩 포트폴리오 재구성 (AI 빌더 / 네이티브 엔지니어 포지셔닝)

## HISTORY

- 2026-05-15 v0.1.0: 초안 (Plan workflow Phase 2). 사용자 4개 frozen 결정 박제 — (1) 자체개발 3개 = OneTime/Hazel/kusting, (2) 미디어 = 라이브 사이트 자동 캡처, (3) kiko = AI 창업준비 서비스, 최상단 강조, (4) moai SPEC 워크플로우. 미디어 자산 URL 의존성 D1 으로 분리.

## Overview

`content/index.md` (블로그 랜딩 = 포트폴리오 허브) 를 재구성한다. 현재는 경력 중심으로 길게 나열돼 있어 "이 사람이 무엇을 만드는 사람인지" 가 한눈에 안 들어온다.

목표 포지셔닝: **누가 봐도 AI 네이티브 제품을 만드는 빌더/엔지니어**. 정보 위계를 다음으로 재배치한다.

1. **kiko (AI 서비스, 창업준비 중)** — 최상단 히어로. 지금 만들고 있는 것.
2. **자체개발 3개 (OneTime · Hazel · kusting)** — 라이브 화면 썸네일과 함께 쇼케이스. 직접 기획·개발·운영한 증거.
3. **경력 (LOGOS AI / Ribella 등)** — 축약. 길게 나열하지 않고 한 줄 단위 요약 + 핵심 임팩트 수치만.

스코프 경계: **`content/index.md` 콘텐츠 구조 + 썸네일 자산 추가만** 한다. Quartz 코어/레이아웃/컴포넌트/`quartz.layout.ts`/신규 컴포넌트는 건드리지 않는다 (이전 세션의 구조 변경이 "개판" 으로 평가되어 전면 롤백된 이력 존중). 스타일은 기존 `custom.scss` 가 이미 제공하는 클래스(`.section-card`, `.featured-card`, `.post-card`, `.vibe-*` 등) 재사용을 우선하고, 필요한 최소 보강만 `custom.scss` 말단에 추가한다.

## Goals (EARS-format requirements)

### REQ-PORTFOLIO-001 (Ubiquitous) — kiko 히어로 최상단 배치

WHILE 방문자가 랜딩(`/`) 최상단을 보는 동안, 시스템 SHALL hero 영역에서 **kiko** 를 "현재 창업 준비 중인 AI 서비스" 로 가장 먼저, 가장 크게 제시한다 — 한 줄 정체성 + 한 줄 무엇을 푸는지 + (확보 시) 라이브 썸네일/링크 포함.

[HARD] hero copy 는 "AI로 만든다 / AI 네이티브 엔지니어" 정체성이 즉시 읽히도록 작성한다. 가짜 통계·AI 슬롭 금지. 본인 실데이터(OneTime 25k 유저, AWS 비용 절감 등)만 사용.

### REQ-PORTFOLIO-002 (Event-driven) — 자체개발 3개 쇼케이스

WHEN 방문자가 hero 아래로 스크롤하면, 시스템 SHALL **OneTime · Hazel · kusting** 3개를 동일 위계의 쇼케이스 블록으로 표시한다. 각 블록은 (a) 라이브 캡처 썸네일, (b) 한 줄 정체성, (c) 역할(1인 풀스택/기획·개발·운영), (d) 핵심 임팩트 1~2개, (e) 라이브/GitHub 링크 를 포함한다.

[HARD] Forme 는 3개에서 제외(사용자 결정). 썸네일은 D1(라이브 캡처) 산출물을 `quartz/static/portfolio/` 에 저장하고 상대경로로 참조한다.

### REQ-PORTFOLIO-003 (Ubiquitous) — 경력 축약

WHILE 경력 섹션이 렌더되는 동안, 시스템 SHALL 기존의 장문 불릿 나열을 **회사당 1~3줄 요약 + 핵심 수치** 로 압축한다. 상세 트러블슈팅 불릿은 제거하거나 블로그 글 링크로 대체한다.

### REQ-PORTFOLIO-004 (State-driven) — 구조/기능 무손상

WHILE 재구성을 수행하는 동안, 시스템 SHALL `quartz.layout.ts`, `quartz/components/**`, 사이드바/검색/Explorer/TOC 등 기능 컴포넌트, 다국어(ko/en) 토글 구조를 변경하지 않는다. 변경 대상은 `content/index.md` 와 (불가피한 경우) `custom.scss` 말단 보강으로 한정한다.

### REQ-PORTFOLIO-005 (Unwanted) — 빌드/링크 무결성

IF 재구성 후 `npx quartz build` 가 실패하거나 포트폴리오 내 내부 링크가 404 를 반환하면, THEN 시스템 SHALL NOT 변경을 완료로 간주한다. 모든 프로젝트/글 링크는 빌드 산출물에서 200 으로 검증한다.

## Acceptance Criteria

- AC1: 랜딩 최상단 첫 화면에 kiko 가 "AI 서비스 / 창업준비" 로 노출되고 정체성 한 줄이 읽힌다.
- AC2: OneTime/Hazel/kusting 3개가 라이브 캡처 썸네일과 함께 동일 위계 쇼케이스로 노출된다 (D1 해소 시).
- AC3: 경력 섹션이 회사당 ≤3줄로 축약되고 핵심 수치가 남아있다.
- AC4: `quartz.layout.ts` 와 `quartz/components/**` git diff 가 비어있다 (무손상).
- AC5: `npx quartz build` 성공 + 포트폴리오 내 모든 내부 링크 HTTP 200.
- AC6: ko/en 양 언어 블록이 깨지지 않고 토글 동작 유지.

## Dependencies / Open Items

- **D1 (BLOCKER) — 라이브 캡처 URL 확보**: 라이브 자동 캡처 방식 선택됨. 그러나 레포/환경에서 공개 URL 확인된 것은 **OneTime (onetime-with-members.com)** 뿐. Hazel(flowershop-admin)·kusting(study-admin) 은 GitHub-only(공개 배포 URL 미확인), kiko(=Vercel "portal-ai" 프로젝트)는 로컬 `:3400` 만 확인됨(공개 URL 미상). → 사용자에게 각 항목의 캡처 소스(배포 URL / 로컬 구동 / GitHub 대체 / 목업)를 확인해야 구현 착수 가능.

## Technical Approach

- `content/index.md` 의 ko/en 이중 블록 구조 유지하며 섹션 순서 재배치: hero(kiko) → 자체개발 3 쇼케이스 → 경력(축약) → (선택) 글/회고 링크.
- 썸네일: headless Chrome (CDP) 로 라이브 URL 캡처 → 16:10 크롭 → `quartz/static/portfolio/{slug}.png` 저장 → 마크다운 내 `<img>` 상대경로.
- 스타일: 기존 `.featured-card`/`.section-card`/`.vibe-*` 클래스 우선 재사용. 부족 시 `custom.scss` 말단에 `.portfolio-*` 최소 추가(구조 무관, override only).
- 검증: `npx quartz build` → dev 서버(8080) curl 200 체크 → 내부 링크 일괄 검증.

## Out of Scope

- Quartz 레이아웃/컴포넌트/사이드바 구조 변경, 신규 컴포넌트, 매거진 전면 리디자인 (이전 세션 롤백 사유).
- 블로그 글 콘텐츠 자체 수정, 폰트 교체, 디자인 시스템 토큰 변경.
