"use client"

import { useEffect, useState } from "react"
import type { DashboardStats } from "@/lib/data"

interface KpiCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  glowColor: string
  delay?: number
}

function KpiCard({ label, value, icon, color, glowColor, delay = 0 }: KpiCardProps) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0
      const duration = 1200
      const startTime = performance.now()
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = 1 - (1 - progress) * (1 - progress)
        start = Math.round(ease * value)
        setDisplayed(start)
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:border-muted-foreground/30"
      style={{
        boxShadow: `0 0 30px ${glowColor}, 0 10px 30px rgba(0,0,0,0.4)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: glowColor, color }}
        >
          {icon}
        </div>
      </div>
      <div
        className="font-mono text-4xl font-bold tracking-tight"
        style={{ color }}
      >
        {displayed}
      </div>
      <div className="mt-auto h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${Math.min((displayed / Math.max(value, 1)) * 100, 100)}%`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  )
}

export function KpiCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="stagger-children grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        label="Hot Deals"
        value={stats.hotDeals}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        }
        color="#ff5f1f"
        glowColor="rgba(255, 95, 31, 0.12)"
        delay={0}
      />
      <KpiCard
        label="Good Opportunities"
        value={stats.goodOpportunities}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        }
        color="#989FA6"
        glowColor="rgba(152, 159, 166, 0.12)"
        delay={80}
      />
      <KpiCard
        label="Hidden Gems"
        value={stats.hiddenGems}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
        }
        color="#a78bfa"
        glowColor="rgba(167, 139, 250, 0.12)"
        delay={160}
      />
      <KpiCard
        label="Early Bird"
        value={stats.earlyBird}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        }
        color="#38bdf8"
        glowColor="rgba(56, 189, 248, 0.12)"
        delay={240}
      />
    </div>
  )
}
