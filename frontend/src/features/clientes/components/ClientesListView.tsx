import React from 'react';
import { useGetClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from '../api/clientes.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Plus, User, Mail, Phone, Notebook, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { ClienteForm } from './ClienteForm';
import { Cliente } from '../types/clientes.types';
import { QueryErrorView } from '../../../components/ui/query-error-view';

export function ClientesListView() {
  const { data: clientes, isLoading, isError, error, refetch } = useGetClientes();
  const { mutate: createCliente, isPending: isCreating } = useCreateCliente();
  const { mutate: updateCliente, isPending: isUpdating } = useUpdateCliente();
  const { mutate: deleteCliente, isPending: isDeleting } = useDeleteCliente();

  const [showFormModal, setShowFormModal] = React.useState(false);
  const [editingCliente, setEditingCliente] = React.useState<Cliente | null>(null);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [clienteToDelete, setClienteToDelete] = React.useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredClientes = React.useMemo(() => {
    if (!clientes) return [];
    return clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientes, searchTerm]);

  const handleClienteSubmit = (data: any) => {
    if (editingCliente) {
      updateCliente({ ...data, id: editingCliente.id }, {
        onSuccess: () => {
          setShowFormModal(false);
          setEditingCliente(null);
        }
      });
    } else {
      createCliente(data, {
        onSuccess: () => setShowFormModal(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCliente(id, {
      onSuccess: () => {
        setShowConfirmModal(false);
        setClienteToDelete(null);
      }
    });
  };

  const isMutationLoading = isCreating || isUpdating;
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="studio-display-md !text-4xl tracking-tight">Gestión de Clientes</h1>
              <p className="studio-body text-muted-foreground">Administrá tu base de contactos comerciales.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} aria-hidden="true" />
                <label htmlFor="search-clientes" className="sr-only">Buscar cliente</label>
                <input 
                  id="search-clientes"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full bg-white border border-[#e0e0e0] rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => {
                  setEditingCliente(null);
                  setShowFormModal(true);
                }}
                className="studio-button-primary flex items-center gap-2"
              >
                <Plus size={16} aria-hidden="true" />
                <span>Nuevo Cliente</span>
              </button>
            </div>
          </div>

          {/* Clientes Content */}
          {isError ? (
            <QueryErrorView error={error} refetch={refetch} />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} aria-hidden="true" />
              <p className="studio-caption">Cargando clientes...</p>
            </div>
          ) : filteredClientes.length === 0 ? (
            isSearching ? (
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
                <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                  <Search size={32} className="text-muted-foreground/40" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="studio-body-strong text-foreground">Búsqueda sin resultados</p>
                  <p className="studio-caption text-muted-foreground">No encontramos clientes que coincidan con "{searchTerm}". Intentá con otros términos.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-primary font-semibold hover:underline mt-2"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
                <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                  <User size={32} className="text-muted-foreground/40" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="studio-body-strong text-foreground">No hay clientes registrados</p>
                  <p className="studio-caption text-muted-foreground">Creá tu primer cliente para empezar a organizar tus pedidos.</p>
                </div>
              </div>
            )
          ) : (
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-border/50">
                <thead className="bg-muted/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Teléfono</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Notas</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Registro</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm studio-body-strong text-foreground">{cliente.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{cliente.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">{cliente.telefono || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground truncate max-w-xs hidden lg:table-cell">{cliente.notas || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                        {cliente.fechaCreacion ? format(new Date(cliente.fechaCreacion), 'dd/MM/yyyy', { locale: es }) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingCliente(cliente);
                              setShowFormModal(true);
                            }}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30"
                            title="Editar Cliente"
                            aria-label="Editar Cliente"
                          >
                            <Edit size={16} aria-hidden="true" />
                          </button>
                          <button 
                            onClick={() => {
                              setClienteToDelete(cliente);
                              setShowConfirmModal(true);
                            }}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10"
                            title="Eliminar Cliente"
                            aria-label="Eliminar Cliente"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showFormModal && (
        <ClienteForm
          initialData={editingCliente}
          onSubmit={handleClienteSubmit}
          onCancel={() => {
            setShowFormModal(false);
            setEditingCliente(null);
          }}
          isLoading={isMutationLoading}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          isOpen={true}
          onClose={() => {
            setShowConfirmModal(false);
            setClienteToDelete(null);
          }}
          onConfirm={() => handleDelete(clienteToDelete!.id)}
          title="Eliminar Cliente"
          description={`¿Estás seguro de que quieres eliminar a "${clienteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          cancelText="Cancelar"
          isDestructive={true}
        />
      )}
    </div>
  );
}