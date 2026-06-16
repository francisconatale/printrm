import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalOverlay } from '../../hooks/useModalOverlay';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = '2xl',
}) => {
  useModalOverlay(isOpen, onClose);


  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className={`bg-background rounded-[2rem] w-full ${sizeClasses[size]} max-h-[85vh] flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 z-10`}>
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 p-2 hover:bg-muted/30 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-muted-foreground" />
        </button>
        <div className="p-10 pb-0 shrink-0">
          <div className="mb-6">
            <h2 className="studio-display-md !text-4xl tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="studio-body text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
