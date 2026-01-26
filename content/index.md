---
title: Introduction.
---

<style>
.lang-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray);
  border-radius: 6px;
  background: transparent;
  color: var(--darkgray);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.lang-btn.active {
  background: var(--secondary);
  color: var(--light);
  border-color: var(--secondary);
}

.lang-btn:hover:not(.active) {
  border-color: var(--secondary);
}

.lang-content {
  display: none;
}

.lang-content.active {
  display: block;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.intro-text a {
  color: var(--secondary);
  text-decoration: none;
  font-weight: 500;
}

.intro-text a:hover {
  text-decoration: underline;
}

/* Floating Contact Button */
.contact-fab {
  position: fixed;
  bottom: 1.5rem;
  right: 2rem;
  z-index: 100;
}

@media (max-width: 650px) {
  .contact-fab {
    bottom: 0.75rem;
    right: 0.75rem;
  }
}

.contact-btn {
  padding: 0.75rem 1.25rem;
  background: var(--secondary);
  color: var(--light);
  border: none;
  border-radius: 24px;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Contact Modal Overlay */
.contact-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 200;
  display: none;
  justify-content: center;
  align-items: center;
}

.contact-overlay.active {
  display: flex;
}

.contact-modal {
  background: var(--light);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 650px) {
  .contact-modal {
    padding: 1.5rem 1.75rem;
    margin: 1rem;
  }

  .contact-modal-links a {
    width: 50px;
    height: 50px;
  }

  .contact-modal-links a svg {
    width: 22px;
    height: 22px;
  }
}

.contact-modal h3 {
  margin: 0 0 1.3rem;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--darkgray);
  text-align: center;
}

.contact-modal-links {
  display: flex;
  gap: 0.65rem;
  justify-content: center;
}

.contact-modal-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 57px;
  height: 57px;
  border-radius: 10px;
  background: var(--lightgray);
  color: var(--darkgray);
  transition: all 0.2s ease;
}

.contact-modal-links a svg {
  width: 26px;
  height: 26px;
}

.contact-modal-links a:hover {
  background: var(--secondary);
  color: var(--light);
  transform: translateY(-2px);
}

/* Hide Quartz external link icons in contact modal */
.contact-modal .external-icon {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  visibility: hidden !important;
}

.contact-modal h3 svg,
.contact-modal h3 a,
.contact-modal-links .external-icon {
  display: none !important;
}

