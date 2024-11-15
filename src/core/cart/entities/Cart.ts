export interface CartItem {
    sku: string;
    price: number;
    quantity: number;
    cart_item_id?: string;
  }

  export interface AppliedRule {
    ruleId: string;
    description: string;
    discountAmount: number;
    affectedItems?: string[];
  }

  export interface Cart {
    cartId: string;
    items: CartItem[];
    subtotal: number;
    totalDiscount: number;
    finalPrice: number;
    websiteId?: string;
    customerGroupId?: string;
    appliedRules: AppliedRule[];
    hasFreeShipping: boolean;
    shippingAddress?: any;
    billingAddress?: any;
    shippingMethod?: any;
    paymentMethod?: any;
    shippingAmount?: number;
  }