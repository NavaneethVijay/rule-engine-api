export interface ConditionConfig {
    type: string;
    value: string | number | null;
    operator: string;
    target?: string;
    itemIds?: string[];
    startDate?: string;
    endDate?: string;
    metadata?: {
        target_skus?: string[];
        itemRequirements?: Array<{
            sku: string;
            minQuantity?: number;
            maxQuantity?: number;
        }>;
        [key: string]: any;
    };
}

export interface ConditionResult {
    success: boolean;
    message: string;
    metadata?: {
        matchingItems?: any[];
        targetSkus?: string[];
        actualSubtotal?: number;
        threshold?: number;
        difference?: number;
        itemResults?: any[];
        totalItems?: number;
        [key: string]: any;
    };
}

export interface ConditionInterface {
    evaluate(cart: any, condition: ConditionConfig): ConditionResult;
    validate?(config: ConditionConfig): boolean;
}

// Add to existing condition types
export interface DateRangeConfig extends ConditionConfig {
    startDate: string;  // ISO date string
    endDate: string;    // ISO date string
}