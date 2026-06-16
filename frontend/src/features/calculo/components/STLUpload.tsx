import React from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { STLViewer } from './STLViewer';

interface STLUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isSlicing: boolean;
  onReset?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const STLUpload: React.FC<STLUploadProps> = ({ 
  file, onFileChange, isSlicing, onReset, canvasRef
}) => {
  const { perfilActivo } = usePerfilActivo();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`relative border border-[var(--border-faint)] rounded-[2.5rem] transition-all group overflow-hidden ${file ? 'bg-muted/20 p-0' : 'bg-muted/10 hover:bg-muted/20 p-12 text-center'}`}>
        
        {file ? (
          <div className="relative h-[320px] w-full">
            {/* Subtle Floating File Info */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-lg border border-[var(--border-subtle)] shadow-sm pointer-events-none transition-all group-hover:bg-background/90">
              <div className="size-6 rounded-full bg-background/50 flex items-center justify-center text-foreground">
                <FileText size={12} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground leading-none">{file.name}</p>
                <p className="text-[8px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
              className="absolute top-4 right-4 z-30 size-8 rounded-full bg-background/70 backdrop-blur-lg border border-[var(--border-subtle)] flex items-center justify-center text-muted-foreground hover:bg-background/90 hover:text-foreground transition-all shadow-sm"
              title="Volver atrás"
            >
              <X size={14} />
            </button>
            
            {/* STL Viewer - Full Bleed */}
            <div className="w-full h-full">
              <STLViewer file={file} canvasRef={canvasRef} />
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
            <div className="size-16 rounded-full flex items-center justify-center mx-auto bg-muted/20 text-muted-foreground transition-all group-hover:text-foreground group-hover:bg-muted/30">
              <Upload size={24} />
            </div>
            <div>
              <p className="studio-body-strong !text-lg text-foreground">Importar Modelo STL</p>
              <p className="studio-caption text-muted-foreground mt-1">Arrastrá tu diseño para análisis automático</p>
            </div>
          </div>
        )}
      </div>

      {!perfilActivo && file && (
        <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-[1.5rem] border border-amber-200 dark:border-amber-800/50 animate-in fade-in zoom-in-95">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-[12px] font-semibold">
            Necesitás un **Perfil Activo** para analizar.
          </p>
        </div>
      )}

    </div>
  );
};
