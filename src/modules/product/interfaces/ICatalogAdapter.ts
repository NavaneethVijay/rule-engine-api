import { Product } from "../entities/Product";

export interface ICatalogAdapter {
    connect(): Promise<void>;
    fetchProducts(): Promise<Product[]>;
    fetchProductById(id: string): Promise<Product>;
    fetchProductsBySku(skus: string[]): Promise<Product[]>;
    mapToProduct(sourceProduct: any): Product;
}
