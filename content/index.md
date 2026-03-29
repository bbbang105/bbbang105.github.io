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
    I've <a href="#ai-vibe-coding">built 3 products as a solo full-stack developer</a> through vibe coding, while designing and building the backend for a RAG-based AICC solution.<br><br>
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
    <li>Enabled <strong>TTFT measurement</strong> and response time statistics (P50/P75/P95) through Delta/Final event separation</li>
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
    <span class="period"><a href="https://github.com/onetime-with-members/backend" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2024.08 - Present</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>A web service that helps multiple people easily coordinate schedules with a single link share.</p>
  <div class="metrics">25K+ users / 2K+ MAU</div>

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

<div class="vibe-section scroll-fade-in">
  <div class="vibe-section-header">
    <h3 id="ai-vibe-coding">AI Vibe Coding</h3>
    <p>Projects built solo from planning to deployment, in collaboration with AI</p>
  </div>
  <div class="vibe-grid">
    <div class="vibe-card" onclick="openVibeModal('custing-en')">
      <div class="vibe-card-emoji">📝</div>
      <div class="vibe-card-name">Custing</div>
      <div class="vibe-card-desc">Blog study group automation platform with Discord bot & web dashboard</div>
      <div class="vibe-card-highlight">Automated 30+ member study operations end-to-end</div>
      <div class="vibe-card-tags">
        <span class="vibe-card-tag">Next.js</span>
        <span class="vibe-card-tag">discord.js</span>
        <span class="vibe-card-tag">Monorepo</span>
      </div>
      <div class="vibe-card-hint">See details →</div>
    </div>
    <div class="vibe-card" onclick="openVibeModal('forme-en')">
      <div class="vibe-card-emoji">🧰</div>
      <div class="vibe-card-name">ForMe</div>
      <div class="vibe-card-desc">All-in-one productivity PWA I built for myself — and keep expanding</div>
      <div class="vibe-card-highlight">Scattered tools unified into one PWA</div>
      <div class="vibe-card-tags">
        <span class="vibe-card-tag">Next.js</span>
        <span class="vibe-card-tag">TipTap</span>
        <span class="vibe-card-tag">Gemini</span>
      </div>
      <div class="vibe-card-hint">See details →</div>
    </div>
    <div class="vibe-card" onclick="openVibeModal('hazel-en')">
      <div class="vibe-card-emoji">🌸</div>
      <div class="vibe-card-name">Hazel</div>
      <div class="vibe-card-desc">Sales, customer & reservation management SaaS for flower shops</div>
      <div class="vibe-card-highlight">Paper ledgers → digital transformation</div>
      <div class="vibe-card-tags">
        <span class="vibe-card-tag">Next.js</span>
        <span class="vibe-card-tag">Supabase</span>
        <span class="vibe-card-tag">PWA</span>
      </div>
      <div class="vibe-card-hint">See details →</div>
    </div>
  </div>
</div>

<!-- Vibe Modals (EN) -->
<div class="vibe-overlay" id="vibe-overlay-hazel-en">
  <div class="vibe-modal">
    <button class="vibe-modal-close" onclick="closeVibeModal('hazel-en')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="section-header">
      <span class="company-name">🌸 Hazel</span>
      <span class="period"><a href="https://github.com/bbbang105/flowershop-admin" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2026.01 - Present</span>
    </div>
    <div class="role">Full-Stack (AI Vibe Coding)</div>
    <p>Built this SaaS after seeing my sister manage her flower shop with paper ledgers and KakaoTalk. Developing solo through vibe coding with AI (Claude).</p>
    <div class="subsection-title">Starting from real flower shop problems</div>
    <ul>
      <li>Sales, customers, reservations, and photos scattered across paper + Excel + KakaoTalk → unified SaaS</li>
      <li>Flower shops need multiple pickup dates per order → designed <strong>1:N multi-pickup reservation system</strong></li>
    </ul>
    <div class="subsection-title">Making it actually usable</div>
    <ul>
      <li>No app install needed → <strong>PWA + Bottom Navigation Bar</strong> for native app experience</li>
      <li>Preventing missed reservations → <strong>Web Push notifications</strong> for daily/individual reminders</li>
      <li>No way to track unpaid sales → built <strong>accounts receivable management system</strong></li>
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
</div>

