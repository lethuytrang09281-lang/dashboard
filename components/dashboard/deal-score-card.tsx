"use client"

import { useState } from "react"
import type { Lot } from "@/lib/data"
import { formatPrice } from "@/lib/data"

function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
}: {
  score: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 70 ? "#ff5f1f" : score >= 50 ? "#989FA6" : "#ef4444"

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-lg font-bold text-foreground">
          {score}
        </span>
      </div>
    </div>
  )
}

function ScoreBreakdownBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string
  value: number
  maxValue: number
  color: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-foreground">
          {value > 0 ? "+" : ""}
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(Math.abs(value) / maxValue) * 100}%`,
            background: color,
          }}
        />
      </div>
    </div>
  )
}

export function DealScoreCard({ lot }: { lot: Lot }) {
  const [expanded, setExpanded] = useState(false)
  const marketTotal = lot.marketPricePerM2 * lot.areaM2
  const deviation = Math.round(
    ((lot.currentPrice - marketTotal) / marketTotal) * 100
  )
  const geoBonus = lot.district === "Arbat" || lot.district === "Hamovniki" ? 30 : lot.district === "Tverskoy" ? 20 : 10
  const discountBonus = Math.round(Math.abs(deviation) * 0.8)
  const typeBonus = lot.type === "mkd" || lot.type === "office" ? 15 : 10

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Investment Scoring
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {expanded ? "Hide" : "Details"}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <ScoreRing score={lot.dealScore} />
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-sm text-muted-foreground">Deal Score</div>
          <div className="font-mono text-2xl font-bold text-foreground">
            {lot.dealScore}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}/ 100
            </span>
          </div>
          <div className="mt-1 font-mono text-xs text-muted-foreground">
            {"Investment "}
            <span className="text-foreground">{lot.investmentScore}</span>
            {" - (Fraud "}
            <span style={{ color: "#ef4444" }}>{lot.fraudRisk}</span>
            {" x 0.6) = "}
            <span style={{ color: "#ff5f1f" }}>{lot.dealScore}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <ScoreBreakdownBar
            label={`Geography (${lot.district})`}
            value={geoBonus}
            maxValue={40}
            color="#38bdf8"
          />
          <ScoreBreakdownBar
            label={`Discount (${deviation}%)`}
            value={discountBonus}
            maxValue={50}
            color="#ff5f1f"
          />
          <ScoreBreakdownBar
            label={`Asset Type`}
            value={typeBonus}
            maxValue={20}
            color="#989FA6"
          />
          <div className="mt-2 border-t border-border pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fraud Risk Deductions
            </div>
            <ScoreBreakdownBar
              label={`Manager Karma (${lot.managerKarma}/100)`}
              value={lot.managerKarma < 60 ? -(100 - lot.managerKarma) * 0.2 : 0}
              maxValue={20}
              color="#ef4444"
            />
            {lot.nlpFlags.length > 0 && (
              <ScoreBreakdownBar
                label={`NLP Red Flags (${lot.nlpFlags.length})`}
                value={-lot.nlpFlags.length * 8}
                maxValue={20}
                color="#ef4444"
              />
            )}
          </div>
        </div>
      )}

      {/* Market Context */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Market Price</span>
          <span className="font-mono text-sm font-medium text-foreground">
            {formatPrice(marketTotal)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Current</span>
          <span className="font-mono text-sm font-medium" style={{ color: "#ff5f1f" }}>
            {formatPrice(lot.currentPrice)}
          </span>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Deviation</span>
          <span
            className="font-mono text-lg font-bold"
            style={{ color: deviation < -30 ? "#ff5f1f" : "#989FA6" }}
          >
            {deviation}%
          </span>
        </div>
      </div>
    </div>
  )
}
