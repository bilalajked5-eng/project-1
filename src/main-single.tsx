import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import './styles/globals.css'

/**
 * Single-file build: the whole site in one HTML document. Hash routing
 * (`#/about/`, `#/ar/`) lets every page work when the file is opened
 * directly from disk, with no server.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
