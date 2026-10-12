import type { L, MediaSlot } from './types'

/**
 * Portfolio.
 *
 * Only facts published on projects-world.com are stated. Fields the current
 * site does not give are left out of the page (not paraphrased into vague
 * copy) and listed under `needs` so the team can supply them.
 *
 * Gallery slots render art-directed compositions until real project
 * photography is added. They are never filled with stock photos, which
 * could be mistaken for client work.
 */

export type ProjectCategory = 'office' | 'residential' | 'hospitality' | 'visualisation'

export const categoryLabels: Record<ProjectCategory, L> = {
  office: { en: 'Office & Commercial', ar: 'مكاتب ومساحات تجارية' },
  residential: { en: 'Residential', ar: 'سكني' },
  hospitality: { en: 'Hospitality', ar: 'ضيافة' },
  visualisation: { en: 'Interior & 3D Visualisation', ar: 'تصميم داخلي وتصور ثلاثي الأبعاد' },
}

export interface Project {
  slug: string
  title: L
  category: ProjectCategory
  location?: L
  year?: string
  style?: L
  /** One-line summary for cards. */
  summary: L
  overview?: L[]
  direction?: L
  scope: L[]
  features?: L[]
  cover: MediaSlot
  gallery: MediaSlot[]
  services: string[]
  /** Featured on the homepage, in this order. */
  featured?: number
  needs?: string[]
}

