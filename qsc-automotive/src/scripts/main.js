/* QSC Automotive — navigation, contact wiring and analytics hooks (no dependencies). */
(function () {
  "use strict";
  var CFG = window.QSC_CONFIG || {};
  var lang = document.documentElement.lang || "en";
  var pageType = document.body.getAttribute("data-page-type") || "page";

  /* ---------- Analytics data layer (no personal data is ever pushed) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, extra) {
    var payload = { event: event, language: lang, page_type: pageType };
    if (extra) for (var k in extra) payload[k] = extra[k];
    window.dataLayer.push(payload);
  }
  window.qscTrack = track;

  // Load GA4/GTM only when real IDs are configured.
  if (CFG.gtmContainerId) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", CFG.gtmContainerId);
  } else if (CFG.ga4MeasurementId) {
    var g = document.createElement("script");
    g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.ga4MeasurementId;
    document.head.appendChild(g);
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CFG.ga4MeasurementId);
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav-main");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Contact wiring from central config ----------
     Elements opt in with data attributes:
       data-contact="phone|whatsapp|map" data-workshop="maintenance|painting|org"
     Pending values get an honest fallback, never an invented number. */
  function workshopCfg(id) {
    return (CFG.workshops && CFG.workshops[id]) || {};
  }
  var PENDING = {
    phoneLabel: { en: "Main line (branch line pending): ", ar: "الرقم الرئيسي (رقم الفرع قيد التأكيد): " },
    waPending: { en: "WhatsApp line pending activation — please call instead", ar: "واتساب قيد التفعيل — فضلًا اتصل بنا" },
    mapPending: { en: "Map location pending confirmation", ar: "موقع الخريطة قيد التأكيد" }
  };
  function t(obj) { return obj[lang === "ar" ? "ar" : "en"]; }

  document.querySelectorAll("[data-contact]").forEach(function (el) {
    var kind = el.getAttribute("data-contact");
    var ws = el.getAttribute("data-workshop") || "org";
    var cfg = ws === "org" ? {} : workshopCfg(ws);
    var service = el.getAttribute("data-service") || "";
    var brand = el.getAttribute("data-brand") || "";

    if (kind === "phone") {
      var phone = cfg.phone || CFG.mainPhone;
      if (!phone) { el.setAttribute("aria-disabled", "true"); el.removeAttribute("href"); return; }
      el.setAttribute("href", "tel:" + phone);
      if (!cfg.phone && ws !== "org") el.setAttribute("title", t(PENDING.phoneLabel) + phone);
      el.addEventListener("click", function () { track("phone_click", { workshop: ws, service: service }); });
    }

    if (kind === "whatsapp") {
      var wa = cfg.whatsapp;
      if (!wa) {
        // Honest pending state: no invented number, no fake link.
        el.setAttribute("aria-disabled", "true");
        el.classList.add("btn--ghost");
        el.classList.remove("btn--primary", "btn--dark");
        el.removeAttribute("href");
        el.textContent = t(PENDING.waPending);
        return;
      }
      var msgEn = "Hello QSC — I would like to book: " + (service || "a service") + (brand ? " for my " + brand : "") + " (" + ws + " workshop).";
      var msgAr = "مرحبًا QSC — أرغب بحجز: " + (service || "خدمة") + (brand ? " لسيارتي " + brand : "") + " (ورشة " + (ws === "painting" ? "الدهان" : "الصيانة") + ").";
      el.setAttribute("href", "https://wa.me/" + wa + "?text=" + encodeURIComponent(lang === "ar" ? msgAr : msgEn));
      el.setAttribute("rel", "noopener");
      el.setAttribute("target", "_blank");
      el.addEventListener("click", function () { track("whatsapp_click", { workshop: ws, service: service }); });
    }

    if (kind === "map") {
      var mapUrl = cfg.mapUrl;
      if (!mapUrl) {
        el.setAttribute("aria-disabled", "true");
        el.removeAttribute("href");
        el.textContent = t(PENDING.mapPending);
        return;
      }
      el.setAttribute("href", mapUrl);
      el.setAttribute("rel", "noopener");
      el.setAttribute("target", "_blank");
      el.addEventListener("click", function () { track("map_directions_click", { workshop: ws }); });
    }
  });

  /* ---------- Generic select tracking on directory pages ---------- */
  document.querySelectorAll("[data-track-service]").forEach(function (el) {
    el.addEventListener("click", function () {
      track("service_select", { service: el.getAttribute("data-track-service") });
    });
  });
  document.querySelectorAll("[data-track-workshop]").forEach(function (el) {
    el.addEventListener("click", function () {
      track("workshop_select", { workshop: el.getAttribute("data-track-workshop") });
    });
  });
})();

/* ---------- Hero background slideshow ---------- */
(function () {
  "use strict";
  var slides = document.querySelectorAll(".hero-slides .hero-slide");
  if (slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var i = 0;
  setInterval(function () {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 7000);
})();
