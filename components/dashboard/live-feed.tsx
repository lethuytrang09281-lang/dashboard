"use client"

import { useEffect, useState } from "react"
import type { Lot } from "@/lib/data"
import { formatCompact, categoryLabels, typeLabels } from "@/lib/data"

interface FeedItem {
  lot: Lot
  timestamp: Date
}

export function LiveFeed({ lots }: { lots: Lot[] }) {
  const [feed, setFeed] = useState<FeedItem[]>([])

  useEffect(() => {
    // Simulate initial feed
    const initial = lots
      .filter((l) => l.category === "hot" || l.category === "good")
      .slice(0, 5)
      .map((lot) => ({
        lot,
        timestamp: new Date(Date.now() - Math.random() * 3600000),
      }))
    setFeed(initial)

    // Simulate SSE-like feed
    const interval = setInterval(() => {
      const randomLot = lots[Math.floor(Math.random() * lots.length)]
      if (randomLot.dealScore >= 50) {
        setFeed((prev) => [
          { lot: randomLot, timestamp: new Date() },
          ...prev.slice(0, 7),
        ])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [lots])

  const categoryColors: Record<string, string> = {
    hot: "#ff5f1f",
    good: "#989FA6",
    hidden_gem: "#a78bfa",
    early_bird: "#38bdf8",
    pass: "#52525b",
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Feed
          </span>
          <span className="relative flex h-2 w-2">
            <span
              className="animate-pulse-glow absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#22c55e" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: "#22c55e" }}
            />
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          SSE STREAM
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {feed.map((item, i) => (
          <div
            key={`${item.lot.id}-${i}`}
            className="animate-slide-up flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Category dot */}
            <div
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{
                background: categoryColors[item.lot.category] || "#52525b",
                boxShadow: `0 0 6px ${categoryColors[item.lot.category] || "#52525b"}50`,
              }}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-medium text-foreground">
                  {typeLabels[item.lot.type]} {item.lot.areaM2}m
                  <sup>2</sup> - {item.lot.district}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span>{item.lot.id}</span>
                <span className="text-border">|</span>
                <span
                  style={{
                    color: categoryColors[item.lot.category],
                  }}
                >
                  {categoryLabels[item.lot.category]}
                </span>
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
              <span
                className="font-mono text-sm font-bold"
                style={{
                  color:
                    item.lot.dealScore >= 70
                      ? "#ff5f1f"
                      : "#989FA6",
                }}
              >
                {item.lot.dealScore}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {formatCompact(item.lot.currentPrice)}
              </span>
            </div>
          </div>
        ))}

        {feed.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Waiting for new deals...
          </div>
        )}
      </div>
    </div>
  )
}
