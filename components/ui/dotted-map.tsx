import * as React from "react"
import { createMap } from "svg-dotted-map"

import { cn } from "@/lib/utils"

export interface Marker {
  lat: number
  lng: number
  size?: number
  pulse?: boolean
}

/** addMarkers returns markers with lat/lng removed; only x, y and other props (e.g. size) remain */
type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
  x: number
  y: number
}

export interface MarkerConnection {
  /** Index into the `markers` array. */
  from: number
  /** Index into the `markers` array. */
  to: number
}

export interface DottedMapProps<
  M extends Marker = Marker,
> extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  mapSamples?: number
  markers?: readonly M[]
  /** Dotted strokes between marker indices (great-circle samples, same projection as markers). */
  connections?: readonly MarkerConnection[]
  connectionColor?: string
  dotColor?: string
  markerColor?: string
  dotRadius?: number
  stagger?: boolean
  pulse?: boolean

  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>
    index: number
    x: number
    y: number
    r: number
  }) => React.ReactNode
}

const ARC_STEPS = 28

function toRad(degrees: number) {
  return (degrees * Math.PI) / 180
}

function toDeg(radians: number) {
  return (radians * 180) / Math.PI
}

/** Shortest-path spherical interpolation between two geographic points. */
function greatCircleSamples(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  steps: number,
): Array<{ lat: number; lng: number }> {
  const φ1 = toRad(lat1)
  const λ1 = toRad(lng1)
  const φ2 = toRad(lat2)
  let dλ = toRad(lng2) - λ1
  if (dλ > Math.PI) dλ -= 2 * Math.PI
  if (dλ < -Math.PI) dλ += 2 * Math.PI
  const λ2 = λ1 + dλ

  const cosφ1 = Math.cos(φ1)
  const cosφ2 = Math.cos(φ2)
  const sinHalfΔφ = Math.sin((φ2 - φ1) / 2)
  const sinHalfΔλ = Math.sin(dλ / 2)
  const a = sinHalfΔφ * sinHalfΔφ + cosφ1 * cosφ2 * sinHalfΔλ * sinHalfΔλ
  const δ = 2 * Math.asin(Math.min(1, Math.sqrt(a)))

  if (!Number.isFinite(δ) || δ < 1e-6) {
    return [
      { lat: lat1, lng: lng1 },
      { lat: lat2, lng: lng2 },
    ]
  }

  const sinδ = Math.sin(δ)
  const samples: Array<{ lat: number; lng: number }> = []

  for (let i = 0; i <= steps; i++) {
    const f = i / steps
    const A = Math.sin((1 - f) * δ) / sinδ
    const B = Math.sin(f * δ) / sinδ
    const x = A * cosφ1 * Math.cos(λ1) + B * cosφ2 * Math.cos(λ2)
    const y = A * cosφ1 * Math.sin(λ1) + B * cosφ2 * Math.sin(λ2)
    const z = A * Math.sin(φ1) + B * Math.sin(φ2)
    samples.push({
      lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
      lng: toDeg(Math.atan2(y, x)),
    })
  }

  return samples
}

