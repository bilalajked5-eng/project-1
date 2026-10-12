import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, Gem, Hotel, Home as HomeIcon, LayoutGrid, Phone, Ruler, Store, Truck } from 'lucide-react'
import { useLanguage } from '@/i18n'
import { media } from '@/content/media'
import { company, whatsappLink } from '@/content/company'
import { coreServices } from '@/content/services'
import { featuredProjects } from '@/content/projects'
import { brands } from '@/content/brands'
import { Seo } from '@/lib/seo'
import { organizationSchema, websiteSchema, faqSchema } from '@/lib/schema'
import { cn, useInView, usePrefersReducedMotion } from '@/lib/hooks'
import { track } from '@/lib/analytics'
import { Media } from '@/components/ui/Media'
import { Arrow, Button } from '@/components/ui/Links'
import { Reveal } from '@/components/ui/Reveal'
import { QuickQuote } from '@/components/sections/QuickQuote'
import { ProjectTile, SectionHead, ServiceCard } from '@/components/sections/Cards'
import { CtaBand } from '@/components/sections/CtaBand'

/** Number that counts up once it scrolls into view. */
function Counter({ value, suffix, count }: { value: number; suffix: string; count: boolean }) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(count ? 0 : value)

  useEffect(() => {
    if (!count || !inView) return
    if (reduced) {
      setN(value)
      return
    }
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [count, inView, reduced, value])

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {n}
        {suffix}
      </span>
      {/* Crawlers and screen readers get the final figure */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  )
}

const sectorIcons = [HomeIcon, Building2, Hotel, Store]
const whyIcons = [Gem, LayoutGrid, Ruler, Truck]

