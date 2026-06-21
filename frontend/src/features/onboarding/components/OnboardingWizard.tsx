import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../../../lib/api-client';
import { OnboardingFormData } from '../types/onboarding.types';
import { useCompleteOnboarding } from '../hooks/useOnboarding';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const TOTAL_STEPS = 5;

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
      { key: 'precioKwh', label: 'Precio por kWh', type: 'number', placeholder: '50', mono: true,
        hint: 'Argentina ~$50 ARS · España ~€0.15' },
    ],
  },
  { kind: 'printer' },
  {
    kind: 'field',
    title: 'Tu filamento',
    subtitle: 'El material que más imprimís',
    fields: [
      { key: 'filamentName',     label: 'Nombre',       type: 'text',   placeholder: 'PLA Genérico' },
      { key: 'filamentMaterial', label: 'Material',     type: 'select', options: ['PLA','PLA+','PETG','ABS','TPU','ASA','Nylon','PC'] },
      { key: 'filamentPriceKg',  label: 'Costo por kg', type: 'number', placeholder: '15000', mono: true },
    ],
  },
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
  const completeOnboarding  = useCompleteOnboarding();
  const { visible, phase, dir } = useTransition(step);

  const [form, setForm] = useState<OnboardingFormData>({
    nombreUsuario: '',
    nombreEmprendimiento: '',
    precioKwh: 50,
    printerName: '',
    printerModel: '',
    consumoW: 250,
    filamentName: '',
    filamentMaterial: 'PLA',
    filamentPriceKg: 15000,
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
      await apiClient.post('/v1/perfiles', {
        nombre: form.printerName, modeloImpresora: form.printerModel || 'Genérica',
        consumoW: form.consumoW, nozzleDiameter: 0.4, bedShape: '220x220', maxPrintHeight: 250,
      });
      await apiClient.post('/v1/filament-profiles', {
        nombre: form.filamentName, material: form.filamentMaterial,
        filamentoPorKg: form.filamentPriceKg, density: 1.24, diameter: 1.75, colour: '#3B82F6',
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
              Bienvenido a <span className="ob-brand">PrintRM Studio</span>
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
                    setForm(prev => ({
                      ...prev,
                      printerName:  p.name === 'Otra' ? '' : p.name,
                      printerModel: p.model,
                      consumoW:     p.consumoW,
                    }));
                  }}
                  className="ob-printer-card"
                  style={{
                    borderColor: active ? '#2563eb' : '#e5e7eb',
                    color:       active ? '#2563eb' : '#374151',
                    background:  active ? '#eff6ff' : '#fff',
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
              { label: 'Nombre',       value: form.nombreUsuario },
              { label: 'Emprendimiento', value: form.nombreEmprendimiento },
              { label: 'kWh',          value: `$${form.precioKwh}`, mono: true },
              { label: 'Impresora',    value: form.printerName },
              { label: 'Filamento',    value: `${form.filamentName} · ${form.filamentMaterial}` },
              { label: 'Costo/kg',     value: `$${form.filamentPriceKg.toLocaleString()}`, mono: true },
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
              {f.type === 'select' ? (
                <select
                  value={form[f.key] as string}
                  onChange={e => update(f.key, e.target.value as any)}
                  className="ob-input"
                  style={{ colorScheme: 'dark' }}
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
        /* Layout */
        .ob-root {
          position: fixed; inset: 0; z-index: 100;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: #ffffff;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
          opacity: 0; transition: opacity 500ms ease;
        }
        .ob-root.ob-mounted { opacity: 1; }

        /* Typography */
        .ob-display {
          font-size: clamp(3.5rem, 8vw, 6rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #111827;
        }
        .ob-brand {
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-weight: 600;
        }
        .ob-lead  { font-size: 1.25rem; font-weight: 400; color: #6b7280; letter-spacing: -0.01em; }
        .ob-title { font-size: clamp(1.75rem,4vw,2.5rem); font-weight: 700; letter-spacing: -0.03em; color: #111827; }
        .ob-body  { font-size: 0.9375rem; color: #6b7280; line-height: 1.6; }
        .ob-hint  { font-size: 0.75rem; color: #9ca3af; line-height: 1.5; margin-top: 2px; }

        /* Logo */
        .ob-logo { color: #9ca3af; margin-bottom: 4px; }

        /* Check ring */
        .ob-check-ring {
          width: 60px; height: 60px; border-radius: 50%;
          border: 1.5px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          color: #2563eb;
          animation: ob-ring-in 600ms cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes ob-ring-in {
          from { opacity:0; transform: scale(0.6); }
          to   { opacity:1; transform: scale(1); }
        }

        /* Content container */
        .ob-content {
          width: 100%;
          max-width: 520px;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Fields */
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
          color: #9ca3af;
        }
        .ob-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          color: #111827;
          font-size: 1rem;
          padding: 0.5rem 0;
          outline: none;
          transition: border-color 200ms;
          font-family: inherit;
          caret-color: #2563eb;
        }
        .ob-input::placeholder { color: #d1d5db; }
        .ob-input:focus { border-bottom-color: #2563eb; }
        .ob-input option { background: #fff; color: #111827; }

        /* Summary grid */
        .ob-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 2rem;
          text-align: left;
          width: 100%;
          max-width: 340px;
        }
        .ob-summary-item { display: flex; flex-direction: column; gap: 2px; }
        .ob-summary-label { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; }
        .ob-summary-value { font-size: 0.9375rem; color: #374151; }

        /* Footer */
        .ob-footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 2.5rem;
        }

        /* Dots */
        .ob-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .ob-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #e5e7eb;
          transition: all 300ms cubic-bezier(.22,1,.36,1);
        }
        .ob-dot.active {
          width: 20px;
          border-radius: 3px;
          background: #2563eb;
        }

        /* Buttons */
        .ob-btn-back {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.875rem; font-weight: 500;
          color: #d1d5db;
          background: none; border: none; cursor: pointer;
          padding: 8px; margin: -8px;
          transition: color 200ms;
        }
        .ob-btn-back:hover:not(:disabled) { color: #6b7280; }
        .ob-btn-back:disabled { opacity: 0; pointer-events: none; }

        .ob-btn-next {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.9375rem; font-weight: 600;
          color: #2563eb;
          background: none; border: none; cursor: pointer;
          padding: 8px; margin: -8px;
          transition: opacity 200ms, transform 200ms;
          letter-spacing: -0.01em;
        }
        .ob-btn-next:hover:not(:disabled) { opacity: 0.65; transform: translateX(2px); }
        .ob-btn-next:disabled { opacity: 0.25; cursor: not-allowed; transform: none; }
        .ob-btn-next:active:not(:disabled) { transform: translateX(4px); }

        /* Error */
        .ob-error {
          position: fixed;
          top: 2rem; left: 50%; transform: translateX(-50%);
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 0.625rem 1rem;
          font-size: 0.8125rem;
          color: #dc2626;
          max-width: 360px;
          text-align: center;
          animation: ob-ring-in 300ms ease both;
        }

        /* Spinner */
        /* Printer preset grid */
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
          border: 1.5px solid #e5e7eb;
          cursor: pointer;
          transition: border-color 150ms, background 150ms, color 150ms;
          font-family: inherit;
          text-align: center;
        }
        .ob-printer-card:hover { border-color: #93c5fd; background: #f8faff; }
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
