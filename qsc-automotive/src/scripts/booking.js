/* QSC Automotive — booking/inquiry form behaviour (supports multiple forms per page:
   hero quick form + full booking form, class "qsc-form").
   HONESTY RULES:
   - If QSC_CONFIG.bookingEndpoint is set (https), submit by POST and show success
     ONLY on HTTP 2xx.
   - If no endpoint is configured, the form submits through WhatsApp: a prefilled
     message opens in WhatsApp to the selected workshop's number — a real, working
     channel. No fake "booking confirmed" is ever shown. */
(function () {
  "use strict";
  var forms = document.querySelectorAll("form.qsc-form");
  if (!forms.length) return;
  var CFG = window.QSC_CONFIG || {};
  var lang = document.documentElement.lang || "en";
  var isAr = lang === "ar";
  var track = window.qscTrack || function () {};

  var T = {
    sending: isAr ? "جارٍ إرسال طلبك…" : "Sending your request…",
    success: isAr
      ? "تم استلام استفسارك. هذا طلب موعد وليس حجزًا مؤكدًا — سيتواصل معك فريق الورشة للتأكيد."
      : "Inquiry received. This is an appointment request, not a confirmed reservation — the workshop team will contact you to confirm.",
    failure: isAr
      ? "تعذر إرسال الطلب. لم يُستلم استفسارك — فضلًا حاول مجددًا أو تواصل عبر الهاتف."
      : "The request could not be sent. Your inquiry was NOT received — please try again or contact us by phone.",
    waSent: isAr
      ? "فتحنا رسالة واتساب جاهزة ببياناتك — أرسلها لتصل الورشة مباشرة. هذا طلب موعد وليس حجزًا مؤكدًا."
      : "We opened a WhatsApp message prefilled with your details — send it and it reaches the workshop directly. This is an appointment request, not a confirmed reservation.",
    invalid: isAr ? "يرجى تصحيح الحقول المحددة." : "Please correct the highlighted fields.",
    required: isAr ? "هذا الحقل مطلوب." : "This field is required.",
    phoneBad: isAr ? "أدخل رقم جوال صحيحًا (مثال: ‎+9665XXXXXXXX)." : "Enter a valid mobile number (e.g. +9665XXXXXXXX)."
  };

  var connected = typeof CFG.bookingEndpoint === "string" && /^https:\/\//.test(CFG.bookingEndpoint);

  function setup(form) {
    var statusBox = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(state, msg) {
      if (!statusBox) return;
      statusBox.setAttribute("data-state", state);
      statusBox.innerHTML = '<div class="notice" role="status">' + msg + "</div>";
    }

    // Preselect from query string (?service=…&workshop=…&brand=…)
    try {
      var params = new URLSearchParams(location.search);
      ["service", "workshop", "brand"].forEach(function (name) {
        var v = params.get(name);
        var field = form.elements[name];
        if (v && field) field.value = v;
      });
    } catch (e) { /* non-blocking */ }

    // Photo validation
    var fileInput = form.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener("change", function () {
        var ok = true, maxFiles = 6, maxMB = 8;
        if (fileInput.files.length > maxFiles) ok = false;
        Array.prototype.forEach.call(fileInput.files, function (f) {
          if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(f.type)) ok = false;
          if (f.size > maxMB * 1024 * 1024) ok = false;
        });
        var fw = fileInput.closest(".field");
        if (fw) fw.classList.toggle("invalid", !ok);
        if (ok && fileInput.files.length) track("photo_upload", { count: fileInput.files.length });
      });
    }

    function setErr(field, msg) {
      if (!field) return;
      var e = field.querySelector(".error-msg");
      if (e) e.textContent = msg;
    }

    function validate() {
      var valid = true;
      form.querySelectorAll(".field.invalid, .checkline.invalid").forEach(function (f) { f.classList.remove("invalid"); });
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field") || input.closest(".checkline");
        var bad = input.type === "checkbox" ? !input.checked : !String(input.value).trim();
        if (bad) { valid = false; if (field) { field.classList.add("invalid"); setErr(field, T.required); } }
      });
      var phone = form.elements.phone;
      if (phone && phone.value.trim() && !/^\+?[0-9 ()-]{8,18}$/.test(phone.value.trim())) {
        valid = false;
        var pf = phone.closest(".field");
        if (pf) { pf.classList.add("invalid"); setErr(pf, T.phoneBad); }
      }
      return valid;
    }

    var started = false;
    form.addEventListener("input", function () {
      if (!started) {
        started = true;
        track("booking_start", { workshop: form.elements.workshop ? form.elements.workshop.value : "", form: form.getAttribute("data-form") || "booking" });
      }
    });

    function whatsappSubmit() {
      var ws = (form.elements.workshop && form.elements.workshop.value) || "maintenance";
      var cfg = (CFG.workshops && CFG.workshops[ws]) || {};
      var wa = cfg.whatsapp || (CFG.workshops && CFG.workshops.maintenance && CFG.workshops.maintenance.whatsapp);
      if (!wa) { setStatus("error", T.failure); return; }
      var g = function (n) { return form.elements[n] ? String(form.elements[n].value || "").trim() : ""; };
      var svcEl = form.elements.service;
      var svcLabel = svcEl && svcEl.selectedOptions && svcEl.selectedOptions[0] ? svcEl.selectedOptions[0].textContent.trim() : g("service");
      var lines = isAr
        ? ["مرحبًا QSC — أرغب بطلب موعد:",
           "الاسم: " + g("name"), "الجوال: " + g("phone"),
           "الورشة: " + (ws === "painting" ? "الدهان والسمكرة" : "الصيانة"),
           svcLabel ? "الخدمة: " + svcLabel : "", g("brand") ? "السيارة: " + g("brand") + (g("model") ? " — " + g("model") : "") : "",
           g("message") ? "التفاصيل: " + g("message") : "", g("preferred_date") ? "التاريخ المفضل: " + g("preferred_date") : ""]
        : ["Hello QSC — I would like to request an appointment:",
           "Name: " + g("name"), "Mobile: " + g("phone"),
           "Workshop: " + (ws === "painting" ? "Painting & Bodywork" : "Maintenance"),
           svcLabel ? "Service: " + svcLabel : "", g("brand") ? "Car: " + g("brand") + (g("model") ? " — " + g("model") : "") : "",
           g("message") ? "Details: " + g("message") : "", g("preferred_date") ? "Preferred date: " + g("preferred_date") : ""];
      var text = lines.filter(Boolean).join("\n");
      var url = "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
      track("booking_submit", { via: "whatsapp", workshop: ws, service: g("service") });
      window.open(url, "_blank", "noopener");
      setStatus("success", T.waSent);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!validate()) { setStatus("error", T.invalid); return; }

      if (!connected) { whatsappSubmit(); return; }

      if (submitBtn) submitBtn.disabled = true;
      setStatus("sending", T.sending);
      var data = new FormData(form);
      data.append("language", lang);
      data.append("source_page", location.pathname);

      fetch(CFG.bookingEndpoint, { method: "POST", body: data })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          setStatus("success", T.success);
          track("booking_submit", {
            via: "endpoint",
            workshop: form.elements.workshop ? form.elements.workshop.value : "",
            service: form.elements.service ? form.elements.service.value : ""
          });
          form.reset();
        })
        .catch(function () { setStatus("error", T.failure); })
        .finally(function () { if (submitBtn) submitBtn.disabled = false; });
    });
  }

  forms.forEach(setup);
})();
