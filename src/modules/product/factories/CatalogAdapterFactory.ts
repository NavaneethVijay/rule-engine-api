import { injectable, inject } from "inversify";
import { TYPES } from "../../../ioc/types";
import { CatalogType, CATALOG_TYPES } from "../constants/catalogTypes";
import { ICatalogAdapter } from "../interfaces/ICatalogAdapter";

@injectable()
export class CatalogAdapterFactory {
    constructor(
        @inject(TYPES.ShopifyCatalogAdapter) private shopifyAdapter: ICatalogAdapter,
        @inject(TYPES.MagentoCatalogAdapter) private magentoAdapter: ICatalogAdapter,
        @inject(TYPES.WooCommerceCatalogAdapter) private wooCommerceAdapter: ICatalogAdapter,
    ) {}

    createAdapter(type: CatalogType): ICatalogAdapter {
        switch (type) {
            case CATALOG_TYPES.SHOPIFY:
                return this.shopifyAdapter;
            case CATALOG_TYPES.MAGENTO:
                return this.magentoAdapter;
            case CATALOG_TYPES.WOOCOMMERCE:
                return this.wooCommerceAdapter;
            default:
                throw new Error(`Unsupported catalog type: ${type}`);
        }
    }
}