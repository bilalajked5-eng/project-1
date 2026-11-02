/* =====================================================================
   QSC AUTOMOTIVE — CENTRAL RUNTIME CONFIGURATION (edit this one file)
   ---------------------------------------------------------------------
   Values marked SAMPLE are placeholders the client will replace with
   final confirmed details. NEVER put API keys or credentials here —
   this file is public. Form delivery secrets belong on the server side
   of bookingEndpoint.
   ===================================================================== */
window.QSC_CONFIG = {
  // Organization-level contact
  mainPhone: "+966599902555",

  // Booking form POST endpoint (serverless function / CRM webhook).
  // null = forms submit via WhatsApp instead (an honest, working channel).
  bookingEndpoint: null,

  // Per-workshop contact routing — SAMPLE values, client to confirm.
  workshops: {
    maintenance: {
      phone: "+966599902555",                 // SAMPLE (legacy number)
      whatsapp: "966599902555",               // SAMPLE — digits only, country code, no "+"
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Al-Buraikimah%20Street%20Al-Noor%20Al-Sulai%20Riyadh" // SAMPLE
    },
    painting: {
      phone: "+966508181801",                 // SAMPLE (legacy second number)
      whatsapp: "966508181801",               // SAMPLE
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Al-Sulai%20Industrial%20Area%20Riyadh" // SAMPLE
    }
  },

  // Analytics (GA4 via gtag or GTM). null = no tracking is loaded.
  ga4MeasurementId: null,
  gtmContainerId: null
};
