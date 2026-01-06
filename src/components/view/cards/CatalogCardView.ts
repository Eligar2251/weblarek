import { cloneTemplate } from '../../../utils/dom';
import { CardView } from './CardView';

export type TCatalogCardSelectHandler = (id: string) => void;

export class CatalogCardView extends CardView {
	constructor(private readonly onSelect: TCatalogCardSelectHandler) {
		super(cloneTemplate<HTMLElement>('card-catalog'));

		this.root.addEventListener('click', () => {
			const id = this.root.dataset.id;
			if (!id) return;
			this.onSelect(id);
		});
	}
}