import React from 'react';
import { Plus, Minus, MoreVertical, Coins, Box, Image as ImageIcon } from 'lucide-react';

const mockProducto = {
  id: '1',
  nombre: 'Maceta Groot Pequeña',
  descripcion: 'Maceta decorativa impresa en PLA Wood.',
  cantidadStock: 15,
  precioSugerido: 4500,
  partes: [{ costoBase: 850, imagenBase64: '' }],
  lotes: []
};

const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

export const LabPage = () => {
  const currentCost = 850;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12 bg-background min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Design Lab: ProductoCard</h1>
        <p className="text-muted-foreground">Exploración de rediseños elegantes para la tarjeta de producto en el catálogo de stock.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* VARIANT A */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2"><span className="bg-primary text-primary-foreground size-6 flex items-center justify-center rounded-full text-sm">A</span> Vertical Premium</h3>
            <p className="text-sm text-muted-foreground mt-1">Estilo E-Commerce. Protagonismo a la imagen. Botones flotantes.</p>
          </div>
          
          <div className="bg-card border border-border/60 rounded-[1.25rem] overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative">
            <div className="h-48 bg-muted/30 relative flex items-center justify-center">
              <ImageIcon className="text-muted-foreground/30" size={48} />
              <div className="absolute top-3 right-3">
                <button className="bg-background/80 backdrop-blur-md hover:bg-background border border-border/50 text-muted-foreground rounded-full p-1.5 shadow-sm transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                Stock: {mockProducto.cantidadStock}
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-foreground text-lg">{mockProducto.nombre}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mockProducto.descripcion}</p>
              
              <div className="mt-5 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Precio Venta</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(mockProducto.precioSugerido)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Costo</p>
                  <p className="text-sm font-medium text-muted-foreground flex items-center justify-end gap-1"><Coins size={12}/> {formatCurrency(currentCost)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-border/50">
                <button className="flex items-center justify-center gap-2 bg-muted/50 hover:bg-muted text-foreground py-2 rounded-xl text-xs font-semibold transition-colors">
                  <Minus size={14} /> Quitar
                </button>
                <button className="flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                  <Plus size={14} /> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* VARIANT B */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2"><span className="bg-primary text-primary-foreground size-6 flex items-center justify-center rounded-full text-sm">B</span> Minimal Glass</h3>
            <p className="text-sm text-muted-foreground mt-1">Horizontal súper sutil, sin bordes fuertes. Información condensada.</p>
          </div>
          
          <div className="group bg-card hover:bg-muted/30 border border-transparent hover:border-border/60 rounded-2xl p-2.5 flex items-center gap-4 transition-all duration-300 relative">
            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center shrink-0 border border-border/40">
              <ImageIcon className="text-muted-foreground/30" size={24} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-foreground text-sm truncate">{mockProducto.nombre}</h4>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">Stock: {mockProducto.cantidadStock}</span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-foreground">{formatCurrency(mockProducto.precioSugerido)}</span>
                  <span className="text-[10px] text-muted-foreground">venta</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">{formatCurrency(currentCost)}</span>
                  <span className="text-[10px] text-muted-foreground">costo</span>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 transition-all duration-300 flex flex-col gap-1 bg-background border border-border shadow-lg rounded-lg p-1">
              <button className="p-1.5 hover:bg-muted rounded-md"><Plus size={14} /></button>
              <button className="p-1.5 hover:bg-muted rounded-md"><Minus size={14} /></button>
            </div>
          </div>
        </div>

        {/* VARIANT C */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2"><span className="bg-primary text-primary-foreground size-6 flex items-center justify-center rounded-full text-sm">C</span> Stripe-like Row</h3>
            <p className="text-sm text-muted-foreground mt-1">Como una fila de tabla enriquecida. Máxima densidad para catálogos grandes.</p>
          </div>
          
          <div className="bg-card border-y sm:border border-border/50 sm:rounded-xl p-3 flex items-center gap-4 hover:bg-muted/20 transition-colors">
            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center shrink-0 border border-border/50">
              <Box className="text-muted-foreground/50" size={20} />
            </div>
            
            <div className="flex-1 grid grid-cols-4 items-center gap-4">
              <div className="col-span-2">
                <h4 className="font-semibold text-sm text-foreground">{mockProducto.nombre}</h4>
                <p className="text-[11px] text-muted-foreground truncate">{mockProducto.descripcion}</p>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Stock</span>
                <span className="text-sm font-bold text-emerald-600">{mockProducto.cantidadStock}</span>
              </div>
              
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Venta / Costo</span>
                <div className="text-sm">
                  <span className="font-bold">{formatCurrency(mockProducto.precioSugerido)}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-xs text-muted-foreground">{formatCurrency(currentCost)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 pl-4 border-l border-border/50">
              <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"><Minus size={16}/></button>
              <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"><Plus size={16}/></button>
              <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors ml-1"><MoreVertical size={16}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
