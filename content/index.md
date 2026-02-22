---
title: Introduction.
socialDescription: "안녕하세요, 개발자 한상호입니다."
---

<div class="lang-toggle animate-fade-in">
  <button class="lang-btn" onclick="switchLang('ko')">한국어</button>
  <button class="lang-btn active" onclick="switchLang('en')">EN</button>
</div>

<!-- Contact Modal -->
<div class="contact-overlay" id="contact-overlay">
  <div class="contact-modal">
    <h3>Contact</h3>
    <div class="contact-modal-links">
      <a href="https://mail.google.com/mail/?view=cm&to=hchsa77@gmail.com" target="_blank" rel="noopener noreferrer" title="Email">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
      <a href="https://github.com/bbbang105" target="_blank" rel="noopener noreferrer" title="GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/sangho105/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
      <a href="https://www.instagram.com/bbang_105/" target="_blank" rel="noopener noreferrer" title="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </a>
    </div>
  </div>
</div>

<!-- Floating Contact Button -->
<div class="contact-fab">
  <button class="contact-btn" onclick="openContact()">Contact</button>
</div>

<!-- English Version -->
<div id="content-en" class="lang-content active">

<!-- Hero Section -->
<div class="hero-section animate-fade-in">
  <div class="hero-greeting">Hello, I'm Sangho Han, a developer.</div>
  <p class="hero-tagline">
    I know how to work with AI.<br>
    I handle planning, design, and frontend development solo through vibe coding, while designing and building the backend for a RAG-based AICC solution.<br><br>
    I believe the essence of development is understanding user pain points and proactively solving them.<br>
    I'm building and operating <a href="https://www.onetime-with-members.com/en/landing" target="_blank">OneTime</a>, a scheduling service with over 25,000 users, putting this belief into practice.<br><br>
    I believe in the power of writing and community.<br>
    I've written 140+ tech blog posts over 2 years and have been running a blog study group for over 1.5 years.
  </p>
</div>

---

