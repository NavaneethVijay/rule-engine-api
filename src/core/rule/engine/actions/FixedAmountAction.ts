import { Cart } from "../../../cart/entities/Cart";
import { ActionInterface, ActionResult, FixedAmountConfig } from "../../interfaces/ActionInterface";

export class FixedAmountAction implements ActionInterface {
    apply(cart: Cart, config: FixedAmountConfig): ActionResult {
        let discount = 0;
        const affectedItems: string[] = [];
        console.log('FixedAmountConfig', JSON.stringify(config, null, 2));

        if (config.target === 'total') {
            // Apply discount to cart total
            discount = Math.min(config.value, cart.subtotal);
            affectedItems.push(...cart.items.map(item => item.sku));
        } else if (config.target === 'item') {
            // Apply discount to each cart item
            cart.items.forEach(item => {
                const itemDiscount = Math.min(config.value, item.price * item.quantity);
                discount += itemDiscount;
                affectedItems.push(item.sku);
            });
        }

        return {
            message: `Fixed amount discount of ${discount} applied`,
            success: true,
            modifiedAmount: discount,
            affectedItems
        };
    }
}