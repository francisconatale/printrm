import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { EarningsCard } from "@/components/dashboard/earnings-card"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { TransfersCard } from "@/components/dashboard/transfers-card"
import { SecurityCard } from "@/components/dashboard/security-card"

export default function Page() {
  return (
    <main className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <div className="sticky top-6 hidden h-[calc(100vh-3rem)] w-20 shrink-0 md:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Header />
          <StatCards />

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <BalanceCard />
            </div>
            <EarningsCard />
            <ProfileCard />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <WalletCard />
            </div>
            <TransfersCard />
            <SecurityCard />
          </section>
        </div>
      </div>
    </main>
  )
}
