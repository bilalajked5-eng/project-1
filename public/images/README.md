# Images

Expected files (referenced by metadata and structured data):

| File | Use |
|---|---|
| `og-projects-world.jpg` | 1200×630 social share image |
| `projects-world-logo.png` | Logo for Organization schema |
| Original logo SVG/PNG (dark and light) | Set paths in `src/components/ui/Logo.tsx` |

Project and interior photography goes here too; register each file in
`src/content/media.ts`, `src/content/services.ts` or `src/content/projects.ts`
by setting `src`, `width` and `height` on the relevant slot.
