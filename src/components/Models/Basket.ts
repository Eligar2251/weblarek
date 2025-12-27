import type { IProduct } from '../../types';

export class Basket {
	private items: IProduct[] = [];

	getItems(): IProduct[] {
		return [...this.items];
	}

	addItem(product: IProduct): void {
		if (this.hasItem(product.id)) return;
		this.items = [...this.items, product];
	}

	removeItem(productId: string): void {
		this.items = this.items.filter((item) => item.id !== productId);
	}

	clear(): void {
		this.items = [];
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