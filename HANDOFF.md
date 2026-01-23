# HANDOFF - Quartz 블로그 프로젝트

## 프로젝트 개요
- **목적**: Obsidian 마크다운 파일을 Quartz로 정적 블로그 생성
- **배포 URL**: https://bbbang105.github.io
- **레포지토리**: https://github.com/bbbang105/bbbang105.github.io
- **로컬 경로**: `/Users/hansangho/Desktop/obsidian-quartz-blog`

---

## 완료된 작업

### 1. 기본 설정
- [x] Quartz v4.5.2 클론 및 설정
- [x] GitHub Pages 배포 (GitHub Actions)
- [x] 한국어 로케일 설정 (`ko-KR`)
- [x] 블로그 이름: `bbang_dev`

### 2. 콘텐츠
- [x] Obsidian `05.Blog` 폴더 콘텐츠 복사
- [x] `content/index.md` 홈페이지 생성 (카테고리 목록 포함)

### 3. 테마 & 디자인
- [x] **색상**: 파스텔 블루 계열
  - 라이트 모드: `#f0f7ff` 배경
  - 다크 모드: `#0d1117` 배경 (네이비) + `#58a6ff`, `#5ce1e6` 액센트
- [x] **폰트**: Noto Sans KR (본문/헤더), JetBrains Mono (코드)
- [x] **코드 테마**: tokyo-night

### 4. 기능
- [x] **Giscus 댓글** 연동
  - repo: `bbbang105/bbbang105.github.io`
  - mapping: `title` (한글 URL 인코딩 문제 해결)
- [x] **OG 이미지** (CustomOgImages 플러그인)
  - 다크모드 스킴, Noto Sans KR 폰트
- [x] **소셜 링크** (데스크톱만 표시)
  - RSS, Email (hchsa77@gmail.com), GitHub, LinkedIn, Instagram
- [x] **푸터 링크**: GitHub, LinkedIn, Instagram

### 5. 반응형
- [x] 소셜 링크 모바일 숨김 (800px 이하)
- [x] 코드 블록 가로 스크롤 추가

### 6. 의존성 업데이트
- [x] Dependabot PR #3, #4 머지 (CI/프로덕션 의존성)

---

## 진행 중 / 미완료 작업

### 1. 공유 버튼
- 구현 시도했으나 삭제됨
- 아이콘 + 토스트 알림 방식으로 재구현 필요시 참고

### 2. Giscus 댓글 수정/삭제
- Giscus 자체 제한으로 블로그에서 직접 수정/삭제 불가
- GitHub Discussions에서만 가능
- 직접 댓글 시스템 구현 시 백엔드 필요

---

## 다음에 해야 할 것

### 우선순위 높음
1. **Google Analytics 연동**
   - `quartz.config.ts`의 `tagId` 값 설정 필요
   - GA4 측정 ID 형식: `G-XXXXXXXXXX`

2. **파비콘/로고 변경**
   - `static/icon.png` 교체

### 우선순위 중간
3. **커스텀 도메인** (선택)
   - GitHub Pages 설정에서 도메인 연결
   - `quartz.config.ts`의 `baseUrl` 변경

4. **그래프 뷰 / 탐색기 커스터마이징**
   - 사용자가 관심 표명했으나 보류

### 우선순위 낮음
5. **공유 버튼 재구현**
   - 더 나은 UX로 재설계 필요

6. **좋아요 기능**
   - 백엔드 직접 구현 필요 (사용자가 백엔드 개발자)

---

## 중요한 결정사항 / 컨텍스트

### 폰트 선택
- **Pretendard 포기**: OG 이미지 생성 플러그인이 Google Fonts만 지원
- **Noto Sans KR 채택**: 한글 지원 + OG 이미지 호환

### 파일 구조
```
obsidian-quartz-blog/
├── content/           # 블로그 콘텐츠 (마크다운)
├── quartz/
│   ├── components/    # 커스텀 컴포넌트
│   │   └── SocialLinks.tsx  # 소셜 링크 버튼
│   └── styles/
│       └── custom.scss      # 커스텀 CSS
├── quartz.config.ts   # 메인 설정
├── quartz.layout.ts   # 레이아웃 설정
└── .github/workflows/deploy.yml  # 배포 워크플로우
```

### Git 설정
- user.name: `bbbang105`
- user.email: `2018111366@dgu.ac.kr`
- Co-Authored-By: `Claude <noreply@anthropic.com>`

### 주요 URL
- 블로그: https://bbbang105.github.io
- GitHub: https://github.com/bbbang105
- LinkedIn: https://www.linkedin.com/in/sangho105/
- Instagram: https://www.instagram.com/bbang_105/
- Email: hchsa77@gmail.com

---

## 트러블슈팅 기록

| 문제 | 해결 |
|------|------|
| OG 이미지 Pretendard 폰트 실패 | Noto Sans KR로 대체 |
| CSS @import 순서 오류 | Head.tsx에서 link 태그로 폰트 로드 |
| Giscus 한글 URL 인코딩 | mapping을 `pathname` → `title`로 변경 |
| 모바일 소셜 링크 레이아웃 깨짐 | 800px 이하 display: none |
| 배포 환경 보호 규칙 오류 | GitHub API로 환경 설정 |

---

*마지막 업데이트: 2026-01-23*
