"use client"

import { useMemo, useState } from "react"
import { generateLots, computeStats, type Lot } from "@/lib/data"
import { TopBar } from "@/components/dashboard/top-bar"
import { HeroStats } from "@/components/dashboard/hero-stats"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { DealScoreCard } from "@/components/dashboard/deal-score-card"
import { ScavengerChart } from "@/components/dashboard/scavenger-chart"
import { AntifraudPanel } from "@/components/dashboard/antifraud-panel"
import { LotListing } from "@/components/dashboard/lot-listing"
import { LiveFeed } from "@/components/dashboard/live-feed"

export default function DashboardPage() {
  const lots = useMemo(() => generateLots(50), [])
  const stats = useMemo(() => computeStats(lots), [lots])
  const [selectedLot, setSelectedLot] = useState<Lot | null>(
    () => lots.sort((a, b) => b.dealScore - a.dealScore)[0] || null
  )

  const lastUpdate = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-5 lg:p-8">
        {/* Top Navigation */}
        <TopBar lastUpdate={lastUpdate} />

        {/* Hero */}
        <HeroStats stats={stats} />

        {/* KPI Cards */}
        <KpiCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Lot Listing (2/3 width) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <LotListing
              lots={lots}
              selectedLot={selectedLot}
              onSelectLot={setSelectedLot}
            />
          </div>

          {/* Right: Detail panel + Live Feed (1/3 width) */}
          <div className="flex flex-col gap-6">
            {selectedLot ? (
              <>
                <DealScoreCard lot={selectedLot} />
                <ScavengerChart lot={selectedLot} />
                <AntifraudPanel lot={selectedLot} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 text-muted-foreground"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-sm text-muted-foreground">
                  Select a lot to view details
                </span>
              </div>
            )}
            <LiveFeed lots={lots} />
          </div>
        </div>
      </main>
    </div>
  )
}