.section-card {
  background: var(--lightgray);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.company-name {
  font-size: 1.2rem;
  font-weight: 600;
}

.company-link {
  color: inherit;
  text-decoration: none;
  margin-left: 0.15rem;
  opacity: 0.7;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.company-link:hover {
  opacity: 1;
}

.company-link .external-icon {
  display: none !important;
}

.company-link svg {
  width: 14px;
  height: 14px;
}

.period {
  color: var(--darkgray);
  font-size: 0.9rem;
}

.role {
  color: var(--secondary);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.subsection-title {
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}


.metrics {
  display: inline-block;
  color: var(--secondary);
  font-weight: 600;
  margin: 0.75rem 0;
  padding: 0.4rem 0.8rem;
  background: rgba(var(--secondary-rgb), 0.1);
  border-radius: 6px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background: var(--light);
  border: 1px solid var(--gray);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--darkgray);
}

.skills-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.75rem 1rem;
}

.skill-category {
  font-weight: 600;
  color: var(--secondary);
}

.cert-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cert {
  background: var(--lightgray);
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.activity-item {
  margin-bottom: 1rem;
}

.activity-name {
  font-weight: 600;
}

.pr-links {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: var(--gray);
}

.pr-links a {
  color: var(--secondary);
}
</style>

<div class="lang-toggle">
  <button class="lang-btn active" onclick="switchLang('en')">EN</button>
  <button class="lang-btn" onclick="switchLang('ko')">한국어</button>
</div>

<!-- Contact Modal -->
<div class="contact-overlay" id="contact-overlay">
  <div class="contact-modal">
    <h3>Contact</h3>
    <div class="contact-modal-links">
      <a href="mailto:hchsa77@gmail.com" title="Email">
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

## About Me

<div class="intro-text">
I believe the essence of development is understanding user pain points and proactively solving them.<br>
Currently building and operating a service with <strong>20,000+ users</strong> — <a href="https://www.onetime-with-members.com" target="_blank">OneTime</a>.
</div>

<div class="intro-text">
I believe in the power of documentation and human connections.<br>
100+ tech blog posts over 2 years, and running a blog study group for 1.5+ years.
</div>

---

## Career

<div class="section-card">
  <div class="section-header">
    <span class="company-name">LOGOS AI <a href="https://www.logosai.co.kr/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2025.08 - Present</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>Building backend for RAG-based AI Contact Center (AICC) solution platform.</p>

  <div class="subsection-title">Building batch systems for large-scale document processing</div>
  <ul>
    <li>Implemented RAG chunking batch service with Spring Batch (5 threads parallel processing)</li>
    <li>Applied SynchronizedItemStreamReader for thread-safe data reading in multi-threaded environment</li>
    <li>Designed chunk-level document processing for improved memory efficiency and resumability</li>
    <li>Implemented zombie process auto-reset (1h timeout) for uninterrupted operation stability</li>
    <li>Applied Soft Delete strategy to preserve data integrity during document modifications</li>
    <li>Built chat file cleanup batch for storage optimization</li>
  </ul>

  <div class="subsection-title">Optimizing query performance and real-time response</div>
  <ul>
    <li>Added composite index for RAG reference document lookup: <strong>16,000 rows scan → 16 rows (1000x reduction)</strong></li>
    <li>Built real-time LLM response streaming (SSE) without WebFlux using RestClient + SseEmitter</li>
    <li>Leveraged Virtual Thread for async processing to improve TTFB</li>
  </ul>

  <div class="subsection-title">Considering security in multi-tenant environments</div>
  <ul>
    <li>Implemented organization-based access control with @PreAuthorize annotation</li>
    <li>Designed REST APIs for statistics, RAG document management, and history tracking</li>
    <li>Implemented voicebot system API for AI Contact Center integration</li>
    <li>Delivered LG-POC project system API set for enterprise PoC integration</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Security</span>
    <span class="tag">Spring Batch</span>
    <span class="tag">MySQL</span>
    <span class="tag">NCP</span>
    <span class="tag">RAG</span>
    <span class="tag">LLM</span>
    <span class="tag">Docker</span>
  </div>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">Ribella Realty</span>
    <span class="period">2025.06 - 2025.08</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>Built backend and infrastructure for property document platform 'FindIt'.</p>

  <div class="subsection-title">Designing infrastructure and optimizing costs</div>
  <ul>
    <li>Built initial development infrastructure on KVM-based on-premise with Docker Swarm</li>
    <li>Led AWS cloud migration in 3 days: <strong>monthly cost $300+ → $108 (66%+ reduction)</strong></li>
    <li>Architected VPC with Public/Private subnets, ALB, WAF, ACM for security best practices</li>
    <li>Applied SSH → SSM migration for secure server access without key management</li>
    <li>Wrote infrastructure architecture and operation manuals to reduce team onboarding time</li>
  </ul>

  <div class="subsection-title">Sharing knowledge through documentation</div>
  <ul>
    <li>Implemented REST APIs with FastAPI and Swagger documentation</li>
    <li>Built GitLab CI/CD pipeline with ECR integration for automated deployments</li>
    <li>Documented DNS migration, troubleshooting guides for MinIO/S3, ALB configuration</li>
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

<div class="section-card">
  <div class="section-header">
    <span class="company-name">OneTime <a href="https://www.onetime-with-members.com/ko/landing" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2024.08 - Present</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>A web service that helps multiple people easily coordinate schedules with a single link share.</p>
  <div class="metrics">20,000+ users / 2,000+ MAU</div>

  <div class="subsection-title">I measure and improve performance</div>
  <ul>
    <li>Discovered N+1 query in schedule API. Applied QueryDSL fetch join + composite index. <strong>18.38s → 0.35s (98% faster)</strong></li>
    <li>Identified JPA saveAll individual INSERTs as bottleneck. Applied Bulk INSERT + async QR generation. <strong>16.56s → 0.41s (97.5% faster)</strong></li>
  </ul>

  <div class="subsection-title">I solve costs with technology</div>
  <ul>
    <li><strong>Reduced AWS costs from $83 to under $50/month (40%)</strong></li>
    <li>EC2 t2 → t4g migration for better price/performance ratio</li>
    <li>Applied RDS Reserved Instance + EC2 Savings Plans for additional 20%+ savings</li>
    <li>Removed CodeDeploy + ECR adoption: <strong>CI/CD time 4min → 2min (50% faster)</strong></li>
    <li>Secured <strong>$1,100 in AWS credits</strong> through Activate program</li>
  </ul>

  <div class="subsection-title">I consider security</div>
  <ul>
    <li>Built Fail2ban firewall: Nginx access log-based malicious HTTP request detection and blocking</li>
    <li>Auto-block repeated malicious IPs with Discord Webhook alerts</li>
  </ul>

  <div class="subsection-title">I build monitoring systems</div>
  <ul>
    <li>Built serverless logging system: CloudWatch Logs → S3 → Athena for SQL analysis</li>
    <li>Implemented JSON structured logging with Logback for efficient log analysis</li>
    <li>Real-time alerts for 500 errors and slow APIs (1s+) via Lambda → Discord</li>
  </ul>

  <div class="subsection-title">I integrate external services</div>
  <ul>
    <li>Migrated Everytime timetable feature from Lambda(Python/Selenium) to Spring Boot</li>
    <li>Implemented Feign Client + JSoup for direct XML API parsing (faster than crawling)</li>
    <li>Auto-converts university timetable to fixed schedule format</li>
  </ul>

  <div class="subsection-title">I collaborate and communicate</div>
  <ul>
    <li>Weekly sync meetings with FE/Design/Marketing teams for planning, design, and implementation.</li>
    <li>Detailed PR descriptions: background, changes, test methods, and screenshots</li>
    <li>Shared technical decisions through internal docs and retrospectives</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Security</span>
    <span class="tag">MySQL</span>
    <span class="tag">QueryDSL</span>
    <span class="tag">AWS</span>
    <span class="tag">Nginx</span>
    <span class="tag">Docker</span>
  </div>
</div>

---

## Activities

<div class="section-card">
  <div class="section-header">
    <span class="company-name">Technical Blog</span>
    <span class="period">2023 - Present</span>
  </div>
  <p>250+ posts over 2 years</p>
  <div class="skills-grid">
    <span class="skill-category">Spring</span>
    <span>Filter vs Interceptor, OAuth2.0, Error Handling</span>
    <span class="skill-category">Database</span>
    <span>Index Optimization, Transaction Isolation Levels</span>
    <span class="skill-category">Infra</span>
    <span>Docker, Nginx, Fail2Ban, Load Balancing</span>
    <span class="skill-category">Troubleshooting</span>
    <span>Real production issue resolutions</span>
  </div>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">Blog Study Group</span>
    <span class="period">2023.06 - Present</span>
  </div>
  <p>Running a blog study group for 1.5+ years. Encouraging consistent documentation and knowledge sharing.</p>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">KUSITMS</span>
    <span class="period">2024</span>
  </div>
  <p>IT Management Society - Collaborated with 70+ members on tech projects. Participated as backend developer in corporate project.</p>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">SKT Devocean Young</span>
    <span class="period">2024</span>
  </div>
  <p>Selected as outstanding participant</p>
</div>

---

## Skills

<div class="section-card">
  <div class="subsection-title">Backend</div>
  <p>Proficient in Spring Boot, Spring Batch, Spring Data JPA, QueryDSL. Experience with Python FastAPI. MyBatis legacy system maintenance experience.</p>

  <div class="subsection-title">Database</div>
  <p>Primary: MySQL. Strong interest in query optimization and index design. Redis caching and distributed lock implementation experience.</p>

  <div class="subsection-title">Infrastructure</div>
  <p>AWS (EC2, RDS, S3, CodeDeploy, ECR), NCP experience. Docker containerization, GitHub Actions & GitLab CI pipeline construction. Active use of Reserved Instances and Savings Plans for cost optimization.</p>

  <div class="subsection-title">Documentation</div>
  <p>Technical blog for learning documentation and sharing. Detailed PR descriptions with background, changes, and test methods. Infrastructure architecture and operation manual writing experience.</p>
</div>

---

## Education

<div class="section-card">
  <div class="section-header">
    <span class="company-name">Dongguk University</span>
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

## About Me

<div class="intro-text">
사용자가 겪는 불편함을 이해하고 주도적으로 해결해 나가는 것이 개발의 본질이라고 생각합니다.<br>
<strong>2만 명 이상</strong>이 사용하는 서비스 <a href="https://www.onetime-with-members.com" target="_blank">OneTime</a>을 직접 기획·개발·운영하며 이를 실천하고 있습니다.
</div>

<div class="intro-text">
기록과 사람의 힘을 믿습니다.<br>
2년간 100개 이상의 기술 블로그 글을 작성하고, 블로그 스터디를 1년 반 이상 운영해왔습니다.
</div>

---

## 경력

<div class="section-card">
  <div class="section-header">
    <span class="company-name">(주)로고스에이아이 <a href="https://www.logosai.co.kr/" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2025.08 - 현재</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>RAG 기반 AICC(AI Contact Center) 솔루션 플랫폼의 백엔드 개발 및 인프라 구축을 담당하고 있습니다.</p>

  <div class="subsection-title">대용량 문서 처리를 위한 배치 시스템을 구축합니다</div>
  <ul>
    <li>Spring Batch를 활용해 RAG 청킹 배치 서비스를 구현했습니다.</li>
    <li>SynchronizedItemStreamReader 적용으로 멀티스레드 환경 데이터 읽기 동시성을 보장했습니다.</li>
    <li>청크 단위 문서 처리 설계로 메모리 효율성과 재시작 용이성을 확보했습니다.</li>
    <li>채팅 파일 정리 배치 기능을 구현해 스토리지를 최적화했습니다.</li>
  </ul>

  <div class="subsection-title">쿼리 성능 최적화와 실시간 응답을 구현합니다</div>
  <ul>
    <li>RAG 참조 문서 조회에 복합 인덱스 추가: <strong>16,000개 스캔 → 16개 (1000배 감소)</strong></li>
    <li>WebFlux 없이 RestClient + SseEmitter 조합으로 LLM 실시간 스트리밍을 구현했습니다.</li>
    <li>Java Virtual Thread 기반 비동기 처리로 TTFB를 단축했습니다.</li>
  </ul>

  <div class="subsection-title">멀티테넌트 환경에서 보안을 고려합니다</div>
  <ul>
    <li>@PreAuthorize 어노테이션 기반 조직별 접근 제어를 구현해 멀티테넌트 보안을 강화했습니다.</li>
    <li>통계, RAG 문서 관리, 이력 추적 등 핵심 기능의 REST API를 설계하고 구현했습니다.</li>
    <li>보이스봇 시스템 API를 구현해 AI Contact Center 연동을 지원합니다.</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Security</span>
    <span class="tag">Spring Batch</span>
    <span class="tag">MySQL</span>
    <span class="tag">NCP</span>
    <span class="tag">RAG</span>
    <span class="tag">LLM</span>
    <span class="tag">Docker</span>
  </div>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">(주)리벨라리얼티</span>
    <span class="period">2025.06 - 2025.08</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>부동산 매물 중개 플랫폼 'FindIt'의 백엔드 개발 및 인프라 구축을 담당했습니다.</p>

  <div class="subsection-title">인프라를 설계하고 비용을 최적화합니다</div>
  <ul>
    <li>KVM 기반 온프레미스 환경에서 Docker Swarm을 활용해 초기 개발 인프라를 구축했습니다.</li>
    <li>3일 내 AWS 클라우드 마이그레이션을 완료했습니다: <strong>월 $300+ → $108 (66% 이상 절감)</strong></li>
    <li>VPC (Public/Private Subnet), ALB, WAF, ACM을 활용한 보안 베스트 프랙티스를 적용했습니다.</li>
    <li>SSH → SSM 전환으로 키 관리 없이 안전한 서버 접속 환경을 구축했습니다.</li>
    <li>GitLab CI/CD 파이프라인에 ECR을 연동해 배포를 자동화했습니다.</li>
    <li>인프라 아키텍처 및 운영 매뉴얼을 작성해 팀의 온보딩 시간을 단축했습니다.</li>
  </ul>

  <div class="subsection-title">문서화를 통해 지식을 공유합니다</div>
  <ul>
    <li>FastAPI를 활용한 REST API를 구현하고 Swagger 문서화를 진행했습니다.</li>
    <li>DNS 마이그레이션, MinIO/S3 트러블슈팅, ALB 설정 가이드를 문서화했습니다.</li>
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

<div class="section-card">
  <div class="section-header">
    <span class="company-name">OneTime <a href="https://www.onetime-with-members.com/ko/landing" target="_blank" class="company-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></span>
    <span class="period">2024.08 - 현재</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>링크 공유 한 번으로 여러 사람과 쉽게 일정을 맞추도록 돕는 웹 서비스입니다.</p>
  <div class="metrics">누적 사용자 20,000+명 / MAU 2,000+명</div>

  <div class="subsection-title">성능을 측정하고 개선합니다</div>
  <ul>
    <li>전체 스케줄 조회 API에서 N+1 쿼리 문제를 발견. QueryDSL fetch join과 복합 인덱스 적용. <strong>18.38s → 0.35s (98% 개선)</strong></li>
    <li>이벤트 생성 시 JPA saveAll의 개별 INSERT가 병목임을 확인. Bulk INSERT와 비동기 QR 생성 적용. <strong>16.56s → 0.41s (97.5% 개선)</strong></li>
  </ul>

  <div class="subsection-title">비용을 기술로 해결합니다</div>
  <ul>
    <li><strong>AWS 월 비용 $83 → $50 미만으로 40% 절감</strong></li>
    <li>EC2 t2 → t4g 마이그레이션으로 가격 대비 성능 개선</li>
    <li>RDS 예약 인스턴스 + EC2 Savings Plans 적용으로 추가 20%+ 절감</li>
    <li>CodeDeploy 제거 + ECR 도입으로 <strong>CI/CD 시간 4분 → 2분 (50% 단축)</strong></li>
    <li>AWS Activate 스타트업 프로그램 직접 신청 → <strong>140만원 크레딧 획득</strong></li>
  </ul>

  <div class="subsection-title">보안을 고려합니다</div>
  <ul>
    <li>Fail2ban을 활용해 Nginx 액세스 로그 기반 비정상 HTTP 요청 탐지 및 차단</li>
    <li>반복적 악성 요청 IP 자동 차단 및 Discord Webhook 알림 연동</li>
  </ul>

  <div class="subsection-title">모니터링 시스템을 구축합니다</div>
  <ul>
    <li>서버리스 로깅 시스템 구축: CloudWatch Logs → S3 → Athena SQL 분석</li>
    <li>Logback JSON 구조화 로깅 적용으로 효율적인 로그 분석 환경 구축</li>
    <li>500 에러 및 Slow API(1초 이상) 실시간 알림: Lambda → Discord</li>
  </ul>

  <div class="subsection-title">외부 서비스를 연동합니다</div>
  <ul>
    <li>에브리타임 시간표 연동 기능을 Lambda(Python/Selenium)에서 Spring Boot로 마이그레이션</li>
    <li>Feign Client + JSoup으로 XML API 직접 파싱 (크롤링 대비 응답 속도 개선)</li>
    <li>대학 시간표를 고정 스케줄 형태로 자동 변환</li>
  </ul>

  <div class="subsection-title">협업하고 소통합니다</div>
  <ul>
    <li>FE / 디자인/ 마케팅 팀과 주간 싱크 미팅을 통해 기획, 설계, 구현을 진행합니다.</li>
    <li>PR에 배경, 변경사항, 테스트 방법, 스크린샷을 상세히 작성합니다</li>
    <li>내부 문서와 회고를 통해 기술적 결정을 공유합니다</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Security</span>
    <span class="tag">MySQL</span>
    <span class="tag">QueryDSL</span>
    <span class="tag">AWS</span>
    <span class="tag">Nginx</span>
    <span class="tag">Docker</span>
  </div>
</div>

---

## 활동

<div class="section-card">
  <div class="section-header">
    <span class="company-name">기술 블로그</span>
    <span class="period">2023 - 현재</span>
  </div>
  <p>2년간 250개 이상의 기술 포스트를 작성했습니다.</p>
  <div class="skills-grid">
    <span class="skill-category">Spring</span>
    <span>Filter vs Interceptor, OAuth2.0, Error Handling</span>
    <span class="skill-category">Database</span>
    <span>Index 최적화, Transaction Isolation Levels</span>
    <span class="skill-category">Infra</span>
    <span>Docker, Nginx, Fail2Ban, Load Balancing</span>
    <span class="skill-category">Troubleshooting</span>
    <span>실제 장애 해결 사례</span>
  </div>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">블로그 스터디</span>
    <span class="period">2023.06 - 현재</span>
  </div>
  <p>1년 6개월 이상 블로그 스터디를 운영하며 꾸준한 기록과 지식 공유를 독려하고 있습니다.</p>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">KUSITMS</span>
    <span class="period">2024</span>
  </div>
  <p>IT 경영학회 - 70명 이상의 학회원들과 함께 기술 프로젝트를 진행했습니다. 기업 프로젝트에 백엔드 개발자로 참여했습니다.</p>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">SKT 데보션영</span>
    <span class="period">2024</span>
  </div>
  <p>우수활동자로 선정되었습니다.</p>
</div>

---

## 기술

<div class="section-card">
  <div class="subsection-title">Backend</div>
  <p>Spring Boot, Spring Batch, Spring Data JPA, QueryDSL을 사용한 백엔드 개발에 익숙합니다. Python FastAPI를 활용한 REST API 개발 경험이 있습니다. MyBatis를 사용한 레거시 시스템 유지보수 경험이 있습니다.</p>

  <div class="subsection-title">Database</div>
  <p>MySQL을 주로 사용하며, 쿼리 최적화와 인덱스 설계에 관심이 많습니다. Redis를 활용한 캐싱과 분산 락 구현 경험이 있습니다.</p>

  <div class="subsection-title">Infrastructure</div>
  <p>AWS (EC2, RDS, S3, CodeDeploy, ECR), NCP 기반 인프라 구축 경험이 있습니다. Docker 컨테이너화와 GitHub Actions, GitLab CI를 활용한 CI/CD 파이프라인 구축에 익숙합니다. 비용 최적화에 관심이 많아 Reserved Instance, Savings Plans 등을 적극 활용합니다.</p>

  <div class="subsection-title">Documentation</div>
  <p>기술 블로그 운영을 통해 배운 것을 정리하고 공유합니다. PR 작성 시 배경, 변경 사항, 테스트 방법을 상세히 기록합니다. 인프라 아키텍처와 운영 매뉴얼 작성 경험이 있습니다.</p>
</div>

---

## 학력

<div class="section-card">
  <div class="section-header">
    <span class="company-name">동국대학교</span>
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

<script src="/static/portfolio.js"></script>
