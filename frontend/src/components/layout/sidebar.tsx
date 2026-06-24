import React, { useState } from 'react';
import { 
  LayoutDashboard, List, ArrowUpDown, Users, Package, 
  Printer, Sliders, Hammer, ArrowLeftRight, Pin, PinOff, ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboardingStatus } from '../../features/onboarding/hooks/useOnboarding';

export type ViewType = 'dashboard' | 'calculator' | 'transactions' | 'finance' | 'customers' | 'inventory' | 'stock' | 'orders' | 'sales' | 'reports' | 'profiles' | 'production';

const NAV_ITEMS = [
  { icon: Printer,        label: 'Cotizador',       id: 'calculator' },
  { icon: Package,        label: 'Biblioteca',  id: 'inventory' },
  { icon: List,           label: 'Catálogo',  id: 'stock' },
  { icon: ArrowUpDown,    label: 'Pedidos',         id: 'orders' },
  { icon: ShoppingBag,    label: 'Ventas',          id: 'sales' },
  { icon: Hammer,         label: 'Producción',      id: 'production' },
  { icon: Users,          label: 'Clientes',        id: 'customers' },
  { icon: Sliders,        label: 'Perfiles',        id: 'profiles' },
  { icon: LayoutDashboard,label: 'Finanzas',        id: 'finance' },
  { icon: ArrowLeftRight, label: 'Transacciones',   id: 'transactions' },
];

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;
  const { data: onboarding } = useOnboardingStatus();

  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-col bg-[var(--studio-parchment)] border-r border-[var(--studio-hairline)] py-5 shrink-0 overflow-hidden z-30"
      style={{
        width: expanded ? 232 : 68,
        transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pin toggle */}
      <div className="flex justify-end px-3 mb-6 h-10 shrink-0">
        <button
          onClick={() => setPinned(p => !p)}
          aria-label={pinned ? 'Desanclar sidebar' : 'Anclar sidebar'}
          title={pinned ? 'Desanclar sidebar' : 'Anclar sidebar'}
          className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.06] transition-colors shrink-0"
        >
          {pinned ? <PinOff size={13} /> : <Pin size={13} />}
        </button>
      </div>

      {/* Nav items */}
      <ul className="flex flex-col gap-0.5 px-2.5 flex-1 overflow-hidden overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onViewChange(item.id as ViewType)}
                aria-label={item.label}
                title={!expanded ? item.label : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-colors duration-150 group active:scale-95',
                  active
                    ? 'bg-primary/[0.08] text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.04]'
                )}
                style={{ minHeight: 40 }}
              >
                {/* Icon box */}
                <div
                  className={cn(
                    'relative flex items-center justify-center rounded-lg shrink-0 transition-colors duration-150',
                    active ? 'bg-primary/[0.12]' : 'group-hover:bg-black/[0.05]'
                  )}
                  style={{ width: 32, height: 32 }}
                >
                  <item.icon size={16} strokeWidth={active ? 2 : 1.5} />
                  {/* Active pill cuando colapsado */}
                  {active && (
                    <span
                      className="absolute -left-[18px] w-[3px] h-4 bg-primary rounded-r-full"
                      style={{
                        opacity: expanded ? 0 : 1,
                        transition: 'opacity 150ms ease',
                      }}
                    />
                  )}
                </div>

                {/* Label con fade+slide */}
                <span
                  className="text-[13px] font-medium whitespace-nowrap"
                  style={{
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? 'translateX(0)' : 'translateX(-8px)',
                    transition: 'opacity 200ms ease, transform 200ms ease',
                    transitionDelay: expanded ? '100ms' : '0ms',
                    pointerEvents: 'none',
                  }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* User footer */}
      <div className="px-2.5 mt-3 pt-3 border-t border-border/50 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="size-8 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
            {onboarding?.nombreUsuario
              ?.split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map(w => w[0].toUpperCase())
              .join('') || '?'}
          </div>
          <div
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'translateX(0)' : 'translateX(-6px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              transitionDelay: expanded ? '80ms' : '0ms',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <p className="text-[12px] font-semibold text-foreground leading-none whitespace-nowrap">{onboarding?.nombreUsuario || 'Usuario'}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">{onboarding?.nombreEmprendimiento || 'Emprendimiento'}</p>
          </div>
        </div>
      </div>

      {/* Dev footer */}
      <div className="px-2.5 mt-2 pt-2 border-t border-border/50">
        <p
          className="text-[9px] text-muted-foreground/40 text-center whitespace-nowrap"
          style={{
            opacity: expanded ? 1 : 0,
            transition: 'opacity 180ms ease',
            transitionDelay: expanded ? '80ms' : '0ms',
          }}
        >
          Desarrollado por HITLABS
        </p>
      </div>
    </nav>
  );
}
