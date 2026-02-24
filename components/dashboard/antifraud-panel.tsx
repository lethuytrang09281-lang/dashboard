"use client"

import type { Lot } from "@/lib/data"

function RiskMeter({
  label,
  value,
  maxValue,
  unit,
  thresholdHigh,
  color,
}: {
  label: string
  value: number
  maxValue: number
  unit?: string
  thresholdHigh: number
  color: string
}) {
  const isWarning = value >= thresholdHigh
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className="font-mono text-sm font-semibold"
          style={{ color: isWarning ? "#ef4444" : color }}
        >
          {value}
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(value / maxValue) * 100}%`,
            background: isWarning
              ? "linear-gradient(90deg, #ef4444, #dc2626)"
              : `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
        {/* Threshold mark */}
        <div
          className="absolute inset-y-0 w-px"
          style={{
            left: `${(thresholdHigh / maxValue) * 100}%`,
            background: "#ef4444",
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  )
}

export function AntifraudPanel({ lot }: { lot: Lot }) {
  const overallRisk =
    lot.fraudRisk >= 30 ? "HIGH" : lot.fraudRisk >= 15 ? "MEDIUM" : "LOW"
  const riskColor =
    overallRisk === "HIGH"
      ? "#ef4444"
      : overallRisk === "MEDIUM"
        ? "#f59e0b"
        : "#22c55e"

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Antifraud Protection
        </span>
        <div
          className="rounded-md px-2.5 py-1 text-xs font-bold uppercase"
          style={{
            background: `${riskColor}20`,
            color: riskColor,
          }}
        >
          {overallRisk} RISK
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <RiskMeter
          label="Manager Karma"
          value={lot.managerKarma}
          maxValue={100}
          thresholdHigh={40}
          color="#989FA6"
        />
        <RiskMeter
          label="Price Velocity"
          value={lot.velocity}
          maxValue={100}
          unit="%/period"
          thresholdHigh={50}
          color="#ff5f1f"
        />
        <RiskMeter
          label="Fraud Score"
          value={lot.fraudRisk}
          maxValue={100}
          thresholdHigh={30}
          color="#f59e0b"
        />
      </div>

      {/* NLP Red Flags */}
      {lot.nlpFlags.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            NLP Red Flags
          </span>
          <div className="flex flex-wrap gap-2">
            {lot.nlpFlags.map((flag, i) => (
              <span
                key={i}
                className="rounded-md border px-2 py-1 font-mono text-xs"
                style={{
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.08)",
                }}
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Manager info */}
      <div className="flex items-center gap-3 border-t border-border pt-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold"
          style={{
            background:
              lot.managerKarma >= 60
                ? "rgba(152, 159, 166, 0.15)"
                : "rgba(239, 68, 68, 0.15)",
            color: lot.managerKarma >= 60 ? "#989FA6" : "#ef4444",
          }}
        >
          {lot.managerName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {lot.managerName}
          </span>
          <span className="text-xs text-muted-foreground">
            Karma: {lot.managerKarma}/100
          </span>
        </div>
      </div>
    </div>
  )
}
