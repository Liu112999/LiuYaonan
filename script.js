/* =========================================================
   Ruoyu Chen — Academic site
   Shared interactions: language, nav, reveal
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Language ---------- */
  var STORE_KEY = "rc_lang";

  function getLang() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      if (v === "en" || v === "zh") return v;
    } catch (e) {}
    return document.documentElement.getAttribute("lang") || "en";
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "zh") lang = "en";
    document.documentElement.setAttribute("lang", lang);
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    // toggle button states
    var btns = document.querySelectorAll(".lang-toggle button");
    btns.forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-set-lang") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
    // swap any element's title/aria text holders if present
    var titleEl = document.querySelector("title");
    if (titleEl) {
      var t = titleEl.getAttribute("data-" + lang);
      if (t) titleEl.textContent = t;
    }
  }

  /* ---------- Nav: sticky + mobile ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("scrolled", window.scrollY > 40);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    var burger = document.querySelector(".nav-burger");
    var mobile = document.querySelector(".nav-mobile");
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        var open = mobile.classList.toggle("open");
        burger.classList.toggle("open", open);
        document.body.classList.toggle("menu-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          mobile.classList.remove("open");
          burger.classList.remove("open");
          document.body.classList.remove("menu-open");
        });
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Bind language toggle buttons ---------- */
  function initLangToggle() {
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-set-lang"));
      });
    });
  }

  /* ---------- Init ---------- */
  setLang(getLang());
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initNav(); initReveal(); initLangToggle(); setLang(getLang());
    });
  } else {
    initNav(); initReveal(); initLangToggle(); setLang(getLang());
  }
})();