<div class="vibe-overlay" id="vibe-overlay-custing-en">
  <div class="vibe-modal">
    <button class="vibe-modal-close" onclick="closeVibeModal('custing-en')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="section-header">
      <span class="company-name">📝 Custing</span>
      <span class="period"><a href="https://github.com/bbbang105/study-admin" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2026.02 - Present</span>
    </div>
    <div class="role">Full-Stack (AI Vibe Coding)</div>
    <p>Automated a 30-35 member blog study group previously managed via Notion + KakaoTalk, replacing manual workflows with Discord bot + custom web dashboard.</p>
    <div class="subsection-title">Replacing manual operations with automation</div>
    <ul>
      <li>Manual post checking every round (2 weeks) → <strong>RSS auto-collection every 5 min → attendance → late/absent fine auto-assignment → Discord alerts</strong></li>
      <li>Declining participation → activity score gamification with podium/weekly rankings</li>
      <li>Notion-based member management chaos → 6-state management system (pending, active, dormant, OB, etc.)</li>
    </ul>
    <div class="subsection-title">Features planned and built from real needs</div>
    <ul>
      <li>No decision-making tool → designed <strong>board voting</strong> with 4 types (single/multiple/date/anonymous) + anonymous privacy separation</li>
      <li>Discord alone insufficient for announcements → introduced <strong>FCM web push notifications</strong>, 5 types with individual on/off</li>
    </ul>
    <div class="tags">
      <span class="tag">Next.js</span>
      <span class="tag">React 19</span>
      <span class="tag">TypeScript</span>
      <span class="tag">Drizzle ORM</span>
      <span class="tag">Supabase</span>
      <span class="tag">PostgreSQL</span>
      <span class="tag">discord.js</span>
      <span class="tag">pg-boss</span>
      <span class="tag">pnpm Monorepo</span>
      <span class="tag">Vercel</span>
      <span class="tag">PWA</span>
      <span class="tag">FCM</span>
      <span class="tag">Sentry</span>
      <span class="tag">AI Vibe Coding</span>
    </div>
  </div>
</div>

