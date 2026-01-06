import { cloneTemplate } from '../../../utils/dom';
import { ViewEvents } from '../../../utils/events';
import type { IEvents } from '../../base/Events';
import { CardView } from './CardView';

export class CatalogCardView extends CardView {
  constructor(private readonly events: IEvents) {
    super(cloneTemplate<HTMLElement>('card-catalog'));

    this.root.addEventListener('click', () => {
      const id = this.root.dataset.id;
      if (!id) return;
      this.events.emit(ViewEvents.CardSelect, { id });
    });
  }
}