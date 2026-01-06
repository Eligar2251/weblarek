import { ensureElement } from '../../../utils/dom';
import { ViewEvents } from '../../../utils/events';
import type { IEvents } from '../../base/Events';

export class FormView {
	protected readonly form: HTMLFormElement;
	protected readonly events: IEvents;

	protected readonly submitButton: HTMLButtonElement;
	protected readonly errorsEl: HTMLElement;

	constructor(
		form: HTMLFormElement,
		events: IEvents,
		private readonly formId: 'order' | 'contacts',
		private readonly submitEvent: string
	) {
		this.form = form;
		this.events = events;

		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
		this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.form);

		this.form.addEventListener('input', (evt) => {
			const target = evt.target;

			if (
				!(
					target instanceof HTMLInputElement ||
					target instanceof HTMLTextAreaElement
				)
			) {
				return;
			}

			if (!target.name) return;

			this.events.emit(ViewEvents.FormChange, {
				form: this.formId,
				name: target.name,
				value: target.value,
			});
		});

		this.form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(this.submitEvent);
		});
	}

	render(): HTMLFormElement {
		return this.form;
	}

	setErrors(text: string): void {
		this.errorsEl.textContent = text;
	}

	setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}

	reset(): void {
		this.form.reset();
		this.setErrors('');
		this.setSubmitEnabled(false);
	}
}