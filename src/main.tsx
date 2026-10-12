import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './styles/globals.css'
import './lib/analytics'

// Google Tag Manager, only when a container ID is configured
const gtm = import.meta.env.VITE_GTM_ID
if (gtm) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`
  document.head.appendChild(s)
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Hydrate only markup prerendered for this exact URL. Error pages and SPA
// fallbacks are served at other URLs, so those render from scratch.
if (root.hasChildNodes() && root.dataset.route === window.location.pathname) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
