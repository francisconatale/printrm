import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { OnboardingFormData } from '../types/onboarding.types';
import { useCompleteOnboarding } from '../hooks/useOnboarding';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const TOTAL_STEPS = 7;

interface OnboardingWizardProps {
  onComplete: () => void;
}

/* ─── Impresoras preconfiguradas ─── */
const PRINTERS = [
  { name: 'Ender 3',       model: 'Creality Ender 3',         consumoW: 270  },
  { name: 'Ender 3 V2',    model: 'Creality Ender 3 V2',      consumoW: 270  },
  { name: 'Ender 3 S1',    model: 'Creality Ender 3 S1',      consumoW: 350  },
  { name: 'Bambu X1C',     model: 'Bambu Lab X1 Carbon',      consumoW: 1000 },
  { name: 'Bambu P1S',     model: 'Bambu Lab P1S',            consumoW: 1000 },
  { name: 'Bambu A1 Mini', model: 'Bambu Lab A1 Mini',        consumoW: 500  },
  { name: 'Prusa MK4',     model: 'Prusa Research MK4',       consumoW: 240  },
  { name: 'Prusa Mini+',   model: 'Prusa Research Mini+',     consumoW: 180  },
  { name: 'Voron 2.4',     model: 'Voron Design 2.4',        consumoW: 500  },
  { name: 'Neptune 4',     model: 'Elegoo Neptune 4',         consumoW: 350  },
  { name: 'K1 Max',        model: 'Creality K1 Max',          consumoW: 600  },
  { name: 'Otra',          model: '',                         consumoW: 250  },
] as const;

/* ─── Tipos de paso ─── */
type StepConfig =
  | { kind: 'greeting' }
  | { kind: 'field'; title: string; subtitle: string; fields: FieldConfig[] }
  | { kind: 'printer' }
  | { kind: 'summary' };

type FieldConfig = {
  key: keyof OnboardingFormData;
  label: string;
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  hint?: string;
  options?: string[];
  mono?: boolean;
};

const STEPS: StepConfig[] = [
  { kind: 'greeting' },
  {
    kind: 'field',
    title: 'Sobre vos',
    subtitle: 'Cómo te llamás y cómo se llama tu emprendimiento',
    fields: [
      { key: 'nombreUsuario',        label: 'Tu nombre',               type: 'text',   placeholder: 'Juan Pérez'           },
      { key: 'nombreEmprendimiento', label: 'Tu emprendimiento',        type: 'text',   placeholder: 'Impresiones 3D XYZ'   },
    ],
  },
  {
    kind: 'field',
    title: 'Electricidad',
    subtitle: 'El precio del kWh define tus costos de energía',
    fields: [
      { key: 'precioKwh', label: 'Precio por kWh', type: 'number', placeholder: '50', mono: true },
    ],
  },
  { kind: 'printer' },
  {
    kind: 'field',
    title: 'Tu filamento',
    subtitle: 'El material que más imprimís',
    fields: [
      { key: 'filamentName',     label: 'Nombre',        type: 'text',   placeholder: 'PLA Genérico' },
      { key: 'filamentMaterial', label: 'Material',      type: 'select', options: ['PLA','PLA+','PETG','ABS','TPU','ASA','Nylon','PC'] },
      { key: 'filamentPriceKg',  label: 'Costo por kg',  type: 'number', placeholder: '15000', mono: true },
      { key: 'density',          label: 'Densidad g/cm³', type: 'number', placeholder: '1.24',  mono: true },
      { key: 'diameter',         label: 'Diámetro mm',    type: 'number', placeholder: '1.75',  mono: true },
      { key: 'colour',           label: 'Color',          type: 'text',   placeholder: '#3B82F6', mono: true },
    ],
  },
  {
    kind: 'field',
    title: 'Perfil de impresión',
    subtitle: 'Ajustes de calidad con los que imprimís habitualmente',
    fields: [
      { key: 'layerHeight', label: 'Altura de capa (mm)',     type: 'number', placeholder: '0.2',  mono: true },
      { key: 'perimeters',  label: 'Perímetros / Paredes',    type: 'number', placeholder: '3',    mono: true },
      { key: 'fillDensity', label: 'Densidad de relleno (%)', type: 'text',   placeholder: '15%',  mono: true },
      { key: 'speedPrint',  label: 'Velocidad (mm/s)',        type: 'number', placeholder: '60',   mono: true },
    ],
  },
  { kind: 'summary' },
];

