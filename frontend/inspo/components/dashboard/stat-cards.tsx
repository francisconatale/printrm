import { Users, Wallet } from "lucide-react"

function MiniBars({ className }: { className?: string }) {
  const heights = [10, 16, 13, 22, 18, 28, 24]
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 11}
          y={32 - h}
          width={6}
          height={h}
          rx={2}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

function MiniWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M0 22 C 12 22, 14 10, 26 10 S 40 24, 52 18 S 70 6, 80 12"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

function MiniSquiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M2 26 C 18 26, 16 6, 30 16 S 46 30, 58 12 S 72 4, 78 8"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StatCards() {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <article className="flex items-center justify-between rounded-3xl bg-card p-5">
        <div>
          <p className="text-sm text-muted-foreground">Spent this month</p>
          <p className="mt-1 text-2xl font-bold text-foreground">$682.5</p>
        </div>
        <MiniBars className="h-8 w-20 text-primary" />
      </article>

      <article className="flex items-center justify-between rounded-3xl bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">New clients</p>
            <p className="mt-1 text-2xl font-bold text-foreground">321</p>
          </div>
        </div>
        <MiniWave className="h-8 w-16 text-muted-foreground" />
      </article>

      <article className="flex items-center justify-between rounded-3xl bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Earnings</p>
            <p className="mt-1 text-2xl font-bold text-foreground">$350.40</p>
          </div>
        </div>
        <MiniWave className="h-8 w-16 text-muted-foreground" />
      </article>

      <article className="flex items-center justify-between rounded-3xl bg-primary p-5 text-primary-foreground">
        <div>
          <p className="text-sm text-primary-foreground/80">Activity</p>
          <p className="mt-1 text-2xl font-bold">$540.50</p>
        </div>
        <MiniSquiggle className="h-9 w-20 text-primary-foreground" />
      </article>
    </section>
  )
}
