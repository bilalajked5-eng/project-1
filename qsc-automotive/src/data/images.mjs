// QSC — central image map. Currently hotlinked from the live legacy site
// (https://qscco.sa/qsc6/img/). When deploying, copy these files into
// /assets/images/ and change IMG_BASE to "/assets/images/" — nothing else.
export const IMG_BASE = "https://qscco.sa/qsc6/img/";
export const LOGO_BASE = "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/";

export const IMAGES = {
  heroSlides: ["carousel-bg-111.jpeg", "carousel-bg-333.jpeg", "carousel-bg-555.jpeg"],
  pageHero: "carousel-bg-2.jpg",
  choiceMaintenance: "carousel-bg-444.jpeg",
  choicePainting: "carousel-bg-666.jpeg",
  workshopMaintenance: "service-11.jpeg",
  workshopPainting: "service-22.jpeg",
  pillarMaintenance: "service-33.jpeg",
  pillarPainting: "service-44.jpeg",
  about: "aboutus.jpeg",
  // service-page images by branch/category
  service: {
    mechanical: "service-33.jpeg",
    electrical: "service-11.jpeg",
    chassis: "carousel-bg-444.jpeg",
    routine: "carousel-bg-111.jpeg",
    logistics: "carousel-bg-2.jpg",
    painting: "service-44.jpeg",
    bodywork: "carousel-bg-666.jpeg",
    restoration: "service-22.jpeg"
  },
  brandPage: ["carousel-bg-222.jpeg", "carousel-bg-555.jpeg", "carousel-bg-333.jpeg", "carousel-bg-111.jpeg"]
};

// car-logos-dataset ids per brand slug (text monogram fallback on load error)
export const BRAND_LOGOS = {
  "mercedes-benz": { file: "mercedes-benz", mono: "MB" },
  "bmw": { file: "bmw", mono: "BMW" },
  "porsche": { file: "porsche", mono: "P" },
  "land-rover": { file: "land-rover", mono: "LR" },
  "bentley": { file: "bentley", mono: "B" },
  "rolls-royce": { file: "rolls-royce", mono: "RR" },
  "ferrari": { file: "ferrari", mono: "F" },
  "lamborghini": { file: "lamborghini", mono: "L" },
  "maserati": { file: "maserati", mono: "M" },
  "mclaren": { file: "mclaren", mono: "McL" },
  "aston-martin": { file: "aston-martin", mono: "AM" },
  "maybach": { file: "maybach", mono: "MM" },
  "audi": { file: "audi", mono: "A" },
  "mini-cooper": { file: "mini", mono: "MINI" },
  "bugatti": { file: "bugatti", mono: "EB" },
  "pagani": { file: "pagani", mono: "PG" }
};
