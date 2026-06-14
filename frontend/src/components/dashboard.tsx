import { 
  Plus, 
  Settings, 
  History, 
  Cpu, 
  HardDrive, 
  Layers, 
  Clock, 
  DollarSign, 
  Box
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] p-6 lg:p-10 transition-colors duration-500">
      {/* Header section inspired by iOS Settings/Control Center */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Motor PrusaSlicer activo</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-white/50 dark:bg-white/5 backdrop-blur-md border-none px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
             v2.9.5
           </Badge>
           <button className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm active:scale-90 transition-transform">
             <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
           </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Main Action Card - High impact */}
        <Card className="col-span-1 lg:col-span-2 overflow-hidden border-none shadow-xl bg-white dark:bg-[#1C1C1E] rounded-[28px] group transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-500" />
              Nuevo Cálculo
            </CardTitle>
            <CardDescription>Sube un archivo STL para estimar costos y tiempo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 h-48 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10">
              <div className="p-4 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500">Arrastra tu STL aquí</p>
            </div>
          </CardContent>
        </Card>

        {/* Status / Hardware Widget */}
        <Card className="border-none shadow-lg bg-white dark:bg-[#1C1C1E] rounded-[28px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-400">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Cpu className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">Motor Slicer</span>
              </div>
              <Badge className="bg-green-500 text-white border-none rounded-full px-2 py-0.5 text-[10px]">READY</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Memoria del Motor</span>
                <span>24%</span>
              </div>
              <Progress value={24} className="h-1.5 bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="flex items-center gap-3 pt-2">
               <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <HardDrive className="h-5 w-5 text-orange-600 dark:text-orange-400" />
               </div>
               <div>
                 <p className="text-xs text-gray-400">Configuración</p>
                 <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Calidad Estándar</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Widget */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-[28px]">
           <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Layers className="h-5 w-5 opacity-70" />
                <p className="text-[10px] uppercase font-bold opacity-70">Total Piezas</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="space-y-1 text-right">
                <History className="h-5 w-5 ml-auto opacity-70" />
                <p className="text-[10px] uppercase font-bold opacity-70">Cálculos hoy</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="col-span-2 pt-4 border-t border-white/20 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <DollarSign className="h-4 w-4 opacity-70" />
                   <span className="text-sm font-medium">Ahorro Estimado</span>
                 </div>
                 <span className="text-lg font-bold">$42.50</span>
              </div>
           </CardContent>
        </Card>

        {/* Recent Activity List */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-lg bg-white dark:bg-[#1C1C1E] rounded-[28px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-purple-500" />
              Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[200px]">
              <div className="space-y-4 pr-4">
                {[
                  { name: "Soporte_Base.stl", date: "Hace 5 min", cost: "$4.20", time: "2h 15m" },
                  { name: "Carcasa_Frontal.stl", date: "Hace 1h", cost: "$12.80", time: "8h 45m" },
                  { name: "Engranaje_V3.stl", date: "Ayer", cost: "$1.50", time: "45m" },
                  { name: "Brazo_Robotico.stl", date: "12 Jun", cost: "$24.10", time: "16h 20m" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-500">
                        <Box className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-500 transition-colors">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-gray-900 dark:text-white">{item.cost}</p>
                       <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium justify-end">
                         <Clock className="h-3 w-3" />
                         {item.time}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      {/* Modern floating nav indicator (iOS style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-full blur-[1px] lg:hidden" />
    </div>
  )
}
