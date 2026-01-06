import { cloneTemplate, ensureElement } from '../../../utils/dom';
import { ViewEvents } from '../../../utils/events';
import type { IEvents } from '../../base/Events';
import { FormView } from './FormView';

export class ContactsFormView extends FormView {
	private readonly emailInput: HTMLInputElement;
	private readonly phoneInput: HTMLInputElement;

	constructor(events: IEvents) {
		const form = cloneTemplate<HTMLFormElement>('contacts');
		super(form, events, 'contacts', ViewEvents.ContactsSubmit);

		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
	}

	setEmail(value: string): void {
		this.emailInput.value = value;
	}

	setPhone(value: string): void {
		this.phoneInput.value = value;
	}
}