export const CATALOG_TYPES = {
    SHOPIFY: 'shopify',
    MAGENTO: 'magento',
    WOOCOMMERCE: 'woocommerce'
}

export type CatalogType = keyof typeof CATALOG_TYPES;