/**
 * English content.
 *
 * Copy is sourced from Atmaal's existing positioning and messaging. Business
 * facts — the metrics, the AT/MAAL/AAMAAL brand story, the three-stage process,
 * vision and mission — are reproduced as provided. Nothing here invents client
 * names, certifications, partnerships or performance figures; the case-study
 * entries are explicitly marked placeholders (see `caseStudies.disclaimer`).
 */
export const en = {
  meta: {
    locale: 'en',
    dir: 'ltr' as 'ltr' | 'rtl',
    label: 'English',
    short: 'EN',
  },

  nav: {
    home: 'Home',
    about: 'About',
    solutions: 'Solutions',
    industries: 'Industries',
    technology: 'Technology',
    careers: 'Careers',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close menu',
    open: 'Open menu',
    primary: 'Primary',
  },

  cta: {
    talkToExpert: 'Talk to an Expert',
    exploreSolutions: 'Explore Our Solutions',
    contactAtmaal: 'Contact Atmaal',
    viewPositions: 'View Open Positions',
    learnMore: 'Learn more',
    readCase: 'Read the approach',
    backHome: 'Back to home',
  },

  a11y: {
    skipToContent: 'Skip to main content',
    homeLink: 'Atmaal — home',
    languageSwitch: 'Switch language',
    scrollHint: 'Scroll to explore',
  },

  hero: {
    eyebrow: 'Business Process Outsourcing · Saudi Arabia',
    h1a: 'At Most Efficiency.',
    h1b: 'At Best Expertise.',
    sub: 'Transforming Business Operations Through People, Process & Technology.',
    body:
      'Atmaal combines intelligent automation, financial expertise and operational excellence to help organizations improve efficiency, reduce costs and scale with confidence.',
    visualAlt:
      'Abstract visualisation of connected business workflows, data points and automation pathways',
  },

  metrics: {
    label: 'Operating at national scale',
    items: [
      { value: 8, suffix: 'K+', label: 'Trained Experts', note: 'Specialists across operations, finance and technology' },
      { value: 22, suffix: 'M', label: 'Calls Handled Yearly', note: 'Across contact-centre and customer-experience operations' },
      { value: 500, suffix: 'M+', label: 'Transactions Processed Annually', note: 'Financial and business operations at enterprise volume' },
      { value: 3, suffix: '', label: 'Integrated Capability Pillars', note: 'Automation & Technology · Financial Operations · Business Solutions' },
    ],
  },

  intro: {
    eyebrow: 'Why Atmaal',
    heading: 'The Powerhouse Supporting Industry Leaders',
    statement: "Operational excellence is no longer optional. It's a competitive advantage.",
    body: [
      'Atmaal enables organizations to optimize performance through people, process and intelligent technology — bringing together a trained national workforce, disciplined operating models and automation built for enterprise volume.',
      'We work inside the operations that matter most: the transactions, the customer conversations, the financial controls and the back-office processes that determine whether a business runs efficiently or merely runs.',
    ],
    pillars: [
      { k: 'People', v: 'A distinguished, trained workforce operating at national scale.' },
      { k: 'Process', v: 'Operating models engineered for accuracy, control and repeatability.' },
      { k: 'Technology', v: 'Automation and intelligence applied where they change the economics.' },
    ],
    imageAlt: 'Modern enterprise operations centre in Riyadh',
  },

  solutions: {
    eyebrow: 'Solutions',
    heading: 'Solutions Built Around Your Business',
    intro:
      'Three integrated pillars, delivered independently or as a single operating partnership.',
    items: [
      {
        id: 'automation',
        number: '01',
        title: 'Automation & Technology',
        tagline: 'Intelligent automation that works harder for your business.',
        body:
          'We identify the processes where automation changes the economics — then design, build and run them. From robotic process automation through to applied AI and analytics, technology is deployed against measurable operational outcomes, not as an experiment.',
        services: [
          'Robotic Process Automation',
          'Artificial Intelligence',
          'Machine Learning',
          'Data Analytics',
          'Business Intelligence',
          'Workflow Automation',
        ],
        cta: 'Explore Automation & Technology',
      },
      {
        id: 'financial-operations',
        number: '02',
        title: 'Financial Operations',
        tagline: 'Precision, speed and control across your financial operations.',
        body:
          'Financial processes carry the least tolerance for error and the most regulatory weight. Atmaal delivers them with the accuracy, throughput and control enterprise finance functions require — at volumes measured in hundreds of millions of transactions each year.',
        services: [
          'Payment Processing',
          'Transaction Operations',
          'Compliance Support',
          'Financial Reconciliation',
          'Accounts Payable & Receivable',
          'Reporting & Financial Controls',
        ],
        cta: 'Explore Financial Operations',
      },
      {
        id: 'business-solutions',
        number: '03',
        title: 'Business Solutions',
        tagline: 'Operational solutions designed to improve performance at scale.',
        body:
          'The operational layer that keeps an enterprise responsive: the workforce, the customer relationship and the processes connecting them. We take operational ownership so internal teams can concentrate on the work that differentiates them.',
        services: [
          'Workforce Management',
          'Customer Experience',
          'Business Process Optimization',
          'Operational Support',
          'Managed Services',
        ],
        cta: 'Explore Business Solutions',
      },
    ],
    hoverHint: 'View capabilities',
  },

  brandStory: {
    eyebrow: 'The name',
    heading: 'Three capabilities. One name.',
    intro:
      'Atmaal is built from the three pillars it delivers — the name carries the operating model.',
    parts: [
      { key: 'AT', word: 'AT', title: 'Automation & Technology', body: 'Intelligent systems, RPA and applied AI that remove repetitive work and raise throughput.' },
      { key: 'MAAL', word: 'MAAL', title: 'Financial Operations', body: 'Maal — capital. Precision, control and speed across financial and transactional operations.' },
      { key: 'AAMAAL', word: 'AAMAAL', title: 'Business Solutions', body: 'Aamaal — business. Workforce, customer experience and the operations that scale a company.' },
    ],
    footnote: 'Automation. Maal. Aamaal. — the three pillars the company is named for.',
  },

  technology: {
    eyebrow: 'Technology',
    heading: 'Intelligence That Moves Business Forward',
    body:
      'Atmaal applies artificial intelligence, robotic process automation, machine learning and data analytics to the operational core of an enterprise — turning manual, high-volume processes into intelligent, measurable ones.',
    capabilities: [
      { title: 'Artificial Intelligence', body: 'Applied AI that supports decisions and handles judgement-heavy volume.' },
      { title: 'Robotic Process Automation', body: 'Rules-based execution at machine speed and machine consistency.' },
      { title: 'Machine Learning', body: 'Models that improve as operational data accumulates.' },
      { title: 'Data Analytics', body: 'Operational visibility that turns process data into decisions.' },
      { title: 'Intelligent Automation', body: 'AI and RPA combined against end-to-end business processes.' },
    ],
    chain: [
      { step: 'People', body: 'Trained specialists' },
      { step: 'Process', body: 'Engineered operating models' },
      { step: 'Technology', body: 'Automation & intelligence' },
      { step: 'Performance', body: 'Measurable outcomes' },
    ],
    chainLabel: 'How value compounds',
  },

  process: {
    eyebrow: 'How we work',
    heading: 'From Complexity to Clarity',
    intro: 'A three-stage engagement model, from first assessment to scaled operation.',
    stages: [
      {
        number: '01',
        phase: 'Alignment',
        title: 'Efficient Onboarding',
        body: 'Assess business needs and align processes with operational objectives.',
      },
      {
        number: '02',
        phase: 'Streamlining',
        title: 'Process Optimization',
        body:
          'Improve efficiency, reduce operational costs and streamline workflows through tailored solutions.',
      },
      {
        number: '03',
        phase: 'Expansion',
        title: 'Scalable Growth Support',
        body: 'Build future-ready operations capable of evolving with business needs.',
      },
    ],
  },

  industries: {
    eyebrow: 'Industries',
    heading: 'Built for Businesses That Demand More',
    intro:
      'Operational depth across the sectors where accuracy, volume and regulatory control matter most.',
    items: [
      { id: 'banking', title: 'Banking & Financial Services', body: 'Retail, corporate and capital operations — from transaction processing to middle-office support.' },
      { id: 'government', title: 'Government', body: 'Citizen-facing service operations and back-office processing aligned to national objectives.' },
      { id: 'healthcare', title: 'Healthcare', body: 'Patient administration, claims support and high-accuracy record operations.' },
      { id: 'retail', title: 'Retail', body: 'Customer service, order operations and workforce management across distributed networks.' },
      { id: 'telecom', title: 'Telecommunications', body: 'High-volume customer contact, retention operations and service assurance.' },
      { id: 'insurance', title: 'Insurance', body: 'Policy administration, claims operations and regulated document processing.' },
      { id: 'ecommerce', title: 'E-commerce', body: 'Marketplace operations, merchant services and always-on customer experience.' },
      { id: 'enterprise', title: 'Enterprise Services', body: 'Shared-services operations and managed business processes for large organisations.' },
    ],
  },

  why: {
    eyebrow: 'The difference',
    heading: 'Why Industry Leaders Choose Atmaal',
    intro:
      'Six reasons organisations hand their most operationally demanding processes to Atmaal.',
    items: [
      { icon: 'excellence', title: 'Operational Excellence', body: 'Improve performance through optimized processes.' },
      { icon: 'automation', title: 'Intelligent Automation', body: 'Reduce repetitive work through AI, RPA and automation.' },
      { icon: 'cost', title: 'Cost Efficiency', body: 'Reduce operational overhead while improving output.' },
      { icon: 'scale', title: 'Scalable Operations', body: 'Build infrastructure that grows with your business.' },
      { icon: 'people', title: 'Expert Workforce', body: 'Combine trained professionals with intelligent technology.' },
      { icon: 'continuity', title: 'Business Continuity', body: 'Create reliable and resilient operational processes.' },
    ],
  },

  caseStudies: {
    eyebrow: 'Results',
    heading: 'Turning Complex Operations Into Measurable Results',
    intro: 'How Atmaal approaches the operational problems enterprises bring to us.',
    labels: { challenge: 'Challenge', solution: 'Solution', result: 'Result', note: 'Note' },
    disclaimer:
      'Illustrative engagement models. Client names and performance figures are withheld pending approval — replace the result field with verified outcomes before publication.',
    items: [
      {
        industry: 'Banking & Financial Services',
        title: 'High-volume transaction operations',
        challenge:
          'Transaction volumes growing faster than the back-office headcount required to process them, with no tolerance for error.',
        solution:
          'Process mapping and reconciliation redesign, followed by RPA deployment against the highest-volume rules-based steps and a trained operations team for exception handling.',
        result: 'Result pending client approval',
      },
      {
        industry: 'Telecommunications',
        title: 'Customer contact at national scale',
        challenge:
          'Seasonal contact peaks exceeding in-house capacity, with service levels degrading at exactly the moments customers mattered most.',
        solution:
          'Managed contact-centre operations with workforce planning modelled against demand curves, supported by analytics on contact drivers to reduce avoidable volume.',
        result: 'Result pending client approval',
      },
      {
        industry: 'Insurance',
        title: 'Regulated document and claims processing',
        challenge:
          'Manual document handling creating processing latency and audit exposure across a regulated claims workflow.',
        solution:
          'Intelligent document processing combined with a controlled operational workflow, giving auditable handling and a measurable reduction in manual touchpoints.',
        result: 'Result pending client approval',
      },
    ],
  },

  about: {
    eyebrow: 'About Atmaal',
    heading: 'Where Innovation Meets Operational Excellence',
    lead:
      'Atmaal is a leading Business Process Outsourcing company delivering intelligent solutions across automation, financial operations and business services.',
    body: [
      'We help organisations optimize performance, reduce costs and scale effectively — streamlining workflows, strengthening financial accuracy and improving operational efficiency through innovative solutions and advanced technologies.',
      'Our model rests on three inseparable elements: a distinguished workforce, disciplined process design, and intelligent technology deployed where it materially changes operational outcomes.',
    ],
    triad: ['People', 'Process', 'Technology'],
    vision: {
      label: 'Our Vision',
      body:
        'To be a trusted strategy enabler delivering transformational operational excellence.',
    },
    mission: {
      label: 'Our Mission',
      body:
        'To deliver exceptional customer service through a distinguished workforce, high operational efficiency and intelligent technologies.',
    },
    imageAlt: 'Atmaal corporate environment in Riyadh, Saudi Arabia',
  },

  careers: {
    eyebrow: 'Careers',
    heading: 'Build the Future With Atmaal',
    sub: 'Your expertise can help transform how businesses operate.',
    items: [
      { title: 'Explore Opportunities', body: 'Roles across operations, finance, technology and customer experience — in Riyadh, Qassim and the Eastern Province.' },
      { title: 'Join Our Team', body: 'Work alongside thousands of trained specialists inside operations that run at national scale.' },
      { title: 'Grow With Us', body: 'Structured development and progression in an organisation investing in Saudi talent.' },
    ],
    cta: 'View Open Positions',
    imageAlt: 'Atmaal professionals collaborating in a modern Saudi workplace',
  },

  contact: {
    eyebrow: 'Get in touch',
    heading: 'Ready to Transform Your Operations?',
    sub: "Let's build smarter, more efficient and scalable operations together.",
    location: 'Riyadh, Saudi Arabia',
    locationLabel: 'Headquarters',
    emailLabel: 'Email',
    email: 'info@atmaal.sa',
    careersLabel: 'Careers',
    careersValue: 'careers.atmaal.sa',
    form: {
      title: 'Talk to an expert',
      note: 'Tell us about the operation you want to improve. A specialist will respond directly.',
      name: 'Full name',
      namePlaceholder: 'Your name',
      email: 'Work email',
      emailPlaceholder: 'name@company.com',
      company: 'Organisation',
      companyPlaceholder: 'Company or entity name',
      interest: 'Area of interest',
      interestOptions: [
        'Automation & Technology',
        'Financial Operations',
        'Business Solutions',
        'General enquiry',
      ],
      message: 'How can we help?',
      messagePlaceholder: 'Briefly describe your operational challenge…',
      submit: 'Send enquiry',
      sending: 'Sending…',
      success: 'Thank you — your enquiry has been received. A specialist will be in touch.',
      errorRequired: 'This field is required',
      errorEmail: 'Enter a valid email address',
      required: 'required',
    },
  },

  footer: {
    blurb:
      'A leading Saudi Business Process Outsourcing company delivering intelligent solutions across automation, financial operations and business services.',
    columns: [
      {
        title: 'Atmaal',
        links: [
          { label: 'About', to: '/about' },
          { label: 'Our Story', to: '/about#story' },
          { label: 'Leadership', to: '/about#leadership' },
          { label: 'Careers', to: '/careers' },
        ],
      },
      {
        title: 'Solutions',
        links: [
          { label: 'Automation & Technology', to: '/solutions#automation' },
          { label: 'Financial Operations', to: '/solutions#financial-operations' },
          { label: 'Business Solutions', to: '/solutions#business-solutions' },
        ],
      },
      {
        title: 'Industries',
        links: [
          { label: 'Banking', to: '/industries#banking' },
          { label: 'Government', to: '/industries#government' },
          { label: 'Healthcare', to: '/industries#healthcare' },
          { label: 'Retail', to: '/industries#retail' },
          { label: 'Enterprise', to: '/industries#enterprise' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Insights', to: '/insights' },
          { label: 'Careers', to: '/careers' },
          { label: 'Contact', to: '/contact' },
          { label: 'Privacy Policy', to: '/privacy' },
        ],
      },
    ],
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms',
    social: 'Follow Atmaal',
  },

  pages: {
    about: {
      title: 'About Atmaal',
      metaTitle: 'About Atmaal | Automation, Financial Operations & Business Solutions',
      metaDescription:
        'Atmaal is a leading Saudi BPO company delivering intelligent solutions across automation, financial operations and business services. Discover our vision, mission and operating model.',
      hero: 'Where Innovation Meets Operational Excellence',
      lede:
        'Built on people, process and technology — operating at the scale Saudi enterprise requires.',
    },
    solutions: {
      title: 'Solutions',
      metaTitle: 'Solutions | Automation, Financial Operations & Business Solutions | Atmaal',
      metaDescription:
        'Three integrated pillars: intelligent automation and technology, precision financial operations, and business solutions engineered to improve performance at scale.',
      hero: 'Solutions Built Around Your Business',
      lede:
        'Automation and technology, financial operations and business solutions — delivered independently or as one operating partnership.',
    },
    industries: {
      title: 'Industries',
      metaTitle: 'Industries We Serve | Banking, Government, Healthcare & More | Atmaal',
      metaDescription:
        'Atmaal delivers operational depth across banking and financial services, government, healthcare, retail, telecommunications, insurance, e-commerce and enterprise services.',
      hero: 'Built for Businesses That Demand More',
      lede:
        'Operational depth across the sectors where accuracy, volume and regulatory control matter most.',
    },
    technology: {
      title: 'Technology',
      metaTitle: 'Technology | AI, RPA, Machine Learning & Data Analytics | Atmaal',
      metaDescription:
        'Artificial intelligence, robotic process automation, machine learning and data analytics applied to the operational core of the enterprise.',
      hero: 'Intelligence That Moves Business Forward',
      lede:
        'AI, RPA, machine learning and analytics applied where they change operational economics.',
    },
    careers: {
      title: 'Careers',
      metaTitle: 'Careers at Atmaal | Build the Future With Us',
      metaDescription:
        'Join thousands of trained specialists at Atmaal. Explore opportunities across operations, finance, technology and customer experience in Riyadh, Qassim and the Eastern Province.',
      hero: 'Build the Future With Atmaal',
      lede: 'Your expertise can help transform how businesses operate.',
    },
    contact: {
      title: 'Contact',
      metaTitle: 'Contact Atmaal | Talk to an Expert',
      metaDescription:
        'Get in touch with Atmaal in Riyadh, Saudi Arabia. Talk to a specialist about automation, financial operations and business solutions.',
      hero: 'Ready to Transform Your Operations?',
      lede: "Let's build smarter, more efficient and scalable operations together.",
    },
    notFound: {
      title: 'Page not found',
      metaTitle: 'Page not found | Atmaal',
      metaDescription: 'The page you are looking for could not be found.',
      hero: 'This page could not be found',
      lede: 'The page may have moved, or the address may be incorrect.',
    },
  },
}

export type Content = typeof en
