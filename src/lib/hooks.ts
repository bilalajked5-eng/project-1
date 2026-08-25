import { useCallback, useEffect, useRef, useState } from 'react'

/** True when the user has asked the OS to minimise motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Observe an element and report the first time it enters the viewport.
 * Disconnects immediately after firing so scrolling stays cheap.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, inView }
}

/**
 * Count from 0 to `target` once triggered, easing out so the final digits
 * settle rather than snap. Returns the target immediately when motion is
 * reduced, so the number is still readable.
 */
export function useCountUp(target: number, active: boolean, duration = 1900) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(0)
  const frame = useRef<number>()

  useEffect(() => {
    if (!active) return

    if (reduced) {
      setValue(target)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo — fast start, long graceful settle
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(target * eased)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [active, target, duration, reduced])

  return value
}

/** True once the window has scrolled past `offset` pixels. */
export function useScrolled(offset = 12): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const update = () => {
      setScrolled(window.scrollY > offset)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}

/**
 * Normalised pointer offset (-0.5 → 0.5 on each axis) for parallax.
 * Inert when motion is reduced or on coarse pointers, where it would only
 * cost battery.
 */
export function usePointerParallax<T extends HTMLElement = HTMLDivElement>(strength = 1) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<T | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let ticking = false
    const onMove = (event: PointerEvent) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect()
        setOffset({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * strength,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * strength,
        })
        ticking = false
      })
    }
    const onLeave = () => setOffset({ x: 0, y: 0 })

    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, strength])

  return { ref, offset }
}

/** Lock body scroll while a full-screen overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`
    return () => {
      document.body.style.overflow = original
      document.body.style.paddingInlineEnd = ''
    }
  }, [locked])
}

/** Trap focus inside a container — used by the mobile menu. */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null)

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !ref.current) return
    const focusable = ref.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    if (!active) return
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, onKeyDown])

  return ref
}
