import React from 'react';
import { useGetPedido, useUpdateEstadoPedido, useRegistrarPago, useRegistrarMerma } from '../api/pedidos.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { EstadoBadge } from './EstadoBadge';
import { 
  ArrowLeft, 
  DollarSign, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  XCircle,
  Truck,
  History,
  Loader2,
  RefreshCcw,
  Calendar,
  User,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { RegistrarPagoModal } from './RegistrarPagoModal';
import { RegistrarMermaModal } from './RegistrarMermaModal';
import { CrearOrdenVinculadaModal } from './CrearOrdenVinculadaModal';
import { QueryErrorView } from '../../../components/ui/query-error-view';

interface PedidoDetalleViewProps {
  pedidoId: string;
  onBack: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export function PedidoDetalleView({ pedidoId, onBack }: PedidoDetalleViewProps) {
  const { data: pedido, isLoading, isError, error, refetch } = useGetPedido(pedidoId);
  const { mutate: updateEstado } = useUpdateEstadoPedido();
  
  const [showPagoModal, setShowPagoModal] = React.useState(false);
  const [showMermaModal, setShowMermaModal] = React.useState(false);
  const [showFabricarModal, setShowFabricarModal] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = React.useState<string>('');
  const [selectedItemFaltante, setSelectedItemFaltante] = React.useState<number>(0);

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <QueryErrorView error={error} refetch={refetch} />
      </div>
    );
  }

  if (isLoading || !pedido) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} aria-hidden="true" />
      </div>
    );
  }

  const handleStatusChange = (nuevoEstado: any) => {
    updateEstado({ id: pedido.id, estado: nuevoEstado });
  };

  // Lifecycle steps for workflow timeline
  const workflowSteps = [
    { key: 'COTIZADO', label: 'Cotizado' },
    { key: 'CONFIRMADO', label: 'Confirmado' },
    { key: 'EN_PRODUCCION', label: 'Producción' },
    { key: 'LISTO_PARA_ENTREGAR', label: 'Listo' },
    { key: 'ENTREGADO', label: 'Entregado' },
  ];

  const currentStepIndex = workflowSteps.findIndex(s => s.key === pedido.estado);
  const isTerminalState = ['CANCELADO', 'DEVUELTO'].includes(pedido.estado);

  // Logical next state
  const getNextStep = (estado: string) => {
    switch (estado) {
      case 'COTIZADO':
        return { estado: 'CONFIRMADO', label: 'Confirmar Pedido', icon: <CheckCircle2 size={16} />, className: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm' };
      case 'CONFIRMADO':
        return { estado: 'EN_PRODUCCION', label: 'Iniciar Producción', icon: <Truck size={16} />, className: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' };
      case 'EN_PRODUCCION':
        return { estado: 'LISTO_PARA_ENTREGAR', label: 'Listo para Entregar', icon: <Package size={16} />, className: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm' };
      case 'LISTO_PARA_ENTREGAR':
        return { estado: 'ENTREGADO', label: 'Entregar y Cobrar Saldo', icon: <CheckCircle2 size={16} />, className: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' };
      default:
        return null;
    }
  };

  const nextStep = getNextStep(pedido.estado);
  const paymentProgress = pedido.total > 0 ? Math.min(100, (pedido.montoPagado / pedido.total) * 100) : 0;

  return (
    <div className="flex flex-col w-full bg-[#fbfbfd] dark:bg-background min-h-full animate-in fade-in duration-300">
      <StudioSubNav />

      <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] mx-auto space-y-6">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group cursor-pointer text-sm font-medium"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Volver a Pedidos</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estado:</span>
              <EstadoBadge estado={pedido.estado} />
            </div>
          </div>

          {/* iOS Style Glass/Card Header */}
          <div className="bg-white dark:bg-card border border-zinc-200/60 dark:border-border/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Pedido #{pedido.id.substring(0, 8).toUpperCase()}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <User size={15} className="text-muted-foreground" />
                  {pedido.clienteNombre}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  Creado el {format(new Date(pedido.fechaCreacion), "dd 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
            </div>

            {/* Workflow Progress Timeline */}
            {!isTerminalState && (
              <div className="flex items-center w-full md:w-auto md:max-w-md pt-2 md:pt-0">
                <div className="flex items-center justify-between w-full relative">
                  {workflowSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <React.Fragment key={step.key}>
                        {idx > 0 && (
                          <div className={`flex-1 h-0.5 mx-1 md:mx-2 rounded-full transition-all ${
                            idx <= currentStepIndex ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-800'
                          }`} />
                        )}
                        <div className="flex flex-col items-center relative group">
                          <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isCurrent ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110' :
                            isCompleted ? 'bg-primary text-primary-foreground' : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-muted-foreground'
                          }`}>
                            {isCompleted && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <span className={`absolute -bottom-5 text-[9px] font-semibold whitespace-nowrap tracking-tight transition-colors ${
                            isCurrent ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column: Items (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Items Section */}
              <div className="bg-white dark:bg-card border border-zinc-200/60 dark:border-border/50 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-border/30 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Artículos en Presupuesto</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-950 rounded-full text-muted-foreground">
                    {pedido.items.length} {pedido.items.length === 1 ? 'Ítem' : 'Ítems'}
                  </span>
                </div>

                  {pedido.items.map((item) => {
                    const fabricadas = item.ordenesProduccion?.reduce((acc, o) => o.estado === 'COMPLETADO' ? acc + o.cantidad : acc, 0) ?? 0;
                    const enProceso = item.ordenesProduccion?.reduce((acc, o) => ['COLA', 'IMPRIMIENDO'].includes(o.estado) ? acc + o.cantidad : acc, 0) ?? 0;
                    return (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-start gap-3.5">
                          <div className="size-11 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <Package size={18} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground leading-snug">{item.perfilNombre}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                              <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                                {item.cantidad} U.
                              </span>
                              {fabricadas > 0 && (
                                <span className="text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-1.5 py-0.5 rounded font-bold text-[9px]">
                                  {fabricadas} FABRICADAS
                                </span>
                              )}
                              {enProceso > 0 && (
                                <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded font-bold text-[9px]">
                                  {enProceso} EN FABRICACIÓN
                                </span>
                              )}
                              {item.cantidadEntregada > 0 && (
                                <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded font-bold text-[9px]">
                                  {item.cantidadEntregada} ENTREGADAS
                                </span>
                              )}
                              {item.cantidadMerma > 0 && (
                                <span className="text-red-500 bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded font-bold text-[9px]">
                                  {item.cantidadMerma} FALLIDAS
                                </span>
                              )}
                              {item.productoId && (
                                <>
                                  {(item.cantidadFaltante ?? 0) > 0 ? (
                                    <span className="text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded font-bold text-[9px]">
                                      FALTAN {item.cantidadFaltante} U.
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded font-bold text-[9px]">
                                      LISTO
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-dashed border-zinc-100">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Subtotal</p>
                          <p className="text-sm font-semibold font-mono">{formatCurrency(item.subtotal)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {(item.cantidadFaltante ?? 0) > 0 && (
                            <button
                              onClick={() => {
                                setSelectedItemId(item.id);
                                setSelectedItemName(item.perfilNombre);
                                setSelectedItemFaltante(item.cantidadFaltante ?? 0);
                                setShowFabricarModal(true);
                              }}
                              className="text-[10px] font-bold uppercase tracking-wider bg-black hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                            >
                              Fabricar
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setShowMermaModal(true);
                            }}
                            className="size-8 rounded-full border border-zinc-200 dark:border-border flex items-center justify-center text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900/50 transition-colors cursor-pointer"
                            title="Registrar Fallo/Merma"
                          >
                            <AlertTriangle size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Actions & Financial Info */}
            <div className="space-y-6">
              
              {/* Payment & Invoice Box (iOS Card Style) */}
              <div className="bg-white dark:bg-card border border-zinc-200/60 dark:border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resumen de Cuenta</h3>
                  
                  {/* Totals lines */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Total Presupuestado</span>
                      <span className="font-semibold font-mono text-foreground">{formatCurrency(pedido.total)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-600 dark:text-emerald-500 font-medium">Monto Pagado</span>
                      <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-500">{formatCurrency(pedido.montoPagado)}</span>
                    </div>

                    {/* iOS style completion progress bar */}
                    <div className="space-y-1 pt-1">
                      <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500 rounded-full" 
                          style={{ width: `${paymentProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                        <span>{paymentProgress.toFixed(0)}% cubierto</span>
                        {pedido.saldoPendiente > 0 ? (
                          <span>{formatCurrency(pedido.saldoPendiente)} restante</span>
                        ) : (
                          <span className="text-emerald-600">Saldo completado</span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-border/30 pt-3 flex justify-between items-center">
                      <span className="text-sm font-bold text-foreground">Saldo Pendiente</span>
                      <span className={`text-xl font-bold font-mono ${pedido.saldoPendiente > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-zinc-400'}`}>
                        {formatCurrency(pedido.saldoPendiente)}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPagoModal(true)}
                  disabled={pedido.saldoPendiente <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all py-2.5 rounded-2xl text-xs font-bold shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <DollarSign size={16} />
                  Registrar Pago / Seña
                </button>
              </div>

              {/* Action Sheet Card (Gestión de Estados) */}
              <div className="bg-white dark:bg-card border border-zinc-200/60 dark:border-border/50 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado y Acciones</h3>
                
                <div className="space-y-4">
                  {/* Logical Next Step Button (prominent iOS design) */}
                  {nextStep ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Siguiente Paso Recomendado</p>
                      <button 
                        onClick={() => handleStatusChange(nextStep.estado)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer ${nextStep.className}`}
                      >
                        <div className="flex items-center gap-2">
                          {nextStep.icon}
                          <span>{nextStep.label}</span>
                        </div>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl text-center border border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-muted-foreground">Pedido finalizado o inactivo</p>
                    </div>
                  )}

                  {/* Other Action buttons list (clean list menu like iOS Settings) */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Cambiar Estado</p>
                    <div className="bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 divide-y divide-zinc-200/50 dark:divide-border/40 overflow-hidden">
                      <button 
                        onClick={() => handleStatusChange('COTIZADO')}
                        disabled={pedido.estado === 'COTIZADO'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <History size={14} className="text-muted-foreground" />
                        <span>Volver a Cotizado</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange('CONFIRMADO')}
                        disabled={pedido.estado === 'CONFIRMADO'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <CheckCircle2 size={14} className="text-indigo-500" />
                        <span>Establecer como Confirmado</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange('EN_PRODUCCION')}
                        disabled={pedido.estado === 'EN_PRODUCCION'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <Truck size={14} className="text-blue-500" />
                        <span>Establecer en Producción</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange('LISTO_PARA_ENTREGAR')}
                        disabled={pedido.estado === 'LISTO_PARA_ENTREGAR'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <Package size={14} className="text-teal-500" />
                        <span>Establecer Listo para Entregar</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange('ENTREGADO')}
                        disabled={pedido.estado === 'ENTREGADO'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Marcar como Entregado</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange('DEVUELTO')}
                        disabled={pedido.estado === 'DEVUELTO'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-900 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <RefreshCcw size={14} className="text-amber-500" />
                        <span>Marcar como Devolución</span>
                      </button>
                      <button 
                        onClick={() => handleStatusChange('CANCELADO')}
                        disabled={pedido.estado === 'CANCELADO'}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-semibold text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <XCircle size={14} className="text-red-500" />
                        <span>Anular Pedido</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <RegistrarPagoModal 
        isOpen={showPagoModal}
        onClose={() => setShowPagoModal(false)}
        pedidoId={pedido.id}
        saldoPendiente={pedido.saldoPendiente}
      />

      <RegistrarMermaModal 
        isOpen={showMermaModal}
        onClose={() => {
          setShowMermaModal(false);
          setSelectedItemId(null);
        }}
        pedidoId={pedido.id}
        itemId={selectedItemId || ''}
      />

      <CrearOrdenVinculadaModal
        isOpen={showFabricarModal}
        onClose={() => {
          setShowFabricarModal(false);
          setSelectedItemId(null);
        }}
        itemPedidoId={selectedItemId || ''}
        perfilNombre={selectedItemName}
        cantidadRecomendada={selectedItemFaltante}
      />
    </div>
  );
}

