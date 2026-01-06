import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ViewEvents } from './utils/events';
import { ModelEvents } from './utils/modelEvents';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';

import { events } from './components/base/Events';

import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { HeaderView } from './components/view/HeaderView';
import { GalleryView } from './components/view/GalleryView';
import { ModalView } from './components/view/ModalView';

import { CatalogCardView } from './components/view/cards/CatalogCardView';
import { PreviewCardView } from './components/view/cards/PreviewCardView';
import { BasketCardView } from './components/view/cards/BasketCardView';

import { BasketView } from './components/view/BasketView';
import { OrderFormView } from './components/view/forms/OrderFormView';
import { ContactsFormView } from './components/view/forms/ContactsFormView';
import { SuccessView } from './components/view/SuccessView';

import type { IBuyer, IOrderRequest, IProduct, TPayment } from './types';

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalog = new ProductsCatalog();
const basket = new Basket();
const buyer = new Buyer();

const headerRoot = document.querySelector<HTMLElement>('.header');
const galleryRoot = document.querySelector<HTMLElement>('main.gallery');
const modalRoot = document.querySelector<HTMLElement>('#modal-container');

if (!headerRoot) throw new Error('Header root not found');
if (!galleryRoot) throw new Error('Gallery root not found');
if (!modalRoot) throw new Error('Modal root not found');

const modalHost: HTMLElement = modalRoot;

const headerView = new HeaderView(headerRoot, events);
const galleryView = new GalleryView(galleryRoot);
const modalView = new ModalView(modalRoot, events);

const previewView = new PreviewCardView(events);
const basketView = new BasketView(events);
const orderFormView = new OrderFormView(events);
const contactsFormView = new ContactsFormView(events);
const successView = new SuccessView(events);

function openModal(content: HTMLElement): void {
	modalView.open(content);
}

function closeModal(): void {
	modalView.close();
}

function isInModal(node: Node): boolean {
	return modalHost.contains(node);
}

