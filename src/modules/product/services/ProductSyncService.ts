import { inject, injectable } from "inversify";
import { IProductService } from "../interfaces/IProductService";
import { IProductRepository } from "../interfaces/IProductRepository";
import { ICatalogAdapter } from "../interfaces/ICatalogAdapter";
import { TYPES } from "../../../ioc/types";
import { Product, SyncResult } from "../entities/Product";
import { ConfigService } from "../../../shared/services/ConfigService";
import { CatalogType } from "../constants/catalogTypes";
import { CatalogAdapterFactory } from "../factories/CatalogAdapterFactory";

@injectable()
export class ProductSyncService implements IProductService {
    private catalogAdapter: ICatalogAdapter;

    constructor(
        @inject(TYPES.ProductRepository) private productRepository: IProductRepository,
        @inject(TYPES.CatalogAdapterFactory) private adapterFactory: CatalogAdapterFactory,
        @inject(TYPES.ConfigService) private config: ConfigService
    ) {
        // Get catalog type from configuration
        const catalogType = this.config.get('CATALOG_TYPE') as CatalogType;
        this.catalogAdapter = this.adapterFactory.createAdapter(catalogType);
    }

    syncProductById(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    syncProductsBySku(skus: string[]): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    async syncProducts(): Promise<SyncResult> {
        await this.catalogAdapter.connect();
        const products = await this.catalogAdapter.fetchProducts();
        return this.productRepository.bulkUpsert(products);
    }
}