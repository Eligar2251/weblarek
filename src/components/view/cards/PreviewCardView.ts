import { cloneTemplate, ensureElement } from '../../../utils/dom';
import { CardView } from './CardView';

export class PreviewCardView extends CardView {
  private readonly textEl: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(private readonly onAction: () => void) {
    super(cloneTemplate<HTMLElement>('card-preview'));

    this.textEl = ensureElement<HTMLElement>('.card__text', this.root);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.root);

    this.actionButton.addEventListener('click', () => this.onAction());
  }

  setDescription(value: string): void {
    this.textEl.textContent = value;
  }

  setButton(text: string, disabled: boolean): void {
    this.actionButton.textContent = text;
    this.actionButton.disabled = disabled;
  }
}