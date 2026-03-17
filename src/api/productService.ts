import apiClient from './apiClient';
import type { Product, PriceHistory, QueryParams } from '../types';

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const productService = {
    async getProducts(params?: QueryParams): Promise<PaginatedResponse<Product>> {
        const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
        return response.data;
    },

    async searchProducts(params: { q: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
        const response = await apiClient.get<Product[]>('/products/search', { params });
        return response.data;
    },

    async getProductById(id: string): Promise<Product> {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    async getStores(): Promise<string[]> {
        const response = await apiClient.get<string[]>('/products/stores');
        return response.data;
    },

    async getPriceHistory(productId: string): Promise<PriceHistory[]> {
        const response = await apiClient.get<PriceHistory[]>(`/price-history/${productId}`);
        return response.data;
    },
};
