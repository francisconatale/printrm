import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { useModalOverlay } from '../../hooks/useModalOverlay';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
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
          <button 
            onClick={onClose} 
            className="studio-button-secondary-pill !px-4 !py-2 text-xs font-semibold order-1"
          >
            {cancelText}
          </button>
          <button 
            disabled={isLoading}
            onClick={() => {
              onConfirm();
            }} 
            className={`rounded-full px-5 py-2 text-xs font-semibold transition-all order-2 text-white flex items-center gap-2 ${
              isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:opacity-85'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading && <div className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