/* ─── Hook: transición de pasos ─── */
function useTransition(step: number) {
  const [phase, setPhase]       = useState<'idle' | 'out' | 'in'>('idle');
  const [visible, setVisible]   = useState(step);
  const [dir, setDir]           = useState<1 | -1>(1);
  const prev = useRef(step);

  useEffect(() => {
    if (step === visible && phase === 'idle') return;
    if (phase !== 'idle') return;
    setDir(step > prev.current ? 1 : -1);
    setPhase('out');
    const t1 = setTimeout(() => { setVisible(step); setPhase('in'); prev.current = step; }, 320);
    const t2 = setTimeout(() => setPhase('idle'), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  return { visible, phase, dir };
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const queryClient         = useQueryClient();
  const completeOnboarding  = useCompleteOnboarding();
  const { visible, phase, dir } = useTransition(step);

  const [form, setForm] = useState<OnboardingFormData>({
    nombreUsuario: '',
    nombreEmprendimiento: '',
    precioKwh: 50,
    printerName: '',
    printerModel: '',
    consumoW: 250,
    nozzleDiameter: 0.4,
    bedShape: '220x220',
    maxPrintHeight: 250,
    filamentName: '',
    filamentMaterial: 'PLA',
    filamentPriceKg: 15000,
    density: 1.24,
    diameter: 1.75,
    colour: '#3B82F6',
    layerHeight: 0.2,
    perimeters: 3,
    fillDensity: '15%',
    speedPrint: 60,
  });

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const update = useCallback(<K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => {
    setForm(p => ({ ...p, [k]: v }));
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return form.nombreUsuario.trim().length > 0 && form.nombreEmprendimiento.trim().length > 0;
      case 2: return form.precioKwh > 0;
      case 3: return form.printerName.trim().length > 0;
      case 4: return form.filamentName.trim().length > 0 && form.filamentPriceKg > 0;
      case 5: return form.layerHeight > 0 && form.perimeters > 0 && form.speedPrint > 0;
      default: return true;
    }
  };

  const next = () => { setError(null); if (step < TOTAL_STEPS - 1) setStep(s => s + 1); };
  const back = () => { setError(null); if (step > 0) setStep(s => s - 1); };

  // Enter key navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed() && !loading) {
        if (step === TOTAL_STEPS - 1) handleFinish(); else next();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, form, loading]);

  const handleFinish = async () => {
    setLoading(true); setError(null);
    try {
      await apiClient.put('/ajustes', { preciokWh: form.precioKwh, margenError: 10 });
      queryClient.invalidateQueries({ queryKey: ['ajustes'] });
      await apiClient.post('/v1/perfiles', {
        nombre: form.printerName, modeloImpresora: form.printerModel || 'Genérica',
        consumoW: form.consumoW, nozzleDiameter: form.nozzleDiameter,
        bedShape: form.bedShape, maxPrintHeight: form.maxPrintHeight,
      });
      await apiClient.post('/v1/filament-profiles', {
        nombre: form.filamentName, material: form.filamentMaterial,
        filamentoPorKg: form.filamentPriceKg, density: form.density,
        diameter: form.diameter, colour: form.colour,
      });
      await apiClient.post('/v1/print-profiles', {
        nombre: 'Estándar', layerHeight: form.layerHeight,
        perimeters: form.perimeters, fillDensity: form.fillDensity,
        speedPrint: form.speedPrint,
      });
      await completeOnboarding.mutateAsync({
        nombreUsuario: form.nombreUsuario,
        nombreEmprendimiento: form.nombreEmprendimiento,
      });
      onComplete();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Ocurrió un error al guardar');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Renderizado del paso visible ─── */
  const renderStep = (s: number) => {
    const cfg = STEPS[s];

    if (cfg.kind === 'greeting') {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <div className="space-y-3">
            <h1 className="ob-display">Hola</h1>
            <p className="ob-lead">
              Bienvenido a <span className="ob-brand">Printly</span>
            </p>
            <p className="ob-body">
              Te llevará menos de dos minutos configurar todo.
            </p>
          </div>
        </div>
      );
    }

    if (cfg.kind === 'printer') {
      const isCustom = !PRINTERS.slice(0, -1).some(p => p.name === form.printerName) || form.printerName === 'Otra';
      const selectedPreset = PRINTERS.find(p => p.name === form.printerName);

      const setBedDefaults = (model: string) => {
        if (model.includes('Ender')) return { bedShape: '220x220', maxPrintHeight: 250 };
        if (model.includes('Mini')) return { bedShape: '180x180', maxPrintHeight: 180 };
        if (model.includes('Bambu')) return { bedShape: '256x256', maxPrintHeight: 256 };
        if (model.includes('Prusa') && !model.includes('Mini')) return { bedShape: '250x210', maxPrintHeight: 220 };
        return { bedShape: '220x220', maxPrintHeight: 250 };
      };

      return (
        <div className="flex flex-col items-center text-center gap-6 w-full">
          <div className="space-y-2">
            <h2 className="ob-title">Tu impresora</h2>
            <p className="ob-body">Seleccioná tu modelo o ingresá uno personalizado</p>
          </div>

          {/* Preset grid */}
          <div className="ob-printer-grid">
            {PRINTERS.map(p => {
              const active = form.printerName === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    const bed = setBedDefaults(p.name);
                    setForm(prev => ({
                      ...prev,
                      printerName:  p.name === 'Otra' ? '' : p.name,
                      printerModel: p.model,
                      consumoW:     p.consumoW,
                      ...(p.name !== 'Otra' ? bed : {}),
                    }));
                  }}
                  className="ob-printer-card"
                  style={{
                    borderColor: active ? 'var(--primary)' : 'var(--border)',
                    color:       active ? 'var(--primary)' : 'var(--foreground)',
                    background:  active ? 'color-mix(in srgb, var(--primary) 10%, var(--background))' : 'var(--background)',
                  }}
                >
                  <span className="ob-printer-name">{p.name}</span>
                  {p.consumoW !== 250 || p.name !== 'Otra' ? (
                    <span className="ob-printer-watts">{p.consumoW} W</span>
                  ) : (
                    <span className="ob-printer-watts">manual</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Manual fields — siempre visibles para editar */}
          <div className="ob-fields" style={{ marginTop: '0.25rem' }}>
            <div className="ob-field-row">
              <label className="ob-label">Nombre</label>
              <input
                type="text"
                value={form.printerName}
                onChange={e => setForm(p => ({ ...p, printerName: e.target.value }))}
                placeholder="Ej: Ender 3 V2"
                className="ob-input"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="ob-field-row">
                <label className="ob-label">Modelo</label>
                <input
                  type="text"
                  value={form.printerModel}
                  onChange={e => setForm(p => ({ ...p, printerModel: e.target.value }))}
                  placeholder="Opcional"
                  className="ob-input"
                />
              </div>
              <div className="ob-field-row">
                <label className="ob-label">Consumo (W)</label>
                <input
                  type="number"
                  value={form.consumoW}
                  onChange={e => setForm(p => ({ ...p, consumoW: parseFloat(e.target.value) || 0 }))}
                  className="ob-input font-mono"
                  placeholder="250"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="ob-field-row">
                <label className="ob-label">Diámetro boquilla (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.nozzleDiameter}
                  onChange={e => setForm(p => ({ ...p, nozzleDiameter: parseFloat(e.target.value) || 0.4 }))}
                  className="ob-input font-mono"
                  placeholder="0.4"
                />
              </div>
              <div className="ob-field-row">
                <label className="ob-label">Altura max Z (mm)</label>
                <input
                  type="number"
                  value={form.maxPrintHeight}
                  onChange={e => setForm(p => ({ ...p, maxPrintHeight: parseInt(e.target.value) || 250 }))}
                  className="ob-input font-mono"
                  placeholder="250"
                />
              </div>
            </div>
            <div className="ob-field-row">
              <label className="ob-label">Cama (ancho x fondo mm)</label>
              <input
                type="text"
                value={form.bedShape}
                onChange={e => setForm(p => ({ ...p, bedShape: e.target.value }))}
                placeholder="220x220"
                className="ob-input font-mono"
              />
            </div>
          </div>
        </div>
      );
    }

    if (cfg.kind === 'summary') {

      return (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="ob-check-ring">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="ob-title">Todo configurado</h2>
            <p className="ob-body">Así quedó tu perfil inicial</p>
          </div>
          <div className="ob-summary-grid">
            {[
              { label: 'Nombre',          value: form.nombreUsuario },
              { label: 'Emprendimiento',  value: form.nombreEmprendimiento },
              { label: 'kWh',             value: `$${form.precioKwh}`, mono: true },
              { label: 'Impresora',       value: form.printerName },
              { label: 'Boquilla',        value: `${form.nozzleDiameter} mm`, mono: true },
              { label: 'Cama',            value: form.bedShape, mono: true },
              { label: 'Filamento',       value: `${form.filamentName} · ${form.filamentMaterial}` },
              { label: 'Costo/kg',        value: `$${form.filamentPriceKg.toLocaleString()}`, mono: true },
              { label: 'Color',           value: form.colour, mono: true },
              { label: 'Capa',            value: `${form.layerHeight} mm`, mono: true },
              { label: 'Relleno',         value: form.fillDensity, mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} className="ob-summary-item">
                <span className="ob-summary-label">{label}</span>
                <span className={`ob-summary-value ${mono ? 'font-mono' : ''}`}>{value}</span>
              </div>
            ))}
          </div>
          <p className="ob-hint">Podés editar estos valores después desde Ajustes.</p>
        </div>
      );
    }

    /* kind === 'field' */
    return (
      <div className="flex flex-col items-center text-center gap-7 w-full">
        <div className="space-y-2">
          <h2 className="ob-title">{cfg.title}</h2>
          <p className="ob-body">{cfg.subtitle}</p>
        </div>
        <div className="ob-fields">
          {cfg.fields.map(f => (
            <div key={f.key as string} className="ob-field-row">
              <label className="ob-label">{f.label}</label>
              {f.key === 'colour' ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.colour}
                    onChange={e => update('colour', e.target.value)}
                    className="ob-color-picker"
                  />
                  <input
                    type="text"
                    value={form.colour}
                    onChange={e => update('colour', e.target.value)}
                    placeholder="#3B82F6"
                    className="ob-input font-mono"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              ) : f.type === 'select' ? (
                <select
                  value={form[f.key] as string}
                  onChange={e => update(f.key, e.target.value as any)}
                  className="ob-input"
                >
                  {f.options!.map(o => <option key={o} value={o}>{o === 'PC' ? 'Policarbonato' : o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={form[f.key] as string | number}
                  onChange={e => update(f.key, f.type === 'number' ? (parseFloat(e.target.value) || 0) as any : e.target.value as any)}
                  placeholder={f.placeholder}
                  className={`ob-input ${f.mono ? 'font-mono' : ''}`}
                  step={f.type === 'number' ? 'any' : undefined}
                  autoFocus={cfg.fields.indexOf(f) === 0}
                />
              )}
              {f.hint && <p className="ob-hint">{f.hint}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ─── Estilos de animación ─── */
  const contentStyle: React.CSSProperties = {
    opacity:   phase === 'out' ? 0 : 1,
    transform: phase === 'out'
      ? `translateY(${dir > 0 ? '-' : ''}18px)`
      : phase === 'in'
      ? `translateY(${dir > 0 ? '' : '-'}18px)`
      : 'translateY(0)',
    transition: phase === 'idle'
      ? 'none'
      : 'opacity 300ms cubic-bezier(.4,0,.2,1), transform 300ms cubic-bezier(.4,0,.2,1)',
  };

  /* ─── Dot indicators ─── */
  const dots = Array.from({ length: TOTAL_STEPS });

  return (
    <>
      <style>{`
        .ob-root {
          position: fixed; inset: 0; z-index: 100;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: var(--background);
          color: var(--foreground);
          font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
          opacity: 0; transition: opacity 500ms ease;
        }
        .ob-root.ob-mounted { opacity: 1; }

        .ob-display {
          font-size: clamp(3.5rem, 8vw, 6rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--foreground);
        }
        .ob-brand {
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-weight: 600;
        }
        .ob-lead  { font-size: 1.25rem; font-weight: 400; color: var(--muted-foreground); letter-spacing: -0.01em; }
        .ob-title { font-size: clamp(1.75rem,4vw,2.5rem); font-weight: 700; letter-spacing: -0.03em; color: var(--foreground); }
        .ob-body  { font-size: 0.9375rem; color: var(--muted-foreground); line-height: 1.6; }
        .ob-hint  { font-size: 0.75rem; color: var(--muted-foreground); line-height: 1.5; margin-top: 2px; }

        .ob-logo { color: var(--muted-foreground); margin-bottom: 4px; }

        .ob-check-ring {
          width: 60px; height: 60px; border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--primary);
          animation: ob-ring-in 600ms cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes ob-ring-in {
          from { opacity:0; transform: scale(0.6); }
          to   { opacity:1; transform: scale(1); }
        }

        .ob-content {
          width: 100%;
          max-width: 520px;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ob-fields {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .ob-field-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }
        .ob-label {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }
        .ob-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          color: var(--foreground);
          font-size: 1rem;
          padding: 0.5rem 0;
          outline: none;
          transition: border-color 200ms;
          font-family: inherit;
          caret-color: var(--primary);
        }
        .ob-input::placeholder { color: var(--muted-foreground); opacity: 0.6; }
        .ob-input:focus { border-bottom-color: var(--primary); }
        .ob-input option { background: var(--background); color: var(--foreground); }

        .ob-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 2rem;
          text-align: left;
          width: 100%;
          max-width: 340px;
        }
        .ob-summary-item { display: flex; flex-direction: column; gap: 2px; }
        .ob-summary-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-foreground); }
        .ob-summary-value { font-size: 0.9375rem; color: var(--foreground); }

        .ob-footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 2.5rem;
        }

        .ob-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .ob-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--border);
          transition: all 300ms cubic-bezier(.22,1,.36,1);
        }
        .ob-dot.active {
          width: 20px;
          border-radius: 3px;
          background: var(--primary);
        }

        .ob-btn-back {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.875rem; font-weight: 500;
          color: var(--muted-foreground);
          opacity: 0.5;
          background: none; border: none; cursor: pointer;
          padding: 8px; margin: -8px;
          transition: color 200ms, opacity 200ms;
        }
        .ob-btn-back:hover:not(:disabled) { opacity: 1; }
        .ob-btn-back:disabled { opacity: 0; pointer-events: none; }

        .ob-btn-next {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.9375rem; font-weight: 600;
          color: var(--primary);
          background: none; border: none; cursor: pointer;
          padding: 8px; margin: -8px;
          transition: opacity 200ms, transform 200ms;
          letter-spacing: -0.01em;
        }
        .ob-btn-next:hover:not(:disabled) { opacity: 0.65; transform: translateX(2px); }
        .ob-btn-next:disabled { opacity: 0.25; cursor: not-allowed; transform: none; }
        .ob-btn-next:active:not(:disabled) { transform: translateX(4px); }

        .ob-error {
          position: fixed;
          top: 2rem; left: 50%; transform: translateX(-50%);
          background: color-mix(in srgb, var(--destructive) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--destructive) 30%, transparent);
          border-radius: 10px;
          padding: 0.625rem 1rem;
          font-size: 0.8125rem;
          color: var(--destructive);
          max-width: 360px;
          text-align: center;
          animation: ob-ring-in 300ms ease both;
        }

        .ob-color-picker {
          width: 40px; height: 40px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 2px;
          background: transparent;
          cursor: pointer;
          flex-shrink: 0;
        }
        .ob-color-picker::-webkit-color-swatch-wrapper { padding: 0; }
        .ob-color-picker::-webkit-color-swatch { border: none; border-radius: 8px; }

        .ob-printer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          width: 100%;
        }
        .ob-printer-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 10px 6px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: border-color 150ms, background 150ms, color 150ms;
          font-family: inherit;
          text-align: center;
        }
        .ob-printer-card:hover { border-color: var(--primary); opacity: 0.8; background: var(--muted); }
        .ob-printer-name { font-size: 0.75rem; font-weight: 600; line-height: 1.2; }
        .ob-printer-watts { font-size: 0.65rem; font-family: ui-monospace, monospace; opacity: 0.5; }

        @keyframes ob-spin { to { transform: rotate(360deg); } }
        .ob-spinner { animation: ob-spin 700ms linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .ob-root, .ob-check-ring { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div className={`ob-root ${mounted ? 'ob-mounted' : ''}`}>

        {error && <div className="ob-error">{error}</div>}

        {/* Main content with transition */}
        <div className="ob-content" style={contentStyle}>
          {renderStep(visible)}
        </div>

        {/* Footer */}
        <div className="ob-footer">
          <button
            className="ob-btn-back"
            onClick={back}
            disabled={step === 0}
            aria-label="Paso anterior"
          >
            <ChevronLeft size={16} />
            Atrás
          </button>

          <div className="ob-dots" role="tablist" aria-label="Progreso">
            {dots.map((_, i) => (
              <div key={i} className={`ob-dot ${i === step ? 'active' : ''}`} />
            ))}
          </div>

          <button
            className="ob-btn-next"
            onClick={step === TOTAL_STEPS - 1 ? handleFinish : next}
            disabled={!canProceed() || loading}
            aria-label={step === TOTAL_STEPS - 1 ? 'Finalizar' : 'Siguiente paso'}
          >
            {loading ? (
              <>
                <svg className="ob-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity=".25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Guardando
              </>
            ) : step === TOTAL_STEPS - 1 ? (
              'Comenzar'
            ) : step === 0 ? (
              'Empezar'
            ) : (
              <>
                Siguiente
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
