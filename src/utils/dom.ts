export function ensureElement<T extends Element>(
  selector: string,
  parent: ParentNode = document
): T {
  const el = parent.querySelector(selector);
  if (!el) {
    throw new Error(`Element not found: ${selector}`);
  }
  return el as T;
}

export function ensureAllElements<T extends Element>(
  selector: string,
  parent: ParentNode
): T[] {
  return Array.from(parent.querySelectorAll(selector)) as T[];
}

export function cloneTemplate<T extends HTMLElement>(id: string): T {
  const tpl = ensureElement<HTMLTemplateElement>(`template#${id}`);
  const node = tpl.content.firstElementChild;
  if (!node) {
    throw new Error(`Template #${id} is empty`);
  }
  return node.cloneNode(true) as T;
}