import { 
  LayoutDashboard, 
  List, 
  ArrowUpDown, 
  Users, 
  Package, 
  BarChart, 
  Settings, 
  Printer,
  Star
} from 'lucide-react';
import { cn } from "@/lib/utils";

export type ViewType = 'overview' | 'dashboard' | 'transactions' | 'finance' | 'customers' | 'inventory' | 'reports';

const NAV_ITEMS = [
  { icon: Star, label: 'Resumen', id: 'overview' },
  { icon: LayoutDashboard, label: 'Finanzas', id: 'dashboard' },
  { icon: List, label: 'Transacciones', id: 'transactions' },
  { icon: ArrowUpDown, label: 'Ingresos/Egresos', id: 'finance' },
  { icon: Users, label: 'Clientes', id: 'customers' },
  { icon: Package, label: 'Inventario', id: 'inventory' },
  { icon: BarChart, label: 'Reportes', id: 'reports' },
];

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="flex h-full flex-col items-center gap-2 bg-[#f5f5f7] border-r border-[#e0e0e0] py-8 w-20 shrink-0"
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-black text-white mb-8">
        <Printer className="size-5" />
      </div>

      <ul className="flex flex-col items-center gap-4 w-full overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <li key={item.id} className="w-full flex justify-center px-2">
            <button
              type="button"
              onClick={() => onViewChange(item.id as ViewType)}
              aria-label={item.label}
              title={item.label}
              className={cn(
                "flex size-12 items-center justify-center rounded-full transition-all duration-300 active:scale-90 relative",
                currentView === item.id
                  ? "text-[#1d1d1f] bg-black/5"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-black/[0.03]"
              )}
            >
              <item.icon className="size-5" strokeWidth={currentView === item.id ? 2 : 1.5} />
              {currentView === item.id && (
                <div className="absolute -left-1 w-1 h-6 bg-[#1d1d1f] rounded-r-full" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-4">
        <button
          type="button"
          aria-label="Configuración"
          className="flex size-12 items-center justify-center rounded-full text-[#7a7a7a] transition-all hover:text-[#1d1d1f] hover:bg-black/[0.03] active:scale-90"
        >
          <Settings className="size-5" strokeWidth={1.5} />
        </button>
        <div className="mt-2 size-10 overflow-hidden rounded-full border border-[#e0e0e0] bg-white flex items-center justify-center text-[10px] font-semibold text-[#1d1d1f] studio-nav-link">
          FB
        </div>
      </div>
    </nav>
  );
}

