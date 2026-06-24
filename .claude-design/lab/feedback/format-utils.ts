import { LabFeedback } from './types';

export function formatFeedbackToMarkdown(feedback: LabFeedback): string {
  const grouped = new Map<string, string[]>();
  for (const c of feedback.comments) {
    const key = `Variant ${c.variantId}`;
    const existing = grouped.get(key) || [];
    existing.push(`1. **${c.elementDescription}** (${c.selector})\n   "${c.comment}"`);
    grouped.set(key, existing);
  }

  let md = `## Design Lab Feedback\n\n**Target:** ${feedback.targetName}\n**Comments:** ${feedback.comments.length}\n\n`;

  for (const [variant, comments] of grouped) {
    md += `### ${variant}\n${comments.join('\n\n')}\n\n`;
  }

  if (feedback.overallDirection) {
    md += `### Overall Direction\n${feedback.overallDirection}\n`;
  }

  return md;
}
