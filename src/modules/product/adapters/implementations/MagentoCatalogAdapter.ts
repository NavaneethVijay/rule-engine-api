import { injectable } from "inversify";
import { BaseCatalogAdapter } from "../BaseCatalogAdapter";
import { Product } from "../../entities/Product";

@injectable()
export class MagentoCatalogAdapter extends BaseCatalogAdapter {
    connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    fetchProducts(): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    fetchProductById(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    fetchProductsBySku(skus: string[]): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }
    mapToProduct(sourceProduct: any): Product {
        throw new Error("Method not implemented.");
    }

}