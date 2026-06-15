import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  Printer, 
  Layers, 
  Paintbrush,
  AlertTriangle,
  X
} from 'lucide-react';
import { 
  useGetPerfiles, 
  useCreatePerfil, 
  useUpdatePerfil, 
  useDeletePerfil, 
  useGetFilamentProfiles,
  useCreateFilamentProfile,
  useUpdateFilamentProfile,
  useDeleteFilamentProfile,
  useGetPrintProfiles,
  useCreatePrintProfile,
  useUpdatePrintProfile,
  useDeletePrintProfile
} from '../api/perfiles.api';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { PerfilForm } from './PerfilForm';
import { FilamentProfileForm } from './FilamentProfileForm';
import { PrintProfileForm } from './PrintProfileForm';
import { Perfil, FilamentProfile, PrintProfile } from '../types/perfiles.types';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export const PerfilesDashboardView: React.FC<{ onToggleTheme: () => void, isDark: boolean }> = ({ onToggleTheme, isDark }) => {
  const [activeTab, setActiveTab] = useState<'printers' | 'filaments' | 'prints'>('printers');
  
  // Modals state
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [showFilamentModal, setShowFilamentModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Editing state
  const [editingPrinter, setEditingPrinter] = useState<Perfil | null>(null);
  const [editingFilament, setEditingFilament] = useState<FilamentProfile | null>(null);
  const [editingPrint, setEditingPrint] = useState<PrintProfile | null>(null);

  // Deleting state
  const [deletingPrinter, setDeletingPrinter] = useState<Perfil | null>(null);
  const [deletingFilament, setDeletingFilament] = useState<FilamentProfile | null>(null);
  const [deletingPrint, setDeletingPrint] = useState<PrintProfile | null>(null);

  // API hooks
  const { data: printers, isLoading: loadingPrinters } = useGetPerfiles();
  const { mutate: createPrinter, isPending: creatingPrinter } = useCreatePerfil();
  const { mutate: updatePrinter, isPending: updatingPrinter } = useUpdatePerfil();
  const { mutate: deletePrinter } = useDeletePerfil();

  const { data: filaments, isLoading: loadingFilaments } = useGetFilamentProfiles();
  const { mutate: createFilament, isPending: creatingFilament } = useCreateFilamentProfile();
  const { mutate: updateFilament, isPending: updatingFilament } = useUpdateFilamentProfile();
  const { mutate: deleteFilament } = useDeleteFilamentProfile();

  const { data: prints, isLoading: loadingPrints } = useGetPrintProfiles();
  const { mutate: createPrint, isPending: creatingPrint } = useCreatePrintProfile();
  const { mutate: updatePrint, isPending: updatingPrint } = useUpdatePrintProfile();
  const { mutate: deletePrint } = useDeletePrintProfile();

  // Ajustes API (Global Settings like electricity cost)
  const { ajustes, updateAjustes, isUpdating: updatingAjustes } = useAjustes();
  const [preciokWh, setPreciokWh] = useState<number>(0);
  const [margenError, setMargenError] = useState<number>(0);

  React.useEffect(() => {
    if (ajustes) {
      setPreciokWh(ajustes.preciokWh);
      setMargenError(ajustes.margenError);
    }
  }, [ajustes]);

  const handleSaveAjustes = () => {
    if (ajustes) {
      updateAjustes({
        ...ajustes,
        preciokWh,
        margenError
      }, {
        onSuccess: () => {
          alert('Configuración general guardada correctamente.');
        }
      });
    }
  };

  // Submit handlers
  const handlePrinterSubmit = (data: any) => {
    if (editingPrinter) {
      updatePrinter({ id: editingPrinter.id, ...data }, {
        onSuccess: () => {
          setShowPrinterModal(false);
          setEditingPrinter(null);
        }
      });
    } else {
      createPrinter(data, {
        onSuccess: () => {
          setShowPrinterModal(false);
        }
      });
    }
  };

  const handleFilamentSubmit = (data: any) => {
    if (editingFilament) {
      updateFilament({ id: editingFilament.id, ...data }, {
        onSuccess: () => {
          setShowFilamentModal(false);
          setEditingFilament(null);
        }
      });
    } else {
      createFilament(data, {
        onSuccess: () => {
          setShowFilamentModal(false);
        }
      });
    }
  };

  const handlePrintSubmit = (data: any) => {
    if (editingPrint) {
      updatePrint({ id: editingPrint.id, ...data }, {
        onSuccess: () => {
          setShowPrintModal(false);
          setEditingPrint(null);
        }
      });
    } else {
      createPrint(data, {
        onSuccess: () => {
          setShowPrintModal(false);
        }
      });
    }
  };

  // Delete confirmations
  const handlePrinterDelete = () => {
    if (deletingPrinter) {
      deletePrinter(deletingPrinter.id, {
        onSuccess: () => setDeletingPrinter(null)
      });
    }
  };

  const handleFilamentDelete = () => {
    if (deletingFilament) {
      deleteFilament(deletingFilament.id, {
        onSuccess: () => setDeletingFilament(null)
      });
    }
  };

  const handlePrintDelete = () => {
    if (deletingPrint) {
      deletePrint(deletingPrint.id, {
        onSuccess: () => setDeletingPrint(null)
      });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-full">
      <StudioSubNav onToggleTheme={onToggleTheme} isDark={isDark} />

      <main className="flex-1 px-8 md:px-12 py-10 max-w-[1200px] w-full mx-auto space-y-10 overflow-y-auto">
        <div>
          <h1 className="studio-display-lg">Configuraciones de Slicing y Costos</h1>
          <p className="studio-body text-[#7a7a7a] mt-2">
            Administrá tus perfiles de hardware, filamentos y resoluciones desde la base de datos de manera simplificada.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e0e0e0] gap-8">
          <button
            onClick={() => setActiveTab('printers')}
            className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'printers' ? 'border-[#1d1d1f] text-[#1d1d1f] font-semibold' : 'border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]'
            }`}
          >
            <Printer size={16} />
            Impresoras
          </button>
          <button
            onClick={() => setActiveTab('filaments')}
            className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'filaments' ? 'border-[#1d1d1f] text-[#1d1d1f] font-semibold' : 'border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]'
            }`}
          >
            <Paintbrush size={16} />
            Filamentos
          </button>
          <button
            onClick={() => setActiveTab('prints')}
            className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'prints' ? 'border-[#1d1d1f] text-[#1d1d1f] font-semibold' : 'border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]'
            }`}
          >
            <Layers size={16} />
            Ajustes de Impresión
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          
          {/* TAB 1: PRINTERS */}
          {activeTab === 'printers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="studio-tagline">Perfiles de Impresora</h2>
                  <p className="studio-body text-xs text-[#7a7a7a] mt-0.5">Define las impresoras del taller, su consumo y repuestos.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPrinter(null);
                    setShowPrinterModal(true);
                  }}
                  className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 flex items-center gap-2"
                >
                  <Plus size={14} />
                  Nueva Impresora
                </button>
              </div>

              {loadingPrinters ? (
                <div className="h-40 w-full bg-[#f5f5f7] animate-pulse rounded-2xl" />
              ) : printers && printers.length > 0 ? (
                <div className="border border-[#e0e0e0] rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f5f5f7] border-b border-[#e0e0e0]">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a]">Nombre</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a]">Modelo</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Consumo</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Vida Útil</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Repuestos</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Boquilla</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Cama (X x Y)</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Altura Z</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0] font-mono text-[13px] text-[#1d1d1f]">
                      {printers.map((p) => (
                        <tr key={p.id} className="hover:bg-[#fafafc]">
                          <td className="px-6 py-4 font-sans font-semibold text-[14px]">{p.nombre}</td>
                          <td className="px-6 py-4 font-sans text-[#7a7a7a]">{p.modeloImpresora}</td>
                          <td className="px-6 py-4 text-right">{p.consumoW} W</td>
                          <td className="px-6 py-4 text-right">{(p.vidaUtilHoras || 0).toLocaleString()} hs</td>
                          <td className="px-6 py-4 text-right">{formatCurrency(p.costoRepuestos || 0)}</td>
                          <td className="px-6 py-4 text-right">{p.nozzleDiameter || 0.4} mm</td>
                          <td className="px-6 py-4 text-right">{p.bedShape || '220x220'}</td>
                          <td className="px-6 py-4 text-right">{p.maxPrintHeight || 250} mm</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => {
                                  setEditingPrinter(p);
                                  setShowPrinterModal(true);
                                }}
                                className="p-1.5 hover:bg-[#e0e0e0] rounded-full transition-all text-[#7a7a7a] hover:text-black"
                                title="Editar impresora"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingPrinter(p)}
                                className="p-1.5 hover:bg-red-50 rounded-full transition-all text-[#7a7a7a] hover:text-red-600"
                                title="Eliminar impresora"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-[#e0e0e0] rounded-2xl p-12 text-center">
                  <Printer size={36} className="mx-auto text-[#7a7a7a] mb-4" />
                  <p className="studio-tagline text-base text-[#1d1d1f]">No hay impresoras configuradas</p>
                  <button
                    onClick={() => {
                      setEditingPrinter(null);
                      setShowPrinterModal(true);
                    }}
                    className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 mx-auto mt-6"
                  >
                    Nueva Impresora
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FILAMENTS */}
          {activeTab === 'filaments' && (
            <div className="space-y-8">
              
              {/* Ajustes Rápidos Generales */}
              <div className="max-w-2xl border border-[#e0e0e0] rounded-2xl p-6 bg-[#fafafc] space-y-4">
                <div>
                  <h3 className="studio-tagline text-base text-[#1d1d1f]">Parámetros Globales (Electricidad)</h3>
                  <p className="studio-body text-xs text-[#7a7a7a] mt-0.5">Configuraciones de precio regionales y márgenes generales.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Precio Energía ($ / kWh)</label>
                    <input
                      type="number"
                      step="any"
                      value={preciokWh}
                      onChange={(e) => setPreciokWh(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono text-[14px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Margen de Seguridad / Error (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={margenError}
                      onChange={(e) => setMargenError(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono text-[14px]"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveAjustes}
                  disabled={updatingAjustes}
                  className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2 !w-full"
                >
                  {updatingAjustes ? 'Guardando...' : 'Guardar Ajustes Globales'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="studio-tagline">Perfiles de Filamento</h2>
                  <p className="studio-body text-xs text-[#7a7a7a] mt-0.5">Define los rollos de filamento que posees en el inventario.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFilament(null);
                    setShowFilamentModal(true);
                  }}
                  className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 flex items-center gap-2"
                >
                  <Plus size={14} />
                  Nuevo Filamento
                </button>
              </div>

              {loadingFilaments ? (
                <div className="h-40 w-full bg-[#f5f5f7] animate-pulse rounded-2xl" />
              ) : filaments && filaments.length > 0 ? (
                <div className="border border-[#e0e0e0] rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f5f5f7] border-b border-[#e0e0e0]">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a]">Color</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a]">Nombre</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a]">Material</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Costo / Kg</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Densidad</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Diámetro</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0] font-mono text-[13px] text-[#1d1d1f]">
                      {filaments.map((f) => (
                        <tr key={f.id} className="hover:bg-[#fafafc]">
                          <td className="px-6 py-4">
                            <div 
                              className="size-6 rounded-full border border-[#e0e0e0]" 
                              style={{ backgroundColor: f.colour || '#FF0000' }}
                              title={f.colour}
                            />
                          </td>
                          <td className="px-6 py-4 font-sans font-semibold text-[14px]">{f.nombre}</td>
                          <td className="px-6 py-4 font-sans text-[#7a7a7a]">{f.material}</td>
                          <td className="px-6 py-4 text-right font-semibold">{formatCurrency(f.filamentoPorKg || 0)}</td>
                          <td className="px-6 py-4 text-right">{f.density || 1.24} g/cm³</td>
                          <td className="px-6 py-4 text-right">{f.diameter || 1.75} mm</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => {
                                  setEditingFilament(f);
                                  setShowFilamentModal(true);
                                }}
                                className="p-1.5 hover:bg-[#e0e0e0] rounded-full transition-all text-[#7a7a7a] hover:text-black"
                                title="Editar filamento"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingFilament(f)}
                                className="p-1.5 hover:bg-red-50 rounded-full transition-all text-[#7a7a7a] hover:text-red-600"
                                title="Eliminar filamento"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-[#e0e0e0] rounded-2xl p-12 text-center">
                  <Paintbrush size={36} className="mx-auto text-[#7a7a7a] mb-4" />
                  <p className="studio-tagline text-base text-[#1d1d1f]">No hay filamentos configurados</p>
                  <button
                    onClick={() => {
                      setEditingFilament(null);
                      setShowFilamentModal(true);
                    }}
                    className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 mx-auto mt-6"
                  >
                    Nuevo Filamento
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRINT SETTINGS */}
          {activeTab === 'prints' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="studio-tagline">Ajustes de Impresión</h2>
                  <p className="studio-body text-xs text-[#7a7a7a] mt-0.5">Define resoluciones de capa, velocidad y perímetros de infill.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPrint(null);
                    setShowPrintModal(true);
                  }}
                  className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 flex items-center gap-2"
                >
                  <Plus size={14} />
                  Nuevo Ajuste
                </button>
              </div>

              {loadingPrints ? (
                <div className="h-40 w-full bg-[#f5f5f7] animate-pulse rounded-2xl" />
              ) : prints && prints.length > 0 ? (
                <div className="border border-[#e0e0e0] rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f5f5f7] border-b border-[#e0e0e0]">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a]">Nombre</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Altura de Capa</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Perímetros</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Infill %</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Velocidad</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-[#7a7a7a] text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0] font-mono text-[13px] text-[#1d1d1f]">
                      {prints.map((p) => (
                        <tr key={p.id} className="hover:bg-[#fafafc]">
                          <td className="px-6 py-4 font-sans font-semibold text-[14px]">{p.nombre}</td>
                          <td className="px-6 py-4 text-right">{p.layerHeight || 0.2} mm</td>
                          <td className="px-6 py-4 text-right">{p.perimeters || 3}</td>
                          <td className="px-6 py-4 text-right">{p.fillDensity || '15%'}</td>
                          <td className="px-6 py-4 text-right">{p.speedPrint || 60} mm/s</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => {
                                  setEditingPrint(p);
                                  setShowPrintModal(true);
                                }}
                                className="p-1.5 hover:bg-[#e0e0e0] rounded-full transition-all text-[#7a7a7a] hover:text-black"
                                title="Editar ajuste"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingPrint(p)}
                                className="p-1.5 hover:bg-red-50 rounded-full transition-all text-[#7a7a7a] hover:text-red-600"
                                title="Eliminar ajuste"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-[#e0e0e0] rounded-2xl p-12 text-center">
                  <Layers size={36} className="mx-auto text-[#7a7a7a] mb-4" />
                  <p className="studio-tagline text-base text-[#1d1d1f]">No hay ajustes de impresión configurados</p>
                  <button
                    onClick={() => {
                      setEditingPrint(null);
                      setShowPrintModal(true);
                    }}
                    className="bg-black text-white hover:bg-black/90 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 mx-auto mt-6"
                  >
                    Nuevo Ajuste
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* IMPRESORA MODAL */}
      {showPrinterModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => {
                setShowPrinterModal(false);
                setEditingPrinter(null);
              }}
              className="absolute right-8 top-8 p-2 hover:bg-[#f5f5f7] rounded-full transition-colors z-10"
            >
              <X size={20} className="text-[#7a7a7a]" />
            </button>
            <div className="p-10 pb-0 shrink-0">
              <div className="mb-6">
                <h2 className="studio-display-md !text-4xl tracking-tight">
                  {editingPrinter ? 'Editar Impresora' : 'Nueva Impresora'}
                </h2>
                <p className="studio-body text-[#7a7a7a] mt-2">
                  Configurá el hardware de la impresora y sus parámetros de slicing en base de datos.
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
              <PerfilForm 
                initialData={editingPrinter}
                onSubmit={handlePrinterSubmit}
                onCancel={() => {
                  setShowPrinterModal(false);
                  setEditingPrinter(null);
                }}
                isLoading={creatingPrinter || updatingPrinter}
              />
            </div>
          </div>
        </div>
      )}

      {/* FILAMENTO MODAL */}
      {showFilamentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => {
                setShowFilamentModal(false);
                setEditingFilament(null);
              }}
              className="absolute right-8 top-8 p-2 hover:bg-[#f5f5f7] rounded-full transition-colors z-10"
            >
              <X size={20} className="text-[#7a7a7a]" />
            </button>
            <div className="p-10 pb-0 shrink-0">
              <div className="mb-6">
                <h2 className="studio-display-md !text-4xl tracking-tight">
                  {editingFilament ? 'Editar Filamento' : 'Nuevo Filamento'}
                </h2>
                <p className="studio-body text-[#7a7a7a] mt-2">
                  Configurá el material, densidad, diámetro y costo de filamento.
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
              <FilamentProfileForm 
                initialData={editingFilament}
                onSubmit={handleFilamentSubmit}
                onCancel={() => {
                  setShowFilamentModal(false);
                  setEditingFilament(null);
                }}
                isLoading={creatingFilament || updatingFilament}
              />
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => {
                setShowPrintModal(false);
                setEditingPrint(null);
              }}
              className="absolute right-8 top-8 p-2 hover:bg-[#f5f5f7] rounded-full transition-colors z-10"
            >
              <X size={20} className="text-[#7a7a7a]" />
            </button>
            <div className="p-10 pb-0 shrink-0">
              <div className="mb-6">
                <h2 className="studio-display-md !text-4xl tracking-tight">
                  {editingPrint ? 'Editar Ajuste' : 'Nuevo Ajuste'}
                </h2>
                <p className="studio-body text-[#7a7a7a] mt-2">
                  Configurá las capas, perímetros y relleno para PrusaSlicer.
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
              <PrintProfileForm 
                initialData={editingPrint}
                onSubmit={handlePrintSubmit}
                onCancel={() => {
                  setShowPrintModal(false);
                  setEditingPrint(null);
                }}
                isLoading={creatingPrint || updatingPrint}
              />
            </div>
          </div>
        </div>
      )}

      {/* DELETE PRINTER CONFIRM */}
      {deletingPrinter && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="studio-tagline text-lg font-bold">¿Eliminar Impresora?</h3>
            </div>
            <p className="studio-body text-sm text-[#7a7a7a] mb-6">
              ¿Estás seguro de que deseas eliminar el perfil de impresora <strong>{deletingPrinter.nombre}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingPrinter(null)} className="studio-button-secondary-pill !px-4 !py-2 text-xs font-semibold order-1">Cancelar</button>
              <button onClick={handlePrinterDelete} className="bg-red-600 text-white rounded-full px-5 py-2 text-xs font-semibold hover:bg-red-700 transition-all order-2">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE FILAMENT CONFIRM */}
      {deletingFilament && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="studio-tagline text-lg font-bold">¿Eliminar Filamento?</h3>
            </div>
            <p className="studio-body text-sm text-[#7a7a7a] mb-6">
              ¿Estás seguro de que deseas eliminar el filamento <strong>{deletingFilament.nombre}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingFilament(null)} className="studio-button-secondary-pill !px-4 !py-2 text-xs font-semibold order-1">Cancelar</button>
              <button onClick={handleFilamentDelete} className="bg-red-600 text-white rounded-full px-5 py-2 text-xs font-semibold hover:bg-red-700 transition-all order-2">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PRINT CONFIRM */}
      {deletingPrint && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="studio-tagline text-lg font-bold">¿Eliminar Ajuste de Impresión?</h3>
            </div>
            <p className="studio-body text-sm text-[#7a7a7a] mb-6">
              ¿Estás seguro de que deseas eliminar el perfil de impresión <strong>{deletingPrint.nombre}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingPrint(null)} className="studio-button-secondary-pill !px-4 !py-2 text-xs font-semibold order-1">Cancelar</button>
              <button onClick={handlePrintDelete} className="bg-red-600 text-white rounded-full px-5 py-2 text-xs font-semibold hover:bg-red-700 transition-all order-2">Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
