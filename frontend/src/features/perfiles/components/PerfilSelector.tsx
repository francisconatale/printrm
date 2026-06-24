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
  const { data: perfilesData, isLoading } = useGetPerfiles(0, 100);
  const perfiles = perfilesData?.content;
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

  if (isLoading) return <div className="h-10 w-48 bg-muted/30 animate-pulse rounded-full" />;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-2 bg-muted/30 border border-border rounded-full hover:bg-muted/30 transition-colors"
      >
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Perfil Activo</p>
          <p className="studio-caption-strong leading-tight">
            {perfilActivo?.nombre || 'Sin perfil'}
          </p>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto">
              {perfiles?.map(perfil => (
                <div 
                  key={perfil.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 cursor-pointer group"
                  onClick={() => {
                    setPerfilActivo(perfil);
                    setIsOpen(false);
                  }}
                >
                  <span className={`studio-caption ${perfilActivo?.id === perfil.id ? 'font-bold' : ''}`}>
                    {perfil.nombre}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(perfil);
                      setIsOpen(false);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted/30 rounded-full transition-all"
                  >
                    <Settings size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[var(--border)] mt-2 pt-2 px-2">
              <button 
                onClick={() => {
                  onAddNew();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 studio-caption-strong text-accent hover:bg-muted/20 rounded-xl transition-colors"
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
