import React from 'react'
import { 
  Plus, 
  Search, 
  ArrowUpRight,
  Printer,
  ChevronRight
} from "lucide-react"
import { StudioSubNav } from './layout/studio-sub-nav'

export function StudioOverview() {
  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex flex-col">
        {/* Stats Tile - Grid of Cards */}
        <section className="studio-product-tile studio-tile-light">
          <div className="max-w-[1024px] w-full px-6">
            <h2 className="studio-display-lg mb-12">Your Month in Numbers.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="studio-store-card text-left">
                <span className="studio-caption text-studio-primary font-semibold">Income</span>
                <h3 className="studio-display-md">$1,240.00</h3>
                <p className="studio-body text-studio-ink-muted-48">Up 12% from last month.</p>
                <div className="mt-4 flex items-center text-studio-primary cursor-pointer group">
                  <span className="studio-body">View details</span>
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="studio-store-card text-left">
                <span className="studio-caption text-studio-primary font-semibold">Pieces</span>
                <h3 className="studio-display-md">48</h3>
                <p className="studio-body text-studio-ink-muted-48">High precision standard.</p>
                <div className="mt-4 flex items-center text-studio-primary cursor-pointer group">
                  <span className="studio-body">See history</span>
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="studio-store-card text-left">
                <span className="studio-caption text-studio-primary font-semibold">Uptime</span>
                <h3 className="studio-display-md">312h</h3>
                <p className="studio-body text-studio-ink-muted-48">MK4 #01 performance.</p>
                <div className="mt-4 flex items-center text-studio-primary cursor-pointer group">
                  <span className="studio-body">Diagnostics</span>
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Tile - Dark */}
        <section className="studio-product-tile studio-tile-dark">
          <div className="max-w-[800px] flex flex-col items-center">
            <h2 className="studio-display-lg mb-4 text-white">Bring your designs to life.</h2>
            <p className="studio-lead mb-12 text-white/80">Real-time cost estimation powered by slicer</p>
            
            <div className="w-full max-w-[600px] border-2 border-dashed border-white/20 rounded-[2.5rem] p-20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors bg-background/5">
               <div className="size-20 bg-background/10 rounded-full flex items-center justify-center mb-6">
                 <Plus className="size-10 text-white" />
               </div>
               <p className="studio-display-md !text-2xl text-white">Upload STL file</p>
               <p className="studio-body text-white/60 mt-2">or drag and drop here</p>
            </div>
          </div>
        </section>

        {/* Activity Tile - Light */}
        <section className="studio-product-tile studio-tile-light !pb-32">
          <div className="max-w-[1024px] w-full text-left px-6">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="studio-display-lg">Recent Activity.</h2>
              <a href="#" className="studio-body text-studio-primary flex items-center gap-1 group">
                Full history
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            
            <div className="divide-y divide-studio-divider-soft border-t border-b border-studio-divider-soft">
              {[
                { date: "Jun 15", desc: "Soporte Articulado", type: "Sale", amount: "+$45.00" },
                { date: "Jun 14", desc: "Filamento PLA Slate", type: "Expense", amount: "-$22.50" },
                { date: "Jun 14", desc: "Carcasa Prototipo V2", type: "Sale", amount: "+$120.00" },
                { date: "Jun 12", desc: "Mantenimiento MK4", type: "Expense", amount: "-$15.00" },
              ].map((row, i) => (
                <div key={i} className="py-8 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-12">
                    <span className="studio-body text-studio-ink-muted-48 w-16">{row.date}</span>
                    <div>
                      <h4 className="studio-body-strong">{row.desc}</h4>
                      <p className="studio-caption text-studio-ink-muted-48">{row.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`studio-body font-semibold ${row.amount.startsWith('+') ? 'text-studio-ink' : 'text-studio-ink-muted-48'}`}>
                      {row.amount}
                    </span>
                    <ChevronRight size={20} className="text-studio-divider-soft group-hover:text-studio-ink transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--studio-parchment)] py-16 px-6">
          <div className="max-w-[1024px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
              <div className="flex flex-col gap-4">
                <h5 className="studio-nav-link font-semibold uppercase text-ink-muted-80">Explore</h5>
                <a href="#" className="studio-nav-link text-ink-muted-48">Prints</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Materials</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Hardware</a>
              </div>
              <div className="flex flex-col gap-4">
                <h5 className="studio-nav-link font-semibold uppercase text-ink-muted-80">Account</h5>
                <a href="#" className="studio-nav-link text-ink-muted-48">Manage Profile</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Orders</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Wallet</a>
              </div>
              <div className="flex flex-col gap-4">
                <h5 className="studio-nav-link font-semibold uppercase text-ink-muted-80">Business</h5>
                <a href="#" className="studio-nav-link text-ink-muted-48">Studio Plan</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Bulk Orders</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">API Access</a>
              </div>
              <div className="flex flex-col gap-4">
                <h5 className="studio-nav-link font-semibold uppercase text-ink-muted-80">About</h5>
                <a href="#" className="studio-nav-link text-ink-muted-48">Our Studio</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Environment</a>
                <a href="#" className="studio-nav-link text-ink-muted-48">Newsroom</a>
              </div>
            </div>
            
            <div className="border-t border-studio-divider-soft pt-8">
              <p className="studio-nav-link text-ink-muted-48">
                Copyright © 2026 Printrm Studio Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

