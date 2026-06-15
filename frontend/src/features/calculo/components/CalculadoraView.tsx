import React from 'react'
import { X } from "lucide-react"

import { StudioSubNav } from '../../../components/layout/studio-sub-nav'
import { PerfilForm } from '../../perfiles/components/PerfilForm'
import { ResultadoPanel } from '../components/ResultadoPanel'
import { STLUpload } from '../components/STLUpload'
import { SlicingConfigSelector } from '../components/SlicingConfigSelector'
import { useCalculo } from '../hooks/useCalculo'
import { PiezaInput } from '../types/calculo.types'
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo'
import { 
  useCreatePerfil, 
  useUpdatePerfil,
  useGetPerfiles,
  useGetFilamentProfiles,
  useGetPrintProfiles
} from '../../perfiles/api/perfiles.api'
import { useGuardarCalculo } from '../api/calculos.api'
import { useSliceSTL } from '../api/slicer.api'
import { Perfil } from '../../perfiles/types/perfiles.types'

export function CalculadoraView({ onToggleTheme, isDark }: { onToggleTheme: () => void, isDark: boolean }) {
  const { perfilActivo } = usePerfilActivo();
  const { data: printers } = useGetPerfiles();
  const { data: filaments } = useGetFilamentProfiles();
  const { data: prints } = useGetPrintProfiles();

  const [file, setFile] = React.useState<File | null>(null);
  const [overrideConfigs, setOverrideConfigs] = React.useState({ print: '', filament: '', printer: '' });

  // Set default values when profiles are loaded
  React.useEffect(() => {
    if (perfilActivo && !overrideConfigs.printer) {
      setOverrideConfigs(prev => ({ ...prev, printer: perfilActivo.id }));
    }
  }, [perfilActivo, overrideConfigs.printer]);

  React.useEffect(() => {
    if (filaments && filaments.length > 0 && !overrideConfigs.filament) {
      setOverrideConfigs(prev => ({ ...prev, filament: filaments[0].id }));
    }
  }, [filaments, overrideConfigs.filament]);

  React.useEffect(() => {
    if (prints && prints.length > 0 && !overrideConfigs.print) {
      setOverrideConfigs(prev => ({ ...prev, print: prints[0].id }));
    }
  }, [prints, overrideConfigs.print]);

  const [piezaInput, setPiezaInput] = React.useState<PiezaInput>({
    horas: 0,
    minutosAdicionales: 0,
    gramos: 0,
    insumosExtra: 0,
    multiplicador: 3
  });

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [hasAnalyzed, setHasAnalyzed] = React.useState(false);

  const activePrinter = React.useMemo(() => {
    return printers?.find(p => p.id === overrideConfigs.printer) || perfilActivo;
  }, [printers, overrideConfigs.printer, perfilActivo]);

  const activeFilament = React.useMemo(() => {
    return filaments?.find(f => f.id === overrideConfigs.filament) || null;
  }, [filaments, overrideConfigs.filament]);

  const resultado = useCalculo(piezaInput, activePrinter, activeFilament);
  
  const [showPerfilModal, setShowPerfilModal] = React.useState(false);
  const [editingPerfil, setEditingPerfil] = React.useState<Perfil | null>(null);

  const { mutate: createPerfil, isPending: isCreating } = useCreatePerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { mutate: guardarCalculo, isPending: isSavingCalculo } = useGuardarCalculo();
  const { mutate: sliceSTL, isPending: isSlicing } = useSliceSTL();

  const handlePerfilSubmit = (data: any) => {
    console.log("StudioDashboard - Iniciando guardado de perfil:", { editingPerfil, data });
    if (editingPerfil) {
      updatePerfil({ id: editingPerfil.id, ...data }, {
        onSuccess: () => {
          console.log("Perfil actualizado con éxito");
          setShowPerfilModal(false);
          setEditingPerfil(null);
        },
        onError: (err) => {
          console.error("Error al actualizar perfil:", err);
          alert("Error al actualizar el perfil. Revisa la consola.");
        }
      });
    } else {
      createPerfil(data, {
        onSuccess: (newPerfil) => {
          console.log("Perfil creado con éxito:", newPerfil);
          setShowPerfilModal(false);
        },
        onError: (err) => {
          console.error("Error al crear perfil:", err);
          alert("Error al crear el perfil. Revisa la consola.");
        }
      });
    }
  };

  const handleSaveCalculo = () => {
    if (!perfilActivo || !resultado) return;

    const snapshot = {
      perfilId: perfilActivo.id,
      perfilNombre: perfilActivo.nombre,
      ...piezaInput,
      ...resultado
    };

    guardarCalculo(snapshot, {
      onSuccess: () => {
        alert('Cálculo guardado en el historial');
      }
    });
  };

  const handleSlicingComplete = (data: { horas: number; minutos: number; gramos: number }) => {
    setPiezaInput(prev => ({
      ...prev,
      horas: data.horas,
      minutosAdicionales: data.minutos,
      gramos: Math.round(data.gramos * 100) / 100
    }));
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleAnalyze = () => {
    if (!file || !perfilActivo) return;
    setIsAnalyzing(true);
    sliceSTL(
      {
        file,
        printConfig: overrideConfigs.print || undefined,
        filamentConfig: overrideConfigs.filament || undefined,
        printerConfig: overrideConfigs.printer || undefined,
      },
      {
        onSuccess: (result) => {
          const match = (result.estimatedTime || '').match(/(\d+)h\s*(\d+)m/);
          const hours = match ? parseInt(match[1]) : 0;
          const minutes = match ? parseInt(match[2]) : 0;
          handleSlicingComplete({
            horas: hours,
            minutos: minutes,
            gramos: result.filamentUsedG || 0,
          });
        },
        onError: () => {
          alert('Error al analizar el archivo STL');
          setIsAnalyzing(false);
        },
      }
    );
  };

  const handleOverrideConfigsChange = (type: 'print' | 'filament' | 'printer', val: string) => {
    setOverrideConfigs(prev => ({ ...prev, [type]: val === '__default__' ? '' : val }));
  };

  const handleResetAnalysis = () => {
    setFile(null);
    setHasAnalyzed(false);
    setPiezaInput(prev => ({ ...prev, horas: 0, minutosAdicionales: 0, gramos: 0 }));
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      <StudioSubNav
        onToggleTheme={onToggleTheme}
        isDark={isDark}
        showPerfilSelector
        onAddPerfil={() => {
          setEditingPerfil(null)
          setShowPerfilModal(true)
        }}
        onEditPerfil={(perfil) => {
          setEditingPerfil(perfil)
          setShowPerfilModal(true)
        }}
      />

      <main className="flex-1 overflow-hidden">
        {/* Operational Section - Studio Spacing */}
        <section className="px-8 md:px-12 py-6 bg-white h-full overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Input Column */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-8">
                <STLUpload 
                  file={file}
                  onFileChange={setFile}
                  isSlicing={isAnalyzing || isSlicing}
                  onReset={handleResetAnalysis}
                />

                <div className="pt-8 border-t border-[#e0e0e0]">
                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold uppercase text-[#a1a1a1]">Parámetros de Impresión</h3>
                  </div>
                  <SlicingConfigSelector 
                    printers={printers || []}
                    filaments={filaments || []}
                    prints={prints || []}
                    selected={overrideConfigs}
                    onChange={handleOverrideConfigsChange}
                  />
                </div>

              </div>
            </div>

            {/* Financial Column */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <div className="p-7 border border-[#f0f0f0] rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in fade-in duration-500">
                  <ResultadoPanel 
                    resultado={resultado}
                    onSave={handleSaveCalculo}
                    isSaving={isSavingCalculo}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing || isSlicing}
                    hasFile={!!file}
                    hasAnalyzed={hasAnalyzed}
                    insumosExtra={piezaInput.insumosExtra}
                    onInsumosExtraChange={(v) => setPiezaInput(prev => ({ ...prev, insumosExtra: v }))}
                    multiplicador={piezaInput.multiplicador}
                    onMultiplicadorChange={(v) => setPiezaInput(prev => ({ ...prev, multiplicador: v }))}
                    onReset={handleResetAnalysis}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Modal - The Floating Canvas */}
      {showPerfilModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => {
                setShowPerfilModal(false);
                setEditingPerfil(null);
              }}
              className="absolute right-8 top-8 p-2 hover:bg-[#f5f5f7] rounded-full transition-colors z-10"
            >
              <X size={20} className="text-[#7a7a7a]" />
            </button>

            <div className="p-10 pb-0 shrink-0">
              <div className="mb-10">
                <h2 className="studio-display-md !text-4xl tracking-tight">{editingPerfil ? 'Ajustar Perfil' : 'Nuevo Perfil'}</h2>
                <p className="studio-body text-[#7a7a7a] mt-4">Configurá las especificaciones de hardware y el motor de slicing para esta unidad.</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
              <PerfilForm 
                initialData={editingPerfil}
                onSubmit={handlePerfilSubmit}
                onCancel={() => {
                  setShowPerfilModal(false);
                  setEditingPerfil(null);
                }}
                isLoading={isCreating || isUpdating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
