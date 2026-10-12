import { Link } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import { media } from '@/content/media'
import { company } from '@/content/company'
import { coreServices } from '@/content/services'
import { featuredProjects } from '@/content/projects'
import { brands } from '@/content/brands'
import { Seo } from '@/lib/seo'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { Media } from '@/components/ui/Media'
import { ArrowLink, Button } from '@/components/ui/Links'
import { MaskedHeading, Reveal } from '@/components/ui/Reveal'
import { ServicePanels } from '@/components/sections/ServicePanels'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { BrandGrid } from '@/components/sections/BrandGrid'
import { ProcessTimeline } from '@/components/sections/Process'
import { CtaBand } from '@/components/sections/CtaBand'

export function Home() {
  const { t, locale, href } = useLanguage()
  const h = t.home
  const [lead, second, ...rest] = featuredProjects

  return (
    <>
      <Seo title={t.meta.homeTitle} description={t.meta.homeDescription} path="/" jsonLd={[organizationSchema(locale), websiteSchema()]} />

      {/* A. Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-charcoal-950 text-ivory-50">
        {media.heroVideo ? (
          <video
            className="absolute inset-0 -z-10 h-full w-full object-cover motion-reduce:hidden"
            src={media.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : null}
        <Media slot={media.hero} fill priority drift className="-z-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/45 to-charcoal-950/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950/60 to-transparent rtl:bg-gradient-to-l" />

        <div className="shell w-full pb-14 pt-40 lg:pb-20">
          <p className="eyebrow mb-8 !text-bronze-300 page-enter">{h.heroEyebrow}</p>
          <MaskedHeading as="h1" lines={h.heroTitle} delay={150} className="max-w-5xl font-serif text-display-3xl font-light" />
          <Reveal delay={500}>
            <p className="mt-10 max-w-xl text-lead text-ivory-50/85">{h.heroText}</p>
          </Reveal>
          <Reveal delay={650} className="mt-10 flex flex-wrap gap-4">
            <Button to={href('/our-projects/')} variant="light" track="hero_projects">
              {h.heroPrimary}
            </Button>
            <Button to={href('/contact/') + '#inquiry'} variant="ghost-light" track="hero_inquiry">
              {h.heroSecondary}
            </Button>
          </Reveal>

          <div className="mt-16 flex items-center justify-between border-t border-ivory-50/20 pt-6 text-caption uppercase tracking-[0.18em] text-ivory-50/70 lg:mt-24">
            <span>{t.common.est}</span>
            <span className="hidden items-center gap-3 sm:flex" aria-hidden="true">
              {h.scroll}
              <span className="relative block h-8 w-px overflow-hidden bg-ivory-50/25">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-ivory-50 motion-safe:animate-[scroll-cue_2.4s_ease-in-out_infinite]" />
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* C. Introduction */}
      <section className="py-section">
        <div className="shell">
          <p className="eyebrow mb-8">{h.introEyebrow}</p>
          <MaskedHeading lines={[h.introTitle]} className="max-w-6xl font-serif text-display-2xl font-light" />

          <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-10">
            <div className="relative lg:col-span-6">
              <Reveal mode="mask">
                <Media slot={media.intro} ratio="aspect-[4/5]" parallax sizes="(min-width: 1024px) 50vw, 100vw" />
              </Reveal>
              <Reveal mode="mask" delay={250} className="absolute -bottom-12 end-0 hidden w-[42%] border-[10px] border-ivory-100 sm:block lg:-end-16">
                <Media slot={media.introDetail} ratio="aspect-square" />
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
              {h.introText.map((p, i) => (
                <Reveal key={i} delay={i * 120}>
                  <p className={i === 0 ? 'text-lead text-charcoal-900' : 'mt-6 text-stone-700'}>{p}</p>
                </Reveal>
              ))}
              <Reveal delay={300}>
                <dl className="mt-14 grid grid-cols-1 gap-8 border-t border-charcoal-900/15 pt-10 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {h.introFacts.map((f) => (
                    <div key={f.label}>
                      <dt className="sr-only">{f.label}</dt>
                      <dd>
                        <span className="block font-serif text-display-md text-charcoal-900">{f.value}</span>
                        <span className="mt-2 block text-caption text-stone-600">{f.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal delay={400} className="mt-12">
                <ArrowLink to={href('/about/')}>{h.aboutCta}</ArrowLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* D. Services */}
      <section className="bg-ivory-200 py-section" aria-labelledby="services-title">
        <div className="shell">
          <div className="mb-20 grid gap-8 lg:mb-28 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6">{h.servicesEyebrow}</p>
              <h2 id="services-title" className="font-serif text-display-xl font-light">
                {h.servicesTitle}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-stone-700">{h.servicesText}</p>
              <ArrowLink to={href('/services/')} className="mt-6">
                {t.nav.allServices}
              </ArrowLink>
            </div>
          </div>
          <ServicePanels items={coreServices} />
        </div>
      </section>

      {/* E. Featured projects */}
      <section className="py-section" aria-labelledby="projects-title">
        <div className="shell">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-8 lg:mb-24">
            <div>
              <p className="eyebrow mb-6">{h.projectsEyebrow}</p>
              <h2 id="projects-title" className="max-w-3xl font-serif text-display-xl font-light">
                {h.projectsTitle}
              </h2>
            </div>
            <ArrowLink to={href('/our-projects/')}>{t.common.allProjects}</ArrowLink>
          </div>

          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-7">
              <ProjectCard project={lead} ratio="aspect-[4/3]" size="lg" />
            </Reveal>
            <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:mt-40">
              <ProjectCard project={second} ratio="aspect-[4/5]" />
            </Reveal>
          </div>
        </div>

        {/* Horizontal rail for the rest */}
        <div className="mt-20 lg:mt-28">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter pb-4 lg:gap-10" aria-label={h.projectsTitle}>
            {rest.map((p) => (
              <li key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[29vw]">
                <ProjectCard project={p} ratio="aspect-[3/4]" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* F. Brands */}
      <section className="border-t border-charcoal-900/10 py-section" aria-labelledby="brands-title">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-6">{h.brandsEyebrow}</p>
              <h2 id="brands-title" className="font-serif text-display-xl font-light">
                {h.brandsTitle}
              </h2>
              <p className="mt-8 text-stone-700">{h.brandsText}</p>
              <ArrowLink to={href('/our-brands/')} className="mt-10">
                {h.brandsCta}
              </ArrowLink>
            </div>
          </div>
          <Reveal className="lg:col-span-8">
            <BrandGrid brands={brands.slice(0, 12)} compact />
          </Reveal>
        </div>
      </section>

      {/* G. Why Projects World */}
      <section className="bg-ivory-200" aria-labelledby="why-title">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[60vh] lg:min-h-full">
            <Media slot={media.why} fill parallax />
          </div>
          <div className="px-gutter py-section lg:px-20 xl:px-28">
            <p className="eyebrow mb-6">{h.whyEyebrow}</p>
            <h2 id="why-title" className="max-w-xl font-serif text-display-xl font-light">
              {h.whyTitle}
            </h2>
            <ol className="mt-16 space-y-0">
              {h.why.map((w, i) => (
                <Reveal as="li" key={w.title} delay={i * 100} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-charcoal-900/15 py-8 last:border-b">
                  <span className="pt-1 font-serif text-[1.375rem] text-bronze-600">0{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-[1.5rem] leading-snug">{w.title}</h3>
                    <p className="mt-3 text-body-sm text-stone-700">{w.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* H. Process */}
      <section className="bg-charcoal-900 py-section text-ivory-50" aria-labelledby="process-title">
        <div className="shell">
          <div className="mb-20 flex flex-wrap items-end justify-between gap-8 lg:mb-24">
            <div>
              <p className="eyebrow mb-6 !text-bronze-300">{h.processEyebrow}</p>
              <h2 id="process-title" className="max-w-2xl font-serif text-display-xl font-light">
                {h.processTitle}
              </h2>
            </div>
            <Link to={href('/our-process/')} className="group inline-flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.16em] text-ivory-50">
              <span className="link-underline pb-1">{t.common.readMore}</span>
            </Link>
          </div>
          <ProcessTimeline tone="dark" />
        </div>
      </section>

      {/* I. About */}
      <section className="py-section" aria-labelledby="about-title">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="eyebrow mb-6">{h.aboutEyebrow}</p>
            <h2 id="about-title" className="font-serif text-display-xl font-light">
              {h.aboutTitle}
            </h2>
            {h.aboutText.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <p className="mt-8 text-stone-700">{p}</p>
              </Reveal>
            ))}
            <ul className="mt-12 space-y-4 border-t border-charcoal-900/15 pt-8">
              <li>
                <ArrowLink to={href('/about/')}>{h.aboutCta}</ArrowLink>
              </li>
              <li>
                <ArrowLink to={href('/about/') + '#mission'}>
                  {t.about.missionTitle} · {t.about.visionTitle}
                </ArrowLink>
              </li>
              <li>
                <a
                  href={company.profilePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-block pb-1 text-caption font-semibold uppercase tracking-[0.16em]"
                >
                  {t.common.downloadProfile}
                </a>
              </li>
            </ul>
          </div>
          <div className="order-1 grid grid-cols-5 gap-6 lg:order-2 lg:col-span-6 lg:col-start-7">
            <Reveal mode="mask" className="col-span-3">
              <Media slot={media.about} ratio="aspect-[3/4]" />
            </Reveal>
            <Reveal mode="mask" delay={200} className="col-span-2 mt-24">
              <Media slot={media.aboutTeam} ratio="aspect-[3/5]" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* J. Contact */}
      <CtaBand withDetails />
    </>
  )
}