## Career

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">LOGOS AI <a href="https://www.logosai.co.kr/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2025.08 - Present</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>Building backend and infrastructure for OptiGen, a RAG-based AI Contact Center (AICC) solution platform.</p>

  <div class="subsection-title">Implementing LLM streaming API</div>
  <ul>
    <li>Built LLM streaming response with <strong>RestClient + SseEmitter</strong> (Java 21 Virtual Thread async processing)</li>
    <li>Chose RestClient+SseEmitter over WebFlux — streaming while maintaining MVC compatibility</li>
    <li>Enabled <strong>TTFB measurement</strong> and response time statistics (P50/P75/P95) through Delta/Final event separation</li>
    <li>LLM performance monitoring with period-over-period comparison (month-over-month change rate)</li>
  </ul>

  <div class="subsection-title">Designing and implementing voicebot system API</div>
  <ul>
    <li>Built pipeline for receiving <strong>voice recording data (Base64) from VG (Voice Gateway) → Storage upload → metadata management</strong></li>
    <li>Completed external client integration with LG-POC system API (conversation logging, RAG reference document tracking)</li>
  </ul>

  <div class="subsection-title">Building batch systems for large-scale document processing</div>
  <ul>
    <li>Implemented <strong>RAG chunking batch service with Spring Batch</strong> (multi-threaded 5 threads parallel processing)</li>
    <li>Ensured uninterrupted operation stability with zombie process auto-reset (1-hour timeout) logic</li>
    <li>Built chat file cleanup batch for S3 storage auto-management</li>
  </ul>

  <div class="subsection-title">Considering security in multi-tenant environments</div>
  <ul>
    <li>Strengthened multi-tenant security with @PreAuthorize-based organization access control</li>
    <li>Prevented file extension spoofing with <strong>Apache Tika Magic Byte verification</strong>, non-member upload limits (10 files/20MB)</li>
  </ul>

  <div class="subsection-title">Designing AWS infrastructure and building CI/CD & Observability</div>
  <ul>
    <li><strong>Designed and built SOLUM POC AWS infrastructure</strong>: VPC (2 AZs) + ALB + Aurora MySQL + EFS + ECR</li>
    <li>Configured <strong>3 Graviton (ARM64) EC2 instances</strong> for ~20% cost reduction vs x86</li>
    <li>Built <strong>GitHub Actions-based automated deployment</strong> pipeline for 4 services (API/Chat/Batch/AI)</li>
    <li>Integrated <strong>Datadog APM/Logs/RUM</strong> for full-stack monitoring across 3 servers (API/AI/Batch)</li>
    <li>Built <strong>LLM Observability</strong>: LiteLLM + Datadog for auto-tracking token usage, model costs, P50/P95/P99 latency, error rates</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Batch</span>
    <span class="tag">MySQL</span>
    <span class="tag">MyBatis</span>
    <span class="tag">AWS</span>
    <span class="tag">LLM</span>
    <span class="tag">RAG</span>
    <span class="tag">GitHub Actions</span>
    <span class="tag">Datadog</span>
    <span class="tag">LiteLLM</span>
    <span class="tag">Qdrant</span>
    <span class="tag">Asterisk</span>
  </div>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">Ribella Realty</span>
    <span class="period">2025.06 - 2025.08</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>Built backend and infrastructure for real estate agent matching platform 'FindIt'.</p>

  <div class="subsection-title">Designing infrastructure and optimizing costs</div>
  <ul>
    <li>Built initial development infrastructure on KVM-based on-premise with Docker Swarm</li>
    <li>Completed AWS cloud migration in 3 days: <strong>monthly cost $300+ → $108 (66%+ reduction)</strong></li>
    <li>Built GitLab CI/CD pipeline for automated deployments</li>
  </ul>

  <div class="subsection-title">Sharing knowledge through documentation</div>
  <ul>
    <li>Implemented REST APIs with <strong>Python + FastAPI</strong> and Swagger documentation</li>
    <li>Documented DNS migration, MinIO/S3 troubleshooting, and ALB configuration guides</li>
    <li>Wrote infrastructure architecture and operation manuals to reduce team onboarding time</li>
  </ul>

  <div class="tags">
    <span class="tag">Python</span>
    <span class="tag">FastAPI</span>
    <span class="tag">MySQL</span>
    <span class="tag">Docker Swarm</span>
    <span class="tag">AWS</span>
    <span class="tag">GitLab CI</span>
    <span class="tag">Linux</span>
  </div>
</div>

---