/** Split when the projected polyline jumps across the antimeridian wrap. */
function polylinePaths(
  points: ReadonlyArray<{ x: number; y: number }>,
  mapWidth: number,
): string[] {
  if (points.length < 2) return []

  const paths: string[] = []
  let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`
  let prev = points[0]!
  const wrap = mapWidth * 0.45

  for (let i = 1; i < points.length; i++) {
    const point = points[i]!
    if (Math.abs(point.x - prev.x) > wrap) {
      paths.push(d)
      d = `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    } else {
      d += ` L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    }
    prev = point
  }

  paths.push(d)
  return paths
}

export function DottedMap<M extends Marker = Marker>({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  connections = [],
  connectionColor = "currentColor",
  dotColor = "currentColor",
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}: DottedMapProps<M>) {
  const { points, addMarkers } = createMap({
    width,
    height,
    mapSamples,
  })
  const processedMarkers = addMarkers(markers ? [...markers] : [])

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x)
    const rowMap = new Map<number, number>()
    let step = 0
    let prevY = Number.NaN
    let prevXInRow = Number.NaN

    for (const p of sorted) {
      if (p.y !== prevY) {
        // new row
        prevY = p.y
        prevXInRow = Number.NaN
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size)
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta)
      }
      prevXInRow = p.x
    }

    return { xStep: step || 1, yToRowIndex: rowMap }
  }, [points])

  const place = React.useCallback(
    (x: number, y: number) => {
      const rowIndex = yToRowIndex.get(y) ?? 0
      const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0
      return { x: x + offsetX, y }
    },
    [stagger, xStep, yToRowIndex],
  )

  const placedMarkers = processedMarkers.map((marker) => {
    const placed = place(marker.x, marker.y)
    return {
      ...marker,
      x: placed.x,
      y: placed.y,
    }
  })

  const connected = React.useMemo(() => {
    const set = new Set<number>()
    for (const link of connections) {
      set.add(link.from)
      set.add(link.to)
    }
    return set
  }, [connections])

  const connectionPaths = React.useMemo(() => {
    return connections.flatMap((link, index) => {
      const fromGeo = markers[link.from]
      const toGeo = markers[link.to]
      const fromPlaced = placedMarkers[link.from]
      const toPlaced = placedMarkers[link.to]
      if (!fromGeo || !toGeo || !fromPlaced || !toPlaced) return []

      const samples = greatCircleSamples(
        fromGeo.lat,
        fromGeo.lng,
        toGeo.lat,
        toGeo.lng,
        ARC_STEPS,
      )
      const projected = addMarkers(samples.map((sample) => ({ ...sample })))
      const placed = projected.map((sample) => place(sample.x, sample.y))

      // Anchor ends exactly on the visible markers so the stroke meets the dots.
      if (placed.length >= 2) {
        placed[0] = { x: fromPlaced.x, y: fromPlaced.y }
        placed[placed.length - 1] = { x: toPlaced.x, y: toPlaced.y }
      }

      return polylinePaths(placed, width).map((d, pathIndex) => ({
        key: `arc-${link.from}-${link.to}-${index}-${pathIndex}`,
        d,
      }))
    })
  }, [addMarkers, connections, markers, place, placedMarkers, width])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      {points.map((point, index) => {
        const placed = place(point.x, point.y)
        return (
          <circle
            cx={placed.x}
            cy={placed.y}
            r={dotRadius}
            fill={dotColor}
            key={`${point.x}-${point.y}-${index}`}
          />
        )
      })}

      {connectionPaths.map(({ key, d }) => (
        <g key={key} pointerEvents="none">
          {/* Soft under-stroke so the route stays readable on dense land dots. */}
          <path
            d={d}
            fill="none"
            stroke={connectionColor}
            strokeWidth={1.15}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.14}
          />
          <path
            d={d}
            fill="none"
            stroke={connectionColor}
            strokeWidth={0.55}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0.55 1.45"
            strokeOpacity={0.78}
          />
        </g>
      ))}

      {placedMarkers.map((marker, index) => {
        const x = marker.x
        const y = marker.y
        const r = marker.size ?? dotRadius
        const isLinked = connected.has(index)
        const shouldPulse = isLinked
          ? false
          : pulse
            ? marker.pulse !== false
            : marker.pulse === true
        const pulseTo = r * 2.8

        return (
          <g key={`${marker.x}-${marker.y}-${index}`}>
            {isLinked ? (
              <circle
                cx={x}
                cy={y}
                r={r + 1.05}
                fill="none"
                stroke={connectionColor}
                strokeWidth={0.4}
                strokeOpacity={0.55}
              />
            ) : null}

            <circle cx={x} cy={y} r={r} fill={markerColor} />

            {shouldPulse ? (
              <g pointerEvents="none">
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={1}
                  strokeWidth={0.35}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={0.9}
                  strokeWidth={0.3}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0"
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ) : null}

            {renderMarkerOverlay?.({
              marker: { ...marker, x, y },
              index,
              x,
              y,
              r,
            })}
          </g>
        )
      })}
    </svg>
  )
}
