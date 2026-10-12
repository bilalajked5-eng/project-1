import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './App'
import { HeadProvider, headTags, type HeadData } from './lib/seo'
import { allPaths, redirects } from './routes'
import { localePath } from './i18n'

export { allPaths, redirects, localePath }

/** Render one URL to HTML plus its head tags. Used by scripts/prerender.mjs. */
export function render(url: string) {
  const collector: { current: HeadData | null } = { current: null }
  const html = renderToString(
    <StrictMode>
      <HeadProvider collector={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>,
  )
  const head = collector.current
  return { html, head: head ? headTags(head) : '', locale: head?.locale ?? 'en' }
}
