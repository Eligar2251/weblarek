import { ensureElement } from '../../utils/dom';
import { ViewEvents } from '../../utils/events';

import type { IEvents } from '../base/Events';

export class ModalView {
  private readonly root: HTMLElement;
  private readonly container: HTMLElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly content: HTMLElement;

  constructor(root: HTMLElement, private readonly events: IEvents) {
    this.root = root;

    this.container = ensureElement<HTMLElement>('.modal__container', this.root);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.root);
    this.content = ensureElement<HTMLElement>('.modal__content', this.root);

    this.closeButton.addEventListener('click', () => {
      this.events.emit(ViewEvents.ModalClose);
    });

    this.root.addEventListener('click', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.events.emit(ViewEvents.ModalClose);
      }
    });

    this.container.addEventListener('click', (evt) => evt.stopPropagation());
  }

  render(): HTMLElement {
    return this.root;
  }

  open(content: HTMLElement): void {
    this.setContent(content);
    this.root.classList.add('modal_active');
  }

  close(): void {
    this.root.classList.remove('modal_active');
    this.content.replaceChildren();
  }

  setContent(content: HTMLElement): void {
    this.content.replaceChildren(content);
  }
}