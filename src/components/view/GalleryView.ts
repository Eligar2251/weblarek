export class GalleryView {
  constructor(private readonly container: HTMLElement) {}

  render(): HTMLElement {
    return this.container;
  }

  setItems(items: HTMLElement[]): void {
    this.container.replaceChildren(...items);
  }
}