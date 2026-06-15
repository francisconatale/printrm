import React from 'react'
import { 
  Plus, 
  Search, 
  ArrowUpRight,
  Printer,
  ChevronRight,
  Sun,
  Moon,
  HardDrive,
  TrendingUp,
  Box,
  Clock
} from "lucide-react"

export function StudioDashboard({ onToggleTheme, isDark }: { onToggleTheme: () => void, isDark: boolean }) {
  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      {/* Dynamic Header */}
      <header className="px-12 py-8 flex items-center justify-between border-b border-[#f0f0f0]">
        <div>
          <h1 className="studio-display-md !text-2xl"></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center bg-[#f5f5f7] rounded-full px-4 py-2 border border-[#e0e0e0]">
             <Search size={16} className="text-[#7a7a7a] mr-2" />
             <input 
               type="text" 
               placeholder="Search transactions..." 
               className="bg-transparent border-none outline-none studio-caption w-48"
             />
           </div>
           <button 
             onClick={onToggleTheme}
             className="size-10 flex items-center justify-center rounded-full bg-[#f5f5f7] border border-[#e0e0e0] hover:bg-[#e0e0e0] transition-colors"
           >
             {isDark ? <Moon size={18} /> : <Sun size={18} />}
           </button>
        </div>
      </header>

      <main className="flex flex-col">
        {/* Studio Card Financial Header */}
        <section className="studio-product-tile studio-tile-parchment !py-24 !items-start px-12">
          <div className="max-w-[1024px] w-full text-left">
            <span className="studio-tagline text-[#1d1d1f] mb-2 block">Monthly Balance</span>
            <div className="flex items-baseline gap-4">
              <h1 className="studio-hero-display">$1,240.00</h1>
              <span className="studio-display-md !text-xl text-[#1d1d1f] opacity-60">+12%</span>
            </div>
            <p className="studio-lead text-[#7a7a7a] mt-4 max-w-[600px]">
              Your studio is performing 8% above average efficiency this month. 
              Active pieces: 48.
            </p>
          </div>
        </section>

        {/* Operational Grid */}
        <section className="px-12 py-16">
          <div className="max-w-[1024px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* STL Upload Card */}
            <div className="studio-store-card group cursor-pointer hover:border-[#1d1d1f] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Estimation</span>
                <Box size={20} className="text-[#1d1d1f]" />
              </div>
              <div className="aspect-video border-2 border-dashed border-[#e0e0e0] rounded-2xl flex flex-col items-center justify-center group-hover:bg-black/[0.02] transition-colors">
                <div className="size-10 bg-[#1d1d1f] rounded-full flex items-center justify-center mb-2">
                  <Plus size={20} className="text-white" />
                </div>
                <p className="studio-caption font-semibold">Drop STL File</p>
              </div>
              <p className="studio-caption text-[#7a7a7a] mt-4">Real-time cost analysis powered by PrusaSlicer.</p>
            </div>

            {/* Printer Status Card */}
            <div className="studio-store-card">
              <div className="flex items-center justify-between mb-4">
                <span className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">System Status</span>
                <Printer size={20} className="text-[#1d1d1f]" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between studio-caption mb-1">
                    <span>MK4 #01 Progress</span>
                    <span className="font-bold text-[#1d1d1f]">74%</span>
                  </div>
                  <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1d1d1f] w-[74%]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#f5f5f7] rounded-xl border border-[#e0e0e0]">
                  <HardDrive size={18} className="text-[#7a7a7a]" />
                  <div>
                    <p className="studio-caption font-semibold text-[#1d1d1f]">Standard 0.20</p>
                    <p className="text-[10px] text-[#7a7a7a] uppercase">Active Profile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization/Metrics Card */}
            <div className="studio-store-card">
              <div className="flex items-center justify-between mb-4">
                <span className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Performance</span>
                <TrendingUp size={20} className="text-[#1d1d1f]" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#1d1d1f] opacity-20" />
                    <span className="studio-body text-[#7a7a7a]">Efficiency</span>
                  </div>
                  <span className="studio-body-strong text-[#1d1d1f]">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#1d1d1f]" />
                    <span className="studio-body text-[#1d1d1f]">Uptime</span>
                  </div>
                  <span className="studio-body-strong text-[#1d1d1f]">312h</span>
                </div>
                <button className="studio-button-primary !w-full !text-sm !py-2 mt-2">
                  View Analytics
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Transaction History - Studio Wallet Style */}
        <section className="px-12 pb-32">
          <div className="max-w-[1024px] w-full">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="studio-display-md !text-2xl">Recent Activity</h2>
              <button className="studio-body text-[#1d1d1f] text-sm font-semibold hover:opacity-60 transition-opacity">See All</button>
            </div>
            
            <div className="space-y-1">
              {[
                { date: "15 Jun 2026", desc: "Venta: Soporte Articulado", type: "Income", amount: "+$45.00", pos: true },
                { date: "14 Jun 2026", desc: "Compra: Filamento PLA Slate", type: "Expense", amount: "-$22.50", pos: false },
                { date: "14 Jun 2026", desc: "Venta: Carcasa Prototipo V2", type: "Income", amount: "+$120.00", pos: true },
                { date: "12 Jun 2026", desc: "Servicio: Mantenimiento MK4", type: "Expense", amount: "-$15.00", pos: false },
                { date: "10 Jun 2026", desc: "Venta: Engranaje Custom", type: "Income", amount: "+$30.00", pos: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[#f0f0f0] hover:bg-[#fcfcfc] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="size-10 rounded-full flex items-center justify-center bg-[#f5f5f7] text-[#1d1d1f]">
                       {row.pos ? <ArrowUpRight size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <h4 className="studio-body-strong !text-[15px]">{row.desc}</h4>
                      <p className="studio-caption text-[#7a7a7a]">{row.date} • {row.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`studio-body-strong ${row.pos ? 'text-[#1d1d1f]' : 'text-[#7a7a7a]'}`}>
                      {row.amount}
                    </span>
                    <ChevronRight size={16} className="text-[#e0e0e0] group-hover:text-[#1d1d1f] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

