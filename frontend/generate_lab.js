const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\franc\\OneDrive\\Desktop\\printrm\\frontend';
const claudeDesignPath = path.join(basePath, '.claude-design');
const labPath = path.join(claudeDesignPath, 'lab');
const variantsPath = path.join(labPath, 'variants');
const srcAppPath = path.join(basePath, 'src', 'App.tsx');
const feedbackOverlayDest = path.join(basePath, 'src', 'FeedbackOverlay.tsx');

// Create directories
[claudeDesignPath, labPath, variantsPath].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Save Brief
const brief = {
  scope: "component",
  isRedesign: true,
  targetPath: "src/features/pedidos/components/CrearPedidoModal.tsx",
  targetName: "CrearPedidoModal",
  painPoints: ["Demasiado denso", "Jerarquía poco clara", "Inconsistente"],
  inspiration: {
    visual: ["Stripe", "Apple"],
    functional: []
  },
  brand: {
    adjectives: ["limpio", "premium"],
    density: "cómoda",
    darkMode: false
  },
  constraints: {
    mustKeep: ["campos actuales", "lógica"],
    technical: ["sin nuevas dependencias", "WCAG"]
  },
  stylingSystem: "tailwind"
};
fs.writeFileSync(path.join(claudeDesignPath, 'design-brief.json'), JSON.stringify(brief, null, 2));

