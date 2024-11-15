export const TYPES = {
    CartService: Symbol.for("CartService"),
    RuleService: Symbol.for("RuleService"),
    RuleEngine: Symbol.for("RuleEngine"),
    CartRepository: Symbol.for("CartRepository"),
    RuleRepository: Symbol.for("RuleRepository"),

    // New Product Module types
    ProductService: Symbol.for("ProductService"),
    ProductRepository: Symbol.for("ProductRepository"),
    CatalogAdapter: Symbol.for("CatalogAdapter"),

    // Catalog Adapters
    CatalogAdapterFactory: Symbol.for("CatalogAdapterFactory"),
    ShopifyCatalogAdapter: Symbol.for("ShopifyCatalogAdapter"),
    MagentoCatalogAdapter: Symbol.for("MagentoCatalogAdapter"),
    WooCommerceCatalogAdapter: Symbol.for("WooCommerceCatalogAdapter"),

    // Configuration
    ConfigService: Symbol.for("ConfigService"),
};
