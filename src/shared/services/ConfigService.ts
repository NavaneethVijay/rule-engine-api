import { injectable } from "inversify";
import { CATALOG_TYPES } from "../../modules/product/constants/catalogTypes";

@injectable()
export class ConfigService {
    private config: Record<string, any>;

    constructor() {
        this.config = {
            CATALOG_TYPE: process.env.CATALOG_TYPE || CATALOG_TYPES.SHOPIFY,
            // other config values...
        };
    }

    get(key: string): any {
        return this.config[key];
    }
}