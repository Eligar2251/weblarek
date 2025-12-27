import type { IBuyer, TBuyerErrors, TPayment } from '../../types';

export class Buyer {
	private data: Partial<IBuyer> = {};

	setData(data: Partial<IBuyer>): void {
		this.data = { ...this.data, ...data };
	}

	getData(): Partial<IBuyer> {
		return { ...this.data };
	}

	clear(): void {
		this.data = {};
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		const { payment, address = '', email = '', phone = '' } = this.data;

		const isValidPayment = (value: unknown): value is TPayment =>
			value === 'card' || value === 'cash';

		if (!isValidPayment(payment)) {
			errors.payment = 'Не выбран вид оплаты';
		}

		if (!address.trim()) {
			errors.address = 'Укажите адрес доставки';
		}

		if (!email.trim()) {
			errors.email = 'Укажите email';
		}

		if (!phone.trim()) {
			errors.phone = 'Укажите телефон';
		}

		return errors;
	}
}