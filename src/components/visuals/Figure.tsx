import { cn } from '@/lib/cn'

/**
 * Photography slot.
 *
 * ▸ ADDING REAL IMAGERY: drop the asset into `public/images/` and pass
 *   `src="/images/<file>.jpg"`. Until a `src` is supplied, the component
 *   renders a composed abstract panel rather than a grey box — the page
 *   stays presentable in review, and swapping in photography is a one-line
 *   change per usage.
 *
 * Art direction for replacement assets (per brand guidance): Saudi business
 * environments, modern offices, technology and financial operations, data,
 * enterprise interiors, the Riyadh skyline. No handshake stock photography.
 */

interface FigureProps {
  /** Path under /images. Omit to render the abstract placeholder. */
  src?: string
  alt: string
  className?: string
  /** Aspect ratio utility, e.g. `aspect-[4/5]`. */
  ratio?: string
  /** Which abstract composition to draw when no `src` is present. */
  pattern?: 'operations' | 'skyline' | 'team' | 'data'
  /** Lazy by default; set eager for above-the-fold art. */
  priority?: boolean
  overlay?: boolean
}

export function Figure({
  src,
  alt,
  className,
  ratio = 'aspect-[4/3]',
  pattern = 'operations',
  priority,
  overlay,
}: FigureProps) {
  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-panel bg-ink-900 ring-1 ring-ink-900/10',
        ratio,
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className="h-full w-full object-cover"
        />
      ) : (
        <AbstractPanel pattern={pattern} label={alt} />
      )}

      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent"
        />
      )}
    </figure>
  )
}

/** Composed geometric artwork — brand-coloured, deliberately non-literal. */
function AbstractPanel({ pattern, label }: { pattern: NonNullable<FigureProps['pattern']>; label: string }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--azure-800)),rgb(var(--ink-950))_55%,rgb(var(--brand-900)))]" />
      <div className="absolute inset-0 bg-grid-dark [background-size:34px_34px] opacity-40" />

      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`fp-${pattern}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--glow))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="rgb(var(--azure-400))" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {pattern === 'skyline' && (
          <g>
            {/* Abstracted skyline silhouette */}
            <g fill="rgb(var(--brand-400))" opacity="0.16">
              {[
                [40, 190, 34, 110], [82, 150, 26, 150], [116, 208, 30, 92],
                [154, 118, 22, 182], [184, 172, 34, 128], [226, 96, 26, 204],
                [260, 186, 30, 114], [298, 144, 24, 156], [330, 200, 36, 100],
              ].map(([x, y, w, h]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="2" />
              ))}
            </g>
            <path d="M0 240h400" stroke="url(#fp-skyline)" strokeWidth="1.5" fill="none" />
            <circle cx="226" cy="88" r="4" fill="rgb(var(--glow))" />
          </g>
        )}

        {pattern === 'operations' && (
          <g fill="none" stroke={`url(#fp-operations)`} strokeWidth="1.2">
            <circle cx="200" cy="150" r="112" strokeDasharray="4 10" opacity="0.6" />
            <circle cx="200" cy="150" r="72" opacity="0.8" />
            <circle cx="200" cy="150" r="34" />
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180
              return (
                <line
                  key={deg}
                  x1={200 + Math.cos(rad) * 34}
                  y1={150 + Math.sin(rad) * 34}
                  x2={200 + Math.cos(rad) * 112}
                  y2={150 + Math.sin(rad) * 112}
                  opacity="0.55"
                />
              )
            })}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180
              return (
                <circle
                  key={`d${deg}`}
                  cx={200 + Math.cos(rad) * 112}
                  cy={150 + Math.sin(rad) * 112}
                  r="3.5"
                  fill="rgb(var(--glow))"
                  stroke="none"
                />
              )
            })}
          </g>
        )}

        {pattern === 'team' && (
          <g>
            {/* Overlapping presence fields — people as a system, not portraits */}
            {[
              [120, 150, 62], [200, 120, 78], [280, 165, 58], [168, 205, 46],
            ].map(([cx, cy, r]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="rgb(var(--brand-400))"
                fillOpacity="0.07"
                stroke="url(#fp-team)"
                strokeWidth="1"
              />
            ))}
            {[[120, 150], [200, 120], [280, 165], [168, 205]].map(([cx, cy]) => (
              <circle key={`c${cx}`} cx={cx} cy={cy} r="4" fill="rgb(var(--glow))" />
            ))}
          </g>
        )}

        {pattern === 'data' && (
          <g>
            <path
              d="M20 220 C 90 220, 110 150, 180 150 S 260 96, 320 96 380 62, 390 62"
              fill="none"
              stroke="url(#fp-data)"
              strokeWidth="2"
            />
            <path
              d="M20 250 C 90 250, 120 200, 190 200 S 270 168, 330 168 384 140, 390 140"
              fill="none"
              stroke="rgb(var(--azure-300))"
              strokeOpacity="0.35"
              strokeWidth="1.4"
            />
            {[
              [20, 236], [104, 190], [188, 158], [272, 118], [356, 76],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="3.6" fill="rgb(var(--glow))" />
            ))}
            <g opacity="0.2" fill="rgb(var(--brand-300))">
              {[240, 262, 284, 306, 328].map((x, i) => (
                <rect key={x} x={x} y={250 - i * 12} width="10" height={i * 12 + 24} rx="2" />
              ))}
            </g>
          </g>
        )}
      </svg>

      {/* Screen-reader users get the alt from <img>; here the label is decorative-adjacent */}
      <span className="sr-only">{label}</span>
    </div>
  )
}
