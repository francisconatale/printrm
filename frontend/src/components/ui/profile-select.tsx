import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ProfileSelectItem {
  value: string;
  label: string;
}

interface ProfileSelectProps {
  /** Texto del label visible arriba del select */
  label?: string;
  /** Placeholder cuando no hay selección */
  placeholder?: string;
  /** Texto de la opción vacía que resetea la selección */
  emptyLabel?: string;
  /** Valor actualmente seleccionado */
  value: string;
  onValueChange: (value: string) => void;
  items: ProfileSelectItem[];
  className?: string;
  disabled?: boolean;
}

export function ProfileSelect({
  label,
  placeholder = 'Seleccionar...',
  emptyLabel = 'Sin selección',
  value,
  onValueChange,
  items,
  className,
  disabled,
}: ProfileSelectProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-[10px] font-bold uppercase text-muted-foreground">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[300]" position="popper" side="bottom">
          <SelectItem value="">{emptyLabel}</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
