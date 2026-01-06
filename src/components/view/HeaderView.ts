import { ensureElement } from '../../utils/dom';
import { ViewEvents } from '../../utils/events';

import type { IEvents } from '../base/Events';

export class HeaderView {
  private readonly root: HTMLElement;
  private readonly basketButton: HTMLButtonElement;
  private readonly basketCounter: HTMLElement;

  constructor(root: HTMLElement, private readonly events: IEvents) {
    this.root = root;

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.root);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.root);

    this.basketButton.addEventListener('click', () => {
      this.events.emit(ViewEvents.BasketOpen);
    });
  }

  render(): HTMLElement {
    return this.root;
  }

  setCounter(value: number): void {
    this.basketCounter.textContent = String(value);
  }
}