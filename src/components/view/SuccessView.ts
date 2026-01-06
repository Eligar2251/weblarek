import { cloneTemplate, ensureElement } from '../../utils/dom';
import { ViewEvents } from '../../utils/events';
import { formatSynapses } from '../../utils/format';
import type { IEvents } from '../base/Events';

export class SuccessView {
  private readonly root: HTMLElement;
  private readonly descriptionEl: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(private readonly events: IEvents) {
    this.root = cloneTemplate<HTMLElement>('success');

    this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', this.root);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.root);

    this.closeButton.addEventListener('click', () => {
      this.events.emit(ViewEvents.SuccessClose);
    });
  }

  render(): HTMLElement {
    return this.root;
  }

  setTotal(total: number): void {
    this.descriptionEl.textContent = `Списано ${formatSynapses(total)}`;
  }
}