## Projects

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">OneTime <a href="https://www.onetime-with-members.com/en/landing" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2024.08 - Present</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>A web service that helps multiple people easily coordinate schedules with a single link share.</p>
  <div class="metrics">25,000+ users / 2,000+ MAU</div>

  <div class="subsection-title">Measuring and improving performance</div>
  <ul>
    <li>Discovered N+1 query in schedule API. Applied QueryDSL fetch join + composite index. <strong>18.38s → 0.35s (98% faster)</strong> <a class="blog-link" href="/OneTime/성능-개선일지-1-(feat.-N+1,-Index)">📝 Read</a></li>
    <li>Identified JPA saveAll individual INSERTs as bottleneck. Applied Bulk INSERT + async QR generation. <strong>16.56s → 0.41s (97.5% faster)</strong> <a class="blog-link" href="/OneTime/성능-개선일지-2-(feat.-Bulk-Insert)">📝 Read</a></li>
  </ul>

  <div class="subsection-title">Considering security</div>
  <ul>
    <li>Detected and blocked malicious HTTP requests with Fail2ban. <strong>Blocked 675 attacks from 425 IPs over 9 months</strong> <a class="blog-link" href="/OneTime/웹-스캐닝-공격:-9개월간의-Fail2ban-로그-분석">📝 Read</a></li>
    <li>Migrated URL pattern-based authorization to method-level @PreAuthorize custom annotation</li>
    <li>Automated security annotation coverage checking with <strong>Safety-Net tests</strong></li>
    <li>Built MySQL-based <strong>Refresh Token Rotation</strong> + 3-second Grace Period for token theft detection</li>
  </ul>

  <div class="subsection-title">Data-driven service operations</div>
  <ul>
    <li>Designed and implemented admin dashboard with <strong>7 analytics domains and 26 APIs</strong></li>
    <li>Visualized key metrics: user acquisition, event patterns, retention (MAU/dormancy rate)</li>
    <li>Optimized complex aggregation queries with Caffeine cache + QueryDSL + Native SQL</li>
  </ul>

  <div class="subsection-title">Solving costs with technology</div>
  <ul>
    <li><strong>Reduced AWS monthly costs from $83 to under $50 (40% reduction)</strong> <a class="blog-link" href="/OneTime/원타임-인프라-개선-도전기">📝 Read</a></li>
    <li>EC2 t2 → t4g migration for better price/performance ratio</li>
    <li>Applied RDS Reserved Instance + EC2 Savings Plans for additional 20%+ savings</li>
    <li>Secured <strong>$1,000 in AWS credits</strong> through Activate startup program <a class="blog-link" href="/일상,-정보/5분만에-AWS-140만원-벌기">📝 Read</a></li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Security</span>
    <span class="tag">MySQL</span>
    <span class="tag">Docker</span>
    <span class="tag">AWS</span>
    <span class="tag">GitHub Actions</span>
    <span class="tag">QueryDSL</span>
    <span class="tag">Nginx</span>
  </div>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">Hazel</span>
    <span class="period">2025.01 - Present</span>
  </div>
  <div class="role">Full-Stack (AI Vibe Coding)</div>
  <p>A sales, customer, and reservation management SaaS for flower shop owners. Building the entire product solo through vibe coding with AI (Claude) — from planning and design to frontend/backend development and deployment.</p>

  <div class="subsection-title">Building production-grade SaaS with AI vibe coding</div>
  <ul>
    <li>Solo development across requirements → UI/UX design → implementation → testing → deployment, <strong>all in collaboration with AI</strong></li>
    <li>Designed AI collaboration guides (<strong>ARCHITECTURE.md, FRONTEND_GUIDE.md</strong>) → consistent code patterns</li>
  </ul>

  <div class="subsection-title">Designing server component-centric architecture</div>
  <ul>
    <li>Designed <strong>Next.js 16 + React 19 Server Components</strong> as single data source</li>
    <li>Applied <strong>Supabase RLS</strong> with 44 policies across 11 tables for per-user data isolation</li>
    <li>Migrated from Supabase Storage to <strong>Cloudflare R2</strong> — eliminated image transfer costs, <strong>4x TTFB improvement</strong></li>
  </ul>

  <div class="subsection-title">Delivering native app experience with PWA</div>
  <ul>
    <li>Implemented PWA push notifications with <strong>Web Push API + Service Worker</strong></li>
    <li>Scheduled daily reminders + individual reservation reminders with pg_cron</li>
    <li>Resolved Safari VAPID compatibility, <strong>prevented multi-tenancy data leaks with per-user reservation isolation</strong></li>
  </ul>

  <div class="subsection-title">Running production at $0 operating cost</div>
  <ul>
    <li>Achieved <strong>$0 monthly operating cost</strong> with Vercel + Supabase + Cloudflare R2</li>
  </ul>

  <div class="tags">
    <span class="tag">Next.js</span>
    <span class="tag">React 19</span>
    <span class="tag">TypeScript</span>
    <span class="tag">Supabase</span>
    <span class="tag">PostgreSQL</span>
    <span class="tag">Cloudflare R2</span>
    <span class="tag">Vercel</span>
    <span class="tag">PWA</span>
    <span class="tag">Web Push</span>
    <span class="tag">shadcn/ui</span>
    <span class="tag">Zod</span>
    <span class="tag">AI Vibe Coding</span>
  </div>
</div>

---

