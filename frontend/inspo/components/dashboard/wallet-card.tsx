import { Plus, Wifi } from "lucide-react"

function CreditCard({
  className,
  brand,
  variant,
}: {
  className?: string
  brand: string
  variant: "light" | "green" | "dark"
}) {
  const bg =
    variant === "light"
      ? "bg-muted-foreground/30 text-foreground"
      : variant === "green"
        ? "bg-primary text-primary-foreground"
        : "bg-foreground text-background"

  return (
    <div
      className={`absolute flex h-40 w-64 flex-col justify-between rounded-2xl p-4 shadow-lg ${bg} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium opacity-80">{brand}</span>
        <Wifi className="size-4 rotate-90 opacity-80" />
      </div>
      <div>
        <p className="font-mono text-sm tracking-widest opacity-90">
          1234 1234 1234 1234
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
          <span>JANE STEINER</span>
          <span>08/28</span>
        </div>
      </div>
    </div>
  )
}

export function WalletCard() {
  return (
    <article className="grid grid-cols-1 gap-4 rounded-3xl bg-card p-6 sm:grid-cols-2">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold leading-tight text-foreground text-balance">
          Available Credit Card in Wallet
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur. Facilisis tincidunt purus id
          hendrerit cras massa sollicitudin adipiscing.
        </p>
        <button
          type="button"
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="size-4" />
          Add New Card
        </button>
      </div>

      <div className="relative h-52 sm:h-44">
        <CreditCard
          brand="Master Card"
          variant="light"
          className="left-6 top-0 -rotate-6"
        />
        <CreditCard
          brand="Visa"
          variant="green"
          className="left-2 top-6 rotate-3"
        />
        <CreditCard
          brand="Master Card"
          variant="dark"
          className="left-0 top-12 -rotate-2"
        />
      </div>
    </article>
  )
}
