import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { LarekApi } from './components/Api/LarekApi';
import { Api } from './components/base/Api';

async function run(): Promise<void> {
	const catalog = new ProductsCatalog();
	const basket = new Basket();
	const buyer = new Buyer();

	console.log('=== PRODUCTS CATALOG TESTS ===');
	catalog.setItems(apiProducts.items);
	console.log('Каталог (getItems):', catalog.getItems());

	const firstProduct = catalog.getItems()[0];
	console.log('Первый товар из каталога:', firstProduct);

	if (firstProduct) {
		console.log('getItemById(first.id):', catalog.getItemById(firstProduct.id));

		catalog.setPreview(firstProduct);
		console.log('Preview (getPreview):', catalog.getPreview());

		catalog.setPreview(null);
		console.log('Preview сброшен (getPreview):', catalog.getPreview());
	}

	console.log('=== BASKET TESTS ===');
	console.log('Корзина пустая (getItems):', basket.getItems());
	console.log('Количество (getCount):', basket.getCount());
	console.log('Сумма (getTotal):', basket.getTotal());

	if (firstProduct) {
		console.log('hasItem(first.id) до добавления:', basket.hasItem(firstProduct.id));
		basket.addItem(firstProduct);
		console.log('Добавили товар. getItems:', basket.getItems());
		console.log('hasItem(first.id) после добавления:', basket.hasItem(firstProduct.id));
		console.log('Количество (getCount):', basket.getCount());
		console.log('Сумма (getTotal):', basket.getTotal());

		basket.addItem(firstProduct);
		console.log('После повторного addItem (дубликат не должен добавиться):', basket.getItems());

		basket.removeItem(firstProduct.id);
		console.log('После removeItem. getItems:', basket.getItems());
		console.log('Количество (getCount):', basket.getCount());
		console.log('Сумма (getTotal):', basket.getTotal());
	}

	basket.clear();
	console.log('После clear. getItems:', basket.getItems());

	console.log('=== BUYER TESTS ===');
	console.log('Покупатель (getData) изначально:', buyer.getData());
	console.log('Ошибки валидации (validate) изначально:', buyer.validate());

	buyer.setData({ address: 'Москва, ул. Пушкина, д. 1' });
	console.log('После setData({address}). getData:', buyer.getData());
	console.log('validate:', buyer.validate());

	buyer.setData({ payment: 'card' });
	console.log('После setData({payment}). getData:', buyer.getData());
	console.log('validate:', buyer.validate());

	buyer.setData({ email: 'test@example.com', phone: '+79990000000' });
	console.log('После setData({email, phone}). getData:', buyer.getData());
	console.log('validate (ошибок быть не должно):', buyer.validate());

	buyer.clear();
	console.log('После clear. getData:', buyer.getData());
	console.log('validate после clear:', buyer.validate());

	const api = new Api(API_URL);
	const larekApi = new LarekApi(api);

	try {
		const products = await larekApi.getProducts();
		catalog.setItems(products);
		console.log('Каталог с сервера сохранён в модель (catalog.getItems):', catalog.getItems());
	} catch (error) {
		console.error('Ошибка при загрузке каталога с сервера:', error);
	}
}

run();