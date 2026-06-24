import React, { useState } from 'react';
import { PiezaSTL } from '../types/biblioteca.types';
import { STLPreview } from './STLPreview';
import { MoreVertical, Trash2, Eye, Box } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface STLCardProps {
  pieza: PiezaSTL;
  onDelete: (id: string) => void;
  onPublish?: (pieza: PiezaSTL) => void;
  onViewDetail?: (pieza: PiezaSTL) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

export const STLCard: React.FC<STLCardProps> = ({ pieza, onDelete, onPublish, onViewDetail }) => {
  const [hovered, setHovered] = useState(false);
  
  const stlUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/biblioteca/files/${pieza.filePath}`; 

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetail?.(pieza)}
      className="group relative bg-background rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-border/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:border-foreground/30 transition-all duration-300 cursor-pointer"
    >
      {/* 3D Preview Area */}
      <div className="aspect-square w-full bg-muted/40 relative overflow-hidden flex items-center justify-center">
        {hovered ? (
          <div className="w-full h-full animate-in fade-in duration-300">
            <STLPreview url={stlUrl} />
          </div>
        ) : pieza.imagenBase64 ? (
          <img 
            src={pieza.imagenBase64} 
            alt={pieza.nombre} 
            className="w-full h-full object-contain p-0 scale-125 animate-in fade-in duration-300 transition-transform duration-700 group-hover:scale-[1.35]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 animate-in fade-in duration-300 transition-transform duration-700 group-hover:scale-105">
            <Box size={48} strokeWidth={1} />
          </div>
        )}

        {/* Dynamic Cost Badge (iOS Glassmorphism) */}
        {pieza.costoBase && pieza.costoBase > 0 ? (
          <div className="absolute top-4 left-4 z-10 bg-background/70 backdrop-blur-md border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
            <p className="text-[12px] font-bold text-foreground leading-none">{formatCurrency(pieza.costoBase)}</p>
          </div>
        ) : null}
      </div>

      {/* Info Area */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-semibold text-foreground text-[15px] truncate" title={pieza.nombre}>
              {pieza.nombre}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
              {pieza.perfilFilamentoNombre || 'Material no definido'}
            </p>
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="size-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
                aria-label={`Opciones para pieza ${pieza.nombre}`}
              >
                <MoreVertical size={18} aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => onViewDetail?.(pieza)}>
                  <Eye size={16} className="mr-2" aria-hidden="true" />
                  Ver Detalle
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(pieza.id)}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                >
                  <Trash2 size={16} className="mr-2" aria-hidden="true" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-border/50">
          <div className="flex gap-4">
            {pieza.pesoGramos && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Peso</span>
                <span className="text-[13px] font-semibold text-foreground">{pieza.pesoGramos}g</span>
              </div>
            )}
            {pieza.tiempoEstimado && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Tiempo</span>
                <span className="text-[13px] font-semibold text-foreground">{pieza.tiempoEstimado}</span>
              </div>
            )}
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onPublish?.(pieza)}
              className="bg-[#007AFF] hover:bg-[#0062cc] active:opacity-60 text-white text-[12px] font-bold px-4 py-2 rounded-full transition-all shadow-sm"
              title={`Fabricar ${pieza.nombre} en Catálogo`}
              aria-label={`Fabricar pieza ${pieza.nombre} en Catálogo`}
            >
              Fabricar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
