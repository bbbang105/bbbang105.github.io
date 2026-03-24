var _scrollObserver = null;
var _countUpObserver = null;

// ========================================
// Tag 카테고리 매핑
// ========================================
var TAG_CATEGORIES = {
  // Language
  "Java": "language", "Python": "language", "TypeScript": "language", "JavaScript": "language",
  // Framework
  "Spring Boot": "framework", "Spring Batch": "framework", "Spring Security": "framework",
  "Next.js": "framework", "React": "framework", "React 19": "framework", "FastAPI": "framework",
  "shadcn/ui": "framework", "Zod": "framework", "QueryDSL": "framework", "MyBatis": "framework",
  "Next.js 16": "framework",
  // Infra
  "AWS": "infra", "Docker": "infra", "Docker Swarm": "infra", "Vercel": "infra",
  "GitHub Actions": "infra", "GitLab CI": "infra", "Nginx": "infra", "Linux": "infra",
  "Cloudflare R2": "infra", "PWA": "infra", "Web Push": "infra", "Asterisk": "infra",
  // AI
  "LLM": "ai", "RAG": "ai", "AI Vibe Coding": "ai", "LiteLLM": "ai", "Qdrant": "ai",
  // Database
  "MySQL": "database", "PostgreSQL": "database", "Supabase": "database",
  // Infra (monitoring)
  "Datadog": "infra", "Sentry": "infra",
};

var CATEGORY_ORDER = ["language", "framework", "database", "infra", "ai", "tool"];

function colorizeTags() {
  document.querySelectorAll(".tags").forEach(function(container) {
    if (container.classList.contains("tags-sorted")) return;

    var tags = Array.from(container.querySelectorAll(".tag"));
    if (tags.length === 0) return;

    // 카테고리 속성 부여
    tags.forEach(function(tag) {
      var text = tag.textContent.trim();
      var category = TAG_CATEGORIES[text];
      if (category) {
        tag.setAttribute("data-category", category);
      }
    });

    // 같은 카테고리끼리 묶어서 정렬
    tags.sort(function(a, b) {
      var catA = CATEGORY_ORDER.indexOf(a.getAttribute("data-category") || "");
      var catB = CATEGORY_ORDER.indexOf(b.getAttribute("data-category") || "");
      if (catA === -1) catA = 99;
      if (catB === -1) catB = 99;
      return catA - catB;
    });

    // DOM 재정렬
    tags.forEach(function(tag) {
      container.appendChild(tag);
    });

    container.classList.add("tags-sorted");
  });
}

// ========================================
// Stagger delay 할당
// ========================================
function assignStaggerDelays() {
  // 각 섹션(h2) 아래의 카드들에 순차적 delay
  var sections = document.querySelectorAll(".lang-content.active");
  sections.forEach(function(section) {
    var cards = section.querySelectorAll(".scroll-fade-in");
    var currentGroup = [];
    var lastH2 = null;

    cards.forEach(function(card, i) {
      // 같은 섹션 내에서 순차 delay
      var prev = card.previousElementSibling;
      var isNewSection = false;
      var el = card;
      while (el && el.previousElementSibling) {
        el = el.previousElementSibling;
        if (el.tagName === "HR") { isNewSection = true; break; }
        if (el.classList && el.classList.contains("scroll-fade-in")) break;
      }

      if (isNewSection) currentGroup = [];
      currentGroup.push(card);
      var delay = (currentGroup.length - 1) * 0.08;
      card.style.setProperty("--stagger-delay", delay + "s");
    });
  });
}

// ========================================
// Count-up 애니메이션
// ========================================
function initCountUp() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (_countUpObserver) {
    _countUpObserver.disconnect();
    _countUpObserver = null;
  }

  _countUpObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        _countUpObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // .metrics 내 숫자 찾기
  document.querySelectorAll(".metrics").forEach(function(el) {
    _countUpObserver.observe(el);
  });
}

