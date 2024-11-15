import { Product, SyncResult } from "../entities/Product";

export interface IProductService {
    syncProducts(): Promise<SyncResult>;
    syncProductById(id: string): Promise<Product>;
    syncProductsBySku(skus: string[]): Promise<Product[]>;
}