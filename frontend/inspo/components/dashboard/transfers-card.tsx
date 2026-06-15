const transfers = [
  { name: "From Anna Jones", time: "Today, 14:34", change: "+2.45%", up: true },
  { name: "To Carlos Brown lll", time: "Today, 15:23", change: "-4.75%", up: false },
  { name: "From Joel Cannan", time: "Today, 17:54", change: "+2.45%", up: true },
]

export function TransfersCard() {
  return (
    <article className="flex flex-col rounded-3xl bg-card p-6">
      <h2 className="text-lg font-bold text-foreground">Your Transfers</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {transfers.map((t) => (
          <li key={t.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="h-9 w-1 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.time}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                t.up
                  ? "bg-accent text-accent-foreground"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {t.change}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
