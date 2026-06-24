import React from 'react';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';

export const LabPage = () => {
  return (
    <div className="min-h-screen bg-background p-10 max-w-5xl mx-auto space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Design Lab</h1>
        <p className="text-muted-foreground">Explorando estructuras horizontales (Listas). Referencias: Stripe & Apple.</p>
      </header>

      <main className="space-y-16">
        
        <section className="space-y-6" data-variant="A">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">A</span> 
              Airy Apple List
            </h2>
            <p className="text-sm text-muted-foreground">Mucho espacio en blanco, tipografía grande, redondeado extremo. Súper limpio.</p>
          </div>
          <div className="p-4 bg-muted/20 border border-border/50 rounded-3xl">
            <VariantA />
          </div>
        </section>

        <section className="space-y-6" data-variant="B">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">B</span> 
              Stripe Density Grid
            </h2>
            <p className="text-sm text-muted-foreground">Estructura tabular estricta. Cero bordes redondeados en la tarjeta. Acciones solo en hover.</p>
          </div>
          <div className="p-4 bg-muted/20 border border-border/50 rounded-xl">
            <div className="bg-background border-y border-border/40">
              <VariantB />
            </div>
          </div>
        </section>

        <section className="space-y-6" data-variant="C">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">C</span> 
              Compact Badges
            </h2>
            <p className="text-sm text-muted-foreground">Equilibrio. Minimalista pero con bordes visibles. La información está pegada para lectura rápida.</p>
          </div>
          <div className="p-4 bg-muted/20 border border-border/50 rounded-3xl">
            <VariantC />
          </div>
        </section>

      </main>
    </div>
  );
};
