import Image from "next/image"
import {
  LayoutGrid,
  Newspaper,
  BarChart3,
  Building2,
  Users,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react"

const topNav = [
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: Newspaper, label: "Documents" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Building2, label: "Properties" },
  { icon: Users, label: "Clients" },
  { icon: Wallet, label: "Wallet" },
]

const bottomNav = [
  { icon: Settings, label: "Settings" },
  { icon: LogOut, label: "Log out" },
]

export function Sidebar() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex h-full flex-col items-center gap-2 rounded-3xl bg-card py-5"
    >
      <ul className="flex flex-col items-center gap-2">
        {topNav.map(({ icon: Icon, label, active }) => (
          <li key={label}>
            <button
              type="button"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex size-11 items-center justify-center rounded-xl transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="size-5" strokeWidth={2} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-2">
        {bottomNav.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="flex size-11 items-center justify-center rounded-xl text-sidebar-foreground transition-colors hover:bg-secondary hover:text-sidebar-accent-foreground"
          >
            <Icon className="size-5" strokeWidth={2} />
          </button>
        ))}
        <div className="mt-2 size-11 overflow-hidden rounded-full ring-2 ring-border">
          <Image
            src="/avatar.png"
            alt="Your profile"
            width={44}
            height={44}
            className="size-full object-cover grayscale"
          />
        </div>
      </div>
    </nav>
  )
}
