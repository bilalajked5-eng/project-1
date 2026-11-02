/* =====================================================================
   QSC AUTOMOTIVE — CENTRAL RUNTIME CONFIGURATION (edit this one file)
   ---------------------------------------------------------------------
   Every value below that is null is PENDING CLIENT CONFIRMATION.
   The site renders an honest "pending" state until a real value is set.
   NEVER put API keys or credentials here — this file is public.
   Form delivery secrets belong on the server side of bookingEndpoint.
   ===================================================================== */
window.QSC_CONFIG = {
  // Organization-level contact (legacy site value; approved to display as main line)
  mainPhone: "+966599902555",

  // Booking form POST endpoint (serverless function / CRM webhook).
  // null = form shows "integration pending" and never fakes success.
  bookingEndpoint: null,

  // Per-workshop contact routing. null = pending; UI falls back to mainPhone
  // with an explicit "branch line pending confirmation" label.
  workshops: {
    maintenance: {
      phone: null,        // e.g. "+9665XXXXXXXX"
      whatsapp: null,     // digits only, country code, no "+" e.g. "9665XXXXXXXX"
      mapUrl: null        // confirmed Google Maps share link for THIS branch only
    },
    painting: {
      phone: null,
      whatsapp: null,
      mapUrl: null
    }
  },

  // Analytics (GA4 via gtag or GTM). null = no tracking is loaded.
  ga4MeasurementId: null,
  gtmContainerId: null
};
