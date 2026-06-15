import { 
  Plus, 
  Settings, 
  History, 
  Cpu, 
  HardDrive, 
  Box,
  TrendingUp,
  Clock,
  Printer,
  Search,
  Bell,
  Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

function MiniBars({ className }: { className?: string }) {
  const heights = [10, 16, 13, 22, 18, 28, 24]
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 11}
          y={32 - h}
          width={6}
          height={h}
          rx={2}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

function MiniWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M0 22 C 12 22, 14 10, 26 10 S 40 24, 52 18 S 70 6, 80 12"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

function MiniSquiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M2 26 C 18 26, 16 6, 30 16 S 46 30, 58 12 S 72 4, 78 8"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Dashboard({ onToggleTheme, isDark }: { onToggleTheme: () => void, isDark: boolean }) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme}
            className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 shadow-sm hover:scale-105 active:scale-95 transition-all dark:bg-indigo-500/10 dark:border-indigo-500/20"
          >
            {isDark ? <Clock className="size-6" strokeWidth={2} /> : <Sun className="size-6" strokeWidth={2} />}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Motor PrusaSlicer activo • v2.9.5
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-full items-center gap-2 rounded-full bg-card border border-slate-200 dark:border-slate-800 pl-5 pr-1.5 sm:w-72 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <input
              type="search"
              placeholder="Buscar transacciones..."
              aria-label="Search"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-colors"
            >
              <Search className="size-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full size-12 shrink-0 border-slate-200 dark:border-slate-800 bg-card shadow-sm">
              <History className="size-5 text-muted-foreground" />
            </Button>
            <Button variant="accent" className="rounded-full px-6 h-12 shadow-md shadow-indigo-500/20">
              <Plus className="mr-1.5 size-4" />
              Nuevo Cálculo
            </Button>
          </div>
        </div>
      </header>

      {/* StatCards */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Card className="flex items-center justify-between rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm bg-card">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingresos Mes</p>
            <p className="mt-1 text-2xl font-bold text-foreground font-mono">$1,240.00</p>
          </div>
          <MiniBars className="h-8 w-20 text-indigo-500" />
        </Card>

        <Card className="flex items-center justify-between rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm bg-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Printer className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Piezas Impresas</p>
              <p className="mt-1 text-2xl font-bold text-foreground font-mono">48</p>
            </div>
          </div>
          <MiniWave className="h-8 w-16 text-muted-foreground" />
        </Card>

        <Card className="flex items-center justify-between rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm bg-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Horas de Vuelo</p>
              <p className="mt-1 text-2xl font-bold text-foreground font-mono">312h</p>
            </div>
          </div>
          <MiniWave className="h-8 w-16 text-muted-foreground" />
        </Card>

        <Card className="flex items-center justify-between rounded-3xl p-5 border-none shadow-md bg-indigo-500 text-white">
          <div>
            <p className="text-sm font-medium text-indigo-100">Filamento Usado</p>
            <p className="mt-1 text-2xl font-bold font-mono">4.2kg</p>
          </div>
          <MiniSquiggle className="h-9 w-20 text-white/80" />
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
        {/* Main Action Area - STL Upload */}
        <Card className="lg:col-span-2 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm bg-card overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4 px-6 pt-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-foreground">Cálculo en tiempo real</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">PrusaSlicer Engine</CardDescription>
            </div>
            <Badge variant="success" className="rounded-full px-3 py-1">Activo</Badge>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 border-dashed border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] hover:border-indigo-200 transition-colors cursor-pointer group bg-background p-10">
              <div className="size-16 bg-card text-indigo-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-border">
                <Box size={32} />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-foreground">Arrastra tu archivo STL aquí</p>
                <p className="text-sm text-muted-foreground">O haz clic para buscar en tu computadora</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm bg-card p-6 flex flex-col text-center items-center">
          <div className="size-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4 border-4 border-background shadow-sm dark:bg-indigo-500/10">
            <Printer size={32} />
          </div>
          <h2 className="text-lg font-bold text-foreground">Estado del Sistema</h2>
          <p className="text-sm text-muted-foreground mt-1">MK4 #01 • Imprimiendo</p>
          
          <div className="w-full mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Progreso</span>
                <span className="text-indigo-500">74%</span>
              </div>
              <Progress value={74} className="h-2 bg-secondary" />
            </div>
            
            <div className="bg-background rounded-2xl p-4 flex items-center gap-3 text-left border border-slate-100 dark:border-slate-800">
              <div className="size-10 bg-card rounded-xl flex items-center justify-center shadow-sm text-muted-foreground border border-border">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Perfil</p>
                <p className="text-xs font-bold text-foreground">Calidad Estándar 0.20</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-auto rounded-xl border-slate-200 dark:border-slate-800 text-foreground hover:bg-secondary">
            Ver Detalles
          </Button>
        </Card>

        {/* Quick Profile/Info Card */}
        <Card className="rounded-3xl border-none shadow-md bg-indigo-500 p-6 flex flex-col text-center items-center text-white">
          <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Cpu size={32} className="text-white" />
          </div>
          <h2 className="text-lg font-bold">Optimización</h2>
          <p className="text-sm text-indigo-100 mt-1">Sugerencias de ahorro</p>
          <div className="mt-6 p-4 bg-white/10 rounded-2xl w-full">
            <p className="text-xs font-medium leading-relaxed">
              Agrupa 3 piezas más para reducir el desperdicio en un 12%.
            </p>
          </div>
          <button className="mt-auto text-sm font-bold text-white underline underline-offset-4">
            Aplicar ahora
          </button>
        </Card>

        {/* Recent Transactions Table */}
        <Card className="lg:col-span-3 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4 px-6 pt-6">
            <CardTitle className="text-lg font-bold text-foreground">Transacciones Recientes</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-500 hover:bg-indigo-500/10 rounded-full px-4">Ver todas</Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="px-6 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { date: "15 Jun 2026", desc: "Venta: Soporte Articulado", status: "success", label: "Pagado", amount: "+ $45.00", pos: true },
                    { date: "14 Jun 2026", desc: "Compra: Filamento PLA Slate", status: "destructive", label: "Egreso", amount: "- $22.50", pos: false },
                    { date: "14 Jun 2026", desc: "Venta: Carcasa Prototipo V2", status: "success", label: "Pagado", amount: "+ $120.00", pos: true },
                    { date: "12 Jun 2026", desc: "Servicio: Mantenimiento MK4", status: "destructive", label: "Egreso", amount: "- $15.00", pos: false },
                    { date: "10 Jun 2026", desc: "Venta: Engranaje Custom", status: "success", label: "Pagado", amount: "+ $30.00", pos: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4 text-xs text-muted-foreground font-medium">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">{row.desc}</td>
                      <td className="px-6 py-4">
                        <Badge variant={row.status as any} className="rounded-full px-2.5 py-0.5 text-[10px] border-none shadow-none">
                          {row.label}
                        </Badge>
                      </td>
                      <td className={`px-6 py-4 text-sm font-mono font-bold text-right ${row.pos ? 'text-green-500' : 'text-red-400'}`}>
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Small Action Card */}
        <Card className="rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm bg-primary p-6 flex flex-col text-center items-center text-primary-foreground">
           <div className="size-14 bg-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
             <Plus className="size-6 text-white" />
           </div>
           <h3 className="text-base font-bold">Nueva Orden</h3>
           <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">
             Crea una orden rápida para un cliente recurrente.
           </p>
           <Button className="w-full mt-6 rounded-xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none font-bold">
             Empezar
           </Button>
        </Card>
      </div>
    </div>
  )
}
