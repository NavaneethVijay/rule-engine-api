export interface Price {
    amount: number;
    currency: string;
    customerGroupId?: string;
    websiteId?: string;
}

export interface ProductStock {
    quantity: number;
    isInStock: boolean;
    websiteId?: string;
    warehouseId?: string;
}

export interface ProductAttribute {
    code: string;
    value: string | number | boolean | string[];
    label?: string;
}

export interface Product {
    id: string;
    sku: string;
    type: 'simple' | 'configurable' | 'bundle' | 'virtual';
    status: 'active' | 'inactive' | 'draft';

    // Basic Information
    name: string;
    description?: string;
    shortDescription?: string;

    // Pricing
    prices: Price[];
    specialPrice?: Price;
    specialPriceFrom?: Date;
    specialPriceTo?: Date;

    // Inventory
    stock: ProductStock[];

    // Categories and Organization
    categoryIds?: string[];
    websiteIds?: string[];

    // Attributes and Variations
    attributes: ProductAttribute[];
    parentId?: string;  // For configurable product variants
    childSkus?: string[]; // For configurable products

    // Media
    images?: {
        url: string;
        position: number;
        type: 'image' | 'video';
        label?: string;
    }[];

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    sourceId?: string;  // ID from the source catalog system
    sourceCatalog?: string;  // Identifier for the source catalog system
    metadata?: Record<string, any>;  // Additional flexible data
}

export interface SyncResult {
    success: boolean;
    totalProcessed: number;
    created: number;
    updated: number;
    failed: number;
    errors?: Array<{
        sku: string;
        error: string;
    }>;
}