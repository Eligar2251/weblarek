import type { IBuyer, TBuyerErrors, TPayment } from '../../types';

export class Buyer {
	private readonly initialData: IBuyer = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};

	private data: IBuyer = { ...this.initialData };

	setData(data: Partial<IBuyer>): void {
		this.data = { ...this.data, ...data };
	}

	getData(): IBuyer {
		return { ...this.data };
	}

	clear(): void {
		this.data = { ...this.initialData };
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		const { payment, address, email, phone } = this.data;

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