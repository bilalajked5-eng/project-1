import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Ambient network field for the dark technology section.
 * Sits behind content at low opacity — structure you notice on the second
 * look, never on the first.
 */

const POINTS = [
  { x: 60, y: 120 }, { x: 178, y: 68 }, { x: 292, y: 140 }, { x: 404, y: 92 },
  { x: 520, y: 158 }, { x: 636, y: 96 }, { x: 748, y: 168 }, { x: 862, y: 110 },
  { x: 118, y: 268 }, { x: 236, y: 212 }, { x: 352, y: 286 }, { x: 470, y: 232 },
  { x: 586, y: 300 }, { x: 700, y: 244 }, { x: 818, y: 312 }, { x: 926, y: 252 },
  { x: 62, y: 400 }, { x: 180, y: 356 }, { x: 300, y: 424 }, { x: 416, y: 368 },
  { x: 534, y: 436 }, { x: 652, y: 380 }, { x: 768, y: 448 }, { x: 884, y: 392 },
]

/** Connect each point to the next and to the one a row below — a lattice, not a mesh. */
const LINKS = POINTS.flatMap((p, i) => {
  const out: Array<{ a: typeof p; b: typeof p; key: string }> = []
  const right = POINTS[i + 1]
  const below = POINTS[i + 8]
  if (right && (i + 1) % 8 !== 0) out.push({ a: p, b: right, key: `r${i}` })
  if (below) out.push({ a: p, b: below, key: `b${i}` })
  return out
})

export function NetworkVisual({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <svg
      viewBox="0 0 980 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nv-link" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--brand-400))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(var(--azure-400))" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id="nv-vignette" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <mask id="nv-mask">
          <rect width="980" height="500" fill="url(#nv-vignette)" />
        </mask>
      </defs>

      <g mask="url(#nv-mask)">
        <g stroke="url(#nv-link)" strokeWidth="1">
          {LINKS.map((l) => (
            <line key={l.key} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} />
          ))}
        </g>

        <g>
          {POINTS.map((p, i) => (
            <circle
              key={`${p.x}-${p.y}`}
              cx={p.x}
              cy={p.y}
              r={i % 5 === 0 ? 3.4 : 2}
              fill={i % 5 === 0 ? 'rgb(var(--glow))' : 'rgb(var(--brand-300))'}
              opacity={i % 5 === 0 ? 0.95 : 0.55}
              className={reduced || i % 5 !== 0 ? undefined : 'animate-orbit-pulse'}
              style={reduced ? undefined : { animationDelay: `${(i % 7) * 0.5}s` }}
            />
          ))}
        </g>
      </g>
    </svg>
  )
}

/**
 * Horizontal animated data lines — used as a section divider and behind
 * the metrics band.
 */
export function DataLines({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const paths = [
    'M0 44 C 180 44, 220 12, 400 12 S 620 76, 800 76 1000 30, 1200 30',
    'M0 74 C 200 74, 240 108, 440 108 S 660 44, 860 44 1040 88, 1200 88',
    'M0 20 C 160 20, 200 62, 380 62 S 640 100, 840 100 1030 58, 1200 58',
  ]

  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="dl-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--brand-500))" stopOpacity="0" />
          <stop offset="35%" stopColor="rgb(var(--brand-500))" stopOpacity="0.5" />
          <stop offset="65%" stopColor="rgb(var(--azure-500))" stopOpacity="0.45" />
          <stop offset="100%" stopColor="rgb(var(--azure-500))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="url(#dl-grad)"
          strokeWidth={i === 0 ? 1.4 : 1}
          opacity={i === 0 ? 0.9 : 0.5}
          style={
            reduced
              ? undefined
              : {
                  strokeDasharray: 1600,
                  strokeDashoffset: 1600,
                  animation: `draw-line 3s cubic-bezier(0.22,1,0.36,1) ${i * 0.3}s forwards`,
                  ['--dash' as string]: '1600',
                }
          }
        />
      ))}
    </svg>
  )
}