## Activities

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">Technical Blog</span>
    <span class="period">2023 - Present</span>
  </div>
  <p>140+ tech posts over 2 years.</p>
  <div class="skills-grid">
    <span class="skill-category">Spring</span>
    <span>Filter vs Interceptor, OAuth2.0, Error Handling</span>
    <span class="skill-category">Database</span>
    <span>Index, Transaction Isolation Levels</span>
    <span class="skill-category">Infra</span>
    <span>Docker, Load Balancing, Infrastructure Cost Optimization</span>
    <span class="skill-category">AI</span>
    <span>RAG Concepts, AGI, AI Regulation</span>
    <span class="skill-category">Security</span>
    <span>Web Scanning Attack Analysis, Fail2Ban</span>
  </div>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">Blog Study Group</span>
    <span class="period">2023.06 - Present</span>
  </div>
  <p>Running a blog study group for 1.5+ years, encouraging consistent documentation and knowledge sharing.</p>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">KUSITMS (IT Management Society) <a href="https://www.kusitms.com/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2024</span>
  </div>
  <p>Participated as backend developer in corporate and collaborative projects.<br>Served as Vice President in the 30th cohort, leading 70+ members.</p>
</div>

---

## Education

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">Dongguk University <a href="https://www.linkedin.com/school/dongguk/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2018 - 2025</span>
  </div>
  <p>B.S. in Management Information Systems / Convergence Software (Double Major)</p>
</div>

---

## Certifications

<div class="cert-list">
  <span class="cert">Linux Master Lv.2 (2026.01)</span>
  <span class="cert">Network Admin Lv.2 (2025.12)</span>
  <span class="cert">AWS SAA (2025.10)</span>
  <span class="cert">SQLD (2023.10)</span>
  <span class="cert">ADsP (2022.09)</span>
</div>

</div>

<!-- Korean Version -->
<div id="content-ko" class="lang-content">

<!-- Hero Section -->
<div class="hero-section animate-fade-in">
  <div class="hero-greeting">안녕하세요, 개발자 한상호입니다.</div>
  <p class="hero-tagline">
    AI와 함께 일하는 방법을 압니다.<br>
    바이브코딩으로 기획·디자인·프론트엔드 개발을 혼자 해내고, RAG 기반 AICC 솔루션의 백엔드를 설계·구현하고 있습니다.<br><br>
    사용자가 겪는 불편함을 이해하고 주도적으로 해결해 나가는 것이 개발의 본질이라고 생각합니다.<br>
    2만 5천명 이상이 사용하는 서비스 <a href="https://www.onetime-with-members.com/ko/landing" target="_blank">OneTime</a>을 직접 기획·개발·운영하며 이를 실천하고 있습니다.<br><br>
    기록과 사람의 힘을 믿습니다.<br>
    2년간 140개 이상의 기술 블로그 글을 작성하고, 블로그 스터디를 1년 반 이상 운영해왔습니다.
  </p>
</div>

---

