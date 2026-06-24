import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { useModalOverlay } from '../../hooks/useModalOverlay';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  cancelVariant?: 'primary' | 'outline';
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  cancelVariant = 'outline',
  isDestructive = false,
  isLoading = false,
}) => {
  useModalOverlay(isOpen, onClose);

  if (!isOpen) return null;


  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-background rounded-2xl max-w-md w-full p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-left animate-in zoom-in-95 duration-200 z-10">
        <div className={`flex items-center gap-3 mb-4 ${isDestructive ? 'text-red-600' : 'text-primary'}`}>
          <AlertTriangle size={24} />
          <h3 className="studio-tagline text-lg font-bold">{title}</h3>
        </div>
        <div className="studio-body text-sm text-muted-foreground mb-6">
          {description}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant={cancelVariant} size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
