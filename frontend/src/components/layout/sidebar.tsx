import { 
  LayoutDashboard, 
  List, 
  ArrowUpDown, 
  Users, 
  Package, 
  BarChart, 
  Printer,
  Star,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTheme } from '../../providers/ThemeProvider';

export type ViewType = 'overview' | 'dashboard' | 'calculator' | 'transactions' | 'finance' | 'customers' | 'inventory' | 'reports' | 'profiles';

const NAV_ITEMS = [
  { icon: Star, label: 'Resumen', id: 'overview' },
  { icon: Printer, label: 'Cotizador', id: 'calculator' },
  { icon: Sliders, label: 'Perfiles', id: 'profiles' },
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
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav
      aria-label="Main navigation"
      className="flex h-full flex-col items-center gap-2 bg-[var(--studio-parchment)] border-r border-[var(--studio-hairline)] py-8 w-20 shrink-0"
    >

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
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
              )}
            >
              <item.icon className="size-5" strokeWidth={currentView === item.id ? 2 : 1.5} />
              {currentView === item.id && (
                <div className="absolute -left-1 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-4">
        <button
          onClick={toggleTheme}
          className="size-10 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20"
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="size-10 overflow-hidden rounded-full border border-border bg-background flex items-center justify-center text-[10px] font-semibold text-foreground studio-nav-link">
          FB
        </div>
      </div>
    </nav>
  );
}
