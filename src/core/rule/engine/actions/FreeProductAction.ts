import { ACTION_TYPES } from '../../../../shared/constants/actionTypes';
import { ActionInterface, ActionPayload, ActionResult } from '../../interfaces/ActionInterface';

export class FreeProductAction implements ActionInterface {
    apply(cart: any, rule: ActionPayload): ActionResult {
        console.log('Free Product Action - Applying:', JSON.stringify(rule, null, 2));
        if (!rule.metadata?.freeProducts?.length) {
            return {
                success: false,
                modifiedAmount: 0,
                message: 'No free products specified'
            };
        }

        const affectedItems: string[] = [];
        let totalValue = 0;

        for (const freeProduct of rule.metadata.freeProducts) {
            const { sku, quantity = 1 } = freeProduct;

            // Check if free product already exists
            const existingFreebie = cart.items.find(
                (item: any) => item.sku === sku && item.price === 0
            );

            if (!existingFreebie) {
                // Get original price for tracking value
                const originalPrice = this.getOriginalPrice(cart, sku);
                totalValue += originalPrice * quantity;

                // Add free product to cart
                cart.items.push({
                    sku,
                    quantity,
                    price: 0,
                    originalPrice, // Track original price
                    isFreebieProduct: true // Flag to identify free products
                });

                affectedItems.push(sku);
            }
        }

        return {
            success: true,
            modifiedAmount: totalValue,
            affectedItems,
            message: `Added ${affectedItems.length} free products to cart`
        };
    }

    private getOriginalPrice(cart: any, sku: string): number {
        // Implementation to get original price from catalog or configuration
        // This is a placeholder - implement according to your system
        return 0;
    }

    validate(cart: any, rule: ActionPayload): boolean {
        return (
            rule.type === ACTION_TYPES.FREE_PRODUCT &&
            Array.isArray(rule.metadata?.freeProducts) &&
            rule.metadata.freeProducts.length > 0
        );
    }
}
