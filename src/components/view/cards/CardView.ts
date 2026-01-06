import { ensureElement } from '../../../utils/dom';
import { formatSynapses } from '../../../utils/format';
import { categoryMap } from '../../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export abstract class CardView {
  protected readonly root: HTMLElement;

  protected readonly titleEl: HTMLElement;
  protected readonly priceEl: HTMLElement;

  protected readonly categoryEl: HTMLElement | null;
  protected readonly imageEl: HTMLImageElement | null;

  constructor(root: HTMLElement) {
    this.root = root;

    this.titleEl = ensureElement<HTMLElement>('.card__title', this.root);
    this.priceEl = ensureElement<HTMLElement>('.card__price', this.root);

    this.categoryEl = this.root.querySelector<HTMLElement>('.card__category');
    this.imageEl = this.root.querySelector<HTMLImageElement>('.card__image');
  }

  render(): HTMLElement {
    return this.root;
  }

  setTitle(value: string): void {
    this.titleEl.textContent = value;
  }

  setPrice(value: number | null): void {
    this.priceEl.textContent = formatSynapses(value);
  }

  setCategory(value: string): void {
    if (!this.categoryEl) return;

    this.categoryEl.textContent = value;

    this.categoryEl.classList.remove(...Object.values(categoryMap));

    const key = value as CategoryKey;
    if (Object.prototype.hasOwnProperty.call(categoryMap, key)) {
      this.categoryEl.classList.add(categoryMap[key]);
    }
  }

  setImage(src: string, alt: string = ''): void {
    if (!this.imageEl) return;
    this.imageEl.src = src;
    this.imageEl.alt = alt;
  }
}