import React from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { useGetSlicerConfigs } from '../../perfiles/api/perfiles.api';
import { useSliceSTL } from '../api/slicer.api';
import { SlicingConfigSelector } from './SlicingConfigSelector';

interface STLUploadProps {
  onSlicingComplete: (data: { horas: number; minutos: number; gramos: number }) => void;
  onSlicingStart?: () => void;
}

export const STLUpload: React.FC<STLUploadProps> = ({ onSlicingComplete, onSlicingStart }) => {
  const { perfilActivo } = usePerfilActivo();
  const { data: slicerConfigs } = useGetSlicerConfigs();
  const { mutate: slice, isPending: isSlicing, error: apiError } = useSliceSTL();
  
  const [file, setFile] = React.useState<File | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [overrideConfigs, setOverrideConfigs] = React.useState({
    print: '',
    filament: '',
    printer: ''
  });

  React.useEffect(() => {
    if (perfilActivo) {
      setOverrideConfigs({
        print: perfilActivo.printConfig || '',
        filament: perfilActivo.filamentConfig || '',
        printer: perfilActivo.printerConfig || ''
      });
    }
  }, [perfilActivo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleSlice = () => {
    console.log("Iniciando slicing...", { file, perfilActivo });
    if (!file) {
      console.warn("No hay archivo seleccionado");
      return;
    }
    if (!perfilActivo) {
      console.warn("No hay perfil activo seleccionado");
      return;
    }

    setSuccess(false);
    onSlicingStart?.();

    slice({
      file,
      printConfig: overrideConfigs.print,
      filamentConfig: overrideConfigs.filament,
      printerConfig: overrideConfigs.printer
    }, {
      onSuccess: (data) => {
        console.log("Slicing exitoso:", data);
        // Parse estimated time (e.g. "1h 20m 5s")
        const timeStr = data.estimatedTime || "0h 0m";
        const hMatch = timeStr.match(/(\d+)h/);
        const mMatch = timeStr.match(/(\d+)m/);
        
        const horas = hMatch ? parseInt(hMatch[1]) : 0;
        const minutos = mMatch ? parseInt(mMatch[1]) : 0;
        const gramos = data.filamentUsedG || 0;

        onSlicingComplete({ horas, minutos, gramos });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      },
      onError: (err) => {
        console.error("Error en el slicing:", err);
      }
    });
  };

  const errorMessage = (apiError as any)?.response?.data || (apiError as any)?.message;

  return (
    <div className="space-y-6">
      <div className={`relative border-2 border-dashed rounded-[2.5rem] p-16 text-center transition-all group ${file ? 'border-[#1d1d1f] bg-black/[0.01]' : 'border-[#e0e0e0] bg-[#fcfcfc] hover:border-[#7a7a7a]'}`}>
        <input 
          type="file" 
          accept=".stl"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={isSlicing}
        />
        <div className="space-y-4">
          <div className={`size-20 rounded-full flex items-center justify-center mx-auto transition-all ${file ? 'bg-[#1d1d1f] text-white shadow-xl' : 'bg-[#f5f5f7] text-[#7a7a7a]'}`}>
            {isSlicing ? <Loader2 className="animate-spin" size={40} /> : file ? <FileText size={40} /> : <Upload size={40} />}
          </div>
          <div>
            <p className="studio-body-strong !text-lg">{file ? file.name : 'Importar Archivo STL'}</p>
            <p className="studio-caption text-[#7a7a7a] mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Arrastrá tu diseño para calcular tiempo y peso automáticamente'}</p>
          </div>
        </div>
      </div>

      {!perfilActivo && file && (
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-5 rounded-[1.5rem] border border-amber-100 animate-in fade-in zoom-in-95">
          <AlertCircle size={20} className="shrink-0" />
          <p className="studio-caption font-semibold text-[13px]">
            Para analizar necesitas un **Perfil Activo**. Por favor, seleccioná o creá uno en la cabecera.
          </p>
        </div>
      )}

      {file && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
          {slicerConfigs && perfilActivo && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7a7a7a] px-1">Configuración del Motor PrusaSlicer</p>
              <SlicingConfigSelector 
                configs={slicerConfigs} 
                selected={overrideConfigs}
                onChange={(type, val) => setOverrideConfigs(prev => ({ ...prev, [type]: val }))}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <button 
              onClick={handleSlice}
              disabled={isSlicing || !perfilActivo}
              className="flex-1 studio-button-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed text-base font-semibold"
            >
              {isSlicing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generando G-code...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={20} className="text-green-400" />
                  Cálculo Sincronizado
                </>
              ) : (
                'Analizar con PrusaSlicer'
              )}
            </button>
            <button 
              onClick={() => { setFile(null); }}
              disabled={isSlicing}
              className="px-8 studio-button-secondary-pill !py-4 text-base"
            >
              Quitar
            </button>
          </div>
          
          {errorMessage && (
            <div className="flex items-start gap-3 text-red-600 bg-red-50 p-5 rounded-[1.5rem] border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="studio-caption-strong uppercase tracking-wider !text-[11px]">Error del Slicer</p>
                <p className="studio-caption mt-1">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
