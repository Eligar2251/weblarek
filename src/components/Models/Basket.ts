import type { IProduct } from '../../types';
import { events } from '../base/Events';
import { ModelEvents } from '../../utils/modelEvents';

export class Basket {
	private items: IProduct[] = [];

	getItems(): IProduct[] {
		return [...this.items];
	}

	addItem(product: IProduct): void {
		if (this.hasItem(product.id)) return;
		this.items = [...this.items, product];
		events.emit(ModelEvents.BasketChanged);
	}

	removeItem(productId: string): void {
		const before = this.items.length;
		this.items = this.items.filter((item) => item.id !== productId);
		if (this.items.length !== before) {
			events.emit(ModelEvents.BasketChanged);
		}
	}

	clear(): void {
		if (this.items.length === 0) return;
		this.items = [];
		events.emit(ModelEvents.BasketChanged);
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	getCount(): number {
		return this.items.length;
	}

	hasItem(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}
}