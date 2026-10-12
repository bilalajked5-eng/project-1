import type { MediaSlot } from '@/content/types'
import { useLanguage } from '@/i18n'
import { cn, useParallax } from '@/lib/hooks'
import { Art } from '@/components/art/Art'

interface MediaProps {
  slot: MediaSlot
  className?: string
  /** Aspect ratio utility for the frame, e.g. `aspect-[4/5]`. Omit to fill the parent. */
  ratio?: string
  sizes?: string
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean
  /** Hover zoom inside the frame (needs a `group` ancestor). */
  zoom?: boolean
  /** Subtle scroll parallax on the inner image. */
  parallax?: boolean
  /** Hide from assistive tech when the image only repeats nearby text. */
  decorative?: boolean
  /** Slow drift, used on the hero. */
  drift?: boolean
  /** Fill the nearest positioned ancestor (background use). */
  fill?: boolean
}

/**
 * One image frame. Renders the real photograph when `slot.src` is set and
 * the art-directed composition otherwise, with identical sizing either way
 * so swapping photography in never shifts the layout.
 */
export function Media({ slot, className, ratio, sizes = '100vw', priority, zoom, parallax, decorative, drift, fill }: MediaProps) {
  const { tr } = useLanguage()
  const { ref, y } = useParallax<HTMLDivElement>(parallax ? 0.06 : 0)
  const alt = decorative ? '' : tr(slot.alt)

  const inner = slot.src ? (
    <img
      src={slot.src}
      srcSet={slot.srcSet}
      sizes={slot.srcSet ? sizes : undefined}
      width={slot.width}
      height={slot.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // React 18 warns on camelCase fetchPriority; the lowercase attribute is valid HTML
      {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
      className="h-full w-full object-cover"
    />
  ) : (
    <Art variant={slot.art} tone={slot.tone} label={alt || undefined} grain={priority} className="h-full w-full" />
  )

  return (
    <div ref={ref} className={cn(fill ? 'absolute inset-0' : 'relative', 'overflow-hidden bg-ivory-300', zoom && 'zoom-frame', ratio, className)}>
      <div
        className={cn('absolute inset-0', zoom && 'zoom-target', drift && 'ken-burns')}
        style={parallax ? { transform: `translate3d(0, ${y}px, 0) scale(1.12)` } : undefined}
      >
        {inner}
      </div>
    </div>
  )
}
