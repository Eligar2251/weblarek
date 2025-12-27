import type { IApi, IOrderRequest, IOrderResponse, IProduct, IProductsResponse } from '../../types';

export class LarekApi {
	constructor(private readonly api: IApi) { }

	async getProducts(): Promise<IProduct[]> {
		const response = await this.api.get<IProductsResponse>('/product/');
		return response.items;
	}

	createOrder(order: IOrderRequest): Promise<IOrderResponse> {
		return this.api.post<IOrderResponse>('/order/', order);
	}
}