## 경력

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">(주)로고스AI <a href="https://www.logosai.co.kr/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2025.08 - 현재</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>RAG 기반 AICC(AI Contact Center) 솔루션 플랫폼 'OptiGen'의 백엔드 개발 및 인프라 구축을 담당하고 있습니다.</p>

  <div class="subsection-title">LLM 스트리밍 API를 구현합니다</div>
  <ul>
    <li><strong>RestClient + SseEmitter</strong> 기반 LLM 스트리밍 응답 구현 (Java 21 Virtual Thread 비동기 처리)</li>
    <li>WebFlux 대신 RestClient+SseEmitter 선택 — 기존 MVC 호환 유지하며 스트리밍 구현</li>
    <li>Delta/Final 이벤트 분리로 <strong>TTFB 측정</strong> 및 응답 시간 통계(P50/P75/P95) 제공</li>
    <li>기간별 비교(전월 대비 변화율) 기능으로 LLM 성능 모니터링</li>
  </ul>

  <div class="subsection-title">보이스봇 시스템 API를 설계·구현합니다</div>
  <ul>
    <li>VG(Voice Gateway)에서 전송하는 <strong>음성 녹음 데이터(Base64) 수신 → Storage 업로드 → 메타데이터 관리</strong> 파이프라인 구축</li>
    <li>LG-POC 시스템 API(대화 로깅, RAG 참조 문서 추적) 구현으로 외부 고객사 연동 완료</li>
  </ul>

  <div class="subsection-title">대용량 문서 처리를 위한 배치 시스템을 구축합니다</div>
  <ul>
    <li><strong>Spring Batch 기반 RAG 청킹 배치 서비스</strong> 구현 (멀티스레드 5 threads 병렬 처리)</li>
    <li>좀비 프로세스 자동 리셋(1시간 타임아웃) 로직으로 무중단 운영 안정성 확보</li>
    <li>채팅 파일 정리 배치 구현으로 S3 스토리지 자동 관리</li>
  </ul>

  <div class="subsection-title">멀티테넌트 환경에서 보안을 고려합니다</div>
  <ul>
    <li>@PreAuthorize 기반 조직별 접근 제어로 멀티테넌트 보안 강화</li>
    <li><strong>Apache Tika Magic Byte 검증</strong>으로 파일 확장자 위조 방지, 비회원 업로드 제한(10개/20MB)</li>
  </ul>

  <div class="subsection-title">AWS 인프라를 설계하고 CI/CD·Observability를 구축합니다</div>
  <ul>
    <li><strong>SOLUM POC AWS 인프라 설계·구축</strong>: VPC(2개 AZ) + ALB + Aurora MySQL + EFS + ECR</li>
    <li><strong>Graviton(ARM64) 기반 EC2 3대</strong> 구성으로 x86 대비 약 20% 비용 절감</li>
    <li><strong>GitHub Actions 기반 자동 배포</strong> 파이프라인 4개 서비스(API/Chat/Batch/AI)에 구축</li>
    <li><strong>Datadog APM/Logs/RUM</strong> 연동으로 3개 서버(API/AI/Batch) 전 구간 모니터링</li>
    <li><strong>LLM Observability</strong> 구축: LiteLLM + Datadog으로 토큰 사용량, 모델별 비용, P50/P95/P99 레이턴시, 에러율 자동 추적</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Batch</span>
    <span class="tag">MySQL</span>
    <span class="tag">MyBatis</span>
    <span class="tag">AWS</span>
    <span class="tag">LLM</span>
    <span class="tag">RAG</span>
    <span class="tag">GitHub Actions</span>
    <span class="tag">Datadog</span>
    <span class="tag">LiteLLM</span>
    <span class="tag">Qdrant</span>
    <span class="tag">Asterisk</span>
  </div>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">(주)리벨라리얼티</span>
    <span class="period">2025.06 - 2025.08</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>부동산 중개사 연결 플랫폼 'FindIt'의 백엔드 개발 및 인프라 구축을 담당했습니다.</p>

  <div class="subsection-title">인프라를 설계하고 비용을 최적화합니다</div>
  <ul>
    <li>KVM 기반 온프레미스 환경에서 Docker Swarm을 활용해 초기 개발 인프라를 구축</li>
    <li>3일 내 AWS 클라우드 마이그레이션 완료: <strong>월 $300+ → $108 (66% 이상 절감)</strong></li>
    <li>GitLab CI/CD 파이프라인 구축으로 배포 자동화</li>
  </ul>

  <div class="subsection-title">문서화를 통해 지식을 공유합니다</div>
  <ul>
    <li><strong>Python + FastAPI</strong>를 활용한 REST API 구현 및 Swagger 문서화</li>
    <li>DNS 마이그레이션, MinIO/S3 트러블슈팅, ALB 설정 가이드 등을 문서화</li>
    <li>인프라 아키텍처 및 운영 매뉴얼 작성으로 팀 온보딩 시간 단축</li>
  </ul>

  <div class="tags">
    <span class="tag">Python</span>
    <span class="tag">FastAPI</span>
    <span class="tag">MySQL</span>
    <span class="tag">Docker Swarm</span>
    <span class="tag">AWS</span>
    <span class="tag">GitLab CI</span>
    <span class="tag">Linux</span>
  </div>
</div>

---

