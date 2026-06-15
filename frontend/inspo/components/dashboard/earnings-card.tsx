function Gauge({ value }: { value: number }) {
  // Semicircle from 180deg to 0deg, radius 80, center (100,100)
  const r = 80
  const cx = 100
  const cy = 100
  const circumference = Math.PI * r
  const filled = (value / 100) * circumference

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-[220px]" aria-hidden="true">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--secondary)"
        strokeWidth={16}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        className="fill-foreground text-[28px] font-bold"
      >
        {value}%
      </text>
    </svg>
  )
}

export function EarningsCard() {
  return (
    <article className="flex flex-col rounded-3xl bg-card p-6">
      <h2 className="text-lg font-bold text-foreground">Earnings</h2>
      <p className="mt-1 text-sm text-muted-foreground">Total Expense</p>
      <p className="mt-1 text-3xl font-bold text-primary">$6078.76</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Profit is 34% More than last Month
      </p>
      <div className="mt-auto flex items-end justify-center pt-4">
        <Gauge value={80} />
      </div>
    </article>
  )
}
