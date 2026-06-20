import React from 'react';
import { useGetTransacciones, useGetBalance } from '../api/finanzas.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { 
  Search, 
  Loader2, 
  Wallet,
  LayoutDashboard,
  ReceiptText,
  Plus
} from 'lucide-react';
import { FinanzasDashboard } from './FinanzasDashboard';
import { TransactionForm } from './TransactionForm';
import { QueryErrorView } from '../../../components/ui/query-error-view';

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(absValue);
  return value < 0 ? `- ${formatted}` : formatted;
};

export function LibroDiarioView() {
  const { data: transacciones, isLoading: isTransaccionesLoading, isError: isTransaccionesError, error: transaccionesError, refetch: refetchTransacciones } = useGetTransacciones();
  const { data: balance, isLoading: isBalanceLoading, isError: isBalanceError, error: balanceError, refetch: refetchBalance } = useGetBalance();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'ledger'>('dashboard');
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const filteredTransacciones = React.useMemo(() => {
    if (!transacciones) return [];
    const sorted = [...transacciones].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return sorted.filter(t => 
      t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transacciones, searchTerm]);

  const isLoading = isTransaccionesLoading || isBalanceLoading;
  const isQueryError = isTransaccionesError || isBalanceError;
  const errorObj = transaccionesError || balanceError;
  const refetchAll = () => {
    refetchTransacciones();
    refetchBalance();
  };

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
            <div className="space-y-2">
              <h1 className="studio-display-md !text-4xl tracking-tight font-bold text-foreground">Finanzas & Negocio</h1>
              <p className="studio-body text-muted-foreground">Control de flujo de caja, mermas, rentabilidad y egresos manuales.</p>
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="studio-button-primary self-start md:self-center flex items-center gap-2 transition-all duration-300"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Registrar Gasto / Ingreso</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all active:scale-95 ${
                activeTab === 'dashboard' 
                  ? 'border-foreground text-foreground font-semibold' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              <span>Dashboard Financiero</span>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all active:scale-95 ${
                activeTab === 'ledger' 
                  ? 'border-foreground text-foreground font-semibold' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <ReceiptText size={16} aria-hidden="true" />
              <span>Libro Diario</span>
            </button>
          </div>

          {/* Content area */}
          <div className="pt-2">
            {isQueryError ? (
              <QueryErrorView error={errorObj} refetch={refetchAll} />
            ) : activeTab === 'dashboard' ? (
              <FinanzasDashboard onOpenNewTransaction={() => setIsFormOpen(true)} refetchAll={refetchAll} />
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Balance & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border/50 p-6 rounded-[var(--radius-xl)] space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                        <Wallet size={20} aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Balance Caja Chica</p>
                      <p className={`text-3xl font-bold tracking-tight mt-1 ${ (balance || 0) >= 0 ? 'text-zinc-900 dark:text-zinc-50' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(balance || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Table Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-border/40">
                  <h3 className="studio-caption-strong uppercase tracking-widest text-muted-foreground">Historial de Movimientos</h3>
                  
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
                    <label htmlFor="search-libro" className="sr-only">Buscar por descripción</label>
                    <input 
                      id="search-libro"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por descripción..."
                      className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Transactions List */}
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
                    <Loader2 className="animate-spin" size={32} aria-hidden="true" />
                    <p className="studio-caption">Cargando movimientos...</p>
                  </div>
                ) : filteredTransacciones.length > 0 ? (
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descripción</th>
                          <th className="px-6 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categoría</th>
                          <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTransacciones.map((t, idx) => (
                          <tr key={t.id} className="hover:bg-muted/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                              <span className="block">{format(new Date(t.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                              <span className="text-[9px] text-zinc-400 font-sans block mt-0.5">#{t.id.slice(-6)}</span>
                            </td>
                            <td className="px-6 py-4 text-sm studio-body-strong text-foreground">
                              {t.descripcion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                t.tipo === 'INGRESO' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50' :
                                t.tipo === 'REEMBOLSO' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50' :
                                'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50'
                              }`}>
                                {t.categoria}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                              t.tipo === 'INGRESO' ? 'text-emerald-600 dark:text-emerald-400' :
                              t.tipo === 'REEMBOLSO' ? 'text-amber-600 dark:text-amber-400' :
                              'text-zinc-900 dark:text-zinc-300'
                            }`}>
                              {formatCurrency(t.monto)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : isSearching ? (
                  <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
                    <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                      <Search size={32} className="text-muted-foreground/40" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <p className="studio-body-strong text-foreground">Búsqueda sin resultados</p>
                      <p className="studio-caption text-muted-foreground">No encontramos movimientos que coincidan con "{searchTerm}". Intentá con otros términos.</p>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-primary font-semibold hover:underline mt-2"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
                    <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                      <Wallet size={32} className="text-muted-foreground/40" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <p className="studio-body-strong text-foreground">No hay movimientos registrados</p>
                      <p className="studio-caption text-muted-foreground">Registrá tu primer ingreso o gasto manual para iniciar el libro contable.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Transaction Modal Form */}
      <TransactionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
