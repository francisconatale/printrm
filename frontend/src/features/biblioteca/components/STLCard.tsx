import React, { useState } from 'react';
import { PiezaSTL } from '../types/biblioteca.types';
import { STLPreview } from './STLPreview';
import { MoreVertical, Trash2, Box } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { useGetPerfiles, useGetFilamentProfiles } from '../../perfiles/api/perfiles.api';
import { parseEstimatedTime } from '../../calculo/utils/calculos.utils';

interface STLCardProps {
  pieza: PiezaSTL;
  onDelete: (id: string) => void;
  onCalculate: (pieza: PiezaSTL) => void;
  onPublish?: (pieza: PiezaSTL) => void;
  onViewDetail?: (pieza: PiezaSTL) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

export const STLCard: React.FC<STLCardProps> = ({ pieza, onDelete, onCalculate, onPublish, onViewDetail }) => {
  const [hovered, setHovered] = useState(false);
  
  const stlUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/biblioteca/files/${pieza.filePath}`; 

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetail?.(pieza)}
      className="group relative bg-white border border-[#e0e0e0] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#1d1d1f] hover:shadow-[3px_5px_30px_0px_rgba(0,0,0,0.08)] cursor-pointer"
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

        {/* Dynamic Cost Badge (Calculated by Backend) */}
        {pieza.costoBase && pieza.costoBase > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md border border-white/50 px-2 py-1 rounded-lg shadow-sm">
            <p className="text-[9px] text-[#7a7a7a] leading-none uppercase font-bold tracking-tight">Costo</p>
            <p className="text-xs font-mono font-bold text-zinc-900">{formatCurrency(pieza.costoBase)}</p>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <h3 className="studio-body-strong truncate pr-2" title={pieza.nombre}>
              {pieza.nombre}
            </h3>
            <p className="text-[10px] text-[#7a7a7a] uppercase tracking-wider font-semibold truncate">
              {pieza.perfilFilamentoNombre || 'Material no definido'}
            </p>
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={`Opciones para pieza ${pieza.nombre}`}
              >
                <MoreVertical size={16} className="text-[#7a7a7a]" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onViewDetail?.(pieza)}
                >
                  <Box size={14} className="mr-2" aria-hidden="true" />
                  Ver Detalle
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(pieza.id)}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 size={14} className="mr-2" aria-hidden="true" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onPublish?.(pieza)}
              className="px-3 py-1.5 rounded-full border border-[#e0e0e0] text-xs font-semibold hover:border-black transition-colors"
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
