function switchLang(lang) {
  document.querySelectorAll(".lang-content").forEach(function(el) { el.classList.remove("active") });
  document.querySelectorAll(".lang-btn").forEach(function(el) { el.classList.remove("active") });
  document.getElementById("content-" + lang).classList.add("active");
  var btn = document.querySelector(".lang-btn[onclick*=" + lang + "]");
  if (btn) btn.classList.add("active");
  localStorage.setItem("preferredLang", lang);
  updateToc(lang);
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
  document.body.style.overflow = "hidden";
}

function closeContact() {
  document.getElementById("contact-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("click", function(e) {
  if (e.target === document.getElementById("contact-overlay")) closeContact();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeContact();
});

function initLang() {
  var saved = localStorage.getItem("preferredLang") || "en";
  switchLang(saved);
}

document.addEventListener("DOMContentLoaded", initLang);
document.addEventListener("nav", initLang);
if (document.readyState !== "loading") initLang();
