import { cloneTemplate, ensureElement } from '../../../utils/dom';
import { ViewEvents } from '../../../utils/events';
import type { IEvents } from '../../base/Events';
import { CardView } from './CardView';

export class BasketCardView extends CardView {
  private readonly indexEl: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(private readonly events: IEvents) {
    const root = cloneTemplate<HTMLLIElement>('card-basket');
    super(root);

    this.indexEl = ensureElement<HTMLElement>('.basket__item-index', this.root);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.root);

    this.deleteButton.addEventListener('click', () => {
      const id = this.root.dataset.id;
      if (!id) return;
      this.events.emit(ViewEvents.BasketItemRemove, { id });
    });
  }

  setIndex(value: number): void {
    this.indexEl.textContent = String(value);
  }
}