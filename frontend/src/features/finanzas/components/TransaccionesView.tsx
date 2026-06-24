import React from 'react';
import { useGetTransacciones, useGetBalance } from '../api/finanzas.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import {
  Search,
  Loader2,
  Wallet,
  ReceiptText,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { TransaccionDetalleModal } from './TransaccionDetalleModal';
import { QueryErrorView } from '../../../components/ui/query-error-view';
import { PaginationBar } from '../../../components/ui/pagination-bar';
import { Transaccion } from '../types/finanzas.types';

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(absValue);
  return value < 0 ? `- ${formatted}` : formatted;
};

type TransactionItem = 
  | { isGroup: false; tx: Transaccion }
  | { isGroup: true; id: string; txs: Transaccion[]; montoTotal: number; fecha: string; descripcion: string; categoria: string; tipo: 'INGRESO' | 'EGRESO' | 'REEMBOLSO' };

export function TransaccionesView() {
  const [page, setPage] = React.useState(0);
  const { data: transaccionesData, isLoading: isTransaccionesLoading, isError: isTransaccionesError, error: transaccionesError, refetch: refetchTransacciones } = useGetTransacciones(page, 20);
  const transacciones = transaccionesData?.content;
  const pageObj = transaccionesData?.page;
  const totalPages = pageObj?.totalPages ?? transaccionesData?.totalPages ?? 0;
  const totalElements = pageObj?.totalElements ?? transaccionesData?.totalElements ?? 0;
  
  const { data: balance, isLoading: isBalanceLoading, isError: isBalanceError, error: balanceError, refetch: refetchBalance } = useGetBalance();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});
  const [selectedTx, setSelectedTx] = React.useState<Transaccion | null>(null);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const groupedTransacciones = React.useMemo<TransactionItem[]>(() => {
    if (!transacciones) return [];
    const sorted = [...transacciones].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    const filtered = sorted.filter(t => 
      t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const result: TransactionItem[] = [];
    const groupMap = new Map<string, Transaccion[]>();

    filtered.forEach(t => {
      if (t.grupoId) {
        if (!groupMap.has(t.grupoId)) {
          groupMap.set(t.grupoId, []);
        }
        groupMap.get(t.grupoId)!.push(t);
      } else {
        result.push({ isGroup: false, tx: t });
      }
    });

    groupMap.forEach((txs, groupId) => {
      const montoTotal = txs.reduce((acc, curr) => acc + curr.monto, 0);
      const mainTx = txs[0];
      let desc = mainTx.descripcion;
      if (desc.includes(': ')) {
        desc = desc.split(': ').slice(1).join(': ');
      }
      
      result.push({
        isGroup: true,
        id: groupId,
        txs,
        montoTotal,
        fecha: mainTx.fecha,
        descripcion: `Fabricación: ${desc}`,
        categoria: 'FABRICACION',
        tipo: 'EGRESO'
      });
    });

    return result.sort((a, b) => {
      const dateA = new Date(a.isGroup ? a.fecha : a.tx.fecha).getTime();
      const dateB = new Date(b.isGroup ? b.fecha : b.tx.fecha).getTime();
      return dateB - dateA;
    });
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
              <h1 className="studio-display-md tracking-tight text-foreground">Transacciones</h1>
              <p className="studio-body text-muted-foreground">Historial completo de movimientos, ingresos, egresos y flujo de caja.</p>
            </div>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="studio-button-primary self-start md:self-center flex items-center gap-2 transition-all duration-300"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Registrar Gasto / Ingreso</span>
            </button>
          </div>

          {isQueryError ? (
            <QueryErrorView error={errorObj} refetch={refetchAll} />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Balance Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border/50 p-6 rounded-[var(--radius-xl)] space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Wallet size={20} aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Balance Caja Chica</p>
                    <p className={`text-3xl font-bold tracking-tight mt-1 ${ (balance || 0) >= 0 ? 'text-foreground' : 'text-destructive'}`}>
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
                  <label htmlFor="search-transacciones" className="sr-only">Buscar por descripción</label>
                  <input 
                    id="search-transacciones"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por descripción..."
                    className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Transactions List */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
                  <Loader2 className="animate-spin" size={32} aria-hidden="true" />
                  <p className="studio-caption">Cargando movimientos...</p>
                </div>
              ) : groupedTransacciones.length > 0 ? (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                      {groupedTransacciones.map((item) => (
                        <React.Fragment key={item.isGroup ? item.id : item.tx.id}>
                          <tr 
                            className={`hover:bg-muted/5 transition-colors ${item.isGroup ? 'cursor-pointer' : ''}`}
                            onClick={() => item.isGroup && toggleGroup(item.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                {item.isGroup && (
                                  <button className="text-muted-foreground hover:text-foreground">
                                    {expandedGroups[item.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </button>
                                )}
                                <div>
                                  <span className="block">{format(new Date(item.isGroup ? item.fecha : item.tx.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                                  <span className="text-[10px] text-muted-foreground font-sans block mt-0.5">#{item.isGroup ? item.id.slice(-6) : item.tx.id.slice(-6)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {item.isGroup ? (
                                <span className="text-sm studio-body-strong text-foreground">
                                  {item.descripcion}
                                  <span className="ml-2 text-[10px] text-muted-foreground font-normal">({item.txs.length} items)</span>
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedTx(item.tx); }}
                                  className="text-sm studio-body-strong text-foreground text-left hover:text-primary transition-colors"
                                >
                                  {item.tx.descripcion}
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                (item.isGroup ? item.tipo : item.tx.tipo) === 'INGRESO' ? 'bg-success/10 text-success border-success/20' :
                                (item.isGroup ? item.tipo : item.tx.tipo) === 'REEMBOLSO' ? 'bg-warning/10 text-warning border-warning/20' :
                                'bg-muted text-muted-foreground border-border'
                              }`}>
                                {item.isGroup ? item.categoria : item.tx.categoria}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                              (item.isGroup ? item.tipo : item.tx.tipo) === 'INGRESO' ? 'text-success' :
                              (item.isGroup ? item.tipo : item.tx.tipo) === 'REEMBOLSO' ? 'text-warning' :
                              'text-foreground'
                            }`}>
                              {formatCurrency(item.isGroup ? item.montoTotal : item.tx.monto)}
                            </td>
                          </tr>
                          {item.isGroup && expandedGroups[item.id] && item.txs.map(subTx => (
                            <tr key={subTx.id} className="bg-muted/10 border-l-2 border-l-primary/30">
                              <td className="px-6 py-3 whitespace-nowrap text-[11px] text-muted-foreground pl-12">
                                <span className="block">{format(new Date(subTx.fecha), 'HH:mm', { locale: es })}</span>
                              </td>
                              <td className="px-6 py-3 text-xs text-muted-foreground">
                                ↳ {subTx.descripcion}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-center">
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase border bg-muted text-muted-foreground border-border">
                                  {subTx.categoria}
                                </span>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-right text-xs text-muted-foreground">
                                {formatCurrency(subTx.monto)}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <PaginationBar
                    page={page}
                    size={20}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>
              ) : isSearching ? (
                <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-xl border border-border/60">
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
                <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-xl border border-border/60">
                  <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                    <ReceiptText size={32} className="text-muted-foreground/40" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <p className="studio-body-strong text-foreground">No hay transacciones registradas</p>
                    <p className="studio-caption text-muted-foreground">Registrá tu primer ingreso o gasto manual para iniciar el historial.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <TransactionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <TransaccionDetalleModal
        tx={selectedTx!}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
