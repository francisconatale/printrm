import { BadgeCheck, ChevronDown } from "lucide-react"

export function BalanceCard() {
  return (
    <article className="flex flex-col rounded-3xl bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">Balance</h2>
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            <BadgeCheck className="size-4" />
            On track
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          Monthly
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="mt-5 flex gap-3">
        <div className="rounded-2xl bg-secondary px-4 py-3">
          <p className="text-xs text-muted-foreground">Saves</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">43.50%</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              +2.45%
            </span>
          </div>
        </div>
        <div className="rounded-2xl bg-secondary px-4 py-3">
          <p className="text-xs text-muted-foreground">Balance</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">$52,422</span>
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              -4.75%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <svg
          viewBox="0 0 600 180"
          preserveAspectRatio="none"
          className="h-40 w-full text-primary"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 140 C 40 140, 60 90, 100 95 S 150 150, 190 120 C 230 95, 250 60, 290 70 S 340 130, 380 110 C 410 96, 430 70, 470 78 S 540 120, 600 100 L 600 180 L 0 180 Z"
            fill="url(#balanceFill)"
          />
          <path
            d="M0 140 C 40 140, 60 90, 100 95 S 150 150, 190 120 C 230 95, 250 60, 290 70 S 340 130, 380 110 C 410 96, 430 70, 470 78 S 540 120, 600 100"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </article>
  )
}