<div class="vibe-overlay" id="vibe-overlay-forme-en">
  <div class="vibe-modal">
    <button class="vibe-modal-close" onclick="closeVibeModal('forme-en')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="section-header">
      <span class="company-name">🧰 ForMe</span>
      <span class="period"><a href="https://github.com/bbbang105/forme" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2026.02 - Present</span>
    </div>
    <div class="role">Full-Stack (AI Vibe Coding)</div>
    <p>All-in-one personal productivity PWA integrating curation, calendar, notes, and YouTube summaries. Built for myself and continuously expanding.</p>
    <div class="subsection-title">Building features I actually need</div>
    <ul>
      <li>Can't watch every YouTube video → RSS collection + <strong>Gemini 2.5 Flash</strong> auto-summarization with length-based prompt tiers</li>
      <li>Limitations of existing memo/calendar apps → built TipTap editor + recurring schedule calendar from scratch</li>
    </ul>
    <div class="tags">
      <span class="tag">Next.js</span>
      <span class="tag">React 19</span>
      <span class="tag">TypeScript</span>
      <span class="tag">Drizzle ORM</span>
      <span class="tag">Supabase</span>
      <span class="tag">PostgreSQL</span>
      <span class="tag">Cloudflare R2</span>
      <span class="tag">Vercel</span>
      <span class="tag">PWA</span>
      <span class="tag">TipTap</span>
      <span class="tag">Service Worker</span>
      <span class="tag">Gemini</span>
      <span class="tag">AI Vibe Coding</span>
    </div>
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
    바이브코딩으로 <a href="#ai-vibe-coding">3개 프로덕트를 1인 풀스택 개발</a>하고, RAG 기반 AICC 솔루션의 백엔드를 설계·구현하고 있습니다.<br><br>
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
    <li><strong>RestClient + SseEmitter</strong> 기반 LLM 스트리밍 응답 구현</li>
    <li>Delta/Final 이벤트 분리로 <strong>TTFT 측정</strong> 및 응답 시간 통계 제공</li>
  </ul>

  <div class="subsection-title">대용량 문서 처리를 위한 배치 시스템을 구축합니다</div>
  <ul>
    <li><strong>Spring Batch 기반 RAG 청킹 배치 서비스</strong> 구현</li>
    <li>채팅 파일 정리 배치 구현으로 S3 스토리지 자동 관리</li>
  </ul>

  <div class="subsection-title">RAG 파이프라인을 위한 문서 처리 도구를 개발합니다</div>
  <ul>
    <li><strong>FastAPI + Docling + MarkItDown</strong> 이중 파싱 엔진으로 PDF/DOCX/PPTX/XLSX → 마크다운 변환</li>
  </ul>

  <div class="subsection-title">멀티테넌트 환경에서 보안을 고려합니다</div>
  <ul>
    <li>@PreAuthorize 기반 조직별 접근 제어로 멀티테넌트 보안 강화</li>
    <li><strong>Apache Tika Magic Byte 검증</strong>으로 파일 확장자 위조 방지, 비회원 업로드 제한</li>
  </ul>

  <div class="subsection-title">AWS 인프라를 설계하고 CI/CD·Observability를 구축합니다</div>
  <ul>
    <li><strong>POC 환경 AWS 인프라 설계·구축</strong>: VPC(2개 AZ) + ALB + Aurora MySQL + EFS + ECR</li>
    <li><strong>GPU 인스턴스에서 오픈소스 LLM 모델 서빙</strong> 경험 (vLLM 기반 추론 서버 구성)</li>
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
    <span class="tag">Python</span>
    <span class="tag">FastAPI</span>
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
    <span class="period"><a href="https://github.com/onetime-with-members/backend" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2024.08 - 현재</span>
  </div>
  <div class="role">Backend & Infrastructure Engineer</div>
  <p>링크 공유 한 번으로 여러 사람과 쉽게 일정을 맞추도록 돕는 웹 서비스입니다.</p>
  <div class="metrics">누적 사용자 25K+명 / MAU 2K+명</div>

  <div class="subsection-title">성능을 측정하고 개선합니다</div>
  <ul>
    <li>전체 스케줄 조회 API에서 N+1 쿼리 문제를 발견. QueryDSL fetch join과 복합 인덱스 적용. <strong>18.38s → 0.35s (98% 개선)</strong> <a class="blog-link" href="/OneTime/성능-개선일지-1-(feat.-N+1,-Index)">📝 글 보기</a></li>
    <li>이벤트 생성 시 JPA saveAll의 개별 INSERT가 병목임을 확인. Bulk INSERT와 비동기 QR 생성 적용. <strong>16.56s → 0.41s (97.5% 개선)</strong> <a class="blog-link" href="/OneTime/성능-개선일지-2-(feat.-Bulk-Insert)">📝 글 보기</a></li>
  </ul>

  <div class="subsection-title">실서비스 환경에서 보안 위협에 직접 대응합니다</div>
  <ul>
    <li>Fail2ban 기반 비정상 HTTP 요청 탐지 및 차단. <strong>9개월간 425개 IP에서 675건 공격 차단</strong> <a class="blog-link" href="/OneTime/웹-스캐닝-공격:-9개월간의-Fail2ban-로그-분석">📝 글 보기</a></li>
    <li>URL 패턴 기반 인가를 메서드 레벨 @PreAuthorize 커스텀 어노테이션으로 이관</li>
    <li><strong>Safety-Net 테스트로 보안 어노테이션 누락 자동 검사</strong></li>
  </ul>

  <div class="subsection-title">데이터 기반으로 서비스를 운영합니다</div>
  <ul>
    <li><strong>7개 통계 도메인, 26개 API</strong>로 구성된 어드민 대시보드를 단독 설계·구현</li>
    <li><strong>SQS 기반 이메일 시스템</strong> (그룹/개별 발송, 템플릿 CRUD)</li>
    <li>유저 유입, 이벤트 패턴, Retention(MAU/휴면율) 등 핵심 지표 시각화</li>
  </ul>

  <div class="subsection-title">지속 가능한 서비스 운영을 위해 비용을 최적화합니다</div>
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