function animateCountUp(el) {
  var text = el.textContent;
  // 숫자 추출 (쉼표 포함)
  var match = text.match(/([\d,]+)/);
  if (!match) return;

  var numStr = match[1];
  var target = parseInt(numStr.replace(/,/g, ""), 10);
  if (isNaN(target) || target === 0) return;

  var duration = 1200;
  var start = performance.now();
  var prefix = text.substring(0, text.indexOf(numStr));
  var suffix = text.substring(text.indexOf(numStr) + numStr.length);

  function frame(now) {
    var progress = Math.min((now - start) / duration, 1);
    // easeOutExpo
    var eased = 1 - Math.pow(2, -10 * progress);
    var current = Math.round(target * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

// ========================================
// 기존 기능
// ========================================
function switchLang(lang) {
  document.querySelectorAll(".lang-content").forEach(function(el) { el.classList.remove("active") });
  document.querySelectorAll(".lang-btn").forEach(function(el) { el.classList.remove("active") });
  document.getElementById("content-" + lang).classList.add("active");
  var btn = document.querySelector(".lang-btn[onclick*=" + lang + "]");
  if (btn) btn.classList.add("active");
  localStorage.setItem("preferredLang", lang);
  updateToc(lang);
  initScrollAnimations();
  colorizeTags();
  assignStaggerDelays();
  initCountUp();
}

function updateToc(lang) {
  var toc = document.querySelector(".toc");
  if (!toc) return;
  var activeDiv = document.getElementById("content-" + lang);
  if (!activeDiv) return;
  toc.querySelectorAll("li").forEach(function(item) {
    var link = item.querySelector("a");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href) return;
    var id = href.replace("#", "");
    var target = document.getElementById(id);
    item.style.display = (target && activeDiv.contains(target)) ? "" : "none";
  });
}

function openContact() {
  document.getElementById("contact-overlay").classList.add("active");
  document.body.classList.add("modal-open");
}

function closeContact() {
  document.getElementById("contact-overlay").classList.remove("active");
  document.body.classList.remove("modal-open");
}

document.addEventListener("click", function(e) {
  if (e.target === document.getElementById("contact-overlay")) closeContact();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeContact();
});

function initScrollAnimations() {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.querySelectorAll(".scroll-fade-in").forEach(function(el) {
      el.classList.add("visible");
    });
    return;
  }

  // Cleanup previous observer
  if (_scrollObserver) {
    _scrollObserver.disconnect();
    _scrollObserver = null;
  }

  _scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        _scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll(".scroll-fade-in").forEach(function(el) {
    if (!el.classList.contains("visible")) {
      // SPA 네비게이션 시 이미 뷰포트에 있는 요소는 즉시 표시
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("visible");
      } else {
        _scrollObserver.observe(el);
      }
    }
  });
}

function initLang() {
  var saved = localStorage.getItem("preferredLang") || "ko";
  switchLang(saved);
}

// ========================================
// 타임라인 래핑 (Career, Projects)
// ========================================
function initTimeline() {
  var timelineSections = ["career", "경력", "projects", "프로젝트"];

  timelineSections.forEach(function(sectionId) {
    var h2 = document.getElementById(sectionId);
    if (!h2) return;

    // 이미 래핑된 경우 스킵
    var next = h2.nextElementSibling;
    if (next && next.classList.contains("timeline-section")) return;

    // h2 다음의 연속된 .section-card들을 수집
    var cards = [];
    var el = h2.nextElementSibling;
    while (el && !el.matches("hr") && !el.matches("h2")) {
      if (el.classList.contains("section-card")) {
        cards.push(el);
      }
      el = el.nextElementSibling;
    }

    if (cards.length < 2) return; // 카드 1개면 타임라인 불필요

    // wrapper 생성
    var wrapper = document.createElement("div");
    wrapper.className = "timeline-section";
    wrapper.setAttribute("data-section", sectionId);

    // 첫 번째 카드 앞에 wrapper 삽입
    cards[0].parentNode.insertBefore(wrapper, cards[0]);

    // 카드들을 wrapper 안으로 이동
    cards.forEach(function(card) {
      wrapper.appendChild(card);
    });
  });
}

// ========================================
// 성과 숫자 하이라이트
// ========================================
function highlightStats() {
  document.querySelectorAll(".section-card li strong").forEach(function(el) {
    var text = el.textContent;
    // 퍼센트, 시간(s), 비용($, ₩), 화살표(→) 포함된 성과 수치
    if (/(\d+%|\d+\.\d+s|→|\$[\d,]+|₩[\d,]+|배|reduction|faster)/.test(text)) {
      el.classList.add("stat-highlight");
    }
  });
}

function initPage() {
  // SPA 네비게이션 후 DOM이 완전히 갱신된 뒤 실행
  requestAnimationFrame(function() {
    initTimeline();
    initLang();
    initScrollAnimations();
    colorizeTags();
    assignStaggerDelays();
    initCountUp();
    highlightStats();
  });
}

document.addEventListener("DOMContentLoaded", initPage);
document.addEventListener("nav", initPage);
if (document.readyState !== "loading") initPage();
