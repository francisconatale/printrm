import React, { useState } from 'react';
import { PiezaSTL } from '../types/biblioteca.types';
import { STLPreview } from './STLPreview';
import { MoreVertical, Trash2, Play, Box } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface STLCardProps {
  pieza: PiezaSTL;
  onDelete: (id: string) => void;
  onCalculate: (pieza: PiezaSTL) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

export const STLCard: React.FC<STLCardProps> = ({ pieza, onDelete, onCalculate }) => {
  const [hovered, setHovered] = useState(false);
  
  const stlUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/biblioteca/files/${pieza.filePath}`; 

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white border border-[#e0e0e0] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#1d1d1f] hover:shadow-[3px_5px_30px_0px_rgba(0,0,0,0.08)]"
    >
      {/* 3D Preview Area */}
      <div className="aspect-square w-full bg-[#f5f5f7] relative overflow-hidden flex items-center justify-center">
        {hovered ? (
          <div className="w-full h-full animate-in fade-in duration-300">
            <STLPreview url={stlUrl} />
          </div>
        ) : pieza.imagenBase64 ? (
          <img 
            src={pieza.imagenBase64} 
            alt={pieza.nombre} 
            className="w-full h-full object-contain p-2 animate-in fade-in duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 animate-in fade-in duration-300">
            <Box size={48} strokeWidth={1} />
          </div>
        )}

        {/* Cost Badge */}
        {pieza.costoBase && (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md border border-white/50 px-2 py-1 rounded-lg shadow-sm">
            <p className="text-[9px] text-[#7a7a7a] leading-none uppercase font-bold tracking-tight">Costo</p>
            <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(pieza.costoBase)}</p>
          </div>
        )}

        {/* 3D Interactive Badge */}
        {!hovered && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
            </span>
            VER 3D
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="studio-body-strong truncate max-w-[140px]" title={pieza.nombre}>
              {pieza.nombre}
            </h3>
            <p className="text-[10px] text-[#7a7a7a] uppercase tracking-wider font-semibold">
              {pieza.perfilFilamentoNombre || 'Material no definido'}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <MoreVertical size={16} className="text-[#7a7a7a]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onDelete(pieza.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 size={14} className="mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0]">
          <div className="flex gap-3">
            {pieza.pesoGramos && (
              <div className="text-[10px]">
                <span className="text-[#7a7a7a] block">PESO</span>
                <span className="font-mono font-bold">{pieza.pesoGramos}g</span>
              </div>
            )}
            {pieza.tiempoEstimado && (
              <div className="text-[10px]">
                <span className="text-[#7a7a7a] block">TIEMPO</span>
                <span className="font-mono font-bold">{pieza.tiempoEstimado}</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => onCalculate(pieza)}
            className="size-8 rounded-full bg-black text-white flex items-center justify-center transition-transform active:scale-90 hover:bg-zinc-800"
            title="Calcular Costo"
          >
            <Play size={12} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
