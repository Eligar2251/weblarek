import { cloneTemplate, ensureElement } from '../../utils/dom';
import { ViewEvents } from '../../utils/events';
import { formatSynapses } from '../../utils/format';

import type { IEvents } from '../base/Events';

export class BasketView {
  private readonly root: HTMLElement;
  private readonly listEl: HTMLUListElement;
  private readonly checkoutButton: HTMLButtonElement;
  private readonly totalEl: HTMLElement;

  constructor(private readonly events: IEvents) {
    this.root = cloneTemplate<HTMLElement>('basket');

    this.listEl = ensureElement<HTMLUListElement>('.basket__list', this.root);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.root);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', this.root);

    this.checkoutButton.addEventListener('click', () => {
      this.events.emit(ViewEvents.OrderOpen);
    });
  }

  render(): HTMLElement {
    return this.root;
  }

  setItems(items: HTMLElement[]): void {
    this.listEl.replaceChildren(...items);
  }

  setTotal(value: number): void {
    this.totalEl.textContent = formatSynapses(value);
  }

  setCheckoutEnabled(enabled: boolean): void {
    this.checkoutButton.disabled = !enabled;
  }
}