import React from 'react'
import { toast } from 'sonner'


import { StudioSubNav } from '../../../components/layout/studio-sub-nav'
import { ResultadoPanel } from '../components/ResultadoPanel'
import { STLUpload } from '../components/STLUpload'
import { CalculadoraConfigSelector } from '../components/CalculadoraConfigSelector'
import { CalculationSuccessModal } from '../components/CalculationSuccessModal'
import { useCalculo } from '../hooks/useCalculo'
import { PiezaInput } from '../types/calculo.types'
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo'
import {
  useGetPerfiles,
  useGetFilamentProfiles,
} from '../../perfiles/api/perfiles.api'
import { useGuardarPieza } from '../../biblioteca/api/biblioteca.api'
import { CalculoSnapshot } from '../types/calculo.types'
import { formatCurrency } from '../../../lib/utils'

interface CalculadoraViewProps {
  initialData?: CalculoSnapshot | null;
  initialFile?: File | null;
  onResetFile?: () => void;
  onGoToLibrary?: () => void;
}

export function CalculadoraView({ initialData, initialFile, onResetFile, onGoToLibrary }: CalculadoraViewProps) {
  const { perfilActivo } = usePerfilActivo();
  const { data: printersData } = useGetPerfiles(0, 100);
  const { data: filamentsData } = useGetFilamentProfiles(0, 100);
  const printers = printersData?.content;
  const filaments = filamentsData?.content;

  const [file, setFile] = React.useState<File | null>(null);
  const [overrideConfigs, setOverrideConfigs] = React.useState({ print: '', filament: '', printer: '' });
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const initialScreenshotRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    initialScreenshotRef.current = undefined;
  }, [file]);

  const [piezaInput, setPiezaInput] = React.useState<PiezaInput>({
    horas: 0,
    minutosAdicionales: 0,
    gramos: 0,
    insumosExtra: 0,
  });

  // Hydrate from initialData if provided
  React.useEffect(() => {
    if (initialData) {
      setPiezaInput({
        horas: initialData.horas,
        minutosAdicionales: initialData.minutosAdicionales,
        gramos: initialData.gramos,
        insumosExtra: initialData.insumosExtra,
      });
      // Optionally override printer if it matches one of ours
      if (initialData.perfilId) {
        setOverrideConfigs(prev => ({ ...prev, printer: initialData.perfilId }));
      }
    }
    if (initialFile) {
      setFile(initialFile);
    }
  }, [initialData, initialFile]);

  // Set default values when profiles are loaded

  // Set default values when profiles are loaded

  const activePrinter = React.useMemo(() => {
    return printers?.find(p => p.id === overrideConfigs.printer) || perfilActivo;
  }, [printers, overrideConfigs.printer, perfilActivo]);

  const activeFilament = React.useMemo(() => {
    return filaments?.find(f => f.id === overrideConfigs.filament) || null;
  }, [filaments, overrideConfigs.filament]);

  const calculationQuery = useCalculo(piezaInput, activePrinter, activeFilament);
  const resultado = calculationQuery.data || null;
  
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const { mutate: guardarPieza, isPending: isSavingPieza } = useGuardarPieza();

  const handleSaveToLibrary = () => {
    if (!file || !resultado) return;

    const canvas = canvasRef.current;
    const imagenBase64 = initialScreenshotRef.current || (canvas ? canvas.toDataURL('image/png') : undefined);

    guardarPieza({
      nombre: file.name.replace('.stl', ''),
      filePath: file.name, 
      pesoGramos: resultado.gramos,
      tiempoEstimado: `${resultado.horas}h ${resultado.minutosAdicionales}m`,
      costoBase: resultado.costoBase,
      perfilImpresoraId: activePrinter?.id,
      perfilFilamentoId: activeFilament?.id,
      perfilImpresionId: overrideConfigs.print || undefined,
      imagenBase64,
    }, {
      onSuccess: () => {
        setShowSuccessModal(true);
      },
      onError: () => {
        toast.error('Error al guardar la pieza');
      }
    });
  };

  const handleAnalyze = () => {
    // Ya no se requiere análisis automático, los inputs son manuales
  };

  const handleOverrideConfigsChange = (type: 'print' | 'filament' | 'printer', val: string) => {
    setOverrideConfigs(prev => ({ ...prev, [type]: val === '__default__' ? '' : val }));
  };

  const handleResetAnalysis = () => {
    setFile(null);
    setPiezaInput(prev => ({ ...prev, horas: 0, minutosAdicionales: 0, gramos: 0 }));
    if (onResetFile) {
      onResetFile();
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 overflow-hidden">
        {/* Operational Section - Studio Spacing */}
        <section className="px-8 md:px-12 py-10 bg-background h-full overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-10">
            <div className="flex items-center">
              <h1 className="studio-display-md">Cotizador de Piezas 3D</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Column */}
            <div className="lg:col-span-8 bg-card rounded-xl border border-border p-6 space-y-10">
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground font-medium">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">1</span>
                  Sube el modelo STL
                </div>
                <div className="pl-9">
                  <STLUpload 
                    file={file}
                    onFileChange={setFile}
                    onReset={handleResetAnalysis}
                    canvasRef={canvasRef}
                    onInitialCapture={(dataUrl) => {
                      initialScreenshotRef.current = dataUrl;
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground font-medium">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">2</span>
                  Datos de Producción (Manual)
                </div>
                <div className="pl-9 grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-muted-foreground font-medium">Horas</label>
                    <input 
                      type="number" 
                      min="0"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      value={piezaInput.horas || ''}
                      onChange={(e) => setPiezaInput(prev => ({ ...prev, horas: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-muted-foreground font-medium">Minutos</label>
                    <input 
                      type="number" 
                      min="0"
                      max="59"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      value={piezaInput.minutosAdicionales || ''}
                      onChange={(e) => setPiezaInput(prev => ({ ...prev, minutosAdicionales: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-muted-foreground font-medium">Gramos</label>
                    <input 
                      type="number" 
                      min="0"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      value={piezaInput.gramos || ''}
                      onChange={(e) => setPiezaInput(prev => ({ ...prev, gramos: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground font-medium">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">3</span>
                  Selecciona los Parámetros
                </div>
                <div className="pl-9">
                  <CalculadoraConfigSelector
                    selected={overrideConfigs}
                    onChange={handleOverrideConfigsChange}
                  />
                </div>
              </div>
            </div>

            {/* Financial Column */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 text-foreground font-medium mb-6">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">4</span>
                    Resultado y Cotización
                  </div>
                  <ResultadoPanel 
                    resultado={resultado}
                    onSaveToLibrary={handleSaveToLibrary}
                    isSavingToLibrary={isSavingPieza}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={calculationQuery.isLoading}
                    hasFile={!!file}
                    hasAnalyzed={true}
                    insumosExtra={piezaInput.insumosExtra}
                    onInsumosExtraChange={(v) => setPiezaInput(prev => ({ ...prev, insumosExtra: v }))}
                    onReset={handleResetAnalysis}
                    isAnalyzeDisabled={false}
                  />
                </div>
              </div>
            </div>

          </div>
          </div>
        </section>
      </main>

      <CalculationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onGoToLibrary={() => {
          setShowSuccessModal(false);
          if (onGoToLibrary) onGoToLibrary();
        }}
        onNewCalculation={() => {
          setShowSuccessModal(false);
          handleResetAnalysis();
        }}
        summaryData={{
          nombre: file?.name?.replace('.stl', '') || 'Pieza',
          tiempoFormatted: resultado ? `${resultado.horas}h ${resultado.minutosAdicionales}m` : '',
          precio: resultado ? formatCurrency(resultado.costoBase * 3) : '$0',
        }}
      />
    </div>
  )
}
