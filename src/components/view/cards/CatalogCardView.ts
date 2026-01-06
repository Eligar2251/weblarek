import { cloneTemplate } from '../../../utils/dom';
import { CardView } from './CardView';

export class CatalogCardView extends CardView {
  constructor(private readonly onClick: () => void) {
    super(cloneTemplate<HTMLElement>('card-catalog'));

    this.root.addEventListener('click', () => this.onClick());
  }
}