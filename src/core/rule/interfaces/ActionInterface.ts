import { ACTION_TYPES } from "../../../shared/constants/actionTypes";

export interface ActionPayload {
    type: keyof typeof ACTION_TYPES;
    value: number;
    target?: 'total' | 'item' | 'shipping';
    itemIds?: string[];
    maximumDiscount?: number;
    metadata?: {
        freeProducts?: Array<{
            sku: string;
            quantity: number;
        }>;
    };
}

export interface ActionResult {
    success: boolean;
    modifiedAmount: number;
    message: string;
    affectedItems?: string[];
}

export interface ActionInterface {
    apply(cart: any, action: ActionPayload): ActionResult;
}

export interface FixedAmountConfig extends ActionPayload {
    amount: number;
}

export interface BuyXGetYDiscountConfig extends ActionPayload {
    buySkus: string[];
    getSkus: string[];
    minQuantity: number;
    discountPercentage: number;
}

export interface FreeShippingConfig extends ActionPayload {
    shippingMethods?: string[];  // Optional: limit to specific shipping methods
}
