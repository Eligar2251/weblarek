import type { IBuyer, TBuyerErrors, TPayment } from '../../types';
import { events } from '../base/Events';
import { ModelEvents } from '../../utils/modelEvents';

export class Buyer {
	private data: IBuyer = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};

	private paymentSelected = false;

	setData(data: Partial<IBuyer>): void {
		if (data.payment !== undefined) {
			this.paymentSelected = true;
		}

		this.data = { ...this.data, ...data };
		events.emit(ModelEvents.BuyerChanged);
	}

	getData(): IBuyer {
		return { ...this.data };
	}

	clear(): void {
		this.data = {
			payment: 'card',
			address: '',
			email: '',
			phone: '',
		};
		this.paymentSelected = false;
		events.emit(ModelEvents.BuyerChanged);
	}

	getPayment(): TPayment | null {
		return this.paymentSelected ? this.data.payment : null;
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};
		const { address, email, phone } = this.data;

		if (!this.paymentSelected) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!address.trim()) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!email.trim()) {
			errors.email = 'Необходимо указать email';
		}
		if (!phone.trim()) {
			errors.phone = 'Необходимо указать телефон';
		}

		return errors;
	}
}