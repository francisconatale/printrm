import React, { useState, useRef } from 'react';

interface FeedbackComment {
  id: string;
  variant: string;
  element: string;
  selector: string;
  text: string;
  x: number;
  y: number;
}

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [mode, setMode] = useState<'idle' | 'selecting'>('idle');
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number; variant: string; element: string; selector: string } | null>(null);
  const [inputText, setInputText] = useState('');
  const [overall, setOverall] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (mode !== 'selecting') return;
    const target = e.target as HTMLElement;
    if (target === overlayRef.current) return;
    const variantEl = target.closest('[data-variant]');
    const variant = variantEl?.getAttribute('data-variant') || 'General';
    const tagName = target.tagName.toLowerCase();
    const text = target.textContent?.slice(0, 30).trim() || '';
    const element = text ? `${tagName} "${text}"` : tagName;
    const selector = target.className ? `.${target.className.split(' ')[0]}` : tagName;
    setPendingPos({ x: e.clientX, y: e.clientY, variant, element, selector });
    setMode('idle');
  };

  const saveComment = () => {
    if (!pendingPos || !inputText.trim()) return;
    setComments(prev => [...prev, { id: Math.random().toString(36).slice(2), variant: pendingPos.variant, element: pendingPos.element, selector: pendingPos.selector, text: inputText.trim(), x: pendingPos.x, y: pendingPos.y }]);
    setInputText('');
    setPendingPos(null);
  };

  const generateReport = () => {
    const byVariant: Record<string, FeedbackComment[]> = {};
    comments.forEach(c => { if (!byVariant[c.variant]) byVariant[c.variant] = []; byVariant[c.variant].push(c); });
    let report = `## Design Lab Feedback\n\n**Target:** ${targetName}\n**Comments:** ${comments.length}\n\n`;
    Object.entries(byVariant).forEach(([variant, cs]) => {
      report += `### Variant ${variant}\n`;
      cs.forEach((c, i) => { report += `${i + 1}. **${c.element}** (\`${c.selector}\`)\n   "${c.text}"\n`; });
      report += '\n';
    });
    report += `### Overall Direction\n${overall || '(sin comentario general)'}\n`;
    navigator.clipboard.writeText(report).catch(() => {});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] bg-white border border-green-200 rounded-2xl shadow-2xl p-5 w-80">
        <p className="font-semibold text-green-700 mb-1">✅ Feedback copiado</p>
        <p className="text-xs text-gray-500">Pegá el texto en el chat.</p>
        <button onClick={() => setSubmitted(false)} className="mt-3 text-xs text-gray-400 hover:text-gray-700 underline">Volver</button>
      </div>
    );
  }

  return (
    <>
      {mode === 'selecting' && (
        <div ref={overlayRef} className="fixed inset-0 z-[9990] cursor-crosshair" style={{ background: 'rgba(37,99,235,0.04)' }} onClick={handleOverlayClick} />
      )}
      {comments.map((c, i) => (
        <div key={c.id} className="fixed z-[9995] size-6 rounded-full bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center shadow-lg cursor-pointer border-2 border-white" style={{ left: c.x - 12, top: c.y - 12 }} title={`Variant ${c.variant}: ${c.text}`}>{i + 1}</div>
      ))}
      {pendingPos && (
        <div className="fixed z-[9999] bg-white border border-[#e5e7eb] rounded-xl shadow-2xl p-4 w-72" style={{ left: Math.min(pendingPos.x, window.innerWidth - 300), top: Math.min(pendingPos.y, window.innerHeight - 200) }}>
          <p className="text-[10px] text-[#9ca3af] mb-2 font-medium uppercase tracking-wider">Variant {pendingPos.variant} · {pendingPos.element}</p>
          <textarea autoFocus className="w-full text-sm border border-[#e5e7eb] rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-[#2563eb]/30" rows={3} placeholder="¿Qué pensás?" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), saveComment())} />
          <div className="flex gap-2 mt-2">
            <button onClick={saveComment} className="flex-1 bg-[#2563eb] text-white text-xs font-semibold py-1.5 rounded-lg">Guardar</button>
            <button onClick={() => setPendingPos(null)} className="text-xs text-[#9ca3af] px-2">Cancelar</button>
          </div>
        </div>
      )}
      <div className="fixed bottom-6 right-6 z-[9998]">
        {comments.length > 0 && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-2xl p-5 w-80 mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9ca3af] mb-3">{comments.length} comentario{comments.length !== 1 ? 's' : ''}</p>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {comments.map((c, i) => (
                <div key={c.id} className="flex gap-2 items-start">
                  <span className="size-5 rounded-full bg-[#2563eb] text-white text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <p className="text-xs text-[#6b7280] leading-snug">{c.text}</p>
                </div>
              ))}
            </div>
            <textarea className="w-full text-sm border border-[#e5e7eb] rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-[#2563eb]/30 mb-3" rows={2} placeholder="Dirección general: ¿cuál ganó y qué cambiarías?" value={overall} onChange={e => setOverall(e.target.value)} />
            <button onClick={generateReport} disabled={!overall.trim()} className="w-full bg-[#111827] disabled:bg-[#e5e7eb] disabled:text-[#9ca3af] text-white text-sm font-semibold py-2.5 rounded-xl">Enviar Feedback</button>
          </div>
        )}
        <button onClick={() => setMode(m => m === 'selecting' ? 'idle' : 'selecting')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all ${mode === 'selecting' ? 'bg-[#2563eb] text-white ring-4 ring-[#2563eb]/30' : 'bg-[#111827] text-white hover:bg-black'}`}>
          {mode === 'selecting' ? '🎯 Hacé click en un elemento...' : '💬 Add Feedback'}
        </button>
      </div>
    </>
  );
}
