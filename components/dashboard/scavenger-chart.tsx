"use client"

import { useMemo } from "react"
import type { Lot } from "@/lib/data"
import { formatPrice, formatCompact } from "@/lib/data"

export function ScavengerChart({ lot }: { lot: Lot }) {
  const history = lot.priceHistory
  const marketTotal = lot.marketPricePerM2 * lot.areaM2
  const sweetSpot = Math.round(lot.startPrice * 0.65)

  const { maxPrice, minPrice, points, marketY, sweetSpotY } = useMemo(() => {
    const allPrices = [...history.map((h) => h.price), marketTotal]
    const max = Math.max(...allPrices) * 1.1
    const min = Math.min(...allPrices) * 0.9
    const range = max - min

    const w = 100
    const h = 100
    const stepX = w / (history.length - 1 || 1)

    const pts = history.map((item, i) => ({
      x: i * stepX,
      y: h - ((item.price - min) / range) * h,
      price: item.price,
      label: item.period,
    }))

    return {
      maxPrice: max,
      minPrice: min,
      points: pts,
      marketY: h - ((marketTotal - min) / range) * h,
      sweetSpotY: h - ((sweetSpot - min) / range) * h,
    }
  }, [history, marketTotal, sweetSpot])

  const stairPath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      return `H ${p.x} V ${p.y}`
    })
    .join(" ")

  const areaPath = `${stairPath} H ${points[points.length - 1].x} V 100 H 0 Z`

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scavenger Chart
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
            <span className="text-xs text-muted-foreground">Market</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: "#ff5f1f" }} />
            <span className="text-xs text-muted-foreground">Price</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: "#38bdf8" }}
            />
            <span className="text-xs text-muted-foreground">Sweet Spot</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-[2.5/1] w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* Profit gap area */}
          <defs>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.15)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </linearGradient>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 95, 31, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 95, 31, 0)" />
            </linearGradient>
          </defs>

          {/* Price area fill */}
          <path d={areaPath} fill="url(#priceGrad)" />

          {/* Market line */}
          <line
            x1="0"
            y1={marketY}
            x2="100"
            y2={marketY}
            stroke="#22c55e"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.7"
          />

          {/* Sweet spot line */}
          <line
            x1="0"
            y1={sweetSpotY}
            x2="100"
            y2={sweetSpotY}
            stroke="#38bdf8"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
            opacity="0.5"
          />

          {/* Stair-step price line */}
          <path
            d={stairPath}
            fill="none"
            stroke="#ff5f1f"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Dots on each step */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1"
              fill="#ff5f1f"
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {/* Labels */}
        <div
          className="absolute right-0 text-xs text-muted-foreground"
          style={{ top: `${marketY}%`, transform: "translateY(-50%)" }}
        >
          <span
            className="rounded bg-background/80 px-1 font-mono text-[10px]"
            style={{ color: "#22c55e" }}
          >
            {formatCompact(marketTotal)}
          </span>
        </div>
      </div>

      {/* Price steps below chart */}
      <div className="flex gap-1 overflow-x-auto">
        {history.map((item, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
          >
            <span className="font-mono text-[10px] text-muted-foreground">
              {formatCompact(item.price)}
            </span>
            <span className="text-[9px] text-muted-foreground/60">
              {item.period.replace("Период ", "P")}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground">
            Start Price
          </span>
          <span className="font-mono text-xs text-foreground">
            {formatPrice(lot.startPrice)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase text-muted-foreground">
            Sweet Spot
          </span>
          <span className="font-mono text-xs" style={{ color: "#38bdf8" }}>
            {formatPrice(sweetSpot)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-muted-foreground">
            Profit Gap
          </span>
          <span className="font-mono text-xs font-bold" style={{ color: "#22c55e" }}>
            +{formatPrice(marketTotal - lot.currentPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}
