import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Cliente, ClienteCreate, ClienteUpdate } from '../types/clientes.types';
import { AlertCircle, User, Mail, Phone, Notebook } from 'lucide-react';
import { Modal } from '../../../components/ui/modal';

const clienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Formato de email inválido").optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  notas: z.string().optional().or(z.literal('')),
});

interface ClienteFormProps {
  initialData?: Cliente | null;
  onSubmit: (data: ClienteCreate | ClienteUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ClienteCreate | ClienteUpdate>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData || {
      nombre: '',
      email: '',
      telefono: '',
      notas: '',
    }
  });

  const onInternalSubmit = (data: ClienteCreate | ClienteUpdate) => {
    onSubmit(data);
  };

  return (
    <Modal
      title={initialData ? "Editar Cliente" : "Nuevo Cliente"}
      description="Gestioná la información de tus contactos comerciales."
      isOpen={true}
      onClose={onCancel}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6 pt-4">
        
        <div className="space-y-2">
          <label className="studio-caption font-semibold flex items-center gap-2">
            <User size={14} /> Nombre Completo *
          </label>
          <input 
            {...register('nombre')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            placeholder="Ej: Juan Pérez"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="studio-caption font-semibold flex items-center gap-2">
              <Mail size={14} /> Email
            </label>
            <input 
              {...register('email')}
              type="email"
              className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="ejemplo@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold flex items-center gap-2">
              <Phone size={14} /> Teléfono
            </label>
            <input 
              {...register('telefono')}
              type="tel"
              className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="+54 9 11 1234-5678"
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold flex items-center gap-2">
            <Notebook size={14} /> Notas
          </label>
          <textarea 
            {...register('notas')}
            rows={4}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all resize-y"
            placeholder="Información adicional sobre el cliente..."
          />
          {errors.notas && <p className="text-red-500 text-xs mt-1">{errors.notas.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#f0f0f0]">
          <button 
            type="button"
            onClick={onCancel}
            className="studio-button-secondary-pill"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="studio-button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
