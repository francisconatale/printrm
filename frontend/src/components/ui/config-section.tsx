import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './button';

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
        <Button size="sm" onClick={onNew}>
          <Plus size={14} />
          {newButtonText}
        </Button>
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
          <Button size="sm" onClick={onNew} className="mx-auto mt-6">
            {newButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};
