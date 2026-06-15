import { Search, MessageSquareDot, Bell, Sun } from "lucide-react"

export function Header() {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sun className="size-7" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hello, Carlic!</h1>
          <p className="text-sm text-muted-foreground">
            Explore information and activity about your property
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-full items-center gap-2 rounded-full bg-card pl-5 pr-1.5 sm:w-72">
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            aria-label="Submit search"
            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Search className="size-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Messages"
          className="relative flex size-12 items-center justify-center rounded-full bg-card text-foreground"
        >
          <MessageSquareDot className="size-5" />
          <span className="absolute right-3 top-3 size-2 rounded-full bg-destructive" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-12 items-center justify-center rounded-full bg-card text-foreground"
        >
          <Bell className="size-5" />
        </button>
      </div>
    </header>
  )
}
