import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface ConfigTableProps<T> {
  items: T[];
  columns: ColumnDef<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  editTitle?: string;
  deleteTitle?: string;
}

export function ConfigTable<T extends { id: string }>({
  items,
  columns,
  onEdit,
  onDelete,
  editTitle = 'Editar',
  deleteTitle = 'Eliminar',
}: ConfigTableProps<T>) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-muted/30 border-b border-border">
          {columns.map((col, idx) => (
            <th 
              key={idx} 
              className={`px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground ${col.className || ''}`}
            >
              {col.header}
            </th>
          ))}
          <th className="px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground text-right">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/50 font-sans text-[13px] text-foreground">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-muted/20">
            {columns.map((col, idx) => (
              <td key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                {col.render(item)}
              </td>
            ))}
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 hover:bg-muted/30 rounded-full transition-all text-muted-foreground hover:text-foreground"
                  title={editTitle}
                  aria-label={editTitle}
                >
                  <Edit3 size={14} aria-hidden="true" />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 hover:bg-red-500/10 rounded-full transition-all text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                  title={deleteTitle}
                  aria-label={deleteTitle}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
