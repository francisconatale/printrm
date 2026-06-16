import React from 'react';
import { useGetTransacciones, useGetBalance } from '../api/finanzas.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Search, 
  Loader2, 
  Wallet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(absValue);
  return value < 0 ? `- ${formatted}` : formatted;
};

export function LibroDiarioView() {
  const { data: transacciones, isLoading } = useGetTransacciones();
  const { data: balance } = useGetBalance();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTransacciones = React.useMemo(() => {
    if (!transacciones) return [];
    return transacciones.filter(t => 
      t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transacciones, searchTerm]);

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header & Balance Cards */}
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="studio-display-md !text-4xl tracking-tight">Finanzas & Negocio</h2>
              <p className="studio-body text-muted-foreground">Control de flujo de caja, rentabilidad y gastos de operación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border/50 p-6 rounded-[2rem] space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <Wallet size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Balance Total</p>
                  <p className={`text-3xl font-mono font-bold tracking-tight mt-1 ${ (balance || 0) >= 0 ? 'text-zinc-900' : 'text-red-600'}`}>
                    {formatCurrency(balance || 0)}
                  </p>
                </div>
              </div>

              {/* Add more KPIs like monthly revenue/expenses here later */}
            </div>
          </div>

          {/* Table Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-border/40">
            <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Libro Diario</h3>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por descripción..."
                className="w-full bg-white border border-[#e0e0e0] rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          {/* Transactions List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <p className="studio-caption">Cargando movimientos...</p>
            </div>
          ) : filteredTransacciones.length > 0 ? (
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-border/50">
                <thead className="bg-muted/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredTransacciones.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                        {format(new Date(t.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </td>
                      <td className="px-6 py-4 text-sm studio-body-strong text-foreground">
                        {t.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          t.tipo === 'INGRESO' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          t.tipo === 'REEMBOLSO' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-zinc-50 text-zinc-600 border-zinc-200'
                        }`}>
                          {t.categoria}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-bold ${
                        t.tipo === 'INGRESO' ? 'text-emerald-600' :
                        t.tipo === 'REEMBOLSO' ? 'text-amber-600' :
                        'text-zinc-900'
                      }`}>
                        {formatCurrency(t.monto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center opacity-40">
              <p className="studio-caption uppercase font-bold">No hay movimientos registrados</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
