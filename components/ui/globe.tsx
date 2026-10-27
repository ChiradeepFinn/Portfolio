"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

/** Enough margin that the globe is drawing again before it scrolls into view. */
const VIEWPORT_MARGIN = "200px"

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

/**
 * A WebGL globe that only runs while somebody can see it.
 *
 * cobe owns its own `requestAnimationFrame` loop and offers no pause, so the
 * only way to stop the work is to destroy the instance. Off screen or on a
 * hidden tab, the instance is destroyed and the GPU goes quiet; the canvas
 * stays in the DOM so it can be observed, and the rotation is kept in a ref so
 * the globe comes back where it left off rather than snapping to zero.
 *
 * Reduced motion is handled differently: the globe is still drawn - removing it
 * would take the content away - it simply stops turning, and drag still works.
 */
export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [active, setActive] = useState(false)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  // Declared first so the instance is never created for a globe that is already
  // out of view on mount.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (typeof IntersectionObserver === "undefined") {
      setActive(true)
      return
    }

    let onScreen = false
    const apply = () => setActive(onScreen && !document.hidden)

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (!entry) return
        onScreen = entry.isIntersecting
        apply()
      },
      { rootMargin: VIEWPORT_MARGIN },
    )

    observer.observe(canvas)
    document.addEventListener("visibilitychange", apply)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", apply)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return

    const onResize = () => {
      widthRef.current = canvas.offsetWidth
    }

    window.addEventListener("resize", onResize)
    onResize()

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let spinning = !reduceMotion.matches
    const onPreferenceChange = () => {
      spinning = !reduceMotion.matches
    }
    reduceMotion.addEventListener("change", onPreferenceChange)

    const globe = createGlobe(canvas, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (spinning && !pointerInteracting.current) phiRef.current += 0.005
        state.phi = phiRef.current + rs.get()
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    const reveal = window.setTimeout(() => {
      canvas.style.opacity = "1"
    }, 0)

    return () => {
      window.clearTimeout(reveal)
      canvas.style.opacity = "0"
      reduceMotion.removeEventListener("change", onPreferenceChange)
      window.removeEventListener("resize", onResize)
      globe.destroy()
    }
  }, [active, rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