function resolveImage(image: string): string {
	if (image.startsWith('http://') || image.startsWith('https://')) return image;
	const base = CDN_URL.endsWith('/') ? CDN_URL.slice(0, -1) : CDN_URL;
	const file = image.replace(/^\//, '');
	return `${base}/${file}`;
}

function getPayment(): TPayment | null {
	return buyer.getPayment();
}

function getStep1Error(): string {
	const { address } = buyer.getData();
	const payment = getPayment();

	if (payment === null) return 'Не выбран тип оплаты';
	if (!address.trim()) return 'Необходимо указать адрес';
	return '';
}

function isStep1Valid(): boolean {
	const { address } = buyer.getData();
	return getPayment() !== null && !!address.trim();
}

function renderStep1(): void {
	const data = buyer.getData();

	orderFormView.setAddress(data.address);
	orderFormView.setPayment(getPayment());

	orderFormView.setSubmitEnabled(isStep1Valid());
	orderFormView.setErrors(getStep1Error());
}

function getStep2Error(): string {
	const { email, phone } = buyer.getData();

	if (!email.trim()) return 'Необходимо указать email';
	if (!phone.trim()) return 'Необходимо указать телефон';
	return '';
}

function isStep2Valid(): boolean {
	const { email, phone } = buyer.getData();
	return !!email.trim() && !!phone.trim();
}

function renderStep2(): void {
	const data = buyer.getData();

	contactsFormView.setEmail(data.email);
	contactsFormView.setPhone(data.phone);

	contactsFormView.setSubmitEnabled(isStep2Valid());
	contactsFormView.setErrors(getStep2Error());
}

function renderCatalog(): void {
	const items = catalog.getItems();

	const cards = items.map((p) => {
		const card = new CatalogCardView(events);
		card.setId(p.id);
		card.setTitle(p.title);
		card.setCategory(p.category);
		card.setImage(resolveImage(p.image), p.title);
		card.setPrice(p.price ?? null);
		return card.render();
	});

	galleryView.setItems(cards);
}

function renderPreview(product: IProduct): void {
	previewView.setId(product.id);
	previewView.setTitle(product.title);
	previewView.setCategory(product.category);
	previewView.setImage(resolveImage(product.image), product.title);
	previewView.setPrice(product.price ?? null);
	previewView.setDescription(product.description);

	if (product.price == null) {
		previewView.setButton('Недоступно', true);
		return;
	}

	previewView.setButton(basket.hasItem(product.id) ? 'Удалить из корзины' : 'Купить', false);
}

function renderBasket(): void {
	const items = basket.getItems();

	if (items.length === 0) {
		const empty = document.createElement('li');
		empty.textContent = 'Корзина пуста';

		basketView.setItems([empty]);
		basketView.setTotal(0);
		basketView.setCheckoutEnabled(false);
		return;
	}

	const rows = items.map((p, index) => {
		const row = new BasketCardView(events);
		row.setId(p.id);
		row.setIndex(index + 1);
		row.setTitle(p.title);
		row.setPrice(p.price ?? null);
		return row.render();
	});

	basketView.setItems(rows);
	basketView.setTotal(basket.getTotal());
	basketView.setCheckoutEnabled(true);
}

events.on<object>(ModelEvents.CatalogChanged, () => {
	renderCatalog();
});

events.on<object>(ModelEvents.PreviewChanged, () => {
	const product = catalog.getPreview();
	if (!product) return;

	renderPreview(product);
	openModal(previewView.render());
});

events.on<object>(ModelEvents.BasketChanged, () => {
	headerView.setCounter(basket.getCount());

	if (isInModal(basketView.render())) {
		renderBasket();
	}
});

events.on<object>(ModelEvents.BuyerChanged, () => {
	if (isInModal(orderFormView.render())) renderStep1();
	if (isInModal(contactsFormView.render())) renderStep2();
});

events.on<object>(ViewEvents.BasketOpen, () => {
	renderBasket();
	openModal(basketView.render());
});

events.on<{ id: string }>(ViewEvents.CardSelect, ({ id }) => {
	const product = catalog.getItemById(id);
	if (!product) return;

	catalog.setPreview(product);
});

events.on<{ id: string }>(ViewEvents.CardAction, ({ id }) => {
	const product = catalog.getItemById(id);
	if (!product) return;
	if (product.price == null) return;

	if (basket.hasItem(id)) basket.removeItem(id);
	else basket.addItem(product);

	closeModal();
});

events.on<{ id: string }>(ViewEvents.BasketItemRemove, ({ id }) => {
	basket.removeItem(id);
});

events.on<object>(ViewEvents.OrderOpen, () => {
	renderStep1();
	openModal(orderFormView.render());
});

events.on<{ method: string }>(ViewEvents.OrderPaymentSelect, ({ method }) => {
	if (method !== 'card' && method !== 'cash') return;
	buyer.setData({ payment: method });
});

events.on<{ form: string; name: string; value: string }>(
	ViewEvents.FormChange,
	({ name, value }) => {
		const patch: Partial<IBuyer> = {};

		if (name === 'address') patch.address = value;
		if (name === 'email') patch.email = value;
		if (name === 'phone') patch.phone = value;

		if (Object.keys(patch).length > 0) buyer.setData(patch);
	}
);

events.on<object>(ViewEvents.OrderSubmit, () => {
	renderStep1();
	if (!isStep1Valid()) return;

	renderStep2();
	openModal(contactsFormView.render());
});

events.on<object>(ViewEvents.ContactsSubmit, async () => {
	renderStep2();
	if (!isStep2Valid()) return;

	const payment = getPayment();
	if (payment === null) return;

	const data = buyer.getData();

	const order: IOrderRequest = {
		payment,
		address: data.address,
		email: data.email,
		phone: data.phone,
		total: basket.getTotal(),
		items: basket.getItems().map((p) => p.id),
	};

	try {
		const response = await larekApi.createOrder(order);

		successView.setTotal(response.total);
		openModal(successView.render());

		basket.clear();
		buyer.clear();
	} catch {
		contactsFormView.setErrors('Ошибка оплаты. Попробуйте ещё раз');
	}
});

events.on<object>(ViewEvents.SuccessClose, () => {
	closeModal();
});

events.on<object>(ViewEvents.ModalClose, () => {
	closeModal();
});

headerView.setCounter(basket.getCount());

(async () => {
	try {
		const products = await larekApi.getProducts();
		catalog.setItems(products);
	} catch {
		const errorEl = document.createElement('div');
		errorEl.textContent = 'Не удалось загрузить каталог';
		galleryRoot.replaceChildren(errorEl);
	}
})();