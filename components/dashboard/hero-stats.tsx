"use client"

import { useEffect, useState } from "react"
import type { DashboardStats } from "@/lib/data"

export function HeroStats({ stats }: { stats: DashboardStats }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedDiscount, setAnimatedDiscount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const ease = 1 - (1 - progress) * (1 - progress)
      setAnimatedScore(Math.round(ease * stats.avgDealScore))
      setAnimatedDiscount(Math.round(ease * stats.avgDiscount))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [stats.avgDealScore, stats.avgDiscount])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background p-6 lg:p-8">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-20 blur-3xl"
        style={{ background: "hsl(20, 100%, 56%)" }}
      />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Market Overview
          </span>
          <h2 className="text-pretty text-3xl font-bold tracking-tight text-foreground lg:text-5xl">
            {stats.totalLots}{" "}
            <span className="text-muted-foreground">Active Lots</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {stats.lotsProcessedToday} new lots processed today
          </p>
        </div>
        <div className="flex gap-6 lg:gap-10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg Score
            </span>
            <span className="font-mono text-3xl font-bold text-foreground lg:text-4xl">
              {animatedScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <div className="h-16 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg Discount
            </span>
            <span
              className="font-mono text-3xl font-bold lg:text-4xl"
              style={{ color: "#ff5f1f" }}
            >
              -{animatedDiscount}%
            </span>
            <span className="text-xs text-muted-foreground">
              vs market
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
