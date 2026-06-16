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
  FileText
} from 'lucide-react';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { RegistrarPagoModal } from './RegistrarPagoModal';
import { RegistrarMermaModal } from './RegistrarMermaModal';

interface PedidoDetalleViewProps {
  pedidoId: string;
  onBack: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export function PedidoDetalleView({ pedidoId, onBack }: PedidoDetalleViewProps) {
  const { data: pedido, isLoading } = useGetPedido(pedidoId);
  const { mutate: updateEstado } = useUpdateEstadoPedido();
  
  const [showPagoModal, setShowPagoModal] = React.useState(false);
  const [showMermaModal, setShowMermaModal] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  if (isLoading || !pedido) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const handleStatusChange = (nuevoEstado: any) => {
    updateEstado({ id: pedido.id, estado: nuevoEstado });
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-full animate-in fade-in duration-500">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1200px] mx-auto space-y-10">
          
          {/* Top Navigation & Status */}
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="size-8 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-muted/40">
                <ArrowLeft size={16} />
              </div>
              <span className="text-sm font-medium">Volver al listado</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estado Actual</span>
              <EstadoBadge estado={pedido.estado} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Order Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-1">
                <h2 className="studio-display-md !text-4xl tracking-tight">Pedido #{pedido.id.substring(0, 8)}</h2>
                <p className="studio-body text-muted-foreground">Solicitado por <span className="text-foreground font-semibold">{pedido.clienteNombre}</span></p>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Ítems del Presupuesto</h3>
                <div className="space-y-3">
                  {pedido.items.map((item) => (
                    <div key={item.id} className="bg-card border border-border/50 p-5 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground">
                          {item.productoId ? <Package size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <p className="studio-body-strong">{item.perfilNombre}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                            {item.cantidad} UNIDADES {item.cantidadMerma > 0 && `• ${item.cantidadMerma} FALLIDAS`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Subtotal</p>
                          <p className="text-sm font-mono font-bold">{formatCurrency(item.subtotal)}</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setShowMermaModal(true);
                          }}
                          className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100"
                          title="Registrar Fallo/Merma"
                        >
                          <AlertTriangle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-8 border-t border-border/40">
                 <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a] mb-6">Gestión de Estados</h3>
                 <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleStatusChange('COTIZADO')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${pedido.estado === 'COTIZADO' ? 'bg-zinc-100 border-zinc-200' : 'hover:bg-zinc-50 border-transparent'}`}
                    >
                      <History size={14} /> Marcar como Cotizado
                    </button>
                    <button 
                      onClick={() => handleStatusChange('EN_PRODUCCION')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${pedido.estado === 'EN_PRODUCCION' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'hover:bg-blue-50/50 border-transparent text-blue-600'}`}
                    >
                      <Truck size={14} /> Iniciar Producción
                    </button>
                    <button 
                      onClick={() => handleStatusChange('ENTREGADO')}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all"
                    >
                      <CheckCircle2 size={14} /> Entregar y Cobrar Saldo
                    </button>
                    <button 
                      onClick={() => handleStatusChange('DEVUELTO')}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-amber-600 hover:bg-amber-50 transition-all"
                    >
                      <RefreshCcw size={14} /> Devolución
                    </button>
                    <button 
                      onClick={() => handleStatusChange('CANCELADO')}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <XCircle size={14} /> Anular Pedido
                    </button>
                 </div>
              </div>
            </div>

            {/* Right Column: Billing Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <div className="p-8 border border-border/50 rounded-[2.5rem] bg-card space-y-8 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="studio-caption text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Total Presupuesto</span>
                      <span className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(pedido.total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="studio-caption uppercase tracking-widest text-[10px] font-bold">Monto Cobrado</span>
                      <span className="text-sm font-mono font-bold">{formatCurrency(pedido.montoPagado)}</span>
                    </div>
                    <div className="border-t border-dashed border-border pt-4 flex justify-between items-center">
                      <span className="studio-caption text-zinc-900 font-bold uppercase tracking-widest text-[10px]">Saldo Pendiente</span>
                      <span className={`text-2xl font-mono font-bold ${pedido.saldoPendiente > 0 ? 'text-amber-600' : 'text-zinc-400'}`}>
                        {formatCurrency(pedido.saldoPendiente)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowPagoModal(true)}
                    disabled={pedido.saldoPendiente <= 0}
                    className="studio-button-primary !w-full flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    <DollarSign size={18} />
                    Registrar Pago / Seña
                  </button>
                </div>

                <div className="p-6 bg-muted/10 rounded-[2rem] border border-border/30">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <History size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Información de Venta</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Este pedido fue creado el {format(new Date(pedido.fechaCreacion), "dd 'de' MMMM", { locale: es })}. 
                    Los egresos por material y luz se registran automáticamente al iniciar la producción.
                  </p>
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
    </div>
  );
}