<div class="vibe-section scroll-fade-in">
  <div class="vibe-section-header">
    <h3 id="ai-vibe-coding">AI Vibe Coding</h3>
    <p>AI와 협업하여 기획부터 배포까지 1인 풀스택으로 구축한 프로젝트들</p>
  </div>
  <div class="vibe-grid">
    <div class="vibe-card" onclick="openVibeModal('custing-ko')">
      <div class="vibe-card-emoji">📝</div>
      <div class="vibe-card-name">큐스팅</div>
      <div class="vibe-card-desc">블로그 스터디 운영 자동화 플랫폼</div>
      <div class="vibe-card-highlight">30명+ 스터디 수동 운영을 전 과정 자동화</div>
      <div class="vibe-card-hint">자세히 보기 →</div>
    </div>
    <div class="vibe-card" onclick="openVibeModal('forme-ko')">
      <div class="vibe-card-emoji">🧰</div>
      <div class="vibe-card-name">ForMe</div>
      <div class="vibe-card-desc">내가 쓰려고 만든 올인원 생산성 앱</div>
      <div class="vibe-card-highlight">흩어진 생산성 도구를 하나로 통합</div>
      <div class="vibe-card-hint">자세히 보기 →</div>
    </div>
    <div class="vibe-card" onclick="openVibeModal('hazel-ko')">
      <div class="vibe-card-emoji">🌸</div>
      <div class="vibe-card-name">Hazel</div>
      <div class="vibe-card-desc">꽃집 매출·고객·예약 관리 SaaS</div>
      <div class="vibe-card-highlight">종이 장부 → 디지털 전환</div>
      <div class="vibe-card-hint">자세히 보기 →</div>
    </div>
  </div>
</div>

<!-- Vibe Modals (KO) -->
<div class="vibe-overlay" id="vibe-overlay-hazel-ko">
  <div class="vibe-modal">
    <button class="vibe-modal-close" onclick="closeVibeModal('hazel-ko')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="section-header">
      <span class="company-name">🌸 Hazel</span>
      <span class="period"><a href="https://github.com/bbbang105/flowershop-admin" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2026.01 - 현재</span>
    </div>
    <div class="role">Full-Stack (AI Vibe Coding)</div>
    <p>친누나가 운영하는 꽃집에서 수기로 매출과 예약을 관리하는 걸 보고, 디지털 전환을 위해 직접 기획·개발한 SaaS입니다.</p>
    <div class="subsection-title">실제 꽃집 운영 문제에서 출발</div>
    <ul>
      <li>종이 장부 + 엑셀 + 카카오톡에 분산된 업무 → 매출·고객·예약·사진을 하나로 통합하는 SaaS 기획</li>
      <li>1건 주문에 여러 수령일이 있는 꽃집 특성 → <strong>1:N 멀티 픽업 예약 시스템</strong> 설계 (예: 2/14 결제, 2/14·2/20 각각 수령)</li>
    </ul>
    <div class="subsection-title">사장님이 실제로 쓸 수 있도록</div>
    <ul>
      <li>앱 설치 없이 모바일에서 바로 사용 → <strong>PWA + Bottom Navigation Bar</strong>로 네이티브 앱 경험</li>
      <li>예약 누락 방지 → <strong>Web Push 알림</strong>으로 일일/개별 예약 리마인더 자동화</li>
      <li>외상 매출을 별도로 추적할 수단이 없던 문제 → <strong>미수 매출 관리 체계</strong> 구축</li>
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
</div>

