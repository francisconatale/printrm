import React from 'react'
import { 
  Plus, 
  Search, 
  ArrowUpRight,
  Printer,
  ChevronRight,
  Sun,
  Moon,
  X
} from "lucide-react"

import { PerfilSelector } from '../features/perfiles/components/PerfilSelector'
import { PerfilForm } from '../features/perfiles/components/PerfilForm'
import { PiezaForm } from '../features/calculo/components/PiezaForm'
import { ResultadoPanel } from '../features/calculo/components/ResultadoPanel'
import { STLUpload } from '../features/calculo/components/STLUpload'
import { useCalculo } from '../features/calculo/hooks/useCalculo'
import { PiezaInput } from '../features/calculo/types/calculo.types'
import { usePerfilActivo } from '../features/perfiles/hooks/usePerfilActivo'
import { useCreatePerfil, useUpdatePerfil } from '../features/perfiles/api/perfiles.api'
import { useGuardarCalculo } from '../features/calculo/api/calculos.api'
import { Perfil } from '../features/perfiles/types/perfiles.types'

export function StudioDashboard({ onToggleTheme, isDark }: { onToggleTheme: () => void, isDark: boolean }) {
  const { perfilActivo } = usePerfilActivo();
  const [piezaInput, setPiezaInput] = React.useState<PiezaInput>({
    horas: 0,
    minutosAdicionales: 0,
    gramos: 0,
    insumosExtra: 0,
    multiplicador: 3
  });

  const resultado = useCalculo(piezaInput);
  
  const [showPerfilModal, setShowPerfilModal] = React.useState(false);
  const [editingPerfil, setEditingPerfil] = React.useState<Perfil | null>(null);

  const { mutate: createPerfil, isPending: isCreating } = useCreatePerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { mutate: guardarCalculo, isPending: isSavingCalculo } = useGuardarCalculo();

  const handlePerfilSubmit = (data: any) => {
    if (editingPerfil) {
      updatePerfil({ id: editingPerfil.id, ...data }, {
        onSuccess: () => {
          setShowPerfilModal(false);
          setEditingPerfil(null);
        }
      });
    } else {
      createPerfil(data, {
        onSuccess: () => setShowPerfilModal(false)
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
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      {/* Header Integrado */}
      <header className="px-12 py-6 flex items-center justify-between border-b border-[#f0f0f0]">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="studio-display-md !text-xl">Motor Financiero</h1>
            <p className="studio-caption text-[#7a7a7a]">Printrm Studio Edition</p>
          </div>
          <div className="h-8 w-px bg-[#f0f0f0]" />
          <PerfilSelector 
            onAddNew={() => {
              setEditingPerfil(null);
              setShowPerfilModal(true);
            }} 
            onEdit={(perfil) => {
              setEditingPerfil(perfil);
              setShowPerfilModal(true);
            }}
          />
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={onToggleTheme}
             className="size-10 flex items-center justify-center rounded-full bg-[#f5f5f7] border border-[#e0e0e0] hover:bg-[#e0e0e0] transition-colors"
           >
             {isDark ? <Moon size={18} /> : <Sun size={18} />}
           </button>
        </div>
      </header>

      <main className="flex flex-col">
        {/* Balance Visual - Studio Style */}
        <section className="studio-product-tile studio-tile-parchment !py-20 !items-start px-12">
          <div className="max-w-[1024px] w-full">
            <span className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a] mb-2 block">Balance Sugerido</span>
            <div className="flex items-baseline gap-4">
              <h1 className="studio-hero-display font-mono">
                {resultado ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(resultado.precioVenta) : '$ 0,00'}
              </h1>
              <span className="studio-display-md !text-xl text-green-600 opacity-80">+{piezaInput.multiplicador}x</span>
            </div>
            <p className="studio-lead text-[#7a7a7a] mt-4 max-w-[600px] !text-[21px]">
              {perfilActivo 
                ? `Calculando sobre perfil "${perfilActivo.nombre}" con un margen de error del ${perfilActivo.margenError}%.`
                : "Configurá un perfil de impresora para comenzar el cálculo real."}
            </p>
          </div>
        </section>

        {/* Work Area */}
        <section className="px-12 py-16">
          <div className="max-w-[1024px] w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Formulario de Pieza (Lógica Operacional) */}
            <div className="lg:col-span-2 space-y-12">
              <div className="border-b border-[#f0f0f0] pb-4">
                <h2 className="studio-display-md !text-2xl">Datos de la Pieza</h2>
                <p className="studio-caption text-[#7a7a7a]">Ingresá los parámetros de esta impresión específica o importá un STL.</p>
              </div>
              
              <PiezaForm 
                input={piezaInput} 
                onChange={setPiezaInput} 
                disabled={!perfilActivo}
              />

              <div className="pt-8">
                <STLUpload onSlicingComplete={handleSlicingComplete} />
              </div>
            </div>

            {/* Panel de Resultados (Lógica Financiera) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ResultadoPanel 
                  resultado={resultado} 
                  onSave={handleSaveCalculo}
                  isSaving={isSavingCalculo}
                />
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Modal de Perfil */}
      {showPerfilModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] w-full max-w-2xl p-6 md:p-10 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[95vh]">
            <button 
              onClick={() => {
                setShowPerfilModal(false);
                setEditingPerfil(null);
              }}
              className="absolute right-4 top-4 md:right-8 md:top-8 p-2 hover:bg-[#f5f5f7] rounded-full transition-colors"
            >
              <X size={20} className="text-[#7a7a7a]" />
            </button>
            <div className="mb-10">
              <h2 className="studio-display-md !text-3xl">{editingPerfil ? 'Editar Perfil' : 'Nuevo Perfil'}</h2>
              <p className="studio-body text-[#7a7a7a] mt-2">Configurá los costos fijos y el motor de slicing (.ini) para tu impresora.</p>
            </div>
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
      )}
    </div>
  )
}
