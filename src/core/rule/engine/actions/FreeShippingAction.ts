import { Cart } from "../../../cart/entities/Cart";
import { ActionInterface, ActionResult, FreeShippingConfig } from "../../interfaces/ActionInterface";

export class FreeShippingAction implements ActionInterface {
    apply(cart: Cart, config: FreeShippingConfig): ActionResult {

        // FOR NOW DO NOTHING
        return {
            message: 'Free shipping action applied',
            success: true,
            modifiedAmount: cart.shippingAmount || 0,
            affectedItems: ['shipping']
        };


        if (!cart.shippingAmount) {
            return {
                message: 'Free shipping action not applied',
                success: false,
                modifiedAmount: 0,
                affectedItems: []
            };
        }

        // If shipping methods are specified, check if cart's shipping method is eligible
        if (config.shippingMethods &&
            config.shippingMethods.length > 0 &&
            !config.shippingMethods.includes(cart.shippingMethod)) {
            return {
                message: 'Free shipping action not applied',
                success: false,
                modifiedAmount: 0,
                affectedItems: []
            };
        }

        return {
            message: 'Free shipping action applied',
            success: true,
            modifiedAmount: cart.shippingAmount,
            affectedItems: ['shipping']
        };
    }
}