// 2. Create Variants
const variantTemplates = [
  {
    name: 'VariantA',
    desc: 'Stripe-esque: Layout limpio a 2 columnas. Selección de cliente y totales a la derecha (sticky), items a la izquierda en tarjetas en lugar de tabla.',
    jsx: `
import React from 'react';
export function VariantA() {
  return (
    <div className="p-6 bg-white border border-gray-100 shadow-xl rounded-2xl max-w-5xl w-full flex gap-6">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Nueva Orden</h2>
          <p className="text-sm text-gray-500">Agrega productos a la orden</p>
        </div>
        <div className="space-y-3">
          {/* Tarjeta de Item */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex gap-4 items-center group hover:bg-white transition-colors">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center shrink-0 font-bold">1</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Producto de Ejemplo</div>
              <div className="text-xs text-gray-500">Costo: $400 | Stock: 10</div>
            </div>
            <div className="w-24">
              <input type="number" defaultValue="1" className="w-full border-gray-200 rounded-md text-center bg-white shadow-sm h-9" />
            </div>
            <div className="text-right font-semibold">$1,200</div>
          </div>
          <button className="text-indigo-600 text-sm font-medium hover:underline">+ Agregar otro producto</button>
        </div>
      </div>
      <div className="w-80 bg-gray-50 p-6 rounded-xl flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Cliente</label>
            <div className="h-10 bg-white border border-gray-200 rounded-lg flex items-center px-3 text-sm text-gray-500 shadow-sm">Buscar cliente...</div>
          </div>
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>$400</span></div>
            <div className="flex justify-between text-sm text-green-600"><span>Ganancia</span><span>+$800</span></div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200"><span>Total</span><span>$1,200</span></div>
          </div>
        </div>
        <button className="w-full bg-black text-white font-medium py-3 rounded-xl mt-8 shadow-md hover:bg-gray-800 transition-colors">Emitir Pedido</button>
      </div>
    </div>
  );
}
`
  },
  {
    name: 'VariantB',
    desc: 'Apple-esque: Minimalista. Usa un enfoque de acordeón/paso a paso suave. Mucho espacio en blanco, bordes muy sutiles.',
    jsx: `
import React from 'react';
export function VariantB() {
  return (
    <div className="p-8 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-[32px] max-w-3xl w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium tracking-tight">Nueva Orden de Trabajo</h2>
      </div>
      
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100/50">
          <label className="text-sm font-medium mb-3 block text-gray-700">1. ¿A quién le facturamos?</label>
          <div className="h-12 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center px-4 text-gray-400">Seleccionar cliente...</div>
        </div>

        <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100/50">
          <label className="text-sm font-medium mb-3 block text-gray-700">2. Productos</label>
          <table className="w-full text-sm">
            <tr className="border-b border-gray-100 text-gray-400 font-normal">
              <th className="text-left font-normal pb-2">Ítem</th>
              <th className="text-center font-normal pb-2 w-20">Cant.</th>
              <th className="text-right font-normal pb-2">Total</th>
            </tr>
            <tr>
              <td className="py-4 font-medium text-gray-900">Producto Premium</td>
              <td className="py-4 text-center">1</td>
              <td className="py-4 text-right font-medium">$1,200</td>
            </tr>
          </table>
          <button className="text-blue-500 text-sm mt-2">+ Añadir ítem</button>
        </div>

        <div className="pt-6 flex items-end justify-between">
          <div className="text-3xl font-semibold tracking-tight">$1,200</div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-md shadow-blue-500/20 hover:bg-blue-700">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    name: 'VariantC',
    desc: 'Listado Expandido: Manteniendo la tabla pero con un diseño mucho más limpio, quitando márgenes y bordes innecesarios, enfocando la atención.',
    jsx: `
import React from 'react';
export function VariantC() {
  return (
    <div className="p-0 bg-white shadow-lg rounded-xl max-w-5xl w-full overflow-hidden flex flex-col border border-gray-200">
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Orden de Trabajo</h2>
          <p className="text-xs text-gray-500">Completá los detalles</p>
        </div>
        <div className="w-72">
          <div className="h-9 bg-white border border-gray-300 rounded shadow-sm flex items-center px-3 text-sm text-gray-400">Cliente...</div>
        </div>
      </div>
      <div className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Producto</th>
              <th className="text-center py-3 px-6 font-medium w-32">Cantidad</th>
              <th className="text-right py-3 px-6 font-medium w-32">Precio Unit.</th>
              <th className="text-right py-3 px-6 font-medium w-32">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-4 px-6 font-medium text-gray-900">Maceta Groot</td>
              <td className="py-4 px-6"><input type="number" defaultValue="2" className="w-full border-gray-200 rounded text-center h-8" /></td>
              <td className="py-4 px-6 text-right text-gray-500">$500</td>
              <td className="py-4 px-6 text-right font-semibold">$1,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button className="text-gray-500 hover:text-gray-900 text-sm font-medium">Cancelar</button>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500">Total a Pagar</div>
            <div className="text-xl font-bold">$1,000</div>
          </div>
          <button className="bg-black text-white px-6 py-2.5 rounded shadow-sm hover:bg-gray-800">Emitir Pedido</button>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    name: 'VariantD',
    desc: 'Panel Lateral (Drawer Style): Diseñado para deslizarse desde la derecha. Ideal para no perder el contexto de la vista principal.',
    jsx: `
import React from 'react';
export function VariantD() {
  return (
    <div className="bg-white shadow-2xl h-[800px] max-w-md w-full border-l border-gray-200 flex flex-col absolute right-0 top-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold">Nueva Orden</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cliente</label>
          <div className="h-10 border border-gray-300 rounded-lg px-3 flex items-center text-sm text-gray-400">Buscar...</div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Productos</label>
            <button className="text-xs text-indigo-600 font-medium">+ Añadir</button>
          </div>
          <div className="p-4 border border-gray-200 rounded-xl space-y-3">
            <div className="font-medium text-sm">Llavero 3D</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center">-</button>
                <span className="w-8 text-center text-sm font-medium">5</span>
                <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center">+</button>
              </div>
              <div className="font-bold">$750</div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
        <div className="flex justify-between text-sm"><span>Ganancia</span><span className="text-green-600 font-medium">+$500</span></div>
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>$750</span></div>
        <button className="w-full bg-black text-white py-3 rounded-lg font-medium">Emitir Pedido</button>
      </div>
    </div>
  );
}
`
  },
  {
    name: 'VariantE',
    desc: 'Cards Flotantes Separadas: Separa conceptualmente el cliente, los productos y los totales en bloques tipo dashboard flotantes.',
    jsx: `
import React from 'react';
export function VariantE() {
  return (
    <div className="p-8 max-w-4xl w-full flex flex-col gap-6 bg-gray-50/50 rounded-3xl">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Crear Pedido</h2>
      </div>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">👤</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500">Facturar a</div>
          <div className="font-semibold text-lg">Seleccionar Cliente...</div>
        </div>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Buscar</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Artículos</h3>
          <button className="text-sm text-blue-600 font-medium">Añadir ítem</button>
        </div>
        <div className="p-5 flex items-center gap-4 hover:bg-gray-50">
          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200"></div>
          <div className="flex-1 font-medium">Soporte Joystick</div>
          <div className="w-20"><input type="number" defaultValue="1" className="w-full text-center h-8 rounded border border-gray-200" /></div>
          <div className="w-24 text-right font-bold">$1,500</div>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center mt-2">
        <div>
          <div className="text-gray-400 text-sm">Total Final</div>
          <div className="text-3xl font-bold">$1,500</div>
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95">Confirmar Orden</button>
      </div>
    </div>
  );
}
`
  }
];

variantTemplates.forEach(v => {
  fs.writeFileSync(path.join(variantsPath, \`\${v.name}.tsx\`), v.jsx);
});

// 3. Lab Page
const labPage = \`
import React from 'react';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';
import { VariantD } from './variants/VariantD';
import { VariantE } from './variants/VariantE';
import { FeedbackOverlay } from '../../src/FeedbackOverlay';

export function LabPage() {
  return (
    <div className="min-h-screen bg-gray-100/50 text-slate-900 font-sans pb-32">
      <header className="bg-white border-b border-gray-200 p-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Design Lab: CrearPedidoModal</h1>
            <p className="text-sm text-gray-500 mt-1">Explorando 5 variantes estructurales para la orden de trabajo.</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8 space-y-24">
        \${variantTemplates.map(v => \`
        <section data-variant="\${v.name.slice(-1)}" className="relative group">
          <div className="absolute -left-6 top-0 bottom-0 w-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">\${v.name.slice(-1)}</span>
              <h2 className="text-xl font-bold">\${v.name}</h2>
            </div>
            <p className="text-gray-600 max-w-3xl ml-11">\${v.desc}</p>
          </div>
          <div className="pl-11 relative overflow-hidden flex items-center justify-center p-12 bg-gray-200/50 rounded-[2rem] border-2 border-dashed border-gray-300">
            <\${v.name} />
          </div>
        </section>
        \`).join('')}
      </main>

      <FeedbackOverlay targetName="CrearPedidoModal" />
    </div>
  );
}
\`;

fs.writeFileSync(path.join(labPath, 'page.tsx'), labPage);

// 4. Feedback Overlay (Simplified)
const feedbackOverlay = \`
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const copyFeedback = () => {
    const text = \`## Design Lab Feedback\\n\\n**Target:** \${targetName}\\n\\n**Overall Direction:**\\n\${feedback}\`;
    navigator.clipboard.writeText(text);
    alert('¡Feedback copiado al portapapeles! Pegalo en la terminal.');
    setIsOpen(false);
    setFeedback('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 transition-transform hover:scale-105 flex items-center gap-2"
        >
          <MessageSquare size={24} />
          <span className="font-bold pr-2">Add Feedback</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 border border-gray-200 animate-in slide-in-from-bottom-5">
          <h3 className="font-bold text-lg mb-4">Feedback: \${targetName}</h3>
          <textarea 
            className="w-full border border-gray-300 rounded-xl p-3 h-32 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Escribí acá qué variante preferís y qué detalles te gustaron (Ej: Me quedo con la B pero me gusta el botón de la A)..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
            <button onClick={copyFeedback} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Copiar Feedback</button>
          </div>
        </div>
      )}
    </div>
  );
}
\`;

fs.writeFileSync(feedbackOverlayDest, feedbackOverlay);

// Modify App.tsx
let appContent = fs.readFileSync(srcAppPath, 'utf8');
if (!appContent.includes('LabPage')) {
  appContent = appContent.replace("import { Toaster } from 'sonner'", "import { Toaster } from 'sonner'\\nimport { LabPage } from '../.claude-design/lab/page'");
  
  const routeHook = \`
  if (new URLSearchParams(window.location.search).get('design_lab') === 'true') {
    return <LabPage />
  }\`;
  
  appContent = appContent.replace("if (!isBackendReady) {", routeHook + "\\n\\n  if (!isBackendReady) {");
  fs.writeFileSync(srcAppPath, appContent);
}

console.log("Lab generated successfully");
