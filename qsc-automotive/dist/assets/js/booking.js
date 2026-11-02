/* QSC Automotive — booking form behaviour.
   HONESTY RULE: if window.QSC_CONFIG.bookingEndpoint is null, the form shows an
   "integration pending" state and NEVER reports fake success. Real success is
   only shown after the configured endpoint returns HTTP 2xx. */
(function () {
  "use strict";
  var form = document.getElementById("booking-form");
  if (!form) return;
  var CFG = window.QSC_CONFIG || {};
  var lang = document.documentElement.lang || "en";
  var isAr = lang === "ar";
  var statusBox = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var track = window.qscTrack || function () {};

  var T = {
    pending: isAr
      ? "ربط إرسال النموذج قيد التجهيز: بياناتك تُدقَّق لكنها لا تُرسل إلكترونيًا بعد. للتواصل اليوم استخدم الاتصال الهاتفي أو واتساب أدناه."
      : "Form delivery is not connected yet: your details are validated but cannot be transmitted online. To reach the team today, please use the phone or WhatsApp options below.",
    sending: isAr ? "جارٍ إرسال طلبك…" : "Sending your request…",
    success: isAr
      ? "تم استلام استفسارك. هذا طلب موعد وليس حجزًا مؤكدًا — سيتواصل معك فريق الورشة للتأكيد."
      : "Inquiry received. This is an appointment request, not a confirmed reservation — the workshop team will contact you to confirm.",
    failure: isAr
      ? "تعذر إرسال الطلب. لم يُستلم استفسارك — فضلًا حاول مجددًا أو تواصل عبر الهاتف."
      : "The request could not be sent. Your inquiry was NOT received — please try again or contact us by phone.",
    invalid: isAr ? "يرجى تصحيح الحقول المحددة." : "Please correct the highlighted fields.",
    required: isAr ? "هذا الحقل مطلوب." : "This field is required.",
    phoneBad: isAr ? "أدخل رقم جوال صحيحًا (مثال: ‎+9665XXXXXXXX)." : "Enter a valid mobile number (e.g. +9665XXXXXXXX)."
  };

  function setStatus(state, msg) {
    statusBox.setAttribute("data-state", state);
    statusBox.innerHTML = '<div class="notice" role="status">' + msg + "</div>";
  }

  // 1) Integration state
  var connected = typeof CFG.bookingEndpoint === "string" && /^https:\/\//.test(CFG.bookingEndpoint);
  if (!connected) {
    setStatus("pending", T.pending);
    statusBox.querySelector(".notice").classList.add("notice--muted");
  }

  // 2) Preselect from query string (?service=…&workshop=…&brand=…)
  try {
    var params = new URLSearchParams(location.search);
    ["service", "workshop", "brand"].forEach(function (name) {
      var v = params.get(name);
      var field = form.elements[name];
      if (v && field) field.value = v;
    });
  } catch (e) { /* non-blocking */ }

  // 3) Photo upload affordance (painting) — files are validated client-side only;
  //    they are transmitted exclusively when a real endpoint accepts multipart data.
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
      fw.classList.toggle("invalid", !ok);
      if (ok && fileInput.files.length) track("photo_upload", { count: fileInput.files.length });
    });
  }

  // 4) Validation
  function validate() {
    var valid = true;
    form.querySelectorAll(".field.invalid").forEach(function (f) { f.classList.remove("invalid"); });
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field") || input.closest(".checkline");
      var bad = input.type === "checkbox" ? !input.checked : !String(input.value).trim();
      if (bad) { valid = false; if (field && field.classList) field.classList.add("invalid"); setErr(field, T.required); }
    });
    var phone = form.elements.phone;
    if (phone && phone.value.trim() && !/^\+?[0-9 ()-]{8,18}$/.test(phone.value.trim())) {
      valid = false;
      var pf = phone.closest(".field");
      pf.classList.add("invalid"); setErr(pf, T.phoneBad);
    }
    return valid;
  }
  function setErr(field, msg) {
    if (!field) return;
    var e = field.querySelector(".error-msg");
    if (e) e.textContent = msg;
  }

  var started = false;
  form.addEventListener("input", function () {
    if (!started) { started = true; track("booking_start", { workshop: form.elements.workshop ? form.elements.workshop.value : "" }); }
  });

  // 5) Submit
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validate()) { setStatus("error", T.invalid); return; }

    if (!connected) {
      // Never fake success. Restate the honest pending state.
      setStatus("pending", T.pending);
      statusBox.querySelector(".notice").classList.add("notice--muted");
      statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    submitBtn.disabled = true;
    setStatus("sending", T.sending);
    var data = new FormData(form);
    data.append("language", lang);
    data.append("source_page", location.pathname);

    fetch(CFG.bookingEndpoint, { method: "POST", body: data })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        setStatus("success", T.success);
        track("booking_submit", {
          workshop: form.elements.workshop ? form.elements.workshop.value : "",
          service: form.elements.service ? form.elements.service.value : ""
        });
        form.reset();
      })
      .catch(function () { setStatus("error", T.failure); })
      .finally(function () { submitBtn.disabled = false; });
  });
})();
