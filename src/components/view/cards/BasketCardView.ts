import { cloneTemplate, ensureElement } from '../../../utils/dom';
import { CardView } from './CardView';

export type TBasketCardRemoveHandler = (id: string) => void;

export class BasketCardView extends CardView {
	private readonly indexEl: HTMLElement;
	private readonly deleteButton: HTMLButtonElement;

	constructor(private readonly onRemove: TBasketCardRemoveHandler) {
		super(cloneTemplate<HTMLElement>('card-basket'));

		this.indexEl = ensureElement<HTMLElement>('.basket__item-index', this.root);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.root);

		this.deleteButton.addEventListener('click', () => {
			const id = this.root.dataset.id;
			if (!id) return;
			this.onRemove(id);
		});
	}

	setIndex(value: number): void {
		this.indexEl.textContent = String(value);
	}
}