import { cloneTemplate, ensureElement } from '../../../utils/dom';
import { ViewEvents } from '../../../utils/events';
import type { IEvents } from '../../base/Events';
import { CardView } from './CardView';

export class PreviewCardView extends CardView {
  private readonly textEl: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(private readonly events: IEvents) {
    const root = cloneTemplate<HTMLDivElement>('card-preview');
    super(root);

    this.textEl = ensureElement<HTMLElement>('.card__text', this.root);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.root);

    this.actionButton.addEventListener('click', () => {
      const id = this.root.dataset.id;
      if (!id) return;
      this.events.emit(ViewEvents.CardAction, { id });
    });
  }

  setDescription(value: string): void {
    this.textEl.textContent = value;
  }

  setButton(text: string, disabled: boolean): void {
    this.actionButton.textContent = text;
    this.actionButton.disabled = disabled;
  }
}