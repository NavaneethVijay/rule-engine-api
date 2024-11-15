import { injectable } from "inversify";
import { ICatalogAdapter } from "../interfaces/ICatalogAdapter";
import { Product } from "../entities/Product";

@injectable()
export abstract class BaseCatalogAdapter implements ICatalogAdapter {
    abstract connect(): Promise<void>;
    abstract fetchProducts(): Promise<Product[]>;
    abstract fetchProductById(id: string): Promise<Product>;
    abstract fetchProductsBySku(skus: string[]): Promise<Product[]>;
    abstract mapToProduct(sourceProduct: any): Product;
}