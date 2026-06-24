import React from 'react';
import { useGetPedido, useUpdateEstadoPedido } from '../api/pedidos.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { EstadoBadge } from './EstadoBadge';
import { 
  ArrowLeft, 
  DollarSign, 
  Package, 
  CheckCircle2, 
  XCircle,
  Truck,
  Loader2,
  RefreshCcw,
  Calendar,
  User,
} from 'lucide-react';
import { fmtDateFull, formatCurrency } from '../../../lib/date-utils';
import { RegistrarPagoModal } from './RegistrarPagoModal';
import { CrearOrdenVinculadaModal } from './CrearOrdenVinculadaModal';
import { DevolverItemsPedidoModal } from './DevolverItemsPedidoModal';
import { QueryErrorView } from '../../../components/ui/query-error-view';

interface PedidoDetalleViewProps {
  pedidoId: string;
  onBack: () => void;
}


export function PedidoDetalleView({ pedidoId, onBack }: PedidoDetalleViewProps) {
  const { data: pedido, isLoading, isError, error, refetch } = useGetPedido(pedidoId);
  const { mutate: updateEstado } = useUpdateEstadoPedido();
  
  const [showPagoModal, setShowPagoModal] = React.useState(false);
  const [showFabricarModal, setShowFabricarModal] = React.useState(false);
  const [showDevolverModal, setShowDevolverModal] = React.useState(false);
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
    { key: 'BORRADOR', label: 'Borrador' },
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
      case 'BORRADOR':
        return { estado: 'COTIZADO', label: 'Cotizar Pedido', icon: <CheckCircle2 size={16} />, className: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm' };
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
    <div className="flex flex-col w-full bg-muted min-h-full animate-in fade-in duration-300">
      <StudioSubNav />

      <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto custom-scrollbar font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          <button 
            onClick={onBack}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Pedidos
          </button>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Pedido #{pedido.id.substring(0, 8).toUpperCase()}</h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <User size={14} /> {pedido.clienteNombre} <span className="text-border">•</span> <Calendar size={14} /> Creado el {fmtDateFull(pedido.fechaCreacion)}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <EstadoBadge estado={pedido.estado} />
              </div>
            </div>

            {/* Timeline / Progress */}
            {!isTerminalState && (
              <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-4">
                <div className="flex flex-wrap gap-4 sm:gap-8 text-muted-foreground font-semibold">
                  {workflowSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    let icon = null;
                    if (step.key === 'BORRADOR') icon = <Loader2 className="w-4 h-4" />;
                    else if (step.key === 'COTIZADO' || step.key === 'CONFIRMADO') icon = <CheckCircle2 className="w-4 h-4" />;
                    else if (step.key === 'EN_PRODUCCION') icon = <Truck className="w-4 h-4" />;
                    else if (step.key === 'LISTO_PARA_ENTREGAR' || step.key === 'ENTREGADO') icon = <Package className="w-4 h-4" />;
                    
                    return (
                      <span key={step.key} className={`flex items-center gap-1.5 ${isCompleted ? 'text-primary' : 'opacity-40'} ${isCurrent ? 'font-bold' : ''}`}>
                        {icon} {step.label}
                      </span>
                    )
                  })}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {nextStep && (
                    <button 
                      onClick={() => handleStatusChange(nextStep.estado)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${nextStep.className}`}
                    >
                      {nextStep.icon} {nextStep.label}
                    </button>
                  )}
                  {pedido.estado === 'BORRADOR' && (
                    <span className="text-[10px] text-muted-foreground/50 italic">Los precios se actualizarán al cotizar</span>
                  )}
                </div>
              </div>
            )}

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Artículos en Presupuesto</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                    {pedido.items.length} {pedido.items.length === 1 ? 'Ítem' : 'Ítems'}
                  </span>
                </div>
                
                <table className="w-full text-sm text-left">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-widest">Ítem</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-widest text-center">Cant.</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-widest text-right">Subtotal</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-widest text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {pedido.items.map(it => {
                      const fabricadas = it.ordenesProduccion?.reduce((acc, o) => o.estado === 'COMPLETADO' ? acc + o.cantidad : acc, 0) ?? 0;
                      return (
                        <tr key={it.id} className="group hover:bg-muted/30 transition-colors">
                          <td className="py-4 pr-4 font-medium text-foreground">
                            {it.perfilNombre}
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {pedido.estado !== 'ENTREGADO' && it.cantidadFaltante && it.cantidadFaltante > 0 ? (
                                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-500 px-1.5 py-0.5 rounded font-bold tracking-wide">FALTAN {it.cantidadFaltante}</span>
                              ) : null}
                              {fabricadas > 0 && (
                                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-500 px-1.5 py-0.5 rounded font-bold tracking-wide">{fabricadas} FABRICADAS</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-center font-semibold text-muted-foreground">{it.cantidad}</td>
                          <td className="py-4 text-right font-semibold">{formatCurrency(it.subtotal)}</td>
                          <td className="py-4 text-right pr-2">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {pedido.estado !== 'ENTREGADO' && (it.cantidadFaltante ?? 0) > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedItemId(it.id);
                                      setSelectedItemName(it.perfilNombre);
                                      setSelectedItemFaltante(it.cantidadFaltante ?? 0);
                                      setShowFabricarModal(true);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-wider bg-foreground text-background px-2.5 py-1.5 rounded transition-colors hover:bg-foreground/80"
                                  >
                                    Fabricar
                                  </button>
                                )}
                             </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-6">
                <div className="bg-muted/30 p-5 rounded-xl border border-border">
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Resumen de Cuenta</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-semibold">Total Presupuesto</span>
                      <span className="font-semibold">{formatCurrency(pedido.total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-success font-semibold">Monto Pagado</span>
                      <span className="text-success font-semibold">{formatCurrency(pedido.montoPagado)}</span>
                    </div>
                    
                    {/* Progress */}
                    <div className="pt-1 pb-1">
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-success transition-all duration-500 rounded-full" style={{ width: `${paymentProgress}%` }} />
                      </div>
                    </div>

                    <div className="border-t border-border pt-3 flex justify-between items-center font-bold">
                      <span className="text-foreground">Saldo Pendiente</span>
                      <span className={`text-lg ${pedido.saldoPendiente > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {formatCurrency(pedido.saldoPendiente)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPagoModal(true)}
                    disabled={pedido.saldoPendiente <= 0}
                    className="w-full mt-5 flex items-center justify-center gap-2 bg-foreground text-background disabled:opacity-30 disabled:hover:bg-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors"
                  >
                    <DollarSign size={16} /> Registrar Pago / Seña
                  </button>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Otras acciones</h2>
                  
                  <div className="space-y-2">
                    {!isTerminalState && (
                      <button 
                        onClick={() => handleStatusChange('CANCELADO')}
                        disabled={pedido.estado === 'CANCELADO' || pedido.estado === 'ENTREGADO'}
                        className="w-full flex items-center gap-2 text-destructive bg-destructive/5 hover:bg-destructive/10 p-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-30 border border-transparent hover:border-destructive/20"
                      >
                        <XCircle size={16} /> Anular Pedido
                      </button>
                    )}
                    {pedido.estado === 'ENTREGADO' && (
                      <button 
                        onClick={() => setShowDevolverModal(true)}
                        className="w-full flex items-center gap-2 text-amber-600 bg-amber-500/5 hover:bg-amber-500/10 p-2.5 rounded-xl text-sm font-semibold transition-colors border border-transparent hover:border-amber-500/20"
                      >
                        <RefreshCcw size={16} /> Devolver Productos
                      </button>
                    )}
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

      <DevolverItemsPedidoModal
        isOpen={showDevolverModal}
        onClose={() => setShowDevolverModal(false)}
        pedidoId={pedido.id}
        items={pedido.items}
      />
    </div>
  );
}

