import type { L, MediaSlot } from './types'
import { stock } from './stock'

/**
 * Services and sectors.
 *
 * Copy is built from what projects-world.com already states on its service,
 * process and profile pages. Where a page needs a fact the current site does
 * not give, the entry carries a `needs` note instead of invented detail;
 * those notes surface as visible markers in development builds only.
 *
 * Each entry picks its own `layout` so service pages do not share one
 * skeleton with swapped words.
 */

export interface ServiceBlock {
  title: L
  text: L
}

export interface Faq {
  q: L
  a: L
}

export interface Service {
  slug: string
  kind: 'service' | 'sector'
  /** Display order on the services index and homepage grid. */
  index: string
  title: L
  /** One line for panels, menus and cards. */
  short: L
  metaTitle: L
  metaDescription: L
  lead: L
  body: L[]
  /** How the main content block is presented. */
  layout: 'scope-grid' | 'steps' | 'split-list' | 'table'
  blocksTitle: L
  blocks: ServiceBlock[]
  /** Optional second list, rendered as a compact checklist. */
  includes?: { title: L; items: L[] }
  faqs?: Faq[]
  hero: MediaSlot
  detail: MediaSlot
  related: string[]
  projects?: string[]
  needs?: string[]
}

export const services: Service[] = [
  {
    slug: 'project-furniture-design-supply',
    kind: 'service',
    index: '01',
    title: { en: 'Furniture Design & Supply', ar: 'تصميم الأثاث وتوريده' },
    short: {
      en: 'Furniture selected or made for each project’s look, use and budget, sourced from European manufacturers.',
      ar: 'أثاث يُختار أو يُصنَّع ليناسب طابع كل مشروع واستخدامه وميزانيته، من مصنّعين أوروبيين.',
    },
    metaTitle: { en: 'Project Furniture Design & Supply in Saudi Arabia', ar: 'تصميم وتوريد أثاث المشاريع في السعودية' },
    metaDescription: {
      en: 'Bespoke and ready-made European furniture for residential, office and hospitality projects in Saudi Arabia, with shipping, customs clearance and installation.',
      ar: 'أثاث أوروبي مُفصَّل وجاهز للمشاريع السكنية والمكتبية والفندقية في السعودية، مع الشحن والتخليص الجمركي والتركيب.',
    },
    lead: {
      en: 'We specify, source and deliver furniture for whole projects, from a single executive suite to a palace. Pieces come from European factories we work with directly, chosen for how a space will be used as much as how it looks.',
      ar: 'نحدّد مواصفات الأثاث ونورّده ونسلّمه لمشاريع كاملة، من جناح تنفيذي واحد إلى قصر. تأتي القطع من مصانع أوروبية نتعامل معها مباشرة، ونختارها وفق طريقة استخدام المساحة بقدر ما نختارها لمظهرها.',
    },
    body: [
      {
        en: 'Most of our collections are Italian, with selected Portuguese and other European makers for upholstery, seating and lighting. When a catalogue piece does not fit the brief, we develop bespoke designs with the factory, adjusting dimensions, finishes and fabrics before production begins.',
        ar: 'معظم مجموعاتنا إيطالية، إلى جانب مصنّعين برتغاليين وأوروبيين مختارين في التنجيد والمقاعد والإضاءة. وعندما لا تناسب قطعة من الكتالوج متطلبات المشروع، نطوّر تصميمًا خاصًا مع المصنع ونعدّل المقاسات والتشطيبات والأقمشة قبل بدء الإنتاج.',
      },
      {
        en: 'You review every selection as a mood board or 3D render first, so changes happen on screen rather than after a shipment lands. We keep the design record on file, which makes it straightforward to add matching pieces later.',
        ar: 'تراجع كل اختيار أولًا في لوحة إلهام أو تصوّر ثلاثي الأبعاد، فتتم التعديلات على الشاشة لا بعد وصول الشحنة. ونحتفظ بسجل التصميم، مما يسهّل إضافة قطع مطابقة لاحقًا.',
      },
    ],
    layout: 'steps',
    blocksTitle: { en: 'From selection to installation', ar: 'من الاختيار إلى التركيب' },
    blocks: [
      {
        title: { en: 'Selection and specification', ar: 'الاختيار وتحديد المواصفات' },
        text: {
          en: 'A project manager works through the range with you and narrows it to pieces that suit the space, the users and the budget.',
          ar: 'يراجع معك مدير المشروع المجموعات ويحصرها في القطع المناسبة للمساحة ومستخدميها والميزانية.',
        },
      },
      {
        title: { en: 'Design review', ar: 'مراجعة التصميم' },
        text: {
          en: 'Mood boards or 3D renders show the selection in context. You approve or revise before anything is ordered.',
          ar: 'تعرض لوحات الإلهام أو التصورات ثلاثية الأبعاد الاختيارات في سياقها، فتعتمدها أو تعدّلها قبل أي طلب.',
        },
      },
      {
        title: { en: 'Factory orders', ar: 'طلبات التصنيع' },
        text: {
          en: 'Orders go to our partner factories, and we follow production and quality on your behalf.',
          ar: 'تُرسل الطلبات إلى المصانع الشريكة، ونتابع الإنتاج والجودة نيابةً عنك.',
        },
      },
      {
        title: { en: 'Shipping and clearance', ar: 'الشحن والتخليص' },
        text: {
          en: 'We arrange shipping, insurance and customs clearance into Saudi Arabia.',
          ar: 'نتولّى الشحن والتأمين والتخليص الجمركي إلى المملكة العربية السعودية.',
        },
      },
      {
        title: { en: 'On-site installation', ar: 'التركيب في الموقع' },
        text: {
          en: 'Installers assemble and place each piece to the layout, followed by a check with you and after-sales support.',
          ar: 'يجمّع فريق التركيب كل قطعة ويضعها وفق المخطط، ثم نراجع النتيجة معك ونقدّم دعم ما بعد البيع.',
        },
      },
    ],
    faqs: [
      {
        q: { en: 'How long does furniture take to arrive?', ar: 'كم يستغرق وصول الأثاث؟' },
        a: {
          en: 'Lead times depend on the pieces, the factory and any customisation. We give you a clear timeline at order stage and keep you updated through production and delivery.',
          ar: 'تختلف المدة حسب القطع والمصنع وأي تخصيص مطلوب. نزوّدك بجدول زمني واضح عند الطلب ونبقيك على اطلاع خلال الإنتاج والتسليم.',
        },
      },
      {
        q: { en: 'Can you make a piece to our own design?', ar: 'هل يمكن تصنيع قطعة وفق تصميمنا الخاص؟' },
        a: {
          en: 'Yes. We develop bespoke pieces with our factory partners, adjusting size, finish and fabric to your drawings or reference.',
          ar: 'نعم. نطوّر قطعًا خاصة مع المصانع الشريكة، ونعدّل المقاس والتشطيب والقماش وفق رسوماتك أو مرجعك.',
        },
      },
    ],
    hero: {
      ...stock('chairStudio'),
      art: 'chair',
      tone: 'stone',
      alt: { en: 'Upholstered armchair in a quiet studio setting', ar: 'كرسي منجّد في إطار هادئ' },
    },
    detail: {
      ...stock('sofaDetail'),
      art: 'materials',
      tone: 'ivory',
      alt: { en: 'Wood, stone and fabric samples for furniture finishes', ar: 'عيّنات خشب وحجر وقماش لتشطيبات الأثاث' },
    },
    related: ['interior-design-furnishing', 'hospitality-furnishing-solutions', 'turnkey-project-solutions'],
    projects: ['ecza', 'private-palace-2'],
  },
  {
    slug: 'interior-design-furnishing',
    kind: 'service',
    index: '02',
    title: { en: 'Interior Design & Furnishing', ar: 'التصميم الداخلي والتأثيث' },
    short: {
      en: 'Residential and commercial interiors with furniture, materials and finishes planned together.',
      ar: 'تصاميم داخلية سكنية وتجارية يُخطَّط فيها الأثاث والمواد والتشطيبات معًا.',
    },
    metaTitle: { en: 'Interior Design & Furnishing in Riyadh', ar: 'التصميم الداخلي والتأثيث في الرياض' },
    metaDescription: {
      en: 'Interior design that plans layout, materials and furniture as one scheme, with mood boards, floor plans and 3D visualisation before anything is ordered.',
      ar: 'تصميم داخلي يخطّط المساقط والمواد والأثاث كمنظومة واحدة، مع لوحات إلهام ومخططات وتصورات ثلاثية الأبعاد قبل أي طلب.',
    },
    lead: {
      en: 'Good interiors are decided early: where people sit, how light falls, which materials carry the room. We design the space and its furnishing as one scheme, so the furniture you order is the furniture the design was drawn around.',
      ar: 'تُحسم جودة التصميم الداخلي مبكرًا: أين يجلس الناس، وكيف يدخل الضوء، وأي المواد تحمل المكان. نصمّم المساحة وتأثيثها كمنظومة واحدة، فيكون الأثاث الذي تطلبه هو ذاته الذي رُسم التصميم حوله.',
    },
    body: [
      {
        en: 'Work starts with a mood board and material selection, then moves to floor plans and visualisations. For clients who want to see the result before committing, we produce 3D renders of key rooms.',
        ar: 'يبدأ العمل بلوحة إلهام واختيار المواد، ثم ينتقل إلى المخططات والتصورات. ولمن يرغب في رؤية النتيجة قبل الالتزام، نعدّ تصورات ثلاثية الأبعاد للمساحات الرئيسية.',
      },
    ],
    layout: 'scope-grid',
    blocksTitle: { en: 'What the design stage covers', ar: 'ما تشمله مرحلة التصميم' },
    blocks: [
      {
        title: { en: 'Concept and mood boards', ar: 'الفكرة ولوحات الإلهام' },
        text: {
          en: 'The design direction set out in images, colour and material, agreed before detailed work begins.',
          ar: 'اتجاه التصميم معروضًا بالصور والألوان والمواد، ويُعتمد قبل بدء العمل التفصيلي.',
        },
      },
      {
        title: { en: 'Space planning', ar: 'تخطيط المساحات' },
        text: {
          en: 'Furniture layouts and floor plans that work for circulation, use and the number of people in the room.',
          ar: 'مخططات توزيع الأثاث والمساقط بما يناسب الحركة والاستخدام وعدد المستخدمين.',
        },
      },
      {
        title: { en: '3D visualisation', ar: 'التصور ثلاثي الأبعاد' },
        text: {
          en: 'Renders of key spaces so you can review proportion, finish and light before approving.',
          ar: 'تصورات للمساحات الرئيسية لمراجعة النِّسب والتشطيبات والإضاءة قبل الاعتماد.',
        },
      },
      {
        title: { en: 'Materials and finishes', ar: 'المواد والتشطيبات' },
        text: {
          en: 'Fabrics, timbers, stone and metal finishes coordinated across the furniture and the room.',
          ar: 'تنسيق الأقمشة والأخشاب والأحجار والتشطيبات المعدنية بين الأثاث والمساحة.',
        },
      },
      {
        title: { en: 'Furniture schedule', ar: 'جدول الأثاث' },
        text: {
          en: 'A complete list of pieces, sources and finishes that feeds directly into ordering.',
          ar: 'قائمة كاملة بالقطع ومصادرها وتشطيباتها تنتقل مباشرة إلى مرحلة الطلب.',
        },
      },
      {
        title: { en: 'Design record', ar: 'سجل التصميم' },
        text: {
          en: 'We keep your design on file so future additions match what is already installed.',
          ar: 'نحتفظ بتصميمك لتتوافق أي إضافات مستقبلية مع ما تم تركيبه.',
        },
      },
    ],
    hero: {
      ...stock('livingSofa'),
      art: 'sofa',
      tone: 'ivory',
      alt: { en: 'Living room with a long sofa, side table and floor lamp', ar: 'غرفة معيشة بأريكة طويلة وطاولة جانبية ومصباح أرضي' },
    },
    detail: {
      ...stock('interiorDesign'),
      art: 'plan',
      tone: 'stone',
      alt: { en: 'Furniture layout drawn on a floor plan', ar: 'مخطط توزيع الأثاث على المسقط الأفقي' },
    },
    related: ['residential-interior-design-furnishing', 'project-furniture-design-supply', 'styling-furnishing'],
    projects: ['private-residential-project-5', 'visualisation'],
  },
  {
    slug: 'office-furnishing-fit-out-solutions',
    kind: 'service',
    index: '03',
    title: { en: 'Office Furnishing & Fit-Out', ar: 'تأثيث وتجهيز المكاتب' },
    short: {
      en: 'Workplaces planned for how teams work, from partitioning and lighting to executive furniture.',
      ar: 'بيئات عمل مخطّطة وفق طريقة عمل الفرق، من القواطع والإضاءة إلى الأثاث التنفيذي.',
    },
    metaTitle: { en: 'Office Furnishing & Fit-Out Solutions in Saudi Arabia', ar: 'حلول تأثيث وتجهيز المكاتب في السعودية' },
    metaDescription: {
      en: 'Office fit-out and furnishing in Riyadh and across Saudi Arabia: space planning, partitioning, lighting, interior design and imported Italian office furniture.',
      ar: 'تجهيز وتأثيث المكاتب في الرياض وأنحاء المملكة: تخطيط المساحات والقواطع والإضاءة والتصميم الداخلي وأثاث مكتبي إيطالي مستورد.',
    },
    lead: {
      en: 'An office has to work hard every day and still say something about the company that occupies it. We plan the space, fit it out and furnish it, from open work areas to boardrooms and executive floors.',
      ar: 'يجب أن يعمل المكتب بكفاءة كل يوم، وأن يعبّر في الوقت نفسه عن الشركة التي تشغله. نخطّط المساحة ونجهّزها ونؤثّثها، من مناطق العمل المفتوحة إلى قاعات الاجتماعات والطوابق التنفيذية.',
    },
    body: [
      {
        en: 'Our office work covers planning, partitioning, furniture selection, lighting and interior design. Throughout, the team considers indoor air quality, natural light and energy-saving systems, because they shape how comfortable a workplace feels long after handover.',
        ar: 'تشمل أعمالنا المكتبية التخطيط والقواطع واختيار الأثاث والإضاءة والتصميم الداخلي. ويراعي الفريق طوال المشروع جودة الهواء الداخلي والإضاءة الطبيعية وأنظمة توفير الطاقة، لأنها تحدّد راحة بيئة العمل بعد التسليم بوقت طويل.',
      },
      {
        en: 'Recent office projects include ECZA in Tamkeen Tower, Riyadh, furnished with pieces imported from Italy, as well as offices for Almousa and Nesma Infrastructure & Technology.',
        ar: 'من مشاريعنا المكتبية الأخيرة مكاتب ECZA في برج تمكين بالرياض، المؤثثة بقطع مستوردة من إيطاليا، إضافة إلى مكاتب الموسى ونسما للبنية التحتية والتقنية.',
      },
    ],
    layout: 'split-list',
    blocksTitle: { en: 'How an office project runs', ar: 'كيف يسير مشروع المكتب' },
    blocks: [
      {
        title: { en: 'Consultation and design', ar: 'الاستشارة والتصميم' },
        text: {
          en: 'We learn how your teams work, then develop layouts, furniture options and a design direction.',
          ar: 'نتعرّف على طريقة عمل فرقك، ثم نطوّر المخططات وخيارات الأثاث واتجاه التصميم.',
        },
      },
      {
        title: { en: 'Planning and approvals', ar: 'التخطيط والموافقات' },
        text: {
          en: 'Drawings, specifications and timelines are finalised and the required approvals obtained.',
          ar: 'تُعتمد الرسومات والمواصفات والجداول الزمنية ونستكمل الموافقات المطلوبة.',
        },
      },
      {
        title: { en: 'Fit-out execution', ar: 'تنفيذ التجهيز' },
        text: {
          en: 'Partitioning, lighting and finishes are built, then furniture is delivered and installed.',
          ar: 'تُنفَّذ القواطع والإضاءة والتشطيبات، ثم يُسلَّم الأثاث ويُركَّب.',
        },
      },
      {
        title: { en: 'Handover and aftercare', ar: 'التسليم وما بعده' },
        text: {
          en: 'A walk-through with your team, snag resolution and support after you move in.',
          ar: 'جولة مع فريقك ومعالجة الملاحظات ودعم بعد الانتقال.',
        },
      },
    ],
    includes: {
      title: { en: 'Scope we cover', ar: 'نطاق العمل' },
      items: [
        { en: 'Space planning', ar: 'تخطيط المساحات' },
        { en: 'Partitioning', ar: 'القواطع' },
        { en: 'Lighting', ar: 'الإضاءة' },
        { en: 'Interior design', ar: 'التصميم الداخلي' },
        { en: 'Workstations and executive furniture', ar: 'محطات العمل والأثاث التنفيذي' },
        { en: 'Meeting and boardroom furniture', ar: 'أثاث الاجتماعات ومجالس الإدارة' },
      ],
    },
    hero: {
      ...stock('office'),
      art: 'office',
      tone: 'stone',
      alt: { en: 'Boardroom with a long table, chairs and pendant lights', ar: 'قاعة اجتماعات بطاولة طويلة وكراسٍ وإضاءة معلّقة' },
    },
    detail: {
      ...stock('officeChair'),
      art: 'plan',
      tone: 'ivory',
      alt: { en: 'Office floor plan with workstations and meeting rooms', ar: 'مسقط مكتب بمحطات عمل وغرف اجتماعات' },
    },
    related: ['end-to-end-project-management-services', 'project-furniture-design-supply', 'turnkey-project-solutions'],
    projects: ['ecza', 'almousa-offices', 'nesma-infrastructure-technology'],
  },
  {
    slug: 'hospitality-furnishing-solutions',
    kind: 'service',
    index: '04',
    title: { en: 'Hospitality Furnishing', ar: 'تأثيث الضيافة' },
    short: {
      en: 'Furniture for hotels, resorts, serviced apartments and restaurants, made to the brand and built for heavy use.',
      ar: 'أثاث للفنادق والمنتجعات والشقق المخدومة والمطاعم، مصمّم وفق الهوية ومهيّأ للاستخدام الكثيف.',
    },
    metaTitle: { en: 'Hospitality Furnishing Solutions in Saudi Arabia', ar: 'حلول تأثيث الضيافة في السعودية' },
    metaDescription: {
      en: 'Hotel, resort and restaurant furnishing in Saudi Arabia: custom pieces to your brand, large-scale orders managed from planning to installation.',
      ar: 'تأثيث الفنادق والمنتجعات والمطاعم في السعودية: قطع مخصّصة لهويتك، وطلبات كبيرة تُدار من التخطيط حتى التركيب.',
    },
    lead: {
      en: 'Guests notice furniture within seconds and use it for years. We furnish hotels, resorts, serviced apartments and restaurants with pieces that carry the brand and stand up to daily commercial use.',
      ar: 'يلاحظ الضيف الأثاث خلال ثوانٍ ويستخدمه لسنوات. نؤثّث الفنادق والمنتجعات والشقق المخدومة والمطاعم بقطع تحمل الهوية وتتحمّل الاستخدام التجاري اليومي.',
    },
    body: [
      {
        en: 'Hospitality orders are large and repetitive, with hundreds of identical rooms that must match exactly. We manage them from planning to installation and work with you on custom pieces that reflect the brand and the design concept.',
        ar: 'طلبات الضيافة كبيرة ومتكررة، فيها مئات الغرف المتطابقة التي يجب أن تتماثل تمامًا. نديرها من التخطيط حتى التركيب، ونعمل معك على قطع مخصّصة تعكس الهوية وفكرة التصميم.',
      },
    ],
    layout: 'table',
    blocksTitle: { en: 'Spaces we furnish', ar: 'المساحات التي نؤثّثها' },
    blocks: [
      {
        title: { en: 'Guest rooms and suites', ar: 'غرف الضيوف والأجنحة' },
        text: {
          en: 'Beds, headboards, casegoods, lounge seating and lighting, repeated consistently across every key.',
          ar: 'الأسرّة والألواح الخلفية والخزائن ومقاعد الجلوس والإضاءة، بتطابق كامل في كل الغرف.',
        },
      },
      {
        title: { en: 'Lobbies and lounges', ar: 'الردهات والصالات' },
        text: {
          en: 'Statement seating and tables that set the first impression of the property.',
          ar: 'مقاعد وطاولات لافتة ترسم الانطباع الأول عن المنشأة.',
        },
      },
      {
        title: { en: 'Restaurants and cafés', ar: 'المطاعم والمقاهي' },
        text: {
          en: 'Dining chairs, banquettes and tables sized for covers, cleaning and service routes.',
          ar: 'كراسي وأرائك وطاولات طعام بمقاسات تراعي عدد المقاعد والتنظيف ومسارات الخدمة.',
        },
      },
      {
        title: { en: 'Serviced apartments', ar: 'الشقق المخدومة' },
        text: {
          en: 'Residential comfort with the durability and consistency an operator needs.',
          ar: 'راحة المنزل مع المتانة والتجانس اللذين يحتاجهما المشغّل.',
        },
      },
    ],
    faqs: [
      {
        q: { en: 'How long do hospitality orders take?', ar: 'كم تستغرق طلبات الضيافة؟' },
        a: {
          en: 'It depends on project size and how much is customised. Most orders take 8–12 weeks from approval to arrival.',
          ar: 'يعتمد ذلك على حجم المشروع ومدى التخصيص. تستغرق معظم الطلبات من 8 إلى 12 أسبوعًا من الاعتماد حتى الوصول.',
        },
      },
      {
        q: { en: 'Do you handle large hotel projects?', ar: 'هل تتولّون مشاريع فندقية كبيرة؟' },
        a: {
          en: 'Yes. We regularly furnish hotels and resorts at scale and manage each step, from planning through installation.',
          ar: 'نعم. نؤثّث الفنادق والمنتجعات على نطاق واسع بانتظام، وندير كل مرحلة من التخطيط حتى التركيب.',
        },
      },
      {
        q: { en: 'Can furniture be tailored to our brand?', ar: 'هل يمكن تخصيص الأثاث وفق هويتنا؟' },
        a: {
          en: 'Yes. We work with your design team to develop pieces that match your brand and concept.',
          ar: 'نعم. نعمل مع فريق التصميم لديك لتطوير قطع تتوافق مع هويتك وفكرتك.',
        },
      },
      {
        q: { en: 'Is installation included?', ar: 'هل يشمل العمل التركيب؟' },
        a: {
          en: 'We provide professional installation on all projects.',
          ar: 'نوفّر التركيب الاحترافي في جميع المشاريع.',
        },
      },
    ],
    hero: {
      ...stock('hotelRoom'),
      art: 'hotel',
      tone: 'charcoal',
      alt: { en: 'Hotel suite with an upholstered bed and wall lights', ar: 'جناح فندقي بسرير منجّد وإضاءة جدارية' },
    },
    detail: {
      ...stock('restaurant'),
      art: 'dining',
      tone: 'ivory',
      alt: { en: 'Restaurant dining table with chairs under a pendant light', ar: 'طاولة طعام في مطعم مع كراسٍ تحت إضاءة معلّقة' },
    },
    related: ['project-furniture-design-supply', 'turnkey-project-solutions', 'end-to-end-project-management-services'],
    needs: ['Named hospitality projects that can be published (the current site lists International Equestrian Resort SPA and Nayyara – Gleam without detail)'],
  },
  {
    slug: 'end-to-end-project-management-services',
    kind: 'service',
    index: '05',
    title: { en: 'Project Management', ar: 'إدارة المشاريع' },
    short: {
      en: 'Planning, budgeting, procurement and site supervision handled by one accountable team.',
      ar: 'التخطيط والميزانية والمشتريات والإشراف الموقعي بيد فريق واحد مسؤول.',
    },
    metaTitle: { en: 'End-to-End Project Management Services in Saudi Arabia', ar: 'خدمات إدارة المشاريع المتكاملة في السعودية' },
    metaDescription: {
      en: 'Interior and furnishing project management in Saudi Arabia: specifications, cost estimates, procurement, logistics, site supervision and quality checks.',
      ar: 'إدارة مشاريع التصميم الداخلي والتأثيث في السعودية: المواصفات وتقديرات التكلفة والمشتريات والخدمات اللوجستية والإشراف الموقعي وفحوص الجودة.',
    },
    lead: {
      en: 'Furnishing projects rarely fail on design. They slip on procurement, cost and coordination. Our project management keeps those under control, with one team responsible from specification to handover.',
      ar: 'نادرًا ما تتعثّر مشاريع التأثيث بسبب التصميم؛ بل تتأخر بسبب المشتريات والتكلفة والتنسيق. تبقي إدارتنا للمشاريع هذه الجوانب تحت السيطرة، بفريق واحد مسؤول من المواصفات حتى التسليم.',
    },
    body: [
      {
        en: 'We set specifications, cost estimates and timelines at the start, then track them through the project with regular reporting, so decisions are made with current numbers.',
        ar: 'نحدّد المواصفات وتقديرات التكلفة والجداول الزمنية في البداية، ثم نتابعها طوال المشروع بتقارير منتظمة، لتُتخذ القرارات بأرقام محدّثة.',
      },
    ],
    layout: 'scope-grid',
    blocksTitle: { en: 'Four disciplines, one team', ar: 'أربعة تخصصات، فريق واحد' },
    blocks: [
      {
        title: { en: 'Planning', ar: 'التخطيط' },
        text: {
          en: 'Specifications, programme and responsibilities agreed before work starts.',
          ar: 'اعتماد المواصفات والبرنامج الزمني والمسؤوليات قبل بدء العمل.',
        },
      },
      {
        title: { en: 'Budgeting', ar: 'الميزانية' },
        text: {
          en: 'Detailed cost estimates, expenditure tracking across the project life cycle and regular financial reporting.',
          ar: 'تقديرات تكلفة تفصيلية ومتابعة للإنفاق طوال دورة المشروع وتقارير مالية منتظمة.',
        },
      },
      {
        title: { en: 'Procurement', ar: 'المشتريات' },
        text: {
          en: 'Negotiation with trusted suppliers, contract management, order processing and logistics.',
          ar: 'التفاوض مع موردين موثوقين وإدارة العقود ومعالجة الطلبات والخدمات اللوجستية.',
        },
      },
      {
        title: { en: 'Technical supervision', ar: 'الإشراف الفني' },
        text: {
          en: 'Site monitoring against plans, safety and standards, with regular inspections and quality checks.',
          ar: 'متابعة الموقع وفق المخططات ومعايير السلامة والجودة، مع فحوص وتفتيش دوري.',
        },
      },
    ],
    hero: {
      ...stock('officeMeeting'),
      art: 'plan',
      tone: 'charcoal',
      alt: { en: 'Technical drawing with dimension lines', ar: 'رسم فني بخطوط الأبعاد' },
    },
    detail: {
      ...stock('office'),
      art: 'colonnade',
      tone: 'stone',
      alt: { en: 'Colonnade in perspective', ar: 'رواق أعمدة في منظور' },
    },
    related: ['turnkey-project-solutions', 'office-furnishing-fit-out-solutions', 'project-furniture-design-supply'],
  },
  {
    slug: 'turnkey-project-solutions',
    kind: 'service',
    index: '06',
    title: { en: 'Turnkey Project Solutions', ar: 'حلول المشاريع المتكاملة' },
    short: {
      en: 'Design, fit-out, furniture supply and installation delivered as one contract.',
      ar: 'التصميم والتجهيز وتوريد الأثاث والتركيب في عقد واحد.',
    },
    metaTitle: { en: 'Turnkey Interior & Furnishing Projects in Saudi Arabia', ar: 'مشاريع التصميم والتأثيث المتكاملة في السعودية' },
    metaDescription: {
      en: 'Turnkey interior projects in Saudi Arabia: design, fit-out, European furniture supply, delivery and installation coordinated by one team.',
      ar: 'مشاريع داخلية متكاملة في السعودية: التصميم والتجهيز وتوريد الأثاث الأوروبي والتسليم والتركيب بتنسيق فريق واحد.',
    },
    lead: {
      en: 'A turnkey project gives you one point of contact for the whole job. Our engineers handle design, fit-out, furniture supply and installation, and you receive a finished space ready to use.',
      ar: 'يمنحك المشروع المتكامل جهة تواصل واحدة للعمل كله. يتولّى مهندسونا التصميم والتجهيز وتوريد الأثاث والتركيب، وتستلم مساحة مكتملة جاهزة للاستخدام.',
    },
    body: [
      {
        en: 'It suits clients who want a single contract and a single schedule rather than coordinating a designer, a contractor and several suppliers. The same team that draws the design is responsible for delivering it.',
        ar: 'يناسب ذلك العملاء الذين يفضّلون عقدًا واحدًا وجدولًا واحدًا بدل التنسيق بين مصمم ومقاول وعدة موردين. والفريق الذي يرسم التصميم هو المسؤول عن تنفيذه.',
      },
    ],
    layout: 'steps',
    blocksTitle: { en: 'What one contract includes', ar: 'ما يشمله العقد الواحد' },
    blocks: [
      {
        title: { en: 'Design', ar: 'التصميم' },
        text: { en: 'Concept, layouts, materials and visualisation.', ar: 'الفكرة والمخططات والمواد والتصورات.' },
      },
      {
        title: { en: 'Fit-out', ar: 'التجهيز' },
        text: { en: 'Interior works coordinated to the approved design.', ar: 'تنفيذ الأعمال الداخلية وفق التصميم المعتمد.' },
      },
      {
        title: { en: 'Furniture supply', ar: 'توريد الأثاث' },
        text: { en: 'European furniture sourced, shipped and cleared.', ar: 'أثاث أوروبي يُورَّد ويُشحن ويُخلَّص.' },
      },
      {
        title: { en: 'Installation and handover', ar: 'التركيب والتسليم' },
        text: { en: 'Delivery, installation, finishing details and the agreed handover.', ar: 'التسليم والتركيب واللمسات النهائية والتسليم المتفق عليه.' },
      },
    ],
    hero: {
      ...stock('villa'),
      art: 'colonnade',
      tone: 'ivory',
      alt: { en: 'Architectural colonnade with soft daylight', ar: 'رواق معماري بإضاءة نهارية هادئة' },
    },
    detail: {
      ...stock('lounge'),
      art: 'lounge',
      tone: 'stone',
      alt: { en: 'Finished lounge with an arched window', ar: 'صالة مكتملة بنافذة مقوّسة' },
    },
    related: ['end-to-end-project-management-services', 'interior-design-furnishing', 'office-furnishing-fit-out-solutions'],
    needs: ['A turnkey project example that can be named on this page'],
  },
  {
    slug: 'residential-interior-design-furnishing',
    kind: 'sector',
    index: 'R',
    title: { en: 'Residential Interiors', ar: 'التصميم الداخلي السكني' },
    short: {
      en: 'Apartments, villas and palaces, from a single room to the whole home.',
      ar: 'شقق وفلل وقصور، من غرفة واحدة إلى المنزل بأكمله.',
    },
    metaTitle: { en: 'Residential Interior Design & Furnishing in Saudi Arabia', ar: 'التصميم الداخلي والتأثيث السكني في السعودية' },
    metaDescription: {
      en: 'Residential interior design and luxury furnishing for apartments, villas and palaces in Saudi Arabia, with Italian furniture and turnkey delivery.',
      ar: 'تصميم داخلي وتأثيث فاخر للشقق والفلل والقصور في السعودية، بأثاث إيطالي وتنفيذ متكامل.',
    },
    lead: {
      en: 'We design and furnish apartments, villas, townhouses and palaces, from a single majlis to a complete home. Classical or contemporary, the furniture is chosen for the family that will live with it.',
      ar: 'نصمّم ونؤثّث الشقق والفلل والتاون هاوس والقصور، من مجلس واحد إلى منزل كامل. كلاسيكيًا كان أو معاصرًا، يُختار الأثاث للعائلة التي ستعيش معه.',
    },
    body: [
      {
        en: 'Residential work starts with mood boards and material selection, followed by floor plans and visualisations. You can choose custom pieces, ready-made collections or a mix, and turnkey furnishing is available if you want the house handed over complete.',
        ar: 'يبدأ العمل السكني بلوحات الإلهام واختيار المواد، ثم المخططات والتصورات. يمكنك اختيار قطع مخصّصة أو مجموعات جاهزة أو مزيج منهما، ويتوفر التأثيث المتكامل إن رغبت في استلام المنزل جاهزًا.',
      },
      {
        en: 'In a Jeddah palace, we supplied and installed classical furniture imported from Italian brands. For a private residence, we took the project from concept design and furniture layout through selection and supply from European makers.',
        ar: 'في قصر بجدة، ورّدنا وركّبنا أثاثًا كلاسيكيًا مستوردًا من علامات إيطالية. وفي مسكن خاص، تولّينا المشروع من التصميم المبدئي وتوزيع الأثاث حتى الاختيار والتوريد من مصنّعين أوروبيين.',
      },
    ],
    layout: 'split-list',
    blocksTitle: { en: 'Homes we work on', ar: 'المنازل التي نعمل عليها' },
    blocks: [
      {
        title: { en: 'Palaces and villas', ar: 'القصور والفلل' },
        text: {
          en: 'Majlis, reception and family wings furnished as one coherent house.',
          ar: 'المجالس والاستقبال وأجنحة العائلة مؤثثة كمنزل متناسق.',
        },
      },
      {
        title: { en: 'Apartments and townhouses', ar: 'الشقق والتاون هاوس' },
        text: {
          en: 'Layouts that make the most of the floor area, with furniture scaled to the rooms.',
          ar: 'مخططات تستثمر المساحة، وأثاث بمقاسات تناسب الغرف.',
        },
      },
      {
        title: { en: 'Single rooms', ar: 'غرف منفردة' },
        text: {
          en: 'A dining room, master suite or majlis refreshed without touching the rest of the home.',
          ar: 'تجديد غرفة طعام أو جناح رئيسي أو مجلس دون المساس ببقية المنزل.',
        },
      },
    ],
    faqs: [
      {
        q: { en: 'How long does a residential project take?', ar: 'كم يستغرق المشروع السكني؟' },
        a: {
          en: 'From a few weeks to a few months, depending on the size of the home and whether pieces are made to order.',
          ar: 'من بضعة أسابيع إلى بضعة أشهر، حسب حجم المنزل وما إذا كانت القطع تُصنع حسب الطلب.',
        },
      },
      {
        q: { en: 'Can we mix custom and ready-made furniture?', ar: 'هل يمكن الجمع بين الأثاث المخصّص والجاهز؟' },
        a: {
          en: 'Yes. Many homes combine bespoke pieces for key rooms with ready-made collections elsewhere.',
          ar: 'نعم. تجمع منازل كثيرة بين قطع مخصّصة للغرف الرئيسية ومجموعات جاهزة لبقية المساحات.',
        },
      },
    ],
    hero: {
      ...stock('dining'),
      art: 'dining',
      tone: 'stone',
      alt: { en: 'Formal dining room with a chandelier', ar: 'غرفة طعام رسمية بثريا' },
    },
    detail: {
      ...stock('bedroom'),
      art: 'lounge',
      tone: 'ivory',
      alt: { en: 'Lounge chair beside an arched window', ar: 'كرسي استرخاء بجانب نافذة مقوّسة' },
    },
    related: ['interior-design-furnishing', 'styling-furnishing', 'project-furniture-design-supply'],
    projects: ['private-palace-2', 'private-residential-project-5'],
  },
  {
    slug: 'styling-furnishing',
    kind: 'sector',
    index: 'S',
    title: { en: 'Styling & Furnishing', ar: 'التنسيق والتأثيث' },
    short: {
      en: 'Accessories, lighting and finishing pieces that complete a furnished space.',
      ar: 'إكسسوارات وإضاءة وقطع ختامية تُكمل المساحة المؤثّثة.',
    },
    metaTitle: { en: 'Interior Styling & Furnishing Accessories | Riyadh', ar: 'تنسيق المساحات الداخلية وإكسسوارات التأثيث | الرياض' },
    metaDescription: {
      en: 'Interior styling in Riyadh: decorative lighting, accessories and finishing pieces from European brands, placed to complete residential and commercial spaces.',
      ar: 'تنسيق داخلي في الرياض: إضاءة ديكورية وإكسسوارات وقطع ختامية من علامات أوروبية تُوضع لإكمال المساحات السكنية والتجارية.',
    },
    lead: {
      en: 'Styling is the last layer of a project and the one people remember. Alongside furniture, we supply decorative lighting and accessories and place them so the room reads as finished, not merely furnished.',
      ar: 'التنسيق هو الطبقة الأخيرة في المشروع، وهو ما يبقى في الذاكرة. إلى جانب الأثاث، نورّد الإضاءة الديكورية والإكسسوارات ونضعها لتبدو الغرفة مكتملة لا مجرد مؤثّثة.',
    },
    body: [
      {
        en: 'Styling can follow one of our own furnishing projects or refresh a space that is already lived in. Lighting comes from European makers in our brand portfolio, chosen to suit the furniture around it.',
        ar: 'يمكن أن يأتي التنسيق تتمةً لأحد مشاريع التأثيث لدينا أو تجديدًا لمساحة مأهولة. وتأتي الإضاءة من مصنّعين أوروبيين ضمن علاماتنا، وتُختار لتناسب الأثاث المحيط بها.',
      },
    ],
    layout: 'scope-grid',
    blocksTitle: { en: 'The finishing layer', ar: 'الطبقة الختامية' },
    blocks: [
      {
        title: { en: 'Decorative lighting', ar: 'الإضاءة الديكورية' },
        text: {
          en: 'Chandeliers, pendants, wall and table lights matched to the furniture scheme.',
          ar: 'ثريات ووحدات معلّقة وإضاءة جدارية ومكتبية تتناسق مع منظومة الأثاث.',
        },
      },
      {
        title: { en: 'Accessories', ar: 'الإكسسوارات' },
        text: {
          en: 'Decorative objects and occasional pieces selected for scale and finish.',
          ar: 'قطع ديكورية وقطع مساندة تُختار بعناية للمقاس والتشطيب.',
        },
      },
      {
        title: { en: 'Placement', ar: 'التوزيع' },
        text: {
          en: 'Final arrangement on site so every room is ready to photograph and use.',
          ar: 'ترتيب نهائي في الموقع لتصبح كل غرفة جاهزة للتصوير والاستخدام.',
        },
      },
    ],
    hero: {
      ...stock('lounge'),
      art: 'lounge',
      tone: 'bronze',
      alt: { en: 'Styled lounge with a floor lamp and arched window', ar: 'صالة منسّقة بمصباح أرضي ونافذة مقوّسة' },
    },
    detail: {
      ...stock('materials'),
      art: 'materials',
      tone: 'stone',
      alt: { en: 'Material and finish samples arranged on a table', ar: 'عيّنات مواد وتشطيبات على طاولة' },
    },
    related: ['interior-design-furnishing', 'residential-interior-design-furnishing', 'project-furniture-design-supply'],
    needs: ['Confirm the exact styling scope Projects World offers (accessories, rugs, art, soft furnishings) before launch'],
  },
]

export const coreServices = services.filter((s) => s.kind === 'service')
export const sectors = services.filter((s) => s.kind === 'sector')

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}
