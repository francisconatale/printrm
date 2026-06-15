import React from 'react';
import { ChevronDown, Plus, Settings } from 'lucide-react';
import { useGetPerfiles } from '../api/perfiles.api';
import { usePerfilActivo } from '../hooks/usePerfilActivo';
import { Perfil } from '../types/perfiles.types';

interface PerfilSelectorProps {
  onAddNew: () => void;
  onEdit: (perfil: Perfil) => void;
}

export const PerfilSelector: React.FC<PerfilSelectorProps> = ({ onAddNew, onEdit }) => {
  const { data: perfiles, isLoading } = useGetPerfiles();
  const { perfilActivo, setPerfilActivo } = usePerfilActivo();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (perfiles && perfiles.length > 0 && !perfilActivo) {
      const savedId = localStorage.getItem('perfilActivoId');
      const saved = perfiles.find(p => p.id === savedId);
      const toSelect = saved || perfiles[0];
      console.log("PerfilSelector - Auto-seleccionando:", toSelect.nombre);
      setPerfilActivo(toSelect);
    }
  }, [perfiles, perfilActivo, setPerfilActivo]);

  if (isLoading) return <div className="h-10 w-48 bg-[#f5f5f7] animate-pulse rounded-full" />;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-2 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full hover:bg-[#e0e0e0] transition-colors"
      >
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase text-[#7a7a7a] leading-none">Perfil Activo</p>
          <p className="studio-body-strong !text-[13px] leading-tight">
            {perfilActivo?.nombre || 'Sin perfil'}
          </p>
        </div>
        <ChevronDown size={14} className={`text-[#7a7a7a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#e0e0e0] rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto">
              {perfiles?.map(perfil => (
                <div 
                  key={perfil.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-[#f5f5f7] cursor-pointer group"
                  onClick={() => {
                    setPerfilActivo(perfil);
                    setIsOpen(false);
                  }}
                >
                  <span className={`studio-body !text-[14px] ${perfilActivo?.id === perfil.id ? 'font-bold' : ''}`}>
                    {perfil.nombre}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(perfil);
                      setIsOpen(false);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-[#e0e0e0] rounded-full transition-all"
                  >
                    <Settings size={14} className="text-[#7a7a7a]" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#f0f0f0] mt-2 pt-2 px-2">
              <button 
                onClick={() => {
                  onAddNew();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 studio-caption-strong text-[#0066cc] hover:bg-black/5 rounded-xl transition-colors"
              >
                <Plus size={14} />
                Nuevo Perfil
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