<div class="vibe-overlay" id="vibe-overlay-custing-ko">
  <div class="vibe-modal">
    <button class="vibe-modal-close" onclick="closeVibeModal('custing-ko')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="section-header">
      <span class="company-name">📝 큐스팅</span>
      <span class="period"><a href="https://github.com/bbbang105/study-admin" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2026.02 - 현재</span>
    </div>
    <div class="role">Full-Stack (AI Vibe Coding)</div>
    <p>30~35명 규모 블로그 스터디를 노션+카카오톡으로 관리하다 한계를 느끼고, Discord 봇 + 자체 웹 대시보드로 전 과정을 자동화한 플랫폼입니다.</p>
    <div class="subsection-title">수동 운영을 자동화로 전환</div>
    <ul>
      <li>매 라운드(2주) 멤버별 글 작성 여부를 수동 확인하던 문제 → <strong>RSS 5분 주기 자동 수집 → 출석 처리 → 지각/결석 벌금 자동 부과 → Discord 알림</strong></li>
      <li>참여율 저하 → 활동 점수 게이미피케이션 도입, 포디움/주간 랭킹으로 동기 부여</li>
      <li>노션 기반 멤버 관리 혼선 → 6단계 상태 기반 관리 체계 설계 (승인 대기, 활동, 휴면, OB 등)</li>
    </ul>
    <div class="subsection-title">운영하면서 필요한 기능을 직접 기획</div>
    <ul>
      <li>스터디 의사결정 수단 부재 → <strong>게시판 투표</strong> 기획, 4종(단일/복수/날짜/익명) + 익명 투표 개인정보 분리</li>
      <li>Discord만으로는 공지 전달 한계 → <strong>FCM 웹 푸시 알림</strong> 도입, 5종 알림 타입별 on/off</li>
    </ul>
    <div class="tags">
      <span class="tag">Next.js</span>
      <span class="tag">React 19</span>
      <span class="tag">TypeScript</span>
      <span class="tag">Drizzle ORM</span>
      <span class="tag">Supabase</span>
      <span class="tag">PostgreSQL</span>
      <span class="tag">discord.js</span>
      <span class="tag">pg-boss</span>
      <span class="tag">pnpm Monorepo</span>
      <span class="tag">Vercel</span>
      <span class="tag">PWA</span>
      <span class="tag">FCM</span>
      <span class="tag">Sentry</span>
      <span class="tag">Docker</span>
      <span class="tag">AI Vibe Coding</span>
    </div>
  </div>
</div>

<div class="vibe-overlay" id="vibe-overlay-forme-ko">
  <div class="vibe-modal">
    <button class="vibe-modal-close" onclick="closeVibeModal('forme-ko')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    <div class="section-header">
      <span class="company-name">🧰 ForMe</span>
      <span class="period"><a href="https://github.com/bbbang105/forme" target="_blank" class="github-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a> 2026.02 - 현재</span>
    </div>
    <div class="role">Full-Stack (AI Vibe Coding)</div>
    <p>큐레이션·캘린더·메모·유튜브 요약이 여러 앱에 흩어져 있어 하나로 통합한 개인 올인원 PWA. 직접 쓰면서 계속 확장하고 있습니다.</p>
    <div class="subsection-title">필요한 기능을 직접 구현</div>
    <ul>
      <li>유튜브 영상을 매번 전부 시청할 수 없는 문제 → RSS 수집 + <strong>Gemini 2.5 Flash</strong> 자동 요약, 영상 길이별 프롬프트 분기</li>
      <li>기존 메모/캘린더 앱의 한계 → TipTap 에디터 + 반복 일정 지원 캘린더를 직접 구현</li>
    </ul>
    <div class="tags">
      <span class="tag">Next.js</span>
      <span class="tag">React 19</span>
      <span class="tag">TypeScript</span>
      <span class="tag">Drizzle ORM</span>
      <span class="tag">Supabase</span>
      <span class="tag">PostgreSQL</span>
      <span class="tag">Cloudflare R2</span>
      <span class="tag">Vercel</span>
      <span class="tag">PWA</span>
      <span class="tag">TipTap</span>
      <span class="tag">Service Worker</span>
      <span class="tag">Gemini</span>
      <span class="tag">AI Vibe Coding</span>
    </div>
  </div>
</div>

---

## 활동

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
