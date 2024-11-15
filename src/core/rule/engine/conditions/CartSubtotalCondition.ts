import {
    ConditionInterface,
    ConditionConfig,
    ConditionResult
} from '../../interfaces/ConditionInterface';

export class CartSubtotalCondition implements ConditionInterface {
    evaluate(cart: any, config: ConditionConfig): ConditionResult {
        if (!this.validate(config)) {
            return {
                success: false,
                message: 'Invalid cart subtotal condition configuration'
            };
        }

        const subtotal = this.getSubtotal(cart);
        const numericValue = typeof config.value === 'string'
            ? parseFloat(config.value)
            : (config.value as number);

        switch (config.operator) {
            case 'greater_than':
                return {
                    success: subtotal > numericValue,
                    message: `Cart subtotal ${subtotal} is ${subtotal > numericValue ? 'above' : 'below'} ${numericValue}`,
                    metadata: {
                        actualSubtotal: subtotal,
                        threshold: numericValue,
                        difference: subtotal - numericValue
                    }
                };

            case 'greater_than_equals':
                return {
                    success: subtotal >= numericValue,
                    message: `Cart subtotal ${subtotal} is ${subtotal >= numericValue ? 'at or above' : 'below'} ${numericValue}`,
                    metadata: {
                        actualSubtotal: subtotal,
                        threshold: numericValue,
                        difference: subtotal - numericValue
                    }
                };

            case 'less_than':
                return {
                    success: subtotal < numericValue,
                    message: `Cart subtotal ${subtotal} is ${subtotal < numericValue ? 'below' : 'above'} ${numericValue}`,
                    metadata: {
                        actualSubtotal: subtotal,
                        threshold: numericValue,
                        difference: numericValue - subtotal
                    }
                };

            case 'less_than_equals':
                return {
                    success: subtotal <= numericValue,
                    message: `Cart subtotal ${subtotal} is ${subtotal <= numericValue ? 'at or below' : 'above'} ${numericValue}`,
                    metadata: {
                        actualSubtotal: subtotal,
                        threshold: numericValue,
                        difference: numericValue - subtotal
                    }
                };

            case 'equals':
                return {
                    success: subtotal === numericValue,
                    message: `Cart subtotal ${subtotal} ${subtotal === numericValue ? 'equals' : 'does not equal'} ${numericValue}`,
                    metadata: {
                        actualSubtotal: subtotal,
                        threshold: numericValue
                    }
                };

            default:
                return {
                    success: false,
                    message: `Unsupported operator: ${config.operator}`
                };
        }
    }

    validate(config: ConditionConfig): boolean {
        console.log('CartSubtotalCondition Config', JSON.stringify(config, null, 2));
        const numericValue = typeof config.value === 'string'
            ? parseFloat(config.value)
            : (config.value as number);

        return (
            !isNaN(numericValue) &&
            numericValue >= 0 &&
            [
                'greater_than',
                'greater_than_equals',
                'less_than',
                'less_than_equals',
                'equals'
            ].includes(config.operator)
        );
    }

    private getSubtotal(cart: any): number {
        // Handle specific category or item subtotals if specified
        if (cart.items && (this.hasCategories(cart) || this.hasSpecificItems(cart))) {
            return this.calculateFilteredSubtotal(cart);
        }

        return cart.subtotal || 0;
    }

    private hasCategories(cart: any): boolean {
        return Array.isArray(cart.categoryIds) && cart.categoryIds.length > 0;
    }

    private hasSpecificItems(cart: any): boolean {
        return Array.isArray(cart.itemIds) && cart.itemIds.length > 0;
    }

    private calculateFilteredSubtotal(cart: any): number {
        return cart.items.reduce((total: number, item: any) => {
            if (this.shouldIncludeItem(item, cart)) {
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    }

    private shouldIncludeItem(item: any, cart: any): boolean {
        // Check if item is in specified categories
        if (this.hasCategories(cart) &&
            item.categoryIds?.some((catId: string) => cart.categoryIds.includes(catId))) {
            return true;
        }

        // Check if item is in specified items
        if (this.hasSpecificItems(cart) && cart.itemIds.includes(item.sku)) {
            return true;
        }

        return false;
    }
}
