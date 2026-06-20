import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface QueryErrorViewProps {
  error: Error | null | unknown;
  refetch: () => void;
  title?: string;
  message?: string;
}

export function QueryErrorView({
  error,
  refetch,
  title = 'Error de carga',
  message = 'Hubo un problema al recuperar los datos del servidor. Por favor, reintentá la operación.',
}: QueryErrorViewProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border border-border rounded-xl shadow-sm max-w-md mx-auto my-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      
      {errorMessage && errorMessage !== 'null' && (
        <div className="w-full p-3 mb-6 bg-muted text-xs text-left rounded-md overflow-x-auto mono max-h-24 custom-scrollbar border border-border-subtle">
          <span className="font-semibold">Detalle:</span> {errorMessage}
        </div>
      )}
      
      <button
        onClick={() => refetch()}
        className="studio-button-primary flex items-center gap-2"
        aria-label="Reintentar cargar datos"
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        <span>Reintentar</span>
      </button>
    </div>
  );
}
