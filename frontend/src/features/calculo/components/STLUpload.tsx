import React from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { useGetSlicerConfigs } from '../../perfiles/api/perfiles.api';
import { SlicingConfigSelector } from './SlicingConfigSelector';

interface STLUploadProps {
  onSlicingComplete: (data: { horas: number; minutos: number; gramos: number }) => void;
}

export const STLUpload: React.FC<STLUploadProps> = ({ onSlicingComplete }) => {
  const { perfilActivo } = usePerfilActivo();
  const { data: slicerConfigs } = useGetSlicerConfigs();
  const [file, setFile] = React.useState<File | null>(null);
  const [isSlicing, setIsSlicing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
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
      setError(null);
      setSuccess(false);
    }
  };

  const handleSlice = async () => {
    if (!file || !perfilActivo) return;

    setIsSlicing(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('printConfig', overrideConfigs.print);
    formData.append('filamentConfig', overrideConfigs.filament);
    formData.append('printerConfig', overrideConfigs.printer);

    try {
      const { data } = await axios.post('http://localhost:8080/api/slice', formData);
      
      // Parse estimated time (e.g. "1h 20m")
      const timeStr = data.estimatedTime || "0h 0m";
      const hMatch = timeStr.match(/(\d+)h/);
      const mMatch = timeStr.match(/(\d+)m/);
      
      const horas = hMatch ? parseInt(hMatch[1]) : 0;
      const minutos = mMatch ? parseInt(mMatch[1]) : 0;
      const gramos = data.filamentUsedG || 0;

      onSlicingComplete({ horas, minutos, gramos });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data || "Error al procesar el archivo STL");
    } finally {
      setIsSlicing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${file ? 'border-[#1d1d1f] bg-black/[0.01]' : 'border-[#e0e0e0] bg-[#fcfcfc] hover:border-[#7a7a7a]'}`}>
        <input 
          type="file" 
          accept=".stl"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-4">
          <div className="size-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
            {file ? <FileText className="text-[#1d1d1f]" size={32} /> : <Upload className="text-[#7a7a7a]" size={32} />}
          </div>
          <div>
            <p className="studio-body-strong">{file ? file.name : 'Importar Archivo STL'}</p>
            <p className="studio-caption text-[#7a7a7a] mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Arrastrá tu diseño para calcular tiempo y peso automáticamente'}</p>
          </div>
        </div>
      </div>

      {file && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
          {slicerConfigs && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-[#7a7a7a] px-1">Configuración del Slicer</p>
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
              className="flex-1 studio-button-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSlicing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Procesando con PrusaSlicer...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={18} />
                  ¡Cálculo Exitoso!
                </>
              ) : (
                'Analizar con PrusaSlicer'
              )}
            </button>
            <button 
              onClick={() => { setFile(null); setError(null); }}
              className="px-6 studio-button-secondary-pill !py-3"
            >
              Quitar
            </button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
              <AlertCircle size={18} />
              <p className="studio-caption font-semibold">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
