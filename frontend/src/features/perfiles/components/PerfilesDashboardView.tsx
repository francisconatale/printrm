import React, { useState, useMemo } from 'react';
import { 
  Settings, 
  Printer, 
  Layers, 
  Paintbrush
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
import { PerfilForm } from './PerfilForm';
import { FilamentProfileForm } from './FilamentProfileForm';
import { PrintProfileForm } from './PrintProfileForm';
import { Perfil, FilamentProfile, PrintProfile } from '../types/perfiles.types';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Modal } from '../../../components/ui/modal';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { ConfigTable, ColumnDef } from '../../../components/ui/config-table';
import { ConfigSection } from '../../../components/ui/config-section';
import { formatCurrency } from '../../../lib/utils';
import { AjustesSeccion } from '../../ajustes/components/AjustesSeccion';

// --- Column Definitions ---
const printerColumns: ColumnDef<Perfil>[] = [
  { header: 'Nombre', className: 'font-sans font-semibold text-[14px]', render: (p) => p.nombre },
  { header: 'Modelo', className: 'font-sans text-muted-foreground', render: (p) => p.modeloImpresora },
  { header: 'Boquilla', className: 'text-right', render: (p) => `${p.nozzleDiameter || 0.4} mm` },
  { header: 'Cama (X x Y)', className: 'text-right', render: (p) => p.bedShape || '220x220' },
  { header: 'Altura Z', className: 'text-right', render: (p) => `${p.maxPrintHeight || 250} mm` },
];

const filamentColumns: ColumnDef<FilamentProfile>[] = [
  { 
    header: 'Color', 
    render: (f) => (
      <div 
        className="size-6 rounded-full border border-border" 
        style={{ backgroundColor: f.colour || '#FF0000' }}
        title={f.colour}
      />
    )
  },
  { header: 'Nombre', className: 'font-sans font-semibold text-[14px]', render: (f) => f.nombre },
  { header: 'Material', className: 'font-sans text-muted-foreground', render: (f) => f.material },
  { header: 'Costo / Kg', className: 'text-right font-semibold', render: (f) => formatCurrency(f.filamentoPorKg || 0) },
  { header: 'Densidad', className: 'text-right', render: (f) => `${f.density || 1.24} g/cm³` },
  { header: 'Diámetro', className: 'text-right', render: (f) => `${f.diameter || 1.75} mm` },
];

const printColumns: ColumnDef<PrintProfile>[] = [
  { header: 'Nombre', className: 'font-sans font-semibold text-[14px]', render: (p) => p.nombre },
  { header: 'Altura de Capa', className: 'text-right', render: (p) => `${p.layerHeight || 0.2} mm` },
  { header: 'Perímetros', className: 'text-right', render: (p) => p.perimeters || 3 },
  { header: 'Infill %', className: 'text-right', render: (p) => p.fillDensity || '15%' },
  { header: 'Velocidad', className: 'text-right', render: (p) => `${p.speedPrint || 60} mm/s` },
];

