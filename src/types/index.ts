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
    source?: 'scraped' | 'user';
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
    source?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export interface CategoryCount {
    parentCategory: string;
    subcategories: string[];
    productCount: number;
}
