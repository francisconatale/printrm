import React from 'react';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';
import { VariantD } from './variants/VariantD';
import { VariantE } from './variants/VariantE';
import { FeedbackOverlay } from './feedback/FeedbackOverlay';
import { LabShell } from './components/LabShell';
import { Hammer, ArrowRight } from 'lucide-react';

const variants = [
  { id: 'A', name: 'Kanban Board', desc: 'Pipeline visual por columnas de estado. Ideal para ver el flujo de trabajo de un vistazo.', component: VariantA },
  { id: 'B', name: 'Lista Moderna', desc: 'Filas espaciadas tipo Stripe con acciones siempre visibles. Búsqueda y filtros inline.', component: VariantB },
  { id: 'C', name: 'Acordeón por Estado', desc: 'Tabla compacta agrupada por estado con secciones expandibles. Máxima info en mínimo espacio.', component: VariantC },
  { id: 'D', name: 'Grid + Drawer', desc: 'Tarjetas visuales con panel lateral de detalles. Progressive disclosure.', component: VariantD },
  { id: 'E', name: 'Línea de Tiempo', desc: 'Vista cronológica con progreso paso a paso. Ideal para seguimiento visual del avance.', component: VariantE },
];

export function DesignLabPage() {
  return (
    <LabShell>
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-3">
          <Hammer size={28} className="text-primary" />
          <h1 className="studio-display-md">Agenda de Producción — Rediseño</h1>
        </div>
        <p className="studio-body text-muted-foreground max-w-2xl">
          Replanteo completo desde cero. Se mantiene el modal <strong>"Nueva Orden de Stock"</strong>.
          Cinco direcciones distintas explorando layout, interacción y densidad.
        </p>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-semibold">Design Lab</span>
          <ArrowRight size={12} />
          <span>Hacé clic en <strong>"Add Feedback"</strong> abajo a la derecha para comentar elementos específicos</span>
        </div>
      </div>

      {/* Variant Grid */}
      <div className="space-y-10">
        {variants.map((v) => (
          <section key={v.id} data-variant={v.id} className="border border-border rounded-[18px] p-6 bg-card">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[13px] font-bold shrink-0">
                {v.id}
              </span>
              <div>
                <h2 className="studio-caption-strong text-foreground">{v.name}</h2>
                <p className="text-[12px] text-muted-foreground">{v.desc}</p>
              </div>
            </div>
            <div className="border border-border rounded-[14px] overflow-hidden bg-[#fafafa] p-6">
              <v.component />
            </div>
          </section>
        ))}
      </div>

      {/* Notes */}
      <div className="mt-10 p-6 bg-muted/50 border border-border rounded-[18px] text-[13px] text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">📐 Notas de diseño</p>
        <p>Todas las variantes usan los tokens del design system existente: Action Blue (#0066cc), Inter, bordes sólidos, UI plana sin sombras.</p>
        <p>El modal "Nueva Orden de Stock" (<code>CrearOrdenIndependienteModal</code>) se conserva tal cual está — su contenido no forma parte de esta exploración.</p>
      </div>

      <FeedbackOverlay targetName="AgendaProduccion" />
    </LabShell>
  );
}
