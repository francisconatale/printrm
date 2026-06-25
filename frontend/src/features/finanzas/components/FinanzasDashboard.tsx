import React from 'react';
import { useGetTransacciones } from '../api/finanzas.api';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Loader2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { format } from 'date-fns/format';
import { subMonths } from 'date-fns/subMonths';
import { parseISO } from 'date-fns/parseISO';
import { startOfMonth } from 'date-fns/startOfMonth';
import { es } from 'date-fns/locale/es';
import { QueryErrorView } from '../../../components/ui/query-error-view';
import { DateRangePicker, useDateRange } from '../../../components/ui/date-range-picker';

interface FinanzasDashboardProps {
  onOpenNewTransaction: () => void;
  refetchAll: () => void;
}

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(absValue);
  return value < 0 ? `- ${formatted}` : formatted;
};

export function FinanzasDashboard({ onOpenNewTransaction, refetchAll }: FinanzasDashboardProps) {
  const dateRangeHook = useDateRange();
  const { fechaDesde, fechaHasta, dateRange, setRange } = dateRangeHook;
  const { data: transaccionesData, isLoading, error } = useGetTransacciones(0, 1000, undefined, fechaDesde, fechaHasta);
  const transacciones = transaccionesData?.content;

  const metrics = React.useMemo(() => {
    if (!transacciones) return null;

    const ingresos = transacciones.filter(t => t.tipo === 'INGRESO');
    const egresos = transacciones.filter(t => t.tipo === 'EGRESO');
    const reembolsos = transacciones.filter(t => t.tipo === 'REEMBOLSO');

    const totalIngresosBrutos = ingresos.reduce((sum, t) => sum + t.monto, 0);
    const totalReembolsos = reembolsos.reduce((sum, t) => sum + t.monto, 0);
    const totalIngresosNetos = totalIngresosBrutos + totalReembolsos;

    // Correct sum of expenses: signed sum of EGRESO amounts (mostly negative), then take absolute value
    const signedGastosSum = egresos.reduce((sum, t) => sum + t.monto, 0);
    const totalGastos = Math.max(0, -signedGastosSum);

    const balance = totalIngresosNetos - totalGastos;
    const roi = totalGastos > 0 ? (balance / totalGastos) * 100 : 0;

    // Expenses by Category (signed sums, then negated)
    const gastosPorCategoria = {
      MATERIAL: 0,
      ENERGIA: 0,
      REPUESTO: 0,
      MERMA: 0,
      OTRO: 0
    };

    transacciones.forEach(t => {
      if (t.tipo === 'EGRESO') {
        const cat = t.categoria;
        if (cat in gastosPorCategoria) {
          gastosPorCategoria[cat as keyof typeof gastosPorCategoria] += t.monto;
        }
      }
    });

    const categoryBreakdown = Object.keys(gastosPorCategoria).map(key => {
      const k = key as keyof typeof gastosPorCategoria;
      return {
        category: k,
        amount: Math.max(0, -gastosPorCategoria[k])
      };
    }).sort((a, b) => b.amount - a.amount);

    // Monthly Trend (Last 6 Months)
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const date = subMonths(now, 5 - idx);
      return {
        label: format(date, 'MMM', { locale: es }),
        key: format(date, 'yyyy-MM'),
        ingresos: 0,
        gastos: 0,
      };
    });

    transacciones.forEach(t => {
      try {
        const date = parseISO(t.fecha);
        const monthKey = format(date, 'yyyy-MM');
        const monthObj = months.find(m => m.key === monthKey);
        
        if (monthObj) {
          if (t.tipo === 'INGRESO') {
            monthObj.ingresos += t.monto;
          } else if (t.tipo === 'EGRESO') {
            monthObj.gastos += Math.abs(t.monto);
          } else if (t.tipo === 'REEMBOLSO') {
            // Reembolsos decrease net income for that month
            monthObj.ingresos += t.monto; 
          }
        }
      } catch (e) {
        // Ignore invalid dates
      }
    });

    // Find max value in monthly trend to scale the chart
    const maxVal = Math.max(...months.map(m => Math.max(m.ingresos, m.gastos)), 1);

    return {
      totalIngresosBrutos,
      totalReembolsos,
      totalIngresosNetos,
      totalGastos,
      balance,
      roi,
      categoryBreakdown,
      monthlyTrend: months,
      maxMonthlyVal: maxVal
    };
  }, [transacciones]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
        <p className="studio-caption">Cargando métricas de rendimiento...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <QueryErrorView 
        error={error} 
        refetch={refetchAll} 
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Header with Date Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Panel de Rendimiento</h2>
          <p className="text-xs text-muted-foreground">Métricas financieras consolidadas.</p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={(range) => setRange(range)}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Balance Card */}
        <div className="bg-card border border-border/50 p-6 md:p-4 xl:p-6 rounded-[var(--radius-xl)] space-y-4 shadow-sm relative overflow-hidden group hover:border-border transition-colors">
          <div className="flex justify-between items-start">
             <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <DollarSign size={20} />
            </div>
            {metrics.balance >= 0 ? (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Superávit
              </span>
            ) : (
              <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full font-semibold">
                Déficit
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Balance Neto</p>
            <p className={`text-2xl sm:text-3xl md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight mt-1 transition-all truncate ${
              metrics.balance >= 0 ? 'text-foreground' : 'text-red-600'
            }`} title={formatCurrency(metrics.balance)}>
              {formatCurrency(metrics.balance)}
            </p>
          </div>
        </div>

        {/* Ingresos Card */}
        <div className="bg-card border border-border/50 p-6 md:p-4 xl:p-6 rounded-[var(--radius-xl)] space-y-4 shadow-sm relative overflow-hidden group hover:border-border transition-colors">
          <div className="flex justify-between items-start">
            <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            {metrics.totalReembolsos < 0 && (
              <span className="text-[9px] text-muted-foreground" title={`Reembolsos: ${formatCurrency(metrics.totalReembolsos)}`}>
                Bruto: {formatCurrency(metrics.totalIngresosBrutos)}
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ingresos Netos</p>
            <p className="text-2xl sm:text-3xl md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight mt-1 text-foreground truncate" title={formatCurrency(metrics.totalIngresosNetos)}>
              {formatCurrency(metrics.totalIngresosNetos)}
            </p>
          </div>
        </div>

        {/* Gastos Card */}
        <div className="bg-card border border-border/50 p-6 md:p-4 xl:p-6 rounded-[var(--radius-xl)] space-y-4 shadow-sm relative overflow-hidden group hover:border-border transition-colors">
          <div className="flex justify-between items-start">
            <div className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gastos Totales</p>
            <p className="text-2xl sm:text-3xl md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight mt-1 text-foreground truncate" title={formatCurrency(metrics.totalGastos)}>
              {formatCurrency(metrics.totalGastos)}
            </p>
          </div>
        </div>

        {/* ROI Card */}
        <div className="bg-card border border-border/50 p-6 md:p-4 xl:p-6 rounded-[var(--radius-xl)] space-y-4 shadow-sm relative group hover:border-border transition-colors">
          <div className="flex justify-between items-start">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Percent size={20} />
            </div>
            <div className="group relative cursor-pointer">
              <HelpCircle size={16} className="text-muted-foreground" />
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-56 bg-black text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 leading-relaxed font-sans">
                ROI = (Balance / Gastos Totales) × 100. Representa el retorno sobre la inversión de fabricación de piezas y costos fijos.
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Retorno (ROI)</p>
            <p className={`text-2xl sm:text-3xl md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight mt-1 truncate ${
              metrics.roi >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`} title={metrics.roi >= 1000 ? '> 1000%' : `${metrics.roi.toFixed(1)}%`}>
              {metrics.roi >= 1000 ? '> 1000%' : `${metrics.roi.toFixed(1)}%`}
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 bg-card border border-border/50 p-8 rounded-[var(--radius-xl)] shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="studio-body-strong">Historial Mensual</h4>
              <p className="text-xs text-muted-foreground">Flujo de ingresos vs egresos (últimos 6 meses).</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-muted-foreground">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-zinc-400 inline-block" />
                <span className="text-muted-foreground">Egresos</span>
              </div>
            </div>
          </div>

          {/* Render Custom SVG Chart */}
          <div className="h-64 flex flex-col pt-4">
            <div className="flex-1 w-full flex items-end justify-between px-2 md:px-8 border-b border-border/50 pb-2">
              {metrics.monthlyTrend.map(month => {
                const incHeight = (month.ingresos / metrics.maxMonthlyVal) * 100;
                const expHeight = (month.gastos / metrics.maxMonthlyVal) * 100;

                return (
                  <div key={month.key} className="flex flex-col items-center group flex-1">
                    {/* Bars Container */}
                    <div className="h-44 w-full flex justify-center items-end gap-1.5 relative">
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] px-2.5 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-28 text-center space-y-1">
                        <p className="font-bold text-zinc-300 uppercase font-sans text-[9px] mb-1">{month.label}</p>
                        <p className="text-emerald-400">+{new Intl.NumberFormat('es-AR', { notation: 'compact' }).format(month.ingresos)}</p>
                        <p className="text-zinc-400">-{new Intl.NumberFormat('es-AR', { notation: 'compact' }).format(month.gastos)}</p>
                      </div>

                      {/* Income Bar */}
                      <div 
                        style={{ height: `${Math.max(incHeight, 2)}%` }} 
                        className={`w-3.5 md:w-5 rounded-t-[3px] bg-emerald-500/80 hover:bg-emerald-500 transition-all duration-300`} 
                      />
                      
                      {/* Expense Bar */}
                      <div 
                        style={{ height: `${Math.max(expHeight, 2)}%` }} 
                        className={`w-3.5 md:w-5 rounded-t-[3px] bg-zinc-300 hover:bg-zinc-400 transition-all duration-300`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* X-Axis Labels Row */}
            <div className="flex justify-between px-2 md:px-8 pt-2">
              {metrics.monthlyTrend.map(month => (
                <div key={month.key} className="flex-1 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold select-none">
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expenses Category Breakdown */}
        <div className="bg-card border border-border/50 p-8 rounded-[var(--radius-xl)] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h4 className="studio-body-strong">Gastos por Categoría</h4>
            <p className="text-xs text-muted-foreground">Distribución neta por concepto.</p>
          </div>

          {metrics.totalGastos > 0 ? (
            <div className="space-y-4 flex-1 flex flex-col justify-center pt-2">
              {metrics.categoryBreakdown.map(item => {
                const percent = metrics.totalGastos > 0 ? (item.amount / metrics.totalGastos) * 100 : 0;
                
                const categoryLabels: Record<string, string> = {
                  MATERIAL: 'Materiales',
                  ENERGIA: 'Energía Eléctrica',
                  REPUESTO: 'Repuestos & Mant.',
                  MERMA: 'Mermas (Fallas)',
                  OTRO: 'Otros Gastos'
                };

                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground font-sans">{categoryLabels[item.category] || item.category}</span>
                      <div className="space-x-2 text-muted-foreground">
                        <span>{formatCurrency(item.amount)}</span>
                        <span className="font-semibold text-foreground">{percent.toFixed(0)}%</span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full transition-all duration-500 bg-foreground opacity-70`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-10">
              <p className="studio-caption text-center uppercase font-bold">No hay gastos registrados</p>
            </div>
          )}


        </div>

      </div>
    </div>
  );
}
