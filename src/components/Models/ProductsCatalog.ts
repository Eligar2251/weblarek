import type { IProduct } from '../../types';
import { events } from '../base/Events';
import { ModelEvents } from '../../utils/modelEvents';

export class ProductsCatalog {
	private items: IProduct[] = [];
	private preview: IProduct | null = null;

	setItems(items: IProduct[]): void {
		this.items = [...items];
		events.emit(ModelEvents.CatalogChanged);
	}

	getItems(): IProduct[] {
		return [...this.items];
	}

	getItemById(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}

	setPreview(product: IProduct | null): void {
		this.preview = product;
		events.emit(ModelEvents.PreviewChanged);
	}

	getPreview(): IProduct | null {
		return this.preview;
	}
}