export const PerfilesDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'printers' | 'filaments' | 'prints' | 'general'>('printers');
  
  // Generic Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);

  // API hooks (called at top level)
  const printersQuery = useGetPerfiles();
  const printerCreate = useCreatePerfil();
  const printerUpdate = useUpdatePerfil();
  const printerDelete = useDeletePerfil();

  const filamentsQuery = useGetFilamentProfiles();
  const filamentCreate = useCreateFilamentProfile();
  const filamentUpdate = useUpdateFilamentProfile();
  const filamentDelete = useDeleteFilamentProfile();

  const printsQuery = useGetPrintProfiles();
  const printCreate = useCreatePrintProfile();
  const printUpdate = useUpdatePrintProfile();
  const printDelete = useDeletePrintProfile();



  // Config Root Registry definition
  const configs = useMemo(() => {
    return {
      printers: {
        id: 'printers' as const,
        label: 'Impresoras',
        icon: Printer,
        title: 'Perfiles de Impresora',
        description: 'Define las impresoras del taller, su consumo y repuestos.',
        newButtonText: 'Nueva Impresora',
        modalTitleNew: 'Nueva Impresora',
        modalTitleEdit: 'Editar Impresora',
        modalDescription: 'Configurá el hardware de la impresora y sus parámetros de slicing en base de datos.',
        deleteTitle: '¿Eliminar Impresora?',
        items: printersQuery.data || [],
        isLoading: printersQuery.isLoading,
        createMutation: printerCreate,
        updateMutation: printerUpdate,
        deleteMutation: printerDelete,
        FormComponent: PerfilForm,
        columns: printerColumns,
      },
      filaments: {
        id: 'filaments' as const,
        label: 'Filamentos',
        icon: Paintbrush,
        title: 'Perfiles de Filamento',
        description: 'Define los rollos de filamento que posees en el inventario.',
        newButtonText: 'Nuevo Filamento',
        modalTitleNew: 'Nuevo Filamento',
        modalTitleEdit: 'Editar Filamento',
        modalDescription: 'Configurá el material, densidad, diámetro y costo de filamento.',
        deleteTitle: '¿Eliminar Filamento?',
        items: filamentsQuery.data || [],
        isLoading: filamentsQuery.isLoading,
        createMutation: filamentCreate,
        updateMutation: filamentUpdate,
        deleteMutation: filamentDelete,
        FormComponent: FilamentProfileForm,
        columns: filamentColumns,
      },
      prints: {
        id: 'prints' as const,
        label: 'Ajustes de Impresión',
        icon: Layers,
        title: 'Ajustes de Impresión',
        description: 'Define resoluciones de capa, velocidad y perímetros de infill.',
        newButtonText: 'Nuevo Ajuste',
        modalTitleNew: 'Nuevo Ajuste',
        modalTitleEdit: 'Editar Ajuste',
        modalDescription: 'Configurá las capas, perímetros y relleno para el motor de cálculo.',
        deleteTitle: '¿Eliminar Ajuste de Impresión?',
        items: printsQuery.data || [],
        isLoading: printsQuery.isLoading,
        createMutation: printCreate,
        updateMutation: printUpdate,
        deleteMutation: printDelete,
        FormComponent: PrintProfileForm,
        columns: printColumns,
      }
    };
  }, [
    printersQuery.data, printersQuery.isLoading, printerCreate, printerUpdate, printerDelete,
    filamentsQuery.data, filamentsQuery.isLoading, filamentCreate, filamentUpdate, filamentDelete,
    printsQuery.data, printsQuery.isLoading, printCreate, printUpdate, printDelete
  ]);

  // Current active configuration
  const currentConfig = useMemo(() => {
    if (activeTab === 'general') return null;
    return configs[activeTab];
  }, [activeTab, configs]);

  // Generic Submit handler
  const handleFormSubmit = (data: any) => {
    if (!currentConfig) return;

    if (editingItem) {
      currentConfig.updateMutation.mutate({ id: editingItem.id, ...data }, {
        onSuccess: () => {
          setShowModal(false);
          setEditingItem(null);
        }
      });
    } else {
      currentConfig.createMutation.mutate(data, {
        onSuccess: () => {
          setShowModal(false);
        }
      });
    }
  };

  // Generic Delete handler
  const handleItemDelete = () => {
    if (!currentConfig || !deletingItem) return;

    currentConfig.deleteMutation.mutate(deletingItem.id, {
      onSuccess: () => setDeletingItem(null)
    });
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 max-w-[1200px] w-full mx-auto space-y-10 overflow-y-auto">
        <div>
          <h1 className="studio-display-lg">Configuraciones de Slicing y Costos</h1>
          <p className="studio-body text-muted-foreground mt-2">
            Administrá tus perfiles de hardware, filamentos y resoluciones desde la base de datos de manera simplificada.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border gap-8">
          {(Object.values(configs) as any[]).map((cfg) => {
            const IconComp = cfg.icon;
            return (
              <button
                key={cfg.id}
                onClick={() => setActiveTab(cfg.id)}
                className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === cfg.id ? 'border-foreground text-foreground font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComp size={16} />
                {cfg.label}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 studio-body-strong flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'general' ? 'border-foreground text-foreground font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings size={16} />
            Ajustes Generales
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {activeTab === 'general' ? (
            <AjustesSeccion />
          ) : currentConfig ? (
            /* DYNAMIC PROFILES TAB */
            <ConfigSection
              title={currentConfig.title}
              description={currentConfig.description}
              newButtonText={currentConfig.newButtonText}
              icon={currentConfig.icon as any}
              label={currentConfig.label}
              isLoading={currentConfig.isLoading}
              hasItems={currentConfig.items.length > 0}
              onNew={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
            >
              <ConfigTable
                items={currentConfig.items as any}
                columns={currentConfig.columns as any}
                onEdit={(item) => {
                  setEditingItem(item);
                  setShowModal(true);
                }}
                onDelete={(item) => {
                  setDeletingItem(item);
                }}
                editTitle={`Editar ${currentConfig.label.toLowerCase()}`}
                deleteTitle={`Eliminar ${currentConfig.label.toLowerCase()}`}
              />
            </ConfigSection>
          ) : null}
        </div>
      </main>

      {/* DYNAMIC FORM MODAL */}
      {currentConfig && showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          title={editingItem ? currentConfig.modalTitleEdit : currentConfig.modalTitleNew}
          description={currentConfig.modalDescription}
        >
          <currentConfig.FormComponent 
            initialData={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            isLoading={currentConfig.createMutation.isPending || currentConfig.updateMutation.isPending}
          />
        </Modal>
      )}

      {/* DYNAMIC DELETE CONFIRM */}
      {currentConfig && deletingItem && (
        <ConfirmModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleItemDelete}
          title={currentConfig.deleteTitle}
          description={
            <>
              ¿Estás seguro de que deseas eliminar <strong>{deletingItem.nombre}</strong>?
            </>
          }
          isDestructive
          confirmText="Eliminar"
        />
      )}
    </div>
  );
};
