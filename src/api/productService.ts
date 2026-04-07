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

    async searchProducts(params: { q: string; minPrice?: number; maxPrice?: number; category?: string; parentCategory?: string; subcategory?: string; source?: string }): Promise<{
        normalized: any;
        results: Product[];
    }> {
        const response = await apiClient.get('/products/search', { params });
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

    async getCategories(): Promise<string[]> {
        const response = await apiClient.get<string[]>('/products/categories');
        return response.data;
    },

    async getTaxonomy(): Promise<Record<string, string[]>> {
        const response = await apiClient.get<Record<string, string[]>>('/products/taxonomy');
        return response.data;
    },

    async getPriceHistory(productId: string): Promise<PriceHistory[]> {
        const response = await apiClient.get<PriceHistory[]>(`/price-history/${productId}`);
        return response.data;
    },

    async createProduct(data: any, token: string): Promise<Product> {
        const response = await apiClient.post<Product>('/products', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getMyProducts(token: string): Promise<Product[]> {
        const response = await apiClient.get<Product[]>('/products/user/all', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async deleteProduct(id: string, token: string): Promise<void> {
        await apiClient.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
};
