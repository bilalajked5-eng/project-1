import { usePointerParallax, usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Hero visual — an abstract system diagram rather than decoration.
 *
 * It reads as: inputs on the outer ring flow through a processing core and
 * out as measured performance. Automation, data, connected workflows and AI
 * are all present as structure, not as clip-art. Everything is inline SVG so
 * there is no image weight and it stays crisp at any size.
 */

/* Node positions on a 520×520 stage. Kept as data so the graph is editable. */
const NODES = [
  { id: 'n1', x: 92, y: 132, r: 5 },
  { id: 'n2', x: 76, y: 288, r: 4 },
  { id: 'n3', x: 150, y: 402, r: 5.5 },
  { id: 'n4', x: 302, y: 84, r: 4.5 },
  { id: 'n5', x: 420, y: 176, r: 5 },
  { id: 'n6', x: 438, y: 330, r: 4 },
  { id: 'n7', x: 330, y: 424, r: 5.5 },
  { id: 'n8', x: 196, y: 96, r: 4 },
]

/* Curved flows from the periphery into the core at (260, 260). */
const FLOWS = [
  'M92 132 C 168 168, 196 214, 260 260',
  'M76 288 C 148 276, 194 268, 260 260',
  'M150 402 C 190 350, 218 300, 260 260',
  'M302 84 C 288 152, 272 208, 260 260',
  'M420 176 C 366 200, 310 232, 260 260',
  'M438 330 C 380 310, 312 282, 260 260',
  'M330 424 C 306 362, 278 306, 260 260',
  'M196 96 C 216 158, 240 212, 260 260',
]

export function HeroVisual({ ariaLabel }: { ariaLabel: string }) {
  const reduced = usePrefersReducedMotion()
  const { ref, offset } = usePointerParallax<HTMLDivElement>(1)

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Ambient brand glow behind the structure */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(var(--brand-500)/0.16),transparent_66%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(var(--azure-500)/0.14),transparent_62%)] blur-3xl"
      />

      <svg
        viewBox="0 0 520 520"
        className="relative h-full w-full overflow-visible"
        style={{
          transform: reduced
            ? undefined
            : `translate3d(${offset.x * 14}px, ${offset.y * 14}px, 0)`,
          transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hv-flow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--azure-500))" stopOpacity="0.12" />
            <stop offset="55%" stopColor="rgb(var(--brand-500))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(var(--glow))" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="hv-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--brand-500))" stopOpacity="0.42" />
            <stop offset="50%" stopColor="rgb(var(--azure-500))" stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgb(var(--brand-400))" stopOpacity="0.38" />
          </linearGradient>

          <radialGradient id="hv-core" cx="42%" cy="36%">
            <stop offset="0%" stopColor="rgb(var(--glow))" stopOpacity="0.95" />
            <stop offset="45%" stopColor="rgb(var(--brand-500))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(var(--azure-700))" stopOpacity="0.95" />
          </radialGradient>

          <filter id="hv-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>

          {/* Fine measurement grid, faded at the edges */}
          <pattern id="hv-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0V26" fill="none" stroke="rgb(var(--ink-900))" strokeOpacity="0.055" strokeWidth="1" />
          </pattern>

          <mask id="hv-grid-mask">
            <rect width="520" height="520" fill="url(#hv-fade)" />
          </mask>
          <radialGradient id="hv-fade" cx="50%" cy="50%">
            <stop offset="30%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="520" height="520" fill="url(#hv-grid)" mask="url(#hv-grid-mask)" />

        {/* ── Orbital structure: scale and reach ── */}
        <g fill="none" stroke="url(#hv-ring)">
          <circle cx="260" cy="260" r="238" strokeWidth="1" strokeDasharray="2 9" opacity="0.7" />
          <circle cx="260" cy="260" r="186" strokeWidth="1.1" />
          <circle cx="260" cy="260" r="128" strokeWidth="1" strokeDasharray="5 8" opacity="0.85" />
          {/* Tilted ellipses give depth without literal 3D */}
          <ellipse cx="260" cy="260" rx="238" ry="94" strokeWidth="1" opacity="0.42" />
          <ellipse
            cx="260"
            cy="260"
            rx="238"
            ry="94"
            strokeWidth="1"
            opacity="0.32"
            transform="rotate(62 260 260)"
          />
        </g>

        {/* ── Flow paths: periphery → core ── */}
        <g fill="none" stroke="url(#hv-flow)" strokeWidth="1.5" strokeLinecap="round">
          {FLOWS.map((d, i) => (
            <path
              key={d}
              d={d}
              style={
                reduced
                  ? { opacity: 0.55 }
                  : {
                      strokeDasharray: 320,
                      strokeDashoffset: 320,
                      animation: `draw-line 2.2s cubic-bezier(0.22, 1, 0.36, 1) ${0.35 + i * 0.11}s forwards`,
                      ['--dash' as string]: '320',
                    }
              }
            />
          ))}
        </g>

        {/* ── Travelling data pulses ── */}
        {!reduced && (
          <g>
            {FLOWS.map((d, i) => (
              <circle key={`p-${d}`} r="3.2" fill="rgb(var(--glow))">
                <animateMotion
                  dur={`${3.4 + (i % 4) * 0.55}s`}
                  begin={`${1.6 + i * 0.38}s`}
                  repeatCount="indefinite"
                  path={d}
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="spline"
                  keySplines="0.42 0 0.58 1"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.12;0.8;1"
                  dur={`${3.4 + (i % 4) * 0.55}s`}
                  begin={`${1.6 + i * 0.38}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* ── Peripheral nodes: the operations feeding the system ── */}
        <g>
          {NODES.map((n, i) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 7}
                fill="rgb(var(--brand-500))"
                opacity="0.1"
                className={reduced ? undefined : 'animate-orbit-pulse'}
                style={reduced ? undefined : { animationDelay: `${i * 0.42}s` }}
              />
              <circle cx={n.x} cy={n.y} r={n.r} fill="rgb(var(--brand-600))" />
              <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke="#fff" strokeWidth="1.4" strokeOpacity="0.85" />
            </g>
          ))}
        </g>

        {/* ── Processing core ── */}
        <g>
          <circle cx="260" cy="260" r="62" fill="rgb(var(--brand-500))" opacity="0.22" filter="url(#hv-soft)" />
          <circle cx="260" cy="260" r="44" fill="url(#hv-core)" />
          <circle cx="260" cy="260" r="44" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1" />

          {/* Concentric processing rings */}
          <circle
            cx="260"
            cy="260"
            r="58"
            fill="none"
            stroke="rgb(var(--glow))"
            strokeOpacity="0.55"
            strokeWidth="1.2"
            strokeDasharray="30 14"
          >
            {!reduced && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 260 260"
                to="360 260 260"
                dur="26s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle
            cx="260"
            cy="260"
            r="78"
            fill="none"
            stroke="rgb(var(--azure-400))"
            strokeOpacity="0.32"
            strokeWidth="1"
            strokeDasharray="4 12"
          >
            {!reduced && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 260 260"
                to="0 260 260"
                dur="38s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* Core glyph: the automation loop */}
          <g stroke="#fff" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="246" y="246" width="28" height="28" rx="7" strokeOpacity="0.95" />
            <path d="M260 236v10M260 274v10M236 260h10M274 260h10" strokeOpacity="0.7" />
          </g>
        </g>

        {/* ── Output bars: performance, measured ── */}
        <g transform="translate(356, 372)">
          <rect x="-10" y="-10" width="116" height="90" rx="14" fill="rgb(var(--ink-900))" fillOpacity="0.045" />
          <rect x="-8" y="-8" width="112" height="86" rx="12" fill="#fff" fillOpacity="0.96" stroke="rgb(var(--sand-200))" />
          {[
            { x: 4, h: 26 },
            { x: 26, h: 42 },
            { x: 48, h: 34 },
            { x: 70, h: 58 },
          ].map((bar, i) => (
            <rect
              key={bar.x}
              x={bar.x}
              y={62 - bar.h}
              width="12"
              height={bar.h}
              rx="3"
              fill={i === 3 ? 'rgb(var(--brand-500))' : 'rgb(var(--azure-700))'}
              fillOpacity={i === 3 ? 1 : 0.28}
              style={
                reduced
                  ? undefined
                  : {
                      transformOrigin: `${bar.x + 6}px 62px`,
                      animation: `fade-up 0.8s cubic-bezier(0.16,1,0.3,1) ${1.5 + i * 0.13}s both`,
                    }
              }
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
