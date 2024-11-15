import { Price, Product, ProductStock, SyncResult } from '../entities/Product';

export interface IProductRepository {
    findBySku(sku: string): Promise<Product>;
    findBySkus(skus: string[]): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    findBySourceId(sourceId: string, sourceCatalog: string): Promise<Product>;

    create(product: Product): Promise<Product>;
    update(sku: string, product: Partial<Product>): Promise<Product>;
    bulkUpsert(products: Product[]): Promise<SyncResult>;

    updateStock(sku: string, stock: ProductStock): Promise<void>;
    updatePrices(sku: string, prices: Price[]): Promise<void>;

    delete(sku: string): Promise<void>;

    search(params: {
        query?: string;
        filters?: Record<string, any>;
        page?: number;
        limit?: number;
        sort?: {
            field: string;
            direction: 'asc' | 'desc';
        };
    }): Promise<{
        items: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}