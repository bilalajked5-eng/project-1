import { useLanguage } from '@/i18n'
import { company } from '@/content/company'
import { Seo } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { Needs } from '@/components/ui/Needs'

/**
 * Privacy and terms pages keep their existing URLs. The legal text itself
 * must be migrated from the current site as written; it is not rewritten
 * here.
 */
export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useLanguage()
  const title = kind === 'privacy' ? t.legal.privacyTitle : t.legal.termsTitle
  const path = kind === 'privacy' ? '/privacy-policy/' : '/terms-conditions/'

  return (
    <>
      <Seo title={`${title} | Projects World`} description={`${title} – ${company.legalName}`} path={path} />
      <PageHero
        eyebrow={company.legalName}
        title={title}
        crumbs={[
          { label: t.nav.home, path: '/' },
          { label: title, path },
        ]}
        layout="text"
      />
      <section className="pb-section pt-12">
        <div className="shell max-w-prose">
          <p className="text-stone-700">
            {t.legal.pending}{' '}
            <a href={`mailto:${company.email}`} className="underline">
              {company.email}
            </a>
            .
          </p>
          <Needs items={[`Migrate the full ${title} text from projects-world.com${path} (English and Arabic)`]} />
        </div>
      </section>
    </>
  )
}
