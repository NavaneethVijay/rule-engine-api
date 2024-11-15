import { Cart } from "../../../cart/entities/Cart";
import { ActionInterface, ActionResult, BuyXGetYDiscountConfig } from "../../interfaces/ActionInterface";

export class BuyXGetYDiscountAction implements ActionInterface {
    apply(cart: Cart, config: BuyXGetYDiscountConfig): ActionResult {
        const qualifyingItems = cart.items.filter(item =>
            config.buySkus.includes(item.sku)
        );

        const discountableItems = cart.items.filter(item =>
            config.getSkus.includes(item.sku)
        );

        if (qualifyingItems.length < config.minQuantity || !discountableItems.length) {
            return {
                message: 'Buy X get Y discount action not applied',
                success: false,
                modifiedAmount: 0,
                affectedItems: []
            };
        }

        const totalDiscount = discountableItems.reduce((sum, item) => {
            return sum + (item.price * (config.discountPercentage / 100));
        }, 0);

        return {
            message: 'Buy X get Y discount action applied',
            success: true,
            modifiedAmount: totalDiscount,
            affectedItems: discountableItems.map(item => item.sku)
        };
    }
}