## 프로젝트

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">OneTime <a href="https://www.onetime-with-members.com/ko/landing" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2024.08 - 현재</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>링크 공유 한 번으로 여러 사람과 쉽게 일정을 맞추도록 돕는 웹 서비스입니다.</p>
  <div class="metrics">누적 사용자 25,000+명 / MAU 2,000+명</div>

  <div class="subsection-title">성능을 측정하고 개선합니다</div>
  <ul>
    <li>전체 스케줄 조회 API에서 N+1 쿼리 문제를 발견. QueryDSL fetch join과 복합 인덱스 적용. <strong>18.38s → 0.35s (98% 개선)</strong> <a class="blog-link" href="/OneTime/성능-개선일지-1-(feat.-N+1,-Index)">📝 글 보기</a></li>
    <li>이벤트 생성 시 JPA saveAll의 개별 INSERT가 병목임을 확인. Bulk INSERT와 비동기 QR 생성 적용. <strong>16.56s → 0.41s (97.5% 개선)</strong> <a class="blog-link" href="/OneTime/성능-개선일지-2-(feat.-Bulk-Insert)">📝 글 보기</a></li>
  </ul>

  <div class="subsection-title">보안을 고려합니다</div>
  <ul>
    <li>Fail2ban 기반 비정상 HTTP 요청 탐지 및 차단. <strong>9개월간 425개 IP에서 675건 공격 차단</strong> <a class="blog-link" href="/OneTime/웹-스캐닝-공격:-9개월간의-Fail2ban-로그-분석">📝 글 보기</a></li>
    <li>URL 패턴 기반 인가를 메서드 레벨 @PreAuthorize 커스텀 어노테이션으로 이관</li>
    <li><strong>Safety-Net 테스트로 보안 어노테이션 누락 자동 검사</strong></li>
    <li>MySQL 기반 <strong>Refresh Token Rotation</strong> + 3초 Grace Period로 토큰 탈취 감지</li>
  </ul>

  <div class="subsection-title">데이터 기반으로 서비스를 운영합니다</div>
  <ul>
    <li><strong>7개 통계 도메인, 26개 API</strong>로 구성된 어드민 대시보드 설계 및 구현</li>
    <li>유저 유입, 이벤트 패턴, Retention(MAU/휴면율) 등 핵심 지표 시각화</li>
    <li>Caffeine 캐시 + QueryDSL + Native SQL로 복잡한 집계 쿼리 최적화</li>
  </ul>

  <div class="subsection-title">비용 문제를 기술로 해결합니다</div>
  <ul>
    <li><strong>AWS 월 비용 $83 → $50 미만 (40% 절감)</strong> <a class="blog-link" href="/OneTime/원타임-인프라-개선-도전기">📝 글 보기</a></li>
    <li>EC2 t2 → t4g 마이그레이션으로 가격 대비 성능 개선</li>
    <li>RDS 예약 인스턴스 + EC2 Savings Plans 적용으로 추가 20%+ 절감</li>
    <li>AWS Activate 스타트업 프로그램 직접 신청 → <strong>140만원 크레딧 획득</strong> <a class="blog-link" href="/일상,-정보/5분만에-AWS-140만원-벌기">📝 글 보기</a></li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Security</span>
    <span class="tag">MySQL</span>
    <span class="tag">Docker</span>
    <span class="tag">AWS</span>
    <span class="tag">GitHub Actions</span>
    <span class="tag">QueryDSL</span>
    <span class="tag">Nginx</span>
  </div>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">Hazel</span>
    <span class="period">2025.01 - 현재</span>
  </div>
  <div class="role">Full-Stack (AI Vibe Coding)</div>
  <p>꽃집 사장님을 위한 매출·고객·예약 관리 SaaS입니다. 기획부터 디자인, 프론트엔드·백엔드 개발, 배포까지 AI(Claude)와의 바이브코딩으로 1인 풀스택 개발을 진행하고 있습니다.</p>

  <div class="subsection-title">AI 바이브코딩으로 프로덕션 수준의 SaaS를 구축합니다</div>
  <ul>
    <li>요구사항 분석 → UI/UX 디자인 → 구현 → 테스트 → 배포 <strong>전 과정을 AI와 협력하여 1인 개발</strong></li>
    <li><strong>ARCHITECTURE.md, FRONTEND_GUIDE.md</strong> 등 AI 협업용 가이드 문서 설계 → 일관된 코드 패턴 유도</li>
  </ul>

  <div class="subsection-title">서버 컴포넌트 중심 아키텍처를 설계합니다</div>
  <ul>
    <li><strong>Next.js 16 + React 19 Server Components</strong>를 단일 데이터 소스로 설계</li>
    <li><strong>Supabase RLS</strong>로 11개 테이블에 44개 정책 적용, 유저별 데이터 격리</li>
    <li>Supabase Storage → <strong>Cloudflare R2 마이그레이션</strong>으로 이미지 전송 비용 제거, <strong>TTFB 4배 개선</strong></li>
  </ul>

  <div class="subsection-title">PWA로 네이티브 앱 경험을 제공합니다</div>
  <ul>
    <li><strong>Web Push API + Service Worker</strong> 기반 PWA 푸시 알림 구현</li>
    <li>pg_cron으로 일일 리마인더 + 개별 예약 리마인더 스케줄링</li>
    <li>Safari VAPID 호환성 해결, <strong>유저별 예약 격리로 멀티테넌시 데이터 누출 방지</strong></li>
  </ul>

  <div class="subsection-title">운영 비용 $0으로 프로덕션을 운영합니다</div>
  <ul>
    <li>Vercel + Supabase + Cloudflare R2 조합으로 <strong>월 운영 비용 $0</strong> 달성</li>
  </ul>

  <div class="tags">
    <span class="tag">Next.js</span>
    <span class="tag">React 19</span>
    <span class="tag">TypeScript</span>
    <span class="tag">Supabase</span>
    <span class="tag">PostgreSQL</span>
    <span class="tag">Cloudflare R2</span>
    <span class="tag">Vercel</span>
    <span class="tag">PWA</span>
    <span class="tag">Web Push</span>
    <span class="tag">shadcn/ui</span>
    <span class="tag">Zod</span>
    <span class="tag">AI Vibe Coding</span>
  </div>
