import React from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { STLViewer } from './STLViewer';

interface STLUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isSlicing: boolean;
  onReset?: () => void;
}

export const STLUpload: React.FC<STLUploadProps> = ({ 
  file, onFileChange, isSlicing, onReset
}) => {
  const { perfilActivo } = usePerfilActivo();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`relative border border-[#e0e0e0] rounded-[2.5rem] transition-all group overflow-hidden ${file ? 'bg-[#f5f5f7] p-0' : 'bg-[#f5f5f7]/30 hover:bg-[#f5f5f7]/50 p-12 text-center'}`}>
        
        {file ? (
          <div className="relative h-[320px] w-full">
            {/* Subtle Floating File Info */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-lg border border-white/20 shadow-sm pointer-events-none transition-all group-hover:bg-white/60">
              <div className="size-6 rounded-full bg-white/40 flex items-center justify-center text-[#1d1d1f]">
                <FileText size={12} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#1d1d1f] leading-none">{file.name}</p>
                <p className="text-[8px] font-medium text-[#7a7a7a] mt-0.5 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            {/* Invisible Input for changing file */}
            <div className="absolute top-4 left-4 z-30 w-40 h-10 cursor-pointer opacity-0">
              <input 
                type="file" 
                accept=".stl"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full cursor-pointer"
                title="Cambiar archivo"
              />
            </div>

            <button
              onClick={onReset}
              className="absolute top-4 right-4 z-30 size-8 rounded-full bg-white/40 backdrop-blur-lg border border-white/20 flex items-center justify-center text-[#7a7a7a] hover:bg-white/80 hover:text-[#1d1d1f] transition-all shadow-sm"
              title="Volver atrás"
            >
              <X size={14} />
            </button>
            
            {/* STL Viewer - Full Bleed */}
            <div className="w-full h-full">
              <STLViewer file={file} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <input 
              type="file" 
              accept=".stl"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              disabled={isSlicing}
            />
            <div className="size-16 rounded-full flex items-center justify-center mx-auto border border-[#e0e0e0] bg-white text-[#7a7a7a] transition-all group-hover:text-[#1d1d1f]">
              <Upload size={24} />
            </div>
            <div>
              <p className="studio-body-strong !text-lg text-[#1d1d1f]">Importar Modelo STL</p>
              <p className="studio-caption text-[#7a7a7a] mt-1">Arrastrá tu diseño para análisis automático</p>
            </div>
          </div>
        )}
      </div>

      {!perfilActivo && file && (
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-[1.5rem] border border-amber-100 animate-in fade-in zoom-in-95">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-[12px] font-semibold">
            Necesitás un **Perfil Activo** para analizar.
          </p>
        </div>
      )}

    </div>
  );
};
