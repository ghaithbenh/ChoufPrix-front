export interface Product {
    _id: string;
    name: string;
    store: string;
    price: number;
    url: string;
    image: string;
    description?: string;
    category?: string;
    parentCategory?: string;
    subcategory?: string;
    lastUpdated: string;
}

export interface PriceHistory {
    _id: string;
    productId: string;
    price: number;
    date: string;
}

export interface QueryParams {
    search?: string;
    store?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    parentCategory?: string;
    subcategory?: string;
    sort?: string;
    page?: number;
    limit?: number;
}