</div>

---

## 활동

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">기술 블로그</span>
    <span class="period">2023 - 현재</span>
  </div>
  <p>2년간 140개 이상의 기술 포스트를 작성했습니다.</p>
  <div class="skills-grid">
    <span class="skill-category">Spring</span>
    <span>Filter vs Interceptor, OAuth2.0, Error Handling</span>
    <span class="skill-category">Database</span>
    <span>Index, Transaction Isolation Levels</span>
    <span class="skill-category">Infra</span>
    <span>Docker, Load Balancing, 인프라 비용 절감</span>
    <span class="skill-category">AI</span>
    <span>RAG 개념, AGI, AI 기본법</span>
    <span class="skill-category">Security</span>
    <span>웹 스캐닝 공격 분석, Fail2Ban</span>
  </div>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">블로그 스터디</span>
    <span class="period">2023.06 - 현재</span>
  </div>
  <p>1년 6개월 이상 블로그 스터디를 운영하며 꾸준한 기록과 지식 공유를 독려하고 있습니다.</p>
</div>

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">KUSITMS (한국대학생IT경영학회) <a href="https://www.kusitms.com/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2024</span>
  </div>
  <p>기획자·디자이너와의 협업 프로젝트에서 백엔드 개발자로 참여했습니다.<br>또한 30기 부학회장으로서 70명 이상의 학회원들을 이끌어 보는 경험도 하였습니다.</p>
</div>

---

## 학력

<div class="section-card scroll-fade-in">
  <div class="section-header">
    <span class="company-name">동국대학교 <a href="https://www.linkedin.com/school/dongguk/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2018 - 2025</span>
  </div>
  <p>경영정보학 / 융합소프트웨어 복수전공</p>
</div>

---

## 자격증

<div class="cert-list">
  <span class="cert">리눅스마스터 2급 (2026.01)</span>
  <span class="cert">네트워크관리사 2급 (2025.12)</span>
  <span class="cert">AWS SAA (2025.10)</span>
  <span class="cert">SQLD (2023.10)</span>
  <span class="cert">ADsP (2022.09)</span>
</div>

</div>

<script>
if (typeof switchLang === 'undefined') {
  var s = document.createElement('script');
  s.src = '/static/portfolio.js';
  s.onload = function() { initPage(); };
  document.head.appendChild(s);
} else {
  initPage();
}
</script>
