"use client"

import { useState } from "react"

export function TopBar({ lastUpdate }: { lastUpdate: string }) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl font-mono text-sm font-black text-background"
          style={{
            background: "#ff5f1f",
            boxShadow: "0 0 20px rgba(255, 95, 31, 0.3)",
          }}
        >
          F
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Fedresurs Pro
          </h1>
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span>
              Sync: {lastUpdate}
            </span>
            <span className="text-border">|</span>
            <span>v3.0</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsRefreshing(true)
            setTimeout(() => setIsRefreshing(false), 1500)
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
          title="Refresh"
          aria-label="Refresh data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isRefreshing ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-muted-foreground hover:text-foreground"
          title="Settings"
          aria-label="Open settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button
          className="rounded-lg px-4 py-2 text-xs font-semibold text-background transition-all hover:opacity-90"
          style={{
            background: "#ff5f1f",
            boxShadow: "0 0 15px rgba(255, 95, 31, 0.2)",
          }}
        >
          Export Report
        </button>
      </div>
    </header>
  )
}