export const projects: Project[] = [
  {
    slug: 'ecza',
    title: { en: 'ECZA', ar: 'ECZA' },
    category: 'office',
    location: { en: 'Tamkeen Tower, Riyadh', ar: 'برج تمكين، الرياض' },
    year: '2025',
    style: { en: 'Luxury modern', ar: 'عصري فاخر' },
    summary: {
      en: 'Office furniture selected, imported from Italy and installed in Tamkeen Tower.',
      ar: 'أثاث مكتبي اختير واستُورد من إيطاليا ورُكّب في برج تمكين.',
    },
    overview: [
      {
        en: 'ECZA’s offices occupy space in Tamkeen Tower, one of Riyadh’s business addresses. Projects World was responsible for selecting the furniture, importing it and installing it on site.',
        ar: 'تقع مكاتب ECZA في برج تمكين، أحد عناوين الأعمال في الرياض. وتولّت بروجكتس وورلد اختيار الأثاث واستيراده وتركيبه في الموقع.',
      },
    ],
    direction: {
      en: 'A luxury modern direction, with furniture imported from Italy.',
      ar: 'اتجاه عصري فاخر، بأثاث مستورد من إيطاليا.',
    },
    scope: [
      { en: 'Furniture selection', ar: 'اختيار الأثاث' },
      { en: 'Importing', ar: 'الاستيراد' },
      { en: 'Installation', ar: 'التركيب' },
    ],
    features: [{ en: 'Furniture imported from Italy', ar: 'أثاث مستورد من إيطاليا' }],
    cover: {
      art: 'office',
      tone: 'charcoal',
      alt: { en: 'ECZA office interior, Tamkeen Tower', ar: 'مكاتب ECZA الداخلية، برج تمكين' },
    },
    gallery: [
      { art: 'office', tone: 'stone', alt: { en: 'ECZA meeting area', ar: 'منطقة الاجتماعات في ECZA' } },
      { art: 'chair', tone: 'ivory', alt: { en: 'Executive seating detail', ar: 'تفصيل مقاعد تنفيذية' } },
      { art: 'materials', tone: 'stone', alt: { en: 'Finish and material detail', ar: 'تفصيل المواد والتشطيبات' } },
    ],
    services: ['office-furnishing-fit-out-solutions', 'project-furniture-design-supply'],
    featured: 1,
    needs: ['ECZA project photography', 'Brands and furniture lines used, if they can be published'],
  },
  {
    slug: 'almousa-offices',
    title: { en: 'Almousa Offices', ar: 'مكاتب الموسى' },
    category: 'office',
    summary: {
      en: 'Office furnishing for Almousa.',
      ar: 'تأثيث مكاتب الموسى.',
    },
    scope: [{ en: 'Office furnishing', ar: 'تأثيث المكاتب' }],
    cover: {
      art: 'office',
      tone: 'stone',
      alt: { en: 'Almousa offices interior', ar: 'مكاتب الموسى من الداخل' },
    },
    gallery: [
      { art: 'plan', tone: 'ivory', alt: { en: 'Almousa office layout', ar: 'مخطط مكاتب الموسى' } },
      { art: 'chair', tone: 'stone', alt: { en: 'Almousa office seating', ar: 'مقاعد مكاتب الموسى' } },
    ],
    services: ['office-furnishing-fit-out-solutions'],
    featured: 2,
    needs: [
      'Almousa project location, year, scope of services and design direction',
      'Almousa project photography',
      'Client approval to publish',
    ],
  },
  {
    slug: 'nesma-infrastructure-technology',
    title: { en: 'Nesma Infrastructure & Technology', ar: 'نسما للبنية التحتية والتقنية' },
    category: 'office',
    summary: {
      en: 'Office spaces furnished for Nesma Infrastructure & Technology.',
      ar: 'مساحات مكتبية مؤثثة لشركة نسما للبنية التحتية والتقنية.',
    },
    overview: [
      {
        en: 'Projects World’s company profile lists Nesma Infrastructure & Technology Co. among the office spaces it has furnished. The current portfolio also lists a Nesma headquarters project.',
        ar: 'يذكر الملف التعريفي لبروجكتس وورلد شركة نسما للبنية التحتية والتقنية ضمن المساحات المكتبية التي أثّثتها، كما تتضمن قائمة المشاريع الحالية مشروع المقر الرئيسي لنسما.',
      },
    ],
    scope: [{ en: 'Office furnishing', ar: 'تأثيث المكاتب' }],
    cover: {
      art: 'colonnade',
      tone: 'charcoal',
      alt: { en: 'Nesma Infrastructure & Technology offices', ar: 'مكاتب نسما للبنية التحتية والتقنية' },
    },
    gallery: [
      { art: 'office', tone: 'ivory', alt: { en: 'Nesma workspace', ar: 'بيئة العمل في نسما' } },
      { art: 'materials', tone: 'stone', alt: { en: 'Nesma finishes', ar: 'تشطيبات نسما' } },
    ],
    services: ['office-furnishing-fit-out-solutions'],
    featured: 3,
    needs: ['Nesma project location, year, scope and photography', 'Confirm whether this page should cover the Nesma headquarters project'],
  },
  {
    slug: 'private-palace-2',
    title: { en: 'Private Palace', ar: 'قصر خاص' },
    category: 'residential',
    location: { en: 'Jeddah', ar: 'جدة' },
    year: '2019',
    style: { en: 'Luxury classical', ar: 'كلاسيكي فاخر' },
    summary: {
      en: 'Classical furniture from Italian brands, supplied and installed in a private palace in Jeddah.',
      ar: 'أثاث كلاسيكي من علامات إيطالية، ورِّد ورُكّب في قصر خاص بجدة.',
    },
    overview: [
      {
        en: 'A private palace in Jeddah furnished in a luxury classical style. Projects World supplied and installed the furniture, most of it imported from different Italian brands and selected to suit the palace interiors.',
        ar: 'قصر خاص في جدة أُثّث بطابع كلاسيكي فاخر. ورّدت بروجكتس وورلد الأثاث وركّبته، ومعظمه مستورد من علامات إيطالية مختلفة واختير ليناسب التصميم الداخلي للقصر.',
      },
    ],
    direction: {
      en: 'Luxury classical furniture chosen to match the existing interior architecture.',
      ar: 'أثاث كلاسيكي فاخر اختير ليتناغم مع العمارة الداخلية القائمة.',
    },
    scope: [
      { en: 'Furniture supply', ar: 'توريد الأثاث' },
      { en: 'Installation', ar: 'التركيب' },
    ],
    features: [{ en: 'Classical furniture from Italian brands', ar: 'أثاث كلاسيكي من علامات إيطالية' }],
    cover: {
      art: 'dining',
      tone: 'stone',
      alt: { en: 'Private palace dining hall, Jeddah', ar: 'قاعة الطعام في القصر الخاص، جدة' },
    },
    gallery: [
      { art: 'colonnade', tone: 'ivory', alt: { en: 'Palace reception hall', ar: 'قاعة الاستقبال في القصر' } },
      { art: 'sofa', tone: 'stone', alt: { en: 'Palace majlis seating', ar: 'مقاعد المجلس في القصر' } },
      { art: 'chair', tone: 'bronze', alt: { en: 'Classical armchair detail', ar: 'تفصيل كرسي كلاسيكي' } },
    ],
    services: ['residential-interior-design-furnishing', 'project-furniture-design-supply'],
    featured: 4,
    needs: ['Palace project photography (with the owner’s approval)'],
  },
  {
    slug: 'private-residential-project-5',
    title: { en: 'Private Residence', ar: 'مسكن خاص' },
    category: 'residential',
    year: '2019',
    summary: {
      en: 'Concept design, furniture layout, selection and supply for a private home.',
      ar: 'تصميم مبدئي وتوزيع الأثاث واختياره وتوريده لمسكن خاص.',
    },
    overview: [
      {
        en: 'A private residence where Projects World took the furnishing from first concept through to supply, with pieces sourced from European suppliers.',
        ar: 'مسكن خاص تولّت فيه بروجكتس وورلد التأثيث من الفكرة الأولى حتى التوريد، بقطع من موردين أوروبيين.',
      },
    ],
    scope: [
      { en: 'Concept design', ar: 'التصميم المبدئي' },
      { en: 'Furniture layout', ar: 'توزيع الأثاث' },
      { en: 'Selection and supply', ar: 'الاختيار والتوريد' },
    ],
    features: [{ en: 'Furniture from European suppliers', ar: 'أثاث من موردين أوروبيين' }],
    cover: {
      art: 'sofa',
      tone: 'ivory',
      alt: { en: 'Private residence living room', ar: 'غرفة المعيشة في المسكن الخاص' },
    },
    gallery: [
      { art: 'plan', tone: 'stone', alt: { en: 'Furniture layout for the residence', ar: 'مخطط توزيع الأثاث للمسكن' } },
      { art: 'lounge', tone: 'ivory', alt: { en: 'Residence lounge', ar: 'صالة المسكن' } },
    ],
    services: ['residential-interior-design-furnishing', 'interior-design-furnishing'],
    featured: 5,
    needs: ['Residence location (city) and photography'],
  },
  {
    slug: 'visualisation',
    title: { en: 'Private Interiors & 3D Visualisation', ar: 'تصاميم داخلية خاصة وتصورات ثلاثية الأبعاد' },
    category: 'visualisation',
    summary: {
      en: 'Design studies and 3D renders prepared for private clients before furniture is ordered.',
      ar: 'دراسات تصميم وتصورات ثلاثية الأبعاد تُعدّ للعملاء قبل طلب الأثاث.',
    },
    overview: [
      {
        en: 'Mood boards and 3D renders are part of how we work: clients see and revise a design before production. This collection gathers visualisation work for private interiors.',
        ar: 'لوحات الإلهام والتصورات ثلاثية الأبعاد جزء من طريقة عملنا؛ إذ يرى العميل التصميم ويعدّله قبل الإنتاج. تجمع هذه الصفحة أعمال التصور للمساحات الخاصة.',
      },
    ],
    scope: [
      { en: 'Mood boards', ar: 'لوحات الإلهام' },
      { en: '3D renders', ar: 'تصورات ثلاثية الأبعاد' },
      { en: 'Furniture layout', ar: 'توزيع الأثاث' },
    ],
    cover: {
      art: 'lounge',
      tone: 'bronze',
      alt: { en: '3D visualisation of a private lounge', ar: 'تصور ثلاثي الأبعاد لصالة خاصة' },
    },
    gallery: [
      { art: 'plan', tone: 'ivory', alt: { en: 'Layout study', ar: 'دراسة توزيع' } },
      { art: 'hotel', tone: 'stone', alt: { en: 'Bedroom visualisation', ar: 'تصور غرفة نوم' } },
    ],
    services: ['interior-design-furnishing'],
    featured: 6,
    needs: ['Selected 3D renders from the current gallery, labelled as visualisations'],
  },
]

/**
 * Further clients and projects named on the current portfolio pages, shown as
 * a reference list. They get dedicated pages once details are supplied.
 * Private villas named after families are deliberately not listed.
 */
export const projectRoster: L[] = [
  { en: 'Diriyah Gate project', ar: 'مشروع بوابة الدرعية' },
  { en: 'International Equestrian Resort SPA', ar: 'سبا المنتجع الدولي للفروسية' },
  { en: 'Saudi Commission for Health headquarters', ar: 'المقر الرئيسي للهيئة السعودية للتخصصات الصحية' },
  { en: 'Nesma Headquarters', ar: 'المقر الرئيسي لنسما' },
  { en: 'Saudi Hollandi Bank', ar: 'البنك السعودي الهولندي' },
  { en: 'Alawwal Bank', ar: 'البنك الأول' },
  { en: 'Al Taawun Headquarters', ar: 'المقر الرئيسي للتعاون' },
  { en: 'The Business Gate', ar: 'بوابة الأعمال' },
  { en: 'Nayyara – Gleam', ar: 'نيّرة – جليم' },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0))
