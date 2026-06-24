import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getElementDescription, generateSelector } from './selector-utils';
import { formatFeedbackToMarkdown } from './format-utils';
import type { FeedbackComment, LabFeedback } from './types';

interface FeedbackOverlayProps {
  targetName: string;
}

export function FeedbackOverlay({ targetName }: FeedbackOverlayProps) {
  const [active, setActive] = useState(false);
  const [selectedEl, setSelectedEl] = useState<Element | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [overallDirection, setOverallDirection] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const highlighterRef = useRef<HTMLDivElement>(null);

  const removeHighlight = useCallback(() => {
    document.querySelectorAll('.design-lab-highlight').forEach((el) => {
      el.classList.remove('design-lab-highlight');
    });
  }, []);

  const handleActivate = useCallback(() => {
    setActive(true);
    removeHighlight();
    setSelectedEl(null);
    setCommentText('');
  }, [removeHighlight]);

  const handleDeactivate = useCallback(() => {
    setActive(false);
    removeHighlight();
    setSelectedEl(null);
    setCommentText('');
  }, [removeHighlight]);

  const handleElementClick = useCallback(
    (e: MouseEvent) => {
      if (!active) return;
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as Element;
      if (target.closest('.feedback-ui')) return;

      removeHighlight();
      target.classList.add('design-lab-highlight');
      setSelectedEl(target);
    },
    [active, removeHighlight]
  );

  useEffect(() => {
    if (active) {
      document.addEventListener('click', handleElementClick, true);
    }
    return () => {
      document.removeEventListener('click', handleElementClick, true);
    };
  }, [active, handleElementClick]);

  useEffect(() => {
    if (!active) {
      removeHighlight();
    }
  }, [active, removeHighlight]);

  const handleSaveComment = useCallback(() => {
    if (!selectedEl || !commentText.trim()) return;

    const variant = selectedEl.closest('[data-variant]')?.getAttribute('data-variant') || 'X';
    const comment: FeedbackComment = {
      id: `c-${Date.now()}`,
      variantId: variant,
      selector: generateSelector(selectedEl),
      elementDescription: getElementDescription(selectedEl),
      comment: commentText.trim(),
    };

    setComments((prev) => [...prev, comment]);
    setSelectedEl(null);
    setCommentText('');
    removeHighlight();
  }, [selectedEl, commentText, removeHighlight]);

  const handleRemoveComment = useCallback((id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleCopyResults = useCallback(() => {
    const feedback: LabFeedback = {
      targetName,
      comments,
      overallDirection: overallDirection.trim(),
    };
    const md = formatFeedbackToMarkdown(feedback);
    navigator.clipboard.writeText(md).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }, [comments, overallDirection, targetName]);

  if (!active) {
    return (
      <button
        onClick={handleActivate}
        className="fixed bottom-6 right-6 z-[300] bg-primary text-primary-foreground px-5 py-3 rounded-full text-[15px] font-semibold shadow-lg hover:opacity-90 transition-all active:scale-[0.97]"
      >
        ✏️ Add Feedback
      </button>
    );
  }

  return (
    <>
      <style>{`
        .design-lab-highlight {
          outline: 2px solid #0066cc !important;
          outline-offset: 2px !important;
          border-radius: 4px !important;
        }
      `}</style>

      <div className="feedback-ui fixed bottom-0 left-0 right-0 z-[300] bg-white border-t border-gray-200 shadow-2xl p-6 max-h-[50vh] overflow-y-auto">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Feedback Mode — Click any element to comment
              </span>
              <span className="ml-3 text-xs text-gray-400">
                ({comments.length} comment{comments.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center gap-3">
              {comments.length > 0 && (
                <button
                  onClick={handleCopyResults}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
                >
                  {copySuccess ? 'Copied!' : 'Copy All Feedback'}
                </button>
              )}
              <button
                onClick={handleDeactivate}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>

          {selectedEl && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="text-sm text-blue-800 font-mono truncate">
                {getElementDescription(selectedEl)}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  autoFocus
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveComment();
                    if (e.key === 'Escape') { setSelectedEl(null); setCommentText(''); }
                  }}
                  placeholder="Write your feedback..."
                  className="flex-1 px-4 py-2 rounded-lg border border-blue-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveComment}
                  disabled={!commentText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50 hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {comments.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comments</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 text-sm bg-gray-50 rounded-lg p-3">
                    <span className="font-mono text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded shrink-0">
                      {c.variantId}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-400 text-xs truncate">{c.elementDescription}</div>
                      <div className="text-gray-800">{c.comment}</div>
                    </div>
                    <button onClick={() => handleRemoveComment(c.id)} className="text-gray-400 hover:text-red-500 shrink-0 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 shrink-0">Overall Direction:</label>
            <input
              type="text"
              value={overallDirection}
              onChange={(e) => setOverallDirection(e.target.value)}
              placeholder="e.g., Go with Variant B's structure + Variant A's colors..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </>
  );
}
