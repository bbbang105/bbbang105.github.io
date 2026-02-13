var _scrollObserver = null;

function switchLang(lang) {
  document.querySelectorAll(".lang-content").forEach(function(el) { el.classList.remove("active") });
  document.querySelectorAll(".lang-btn").forEach(function(el) { el.classList.remove("active") });
  document.getElementById("content-" + lang).classList.add("active");
  var btn = document.querySelector(".lang-btn[onclick*=" + lang + "]");
  if (btn) btn.classList.add("active");
  localStorage.setItem("preferredLang", lang);
  updateToc(lang);
  initScrollAnimations();
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
  var saved = localStorage.getItem("preferredLang") || "en";
  switchLang(saved);
}

function initPage() {
  // SPA 네비게이션 후 DOM이 완전히 갱신된 뒤 실행
  requestAnimationFrame(function() {
    initLang();
    initScrollAnimations();
  });
}

document.addEventListener("DOMContentLoaded", initPage);
document.addEventListener("nav", initPage);
if (document.readyState !== "loading") initPage();
