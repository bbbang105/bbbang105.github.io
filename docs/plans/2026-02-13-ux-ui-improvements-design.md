# bbang.dev UX/UI 종합 개선 설계

## 개요

5개 서브에이전트(UX리서처, UI디자이너, 해외블로그조사, 국내블로그조사, 접근성테스터) 리서치 결과를 종합하여 도출한 개선 항목.

---

## 1. 콘텐츠 발견성

### 1-1. 우측 사이드바에 최근 게시글 (리스트 페이지)

- **위치**: `defaultListPageLayout.right`에 `RecentNotes` 컴포넌트 배치
- **설정**: limit 5, linkToMore: false, showTags: true
- **근거**: 현재 리스트 페이지의 right가 비어있음. 폴더 탐색 중 다른 최신 글 발견 가능

### 1-2. 관련 글 추천

- **위치**: `afterBody`에 Comments 위에 배치
- **방식**: 태그 기반 유사 글 3개 추천. 새 컴포넌트 `RelatedPosts.tsx` 생성
- **로직**: 현재 글과 공유 태그 수로 유사도 계산, 같은 폴더 가중치 부여

### 1-3. 연도별 포스트 그룹화

- **위치**: `PageList.tsx`에서 날짜별 그룹 헤더 추가
- **방식**: 연도가 바뀔 때 구분선 + 연도 레이블 삽입

---

## 2. 모바일 경험

### 2-1. 모바일 TOC

- **위치**: `beforeBody`에 조건부 렌더링
- **방식**: `MobileOnly(TableOfContents())` 추가, 접힘식 아코디언 스타일
- **조건**: TOC 항목이 3개 이상일 때만 표시

### 2-2. 읽기 진행률 바

- **방식**: 스크롤 기반 진행률 바를 페이지 최상단에 표시
- **구현**: 새 컴포넌트 `ReadingProgress.tsx` + inline script
- **스타일**: 높이 3px, secondary 색상, position fixed top 0

---

## 3. 시각적 디테일

### 3-1. Fluid Typography

- CSS `clamp()` 함수로 반응형 폰트 크기 적용
- h1~h3, body, meta 등에 적용

### 3-2. 썸네일 aspect-ratio

- 고정 height 대신 `aspect-ratio: 16/10` (데스크톱), `aspect-ratio: 2/1` (모바일)

### 3-3. 카드 디자인 개선

- 테두리 1px → 투명 또는 매우 연한 색으로 변경
- hover 시 배경색 변화 + 그림자로 구분 (해외 트렌드)
- 링크 밑줄 애니메이션: hover 시 왼→오 그려지는 효과

---

## 4. 접근성 (WCAG 2.1 AA)

### 4-1. 다크모드 색상 대비 수정

- `gray` 색상: `#71717a` → `#a1a1aa` (다크모드 메타 텍스트)
- 대비율 2.1:1 → 7:1 이상으로 개선

### 4-2. ARIA 레이블 추가

- `Darkmode.tsx`: button에 `aria-label="테마 전환"` 추가
- `SocialLinks.tsx`: 각 링크에 `aria-label` 추가
- SVG에 `aria-hidden="true"` 추가

### 4-3. 스킵 링크

- 페이지 최상단에 "본문으로 건너뛰기" 링크 추가
- 포커스 시에만 표시

---

## 5. 구현 순서

| 단계 | 작업 | 파일 | 난이도 |
|------|------|------|--------|
| 1 | 접근성 (ARIA, 대비, 스킵링크) | Darkmode.tsx, SocialLinks.tsx, custom.scss, renderPage.tsx | 하 |
| 2 | 우측 사이드바 최근 게시글 | quartz.layout.ts | 하 |
| 3 | 모바일 TOC | quartz.layout.ts, custom.scss | 하 |
| 4 | 시각 디테일 (fluid typo, aspect-ratio, 카드) | custom.scss | 중 |
| 5 | 읽기 진행률 바 | 새 컴포넌트 생성 | 중 |
| 6 | 관련 글 추천 | 새 컴포넌트 생성 | 중 |
| 7 | 연도별 그룹화 | PageList.tsx | 중 |
