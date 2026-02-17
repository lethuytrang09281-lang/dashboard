"use client"

import { useState } from "react"
import type { Lot } from "@/lib/data"
import {
  formatPrice,
  formatCompact,
  typeLabels,
  stageLabels,
  categoryLabels,
} from "@/lib/data"

function CategoryBadge({ category }: { category: Lot["category"] }) {
  const styles: Record<
    Lot["category"],
    { bg: string; text: string }
  > = {
    hot: { bg: "rgba(255, 95, 31, 0.15)", text: "#ff5f1f" },
    good: { bg: "rgba(152, 159, 166, 0.15)", text: "#989FA6" },
    hidden_gem: { bg: "rgba(167, 139, 250, 0.15)", text: "#a78bfa" },
    early_bird: { bg: "rgba(56, 189, 248, 0.15)", text: "#38bdf8" },
    pass: { bg: "rgba(82, 82, 91, 0.15)", text: "#52525b" },
  }
  const s = styles[category]
  return (
    <span
      className="whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
      style={{ background: s.bg, color: s.text }}
    >
      {categoryLabels[category]}
    </span>
  )
}

function LotRow({
  lot,
  rank,
  onSelect,
  isSelected,
}: {
  lot: Lot
  rank: number
  onSelect: (lot: Lot) => void
  isSelected: boolean
}) {
  const marketTotal = lot.marketPricePerM2 * lot.areaM2
  const deviation = Math.round(
    ((lot.currentPrice - marketTotal) / marketTotal) * 100
  )

  return (
    <button
      onClick={() => onSelect(lot)}
      className={`flex w-full items-center gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
        isSelected ? "bg-muted/80" : ""
      }`}
    >
      {/* Rank */}
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
          rank <= 3
            ? rank === 1
              ? "text-background"
              : "text-background"
            : "text-muted-foreground"
        }`}
        style={{
          background:
            rank === 1
              ? "#ff5f1f"
              : rank === 2
                ? "#989FA6"
                : rank === 3
                  ? "#cd7f32"
                  : "transparent",
        }}
      >
        {rank}
      </div>

      {/* Lot info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {lot.title}
          </span>
          <CategoryBadge category={lot.category} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{lot.id}</span>
          <span className="text-border">|</span>
          <span>{typeLabels[lot.type]}</span>
          <span className="text-border">|</span>
          <span>{stageLabels[lot.stage]}</span>
        </div>
      </div>

      {/* Score */}
      <div className="flex flex-shrink-0 flex-col items-center gap-0.5">
        <span
          className="font-mono text-lg font-bold"
          style={{
            color:
              lot.dealScore >= 70
                ? "#ff5f1f"
                : lot.dealScore >= 50
                  ? "#989FA6"
                  : "#52525b",
          }}
        >
          {lot.dealScore}
        </span>
        <span className="text-[10px] text-muted-foreground">score</span>
      </div>

      {/* Price */}
      <div className="hidden flex-shrink-0 flex-col items-end gap-0.5 sm:flex">
        <span className="font-mono text-sm font-medium text-foreground">
          {formatCompact(lot.currentPrice)}
        </span>
        <span
          className="font-mono text-xs font-semibold"
          style={{ color: deviation < -30 ? "#ff5f1f" : "#989FA6" }}
        >
          {deviation}%
        </span>
      </div>
    </button>
  )
}

export function LotListing({
  lots,
  selectedLot,
  onSelectLot,
}: {
  lots: Lot[]
  selectedLot: Lot | null
  onSelectLot: (lot: Lot) => void
}) {
  const [filter, setFilter] = useState<Lot["category"] | "all">("all")
  const [sortBy, setSortBy] = useState<"score" | "price" | "discount">(
    "score"
  )

  const filtered =
    filter === "all" ? lots : lots.filter((l) => l.category === filter)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score") return b.dealScore - a.dealScore
    if (sortBy === "price") return a.currentPrice - b.currentPrice
    const deviationA =
      ((a.currentPrice - a.marketPricePerM2 * a.areaM2) /
        (a.marketPricePerM2 * a.areaM2)) *
      100
    const deviationB =
      ((b.currentPrice - b.marketPricePerM2 * b.areaM2) /
        (b.marketPricePerM2 * b.areaM2)) *
      100
    return deviationA - deviationB
  })

  const filters: { key: Lot["category"] | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "hot", label: "Hot" },
    { key: "good", label: "Good" },
    { key: "hidden_gem", label: "Gems" },
    { key: "early_bird", label: "Early" },
  ]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lot Ranking
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {sorted.length} lots
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mx-1 h-4 w-px bg-border" />
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "score" | "price" | "discount")
            }
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
          >
            <option value="score">By Score</option>
            <option value="price">By Price</option>
            <option value="discount">By Discount</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[500px] overflow-y-auto">
        {sorted.map((lot, i) => (
          <LotRow
            key={lot.id}
            lot={lot}
            rank={i + 1}
            onSelect={onSelectLot}
            isSelected={selectedLot?.id === lot.id}
          />
        ))}
      </div>
    </div>
  )
}
