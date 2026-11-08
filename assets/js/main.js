/* Portfolio Bahaa Letaief — interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Thème clair / sombre ---------- */
  var THEME_KEY = "bl-theme";
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* stockage indisponible */ }

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Lien actif dans la navigation ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });

    /* ---------- Apparition au défilement ---------- */
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Filtre des réalisations ---------- */
  var filters = document.querySelectorAll(".filter");
  var projects = document.querySelectorAll(".project");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      projects.forEach(function (p) {
        p.hidden = !(cat === "all" || p.getAttribute("data-cat") === cat);
        if (!p.hidden) p.classList.add("is-visible");
      });
    });
  });

  /* ---------- Terminal animé ---------- */
  var term = document.getElementById("terminal");
  var script = [
    { cmd: "whoami", out: [["h", "bahaa.letaief"], ["o", " — BTS SIO option SISR (2e année)"]] },
    { cmd: "cat poste.txt", out: [["o", "Alternant technicien systèmes & réseaux\n"], ["h", "Mairie de Saint-Clément-de-Rivière"]] },
    { cmd: "history | grep mairie", out: [["o", "02/2026 → 07/2026  stage (1re année)\n2026 → 2027        alternance (2e année)"]] },
    { cmd: "ls competences/", out: [["o", "active-directory  reseau-vlan  support-n1\ncybersecurite     glpi         powershell"]] },
    { cmd: "systemctl status motivation", out: [["ok", "● active (running)"], ["o", " since 2025"]] }
  ];

  function el(cls, text) {
    var s = document.createElement("span");
    s.className = cls;
    s.textContent = text;
    return s;
  }

  function renderStatic() {
    term.textContent = "";
    script.forEach(function (step) {
      term.appendChild(el("p", "$ "));
      term.appendChild(el("c", step.cmd + "\n"));
      step.out.forEach(function (o) { term.appendChild(el(o[0], o[1])); });
      term.appendChild(document.createTextNode("\n"));
    });
    term.appendChild(el("p", "$ "));
    term.appendChild(el("cursor", ""));
  }

  if (term) {
    if (reduceMotion) {
      renderStatic();
    } else {
      term.textContent = "";
      var cursor = el("cursor", "");
      var i = 0;

      var typeCmd = function (text, done) {
        var line = el("c", "");
        term.insertBefore(el("p", "$ "), cursor);
        term.insertBefore(line, cursor);
        var k = 0;
        (function tick() {
          if (k < text.length) {
            line.textContent += text.charAt(k++);
            setTimeout(tick, 38 + Math.random() * 40);
          } else {
            line.textContent += "\n";
            setTimeout(done, 260);
          }
        })();
      };

      var next = function () {
        if (i >= script.length) {
          term.insertBefore(el("p", "$ "), cursor);
          return;
        }
        var step = script[i++];
        typeCmd(step.cmd, function () {
          step.out.forEach(function (o) { term.insertBefore(el(o[0], o[1]), cursor); });
          term.insertBefore(document.createTextNode("\n"), cursor);
          setTimeout(next, 520);
        });
      };

      term.appendChild(cursor);
      setTimeout(next, 500);
    }
  }

  /* ---------- Année du footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
