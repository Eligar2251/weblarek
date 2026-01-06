import { cloneTemplate, ensureElement } from '../../../utils/dom';
import { CardView } from './CardView';

export class BasketCardView extends CardView {
  private readonly indexEl: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(private readonly onRemove: () => void) {
    super(cloneTemplate<HTMLElement>('card-basket'));

    this.indexEl = ensureElement<HTMLElement>('.basket__item-index', this.root);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.root);

    this.deleteButton.addEventListener('click', () => this.onRemove());
  }

  setIndex(value: number): void {
    this.indexEl.textContent = String(value);
  }
}