export function Home() {
  const { t, locale, href } = useLanguage()
  const h = t.home
  const x = t.homeX
  const years = new Date().getFullYear() - company.founded

  return (
    <>
      <Seo
        title={t.meta.homeTitle}
        description={t.meta.homeDescription}
        path="/"
        jsonLd={[organizationSchema(locale), websiteSchema(), faqSchema(x.faqs)]}
      />

      {/* Hero: photo background, copy left, quote form right */}
      <section className="relative isolate overflow-hidden bg-charcoal-950 text-white">
        <Media slot={media.hero} fill priority drift decorative className="-z-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/80 to-charcoal-950/50 rtl:bg-gradient-to-l" />

        <div className="shell grid items-center gap-12 pb-28 pt-14 lg:grid-cols-12 lg:pb-36 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="page-enter flex flex-wrap items-center gap-3 text-body-sm font-semibold text-white/90">
              <span className="rounded-full bg-bronze-500 px-3 py-1 text-[0.75rem] font-extrabold uppercase tracking-[0.06em] text-charcoal-950">
                {x.heroBadge}
              </span>
              {x.heroLabel}
            </p>
            <h1 className="page-enter mt-6 font-heading text-display-3xl font-extrabold">
              {h.heroTitle[0]} <span className="text-bronze-400">{x.heroHighlight}</span>
            </h1>
            <p className="mt-6 text-lead font-semibold text-white">{x.heroSub}</p>
            <p className="mt-3 max-w-2xl text-white/75">{h.heroText}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button to={href('/contact/') + '#inquiry'} track="hero_quote">
                {t.nav.cta}
              </Button>
              <Button to={whatsappLink()} variant="whatsapp" icon="whatsapp" track="hero_whatsapp">
                {x.whatsappCta}
              </Button>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-body-sm text-white/85">
              {x.heroChecks.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-bronze-400" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:ps-6">
            <QuickQuote />
          </div>
        </div>
      </section>

      {/* Stats card overlapping the hero */}
      <section aria-label={x.heroLabel} className="relative z-10 -mt-16">
        <div className="shell">
          <dl className="grid grid-cols-2 overflow-hidden rounded-card bg-white shadow-lift lg:grid-cols-4">
            {x.stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  'flex flex-col-reverse p-6 text-center sm:p-8',
                  i % 2 === 1 && 'border-s border-charcoal-900/10',
                  i === 2 && 'lg:border-s',
                  i > 1 && 'border-t border-charcoal-900/10 lg:border-t-0',
                )}
              >
                <dt className="mt-3 text-body-sm text-stone-600">{s.label}</dt>
                <dd className="font-heading text-[2.5rem] font-extrabold leading-none text-charcoal-900">
                  <Counter value={s.value} suffix={s.suffix} count={s.count} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Brand strip */}
      <section className="py-20" aria-labelledby="partners-title">
        <div className="shell">
          <SectionHead id="partners-title" eyebrow={x.partnersEyebrow} title={x.partnersTitle} text={x.partnersText} align="center" />
        </div>
        <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" dir="ltr">
          <ul className="flex w-max gap-4 motion-safe:animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((b, i) => (
              <li key={`${b.slug}-${i}`} aria-hidden={i >= brands.length ? true : undefined}>
                <Link
                  to={href(`/brands/${b.slug}/`)}
                  tabIndex={i >= brands.length ? -1 : undefined}
                  className="flex h-20 w-48 items-center justify-center rounded-card border border-charcoal-900/10 bg-white px-5 text-center font-heading text-[1rem] font-bold uppercase tracking-[0.06em] text-stone-600 transition-colors hover:border-bronze-500 hover:text-charcoal-900"
                >
                  {b.logo ? <img src={b.logo} alt={b.name} className="max-h-10 w-auto grayscale" /> : b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-center">
          <Link to={href('/our-brands/')} className="inline-flex items-center gap-2 text-body-sm font-semibold text-bronze-600 hover:text-charcoal-900">
            {h.brandsCta} <Arrow />
          </Link>
        </p>
      </section>

      {/* About */}
      <section className="pb-section" aria-labelledby="about-title">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative pb-10 pe-10">
            <Media slot={media.about} ratio="aspect-[5/4]" className="rounded-card" sizes="(min-width: 1024px) 50vw, 100vw" />
            <Media
              slot={media.introDetail}
              ratio="aspect-square"
              className="absolute bottom-0 end-0 hidden w-[38%] rounded-card border-[6px] border-white shadow-lift sm:block"
            />
            <div className="absolute bottom-0 start-6 rounded-card bg-bronze-500 p-6 text-charcoal-950 shadow-lift">
              <p className="font-heading text-[2.75rem] font-extrabold leading-none">{years}+</p>
              <p className="mt-2 max-w-[9rem] text-caption font-semibold">{x.aboutBadge}</p>
            </div>
          </Reveal>

          <div>
            <SectionHead id="about-title" eyebrow={x.aboutEyebrow} title={x.aboutTitle} />
            {h.introText.map((p, i) => (
              <p key={i} className="mt-5 text-stone-600">
                {p}
              </p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {x.aboutChecks.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-body-sm font-semibold text-charcoal-900">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-bronze-500" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to={href('/about/')} variant="dark">
                {h.aboutCta}
              </Button>
              <Button to={company.profilePdf} variant="outline" icon="none" external>
                {t.common.downloadProfile}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ivory-200 py-section" aria-labelledby="services-title">
        <div className="shell">
          <SectionHead id="services-title" eyebrow={x.servicesEyebrow} title={x.servicesTitle} text={x.servicesText} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreServices.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </ul>

          <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-card bg-charcoal-900 p-8 text-white sm:p-10 lg:flex-row lg:items-center">
            <div className="on-dark">
              <p className="eyebrow mb-3">{x.bundleEyebrow}</p>
              <h3 className="font-heading text-display-md font-extrabold">{x.bundleTitle}</h3>
              <p className="mt-2 text-white/75">{x.bundleText}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button to={href('/turnkey-project-solutions/')} track="bundle_turnkey">
                {x.bundleCta}
              </Button>
              <Button to={href('/services/')} variant="outline-light">
                {x.seeMore}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors (dark) */}
      <section className="bg-charcoal-900 py-section text-white" aria-labelledby="sectors-title">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <SectionHead id="sectors-title" eyebrow={x.sectorsEyebrow} title={x.sectorsTitle} dark />
            <p className="text-white/75 lg:pb-2">{x.sectorsText}</p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {x.sectors.map((s, i) => {
              const Icon = sectorIcons[i]
              return (
                <Reveal as="li" key={s.title} delay={i * 70}>
                  <Link
                    to={href(s.path)}
                    className="group flex h-full flex-col rounded-card border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-bronze-400/60 hover:bg-white/[0.07]"
                  >
                    <Icon className="h-8 w-8 text-bronze-400" aria-hidden="true" />
                    <h3 className="mt-5 font-heading text-[1.125rem] font-bold">{s.title}</h3>
                    <p className="mt-2 flex-1 text-body-sm text-white/70">{s.text}</p>
                    <Arrow className="mt-5 text-bronze-400 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                </Reveal>
              )
            })}
            <Reveal as="li" delay={4 * 70}>
              <div className="flex h-full flex-col rounded-card bg-bronze-500 p-6 text-charcoal-950">
                <h3 className="font-heading text-[1.125rem] font-extrabold">{x.sectorOtherTitle}</h3>
                <p className="mt-2 flex-1 text-body-sm">{x.sectorOtherText}</p>
                <Link to={href('/contact/')} className="btn btn-dark mt-5 min-h-[2.75rem] self-start">
                  {x.sectorOtherCta} <Arrow />
                </Link>
              </div>
            </Reveal>
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="py-section" aria-labelledby="process-title">
        <div className="shell">
          <SectionHead id="process-title" eyebrow={x.processEyebrow} title={x.processTitle} text={x.processText} align="center" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.process.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90} className="card relative p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-900 font-heading text-[1.0625rem] font-extrabold text-bronze-400">
                  0{i + 1}
                </span>
                <h3 className="mt-6 font-heading text-[1.1875rem] font-bold">{step.title}</h3>
                <p className="mt-3 text-body-sm text-stone-600">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-ivory-200 py-section" aria-labelledby="projects-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="projects-title" eyebrow={x.projectsEyebrow} title={x.projectsTitle} />
            <Button to={href('/our-projects/')} variant="dark">
              {x.projectsCta}
            </Button>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
                <ProjectTile project={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Why choose (dark) */}
      <section className="bg-charcoal-950 py-section text-white" aria-labelledby="why-title">
        <div className="shell">
          <SectionHead id="why-title" eyebrow={x.whyEyebrow} title={x.whyTitle} dark />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.why.map((w, i) => {
              const Icon = whyIcons[i]
              return (
                <Reveal as="li" key={w.title} delay={i * 80} className="rounded-card border border-white/10 bg-white/[0.04] p-7">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-bronze-500 text-charcoal-950">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-heading text-[1.1875rem] font-bold">{w.title}</h3>
                  <p className="mt-3 text-body-sm text-white/70">{w.text}</p>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-section" aria-labelledby="faq-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="faq-title" eyebrow={x.faqEyebrow} title={x.faqTitle} text={x.faqText} />
            <a href={`tel:${company.phones[0].tel}`} className="btn btn-dark mt-8" onClick={() => track('click_to_call', { location: 'home_faq' })}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {x.faqCall} <span dir="ltr">{company.phones[0].display}</span>
            </a>
          </div>
          <div className="space-y-3 lg:col-span-7">
            {x.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="card group overflow-hidden open:border-bronze-500/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading text-[1.0625rem] font-bold">{f.q}</h3>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-200 text-[1.25rem] leading-none text-charcoal-900 group-open:bg-bronze-500"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <p className="px-6 pb-6 text-body-sm text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
