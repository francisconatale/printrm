import React from 'react';
import { Plus } from 'lucide-react';

interface ConfigSectionProps {
  title: string;
  description: string;
  newButtonText: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  isLoading: boolean;
  hasItems: boolean;
  onNew: () => void;
  children: React.ReactNode;
}

export const ConfigSection: React.FC<ConfigSectionProps> = ({
  title,
  description,
  newButtonText,
  icon: IconComponent,
  label,
  isLoading,
  hasItems,
  onNew,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="studio-tagline">{title}</h2>
          <p className="studio-body text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <button
          onClick={onNew}
          className="bg-primary text-white hover:opacity-85 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 flex items-center gap-2"
        >
          <Plus size={14} />
          {newButtonText}
        </button>
      </div>

      {isLoading ? (
        <div className="h-40 w-full bg-muted/30 animate-pulse rounded-2xl" />
      ) : hasItems ? (
        <div className="border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
          {children}
        </div>
      ) : (
        <div className="border border-border rounded-2xl p-12 text-center">
          <IconComponent size={36} className="mx-auto text-muted-foreground mb-4" />
          <p className="studio-tagline text-base text-foreground">No hay {label.toLowerCase()} configurados</p>
          <button
            onClick={onNew}
            className="bg-primary text-white hover:opacity-85 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2.5 mx-auto mt-6"
          >
            {newButtonText}
          </button>
        </div>
      )}
    </div>
  );
};
