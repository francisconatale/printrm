import Image from "next/image"

const stats = [
  { label: "Projects", value: "26" },
  { label: "Followers", value: "356" },
  { label: "Following", value: "68" },
]

export function ProfileCard() {
  return (
    <article className="flex flex-col items-center rounded-3xl bg-card p-6 text-center">
      <div className="size-20 overflow-hidden rounded-full ring-4 ring-secondary">
        <Image
          src="/avatar.png"
          alt="Carlic Bolomboy"
          width={80}
          height={80}
          className="size-full object-cover"
        />
      </div>
      <h2 className="mt-3 text-lg font-bold text-foreground">Carlic Bolomboy</h2>
      <p className="text-sm text-muted-foreground">carlic@gmai.com</p>

      <div className="mt-5 grid w-full grid-cols-3 gap-2">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
