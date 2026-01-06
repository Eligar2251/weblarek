import { cloneTemplate, ensureAllElements, ensureElement } from '../../../utils/dom';
import { ViewEvents } from '../../../utils/events';
import type { IEvents } from '../../base/Events';
import { FormView } from './FormView';

export class OrderFormView extends FormView {
  private readonly paymentButtons: HTMLButtonElement[];
  private readonly addressInput: HTMLInputElement;

  constructor(events: IEvents) {
    const form = cloneTemplate<HTMLFormElement>('order');
    super(form, events, 'order', ViewEvents.OrderSubmit);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      '.order__buttons .button',
      this.form
    );

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.events.emit(ViewEvents.OrderPaymentSelect, { method: btn.name });
      });
    });
  }

  setPayment(method: 'card' | 'cash' | null): void {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', method !== null && btn.name === method);
    });
  }

  setAddress(value: string): void {
    this.addressInput.value = value;
  }
}