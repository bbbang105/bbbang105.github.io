# UI/UX 리디자인 - 변경사항 문서

**날짜**: 2026-02-12
**참고**: shadcn/ui, Medium, 빅테크 테크블로그 (Netflix, AWS, Coupang)

## 변경된 파일

| 파일 | 변경 내용 |
|------|----------|
| `CLAUDE.md` | 프로젝트 분석 문서 생성 |
| `.mcp.json` | shadcn MCP 서버 설정 추가 |
| `quartz/styles/custom.scss` | 전체 SCSS 대폭 개선 |
| `quartz/components/PageList.tsx` | 썸네일, description 지원 추가 |
| `content/index.md` | 랜딩 페이지 Hero 섹션 + Featured Posts |
| `quartz/static/portfolio.js` | 스크롤 기반 fade-in 애니메이션 추가 |

## 1. 디자인 시스템 도입 (custom.scss)

### 핵심 CSS 변수
```scss
:root {
  --radius: 0.75rem;        // shadcn 스타일 라운드
  --radius-sm: 0.5rem;
  --radius-lg: 1rem;
  --shadow-sm/md/lg: ...;   // 그림자 시스템
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);  // Material 이징
}
```

### 변경 사항
- **타이포그래피**: `-webkit-font-smoothing: antialiased` 추가, line-height 1.75
- **코드 블록**: rounded corners, subtle shadow
- **다크모드**: GitHub 스타일 색상 (`#1c2128`, `#2d333b`, `#adbac7`)
- **구분선(hr)**: 컬러에서 `--lightgray`로 변경 (Medium 스타일)
- **링크**: underline with thickness transition (Medium 스타일)
- **테이블**: rounded border, responsive overflow

## 2. 포스트 카드 리디자인 (PageList.tsx)

### Before
- `border-bottom` 구분선 스타일
- 제목 + 날짜만 표시

### After
- **shadcn 카드 스타일**: `border: 1px solid`, `border-radius: 0.75rem`
- **호버 효과**: `border-color: var(--secondary)`, `box-shadow`, `translateY(-1px)`
- **썸네일 지원**: `coverImage` 필드가 있으면 오른쪽에 160px 썸네일 표시
- **Description 표시**: frontmatter description 또는 자동 생성 description (120자 제한)
- **태그 제한**: 최대 3개까지만 표시

### 썸네일 사용법
frontmatter에 다음 중 하나를 추가:
```yaml
---
thumbnail: /path/to/image.png   # 1순위
cover: /path/to/image.png       # 2순위
socialImage: /path/to/image.png # 3순위
---
```
frontmatter에 없으면 글 본문의 첫 번째 이미지를 자동으로 사용 (CoverImage 플러그인).

## 3. 랜딩 페이지 리디자인 (index.md)

### 추가된 섹션

#### Hero Section
- `Backend Engineer` 라벨 + 이름 + 소개문
- 핵심 수치 Stats (20,000+ Users / 250+ Posts / 1.5+ yr)
- `fadeInUp` 애니메이션 (0.6s ease-out, 딜레이 순차 적용)

#### Featured Posts
- 2열 그리드 카드 레이아웃
- 카테고리 라벨 + 제목 + 설명
- `Highlight` 뱃지
- 호버 시 border-color + shadow + translateY

### 제거된 것
- `<style>` 인라인 블록 (custom.scss로 이동)
- `About Me` 섹션 (Hero 섹션으로 대체)

### 언어 토글
- shadcn Tabs 스타일로 변경 (배경색 토글)

## 4. 애니메이션 시스템 (portfolio.js)

### 새로운 기능
- **IntersectionObserver 기반 scroll-fade-in**: 요소가 뷰포트에 진입하면 fade-in
- **prefers-reduced-motion 지원**: 모션 감소 설정 시 애니메이션 비활성화
- **SPA 호환**: Quartz `nav` 이벤트에서 재초기화

### CSS 애니메이션 클래스
| 클래스 | 효과 |
|--------|------|
| `.animate-fade-in` | 즉시 fadeInUp (0.6s) |
| `.animate-fade-in-delay-1` | 0.1s 딜레이 |
| `.animate-fade-in-delay-2` | 0.2s 딜레이 |
| `.animate-fade-in-delay-3` | 0.3s 딜레이 |
| `.scroll-fade-in` | 스크롤 시 나타남 (IntersectionObserver) |

## 5. 다크모드 개선

### 변경 포인트
- `--lightgray`: `#2d333b` → `#1c2128` (더 어둡게)
- 카드 hover: `rgba(255,255,255,0.03)` (미세한 밝기)
- Featured 카드: `#161b22` 배경
- 그림자: 다크모드에서 더 강한 shadow
- 구분선: `#2d333b`로 통일

## 6. 향후 개선 가능 사항

- [ ] Featured Posts를 frontmatter `featured: true`로 자동 수집하는 컴포넌트
- [ ] 글 목록에서 읽기 시간 표시
- [ ] 카테고리별 색상 코딩
- [ ] OG Image 플러그인 재활성화 (이모지 폴더명 이슈 해결 후)
- [ ] 모바일에서 Featured Posts 스와이프 지원
