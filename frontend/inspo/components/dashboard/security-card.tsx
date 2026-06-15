import { Fingerprint } from "lucide-react"

export function SecurityCard() {
  return (
    <article className="flex flex-col items-center rounded-3xl bg-card p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
        <Fingerprint className="size-9" strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-foreground">Keep you safe!</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your security password
      </p>
      <button
        type="button"
        className="mt-auto inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Update Your Security
      </button>
    </article>
  )
}
