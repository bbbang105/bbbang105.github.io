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

.period {
  color: var(--gray);
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
I believe in the power of documentation and the knowledge sharing it inspires.<br>
100+ technical blog posts over 2 years, and running a blog study group for 1.5+ years.
</div>

---

## Career

<div class="section-card">
  <div class="section-header">
    <span class="company-name">LOGOS AI</span>
    <span class="period">2025.08 - Present</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>Building backend for RAG-based AI Contact Center (AICC) solution platform.</p>

  <div class="subsection-title">Building batch systems for large-scale document processing</div>
  <ul>
    <li>Implemented RAG chunking batch service with Spring Batch (5 threads parallel processing)</li>
    <li>Implemented Self-Healing logic for automatic recovery during batch server failures</li>
    <li>Applied Soft Delete strategy to preserve existing data during document modifications</li>
  </ul>

  <div class="subsection-title">Considering security in multi-tenant environments</div>
  <ul>
    <li>Implemented organization-based access control with PreAuthorize</li>
    <li>Designed REST APIs for statistics and RAG document management</li>
    <li>Built real-time LLM response streaming for reduced user waiting time</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Batch</span>
    <span class="tag">MySQL</span>
    <span class="tag">NCP</span>
    <span class="tag">RAG</span>
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
    <li>Built initial development infrastructure on KVM-based on-premise</li>
    <li>Led AWS cloud migration, <strong>reducing infrastructure costs by 66%+</strong></li>
    <li>Wrote infrastructure architecture and operation manuals</li>
  </ul>

  <div class="tags">
    <span class="tag">Python</span>
    <span class="tag">FastAPI</span>
    <span class="tag">MySQL</span>
    <span class="tag">Docker Swarm</span>
    <span class="tag">AWS</span>
    <span class="tag">GitLab CI</span>
  </div>
</div>

---

## Projects

<div class="section-card">
  <div class="section-header">
    <span class="company-name">OneTime</span>
    <span class="period">2024.08 - Present</span>
  </div>
  <div class="role">Backend Developer</div>
  <p>Schedule coordination web service — share a link, find the best time together.</p>
  <div class="metrics">20,000+ users / 2,000+ MAU</div>

  <div class="subsection-title">I measure and improve performance</div>
  <ul>
    <li>Resolved N+1 query with QueryDSL fetch join. <strong>18.38s → 0.35s (98% faster)</strong></li>
    <li>Optimized event creation with Bulk INSERT. <strong>16.56s → 0.41s (97.5% faster)</strong></li>
  </ul>
  <div class="pr-links">
    <a href="https://github.com/onetime-with-members/backend/pull/234">PR #234</a> ·
    <a href="https://github.com/onetime-with-members/backend/pull/238">PR #238</a>
  </div>

  <div class="subsection-title">I solve concurrency problems reliably</div>
  <ul>
    <li>Implemented distributed lock with Redisson + AOP</li>
    <li>100% data integrity under 100 concurrent requests</li>
  </ul>
  <div class="pr-links">
    <a href="https://github.com/onetime-with-members/backend/pull/248">PR #248</a>
  </div>

  <div class="subsection-title">I solve costs with technology</div>
  <ul>
    <li><strong>Reduced AWS costs from $83 to under $50/month (40%)</strong></li>
    <li>Secured <strong>$1,100 in AWS credits</strong> through Activate program</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">MySQL</span>
    <span class="tag">Redis</span>
    <span class="tag">AWS</span>
    <span class="tag">QueryDSL</span>
  </div>
</div>

---

## Activities

<div class="activity-item">
  <span class="activity-name">Technical Blog</span>
  <p>100+ posts over 2 years — Spring, Database, Infrastructure, Troubleshooting</p>
</div>

<div class="activity-item">
  <span class="activity-name">Blog Study Group</span>
  <p>Running for 1.5+ years</p>
</div>

<div class="activity-item">
  <span class="activity-name">SKT Devocean Young</span>
  <p>Selected as outstanding participant</p>
</div>

---

## Skills

<div class="skills-grid">
  <span class="skill-category">Backend</span>
  <span>Spring Boot, Spring Batch, JPA, QueryDSL, FastAPI</span>
  <span class="skill-category">Database</span>
  <span>MySQL, Redis</span>
  <span class="skill-category">Infra</span>
  <span>AWS, NCP, Docker, GitHub Actions, GitLab CI</span>
</div>

---

## Certifications

<div class="cert-list">
  <span class="cert">AWS SAA (2025)</span>
  <span class="cert">Linux Master Lv.2 (2026)</span>
  <span class="cert">SQLD (2023)</span>
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
    <span class="company-name">(주)로고스에이아이</span>
    <span class="period">2025.08 - 현재</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>RAG 기반 AICC(AI Contact Center) 솔루션 플랫폼의 백엔드를 개발하고 있습니다.</p>

  <div class="subsection-title">대용량 문서 처리를 위한 배치 시스템을 구축합니다</div>
  <ul>
    <li>Spring Batch를 활용해 RAG 청킹 배치 서비스를 구현했습니다. (5 threads 병렬 처리)</li>
    <li>배치 서버 장애 시 자동 복구(Self-Healing) 로직을 구현해 운영 자동화를 실현했습니다.</li>
    <li>문서 수정 시 기존 데이터를 보존하는 Soft Delete 전략을 적용했습니다.</li>
  </ul>

  <div class="subsection-title">멀티테넌트 환경에서 보안을 고려합니다</div>
  <ul>
    <li>PreAuthorize 기반 조직별 접근 제어를 구현했습니다.</li>
    <li>통계, RAG 문서 관리 등 핵심 기능의 REST API를 설계하고 구현했습니다.</li>
    <li>LLM 실시간 응답 스트리밍을 구현해 사용자 대기 시간을 줄였습니다.</li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">Spring Batch</span>
    <span class="tag">MySQL</span>
    <span class="tag">NCP</span>
    <span class="tag">RAG</span>
  </div>
</div>

<div class="section-card">
  <div class="section-header">
    <span class="company-name">(주)리벨라리얼티</span>
    <span class="period">2025.06 - 2025.08</span>
  </div>
  <div class="role">Backend Engineer</div>
  <p>부동산 문서 관리 플랫폼 'FindIt'의 백엔드 개발 및 인프라 구축을 담당했습니다.</p>

  <div class="subsection-title">인프라를 설계하고 비용을 최적화합니다</div>
  <ul>
    <li>KVM 기반 온프레미스 환경에서 초기 개발 인프라를 구축했습니다.</li>
    <li>AWS 클라우드 마이그레이션을 주도해 <strong>인프라 비용을 66% 이상 절감</strong>했습니다.</li>
    <li>인프라 아키텍처 및 운영 매뉴얼을 작성했습니다.</li>
  </ul>

  <div class="tags">
    <span class="tag">Python</span>
    <span class="tag">FastAPI</span>
    <span class="tag">MySQL</span>
    <span class="tag">Docker Swarm</span>
    <span class="tag">AWS</span>
    <span class="tag">GitLab CI</span>
  </div>
</div>

---

## 프로젝트

<div class="section-card">
  <div class="section-header">
    <span class="company-name">OneTime</span>
    <span class="period">2024.08 - 현재</span>
  </div>
  <div class="role">Backend Developer</div>
  <p>링크 공유 한 번으로 여러 사람과 쉽게 일정을 맞추는 웹 서비스입니다.</p>
  <div class="metrics">누적 사용자 20,000+명 / MAU 2,000+명</div>

  <div class="subsection-title">성능을 측정하고 개선합니다</div>
  <ul>
    <li>N+1 쿼리 문제를 QueryDSL fetch join으로 해결. <strong>18.38s → 0.35s (98% 개선)</strong></li>
    <li>Bulk INSERT로 이벤트 생성 최적화. <strong>16.56s → 0.41s (97.5% 개선)</strong></li>
  </ul>
  <div class="pr-links">
    <a href="https://github.com/onetime-with-members/backend/pull/234">PR #234</a> ·
    <a href="https://github.com/onetime-with-members/backend/pull/238">PR #238</a>
  </div>

  <div class="subsection-title">동시성 문제를 안정적으로 해결합니다</div>
  <ul>
    <li>Redisson + AOP 조합으로 분산 락 구현</li>
    <li>동시 100명 요청 테스트에서 데이터 정합성 100% 유지</li>
  </ul>
  <div class="pr-links">
    <a href="https://github.com/onetime-with-members/backend/pull/248">PR #248</a>
  </div>

  <div class="subsection-title">비용을 기술로 해결합니다</div>
  <ul>
    <li><strong>AWS 월 비용 $83 → $50 미만으로 40% 절감</strong></li>
    <li>AWS Activate 프로그램으로 <strong>140만원 크레딧 획득</strong></li>
  </ul>

  <div class="tags">
    <span class="tag">Java</span>
    <span class="tag">Spring Boot</span>
    <span class="tag">MySQL</span>
    <span class="tag">Redis</span>
    <span class="tag">AWS</span>
    <span class="tag">QueryDSL</span>
  </div>
</div>

---

## 활동

<div class="activity-item">
  <span class="activity-name">기술 블로그</span>
  <p>2년간 100개 이상 포스트 — Spring, Database, Infrastructure, Troubleshooting</p>
</div>

<div class="activity-item">
  <span class="activity-name">블로그 스터디</span>
  <p>1년 6개월 이상 운영</p>
</div>

<div class="activity-item">
  <span class="activity-name">SKT 데보션영</span>
  <p>우수활동자 선정</p>
</div>

---

## 기술

<div class="skills-grid">
  <span class="skill-category">Backend</span>
  <span>Spring Boot, Spring Batch, JPA, QueryDSL, FastAPI</span>
  <span class="skill-category">Database</span>
  <span>MySQL, Redis</span>
  <span class="skill-category">Infra</span>
  <span>AWS, NCP, Docker, GitHub Actions, GitLab CI</span>
</div>

---

## 자격증

<div class="cert-list">
  <span class="cert">AWS SAA (2025)</span>
  <span class="cert">리눅스마스터 2급 (2026)</span>
  <span class="cert">SQLD (2023)</span>
</div>

</div>

<script src="/static/portfolio.js"></script>
