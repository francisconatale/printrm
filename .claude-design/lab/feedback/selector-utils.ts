export function getElementDescription(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const text = el.textContent?.trim().slice(0, 60) || '';
  const testid = el.getAttribute('data-testid');
  const variant = el.closest('[data-variant]')?.getAttribute('data-variant') || '?';
  const ariaLabel = el.getAttribute('aria-label');

  let desc = `<${tag}`;
  if (testid) desc += ` data-testid="${testid}"`;
  if (ariaLabel) desc += ` aria-label="${ariaLabel}"`;
  if (el.id) desc += `#${el.id}`;
  desc += '>';
  if (text) desc += ` "${text}"`;

  return `[${variant}] ${desc}`;
}

export function generateSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const testid = el.getAttribute('data-testid');
  if (testid) return `[data-testid="${testid}"]`;
  if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;

  const tag = el.tagName.toLowerCase();
  const text = el.textContent?.trim().slice(0, 40);
  if (text && ['button', 'a', 'span', 'label', 'h1', 'h2', 'h3', 'p', 'td'].includes(tag)) {
    return `${tag}:contains("${text}")`;
  }

  const variant = el.closest('[data-variant]')?.getAttribute('data-variant') || '';
  const className = Array.from(el.classList).slice(0, 2).join('.');
  if (variant) {
    return `[data-variant="${variant}"] ${tag}${className ? '.' + className : ''}`;
  }
  return `${tag}${className ? '.' + className : ''}`;
}
