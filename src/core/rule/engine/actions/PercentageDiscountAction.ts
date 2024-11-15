import { ACTION_TYPES } from '../../../../shared/constants/actionTypes';
import { ActionInterface, ActionPayload, ActionResult } from '../../interfaces/ActionInterface';

interface PercentageDiscountConfig {
    value: number;
    targetSkus?: string[];
    scope: 'item' | 'subtotal';
}

export class PercentageDiscountAction implements ActionInterface {
    apply(cart: any, action: ActionPayload): ActionResult {
        let discountAmount = 0;
        const affectedItems: string[] = [];
        const targetSkus = action.itemIds || [];

        if (action.target === 'total') {
            // Calculate discount based on cart subtotal
            const eligibleSubtotal = targetSkus.length > 0
                ? cart.items
                    .filter(item => targetSkus.includes(item.sku))
                    .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                : cart.subtotal;

            discountAmount = eligibleSubtotal * (action.value / 100);

            // Track affected items
            cart.items.forEach(item => {
                if (targetSkus.length === 0 || targetSkus.includes(item.sku)) {
                    affectedItems.push(item.sku);
                }
            });
        } else if (action.target === 'item') {
            // Item-level discount logic
            cart.items.forEach(item => {
                if (targetSkus.length === 0 || targetSkus.includes(item.sku)) {
                    const itemTotal = item.price * item.quantity;
                    const itemDiscount = itemTotal * (action.value / 100);
                    discountAmount += itemDiscount;
                    affectedItems.push(item.sku);
                }
            });
        }

        console.log('Final discount amount:', discountAmount);

        return {
            success: true,
            modifiedAmount: discountAmount,
            message: `Applied ${action.value}% discount to items: ${targetSkus.join(', ')}`,
            affectedItems
        };
    }

    validate(cart: any, action: ActionPayload): boolean {
        const isValid =
            action.type === ACTION_TYPES.PERCENTAGE_DISCOUNT &&
            typeof action.value === 'number' &&
            action.value > 0 &&
            action.value <= 100;

        console.log('Percentage Discount - Validation:', {
            action,
            isValid
        });

        return isValid;
    }
}
