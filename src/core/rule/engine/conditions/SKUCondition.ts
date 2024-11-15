import {
    ConditionInterface,
    ConditionConfig,
    ConditionResult
} from '../../interfaces/ConditionInterface';

export class SKUCondition implements ConditionInterface {

    isWithinDateRange(condition: ConditionConfig): boolean {
        const { startDate, endDate } = condition;
        const today = new Date();

        // If no dates are specified, condition is valid
        if (!startDate && !endDate) {
            return true;
        }

        // Check start date if present
        if (startDate && today < new Date(startDate)) {
            return false;
        }

        // Check end date if present
        if (endDate && today > new Date(endDate)) {
            return false;
        }

        return true;
    }

    evaluate(cart: any, condition: ConditionConfig): ConditionResult {
        console.log('SKU Condition - Evaluating:', {
            cartItems: cart.items,
            condition
        });


        // First validate the condition config
        if (!this.validate(condition)) {
            return {
                success: false,
                message: 'Invalid SKU condition configuration',
                metadata: {
                    condition
                }
            };
        }

        if (!this.isWithinDateRange(condition)) {
            return {
                success: false,
                message: 'SKU condition is outside of valid date range',
                metadata: {
                    currentDate: new Date().toISOString(),
                    startDate: condition.startDate,
                    endDate: condition.endDate
                }
            };
        }


        // Get target SKUs from either metadata or value
        const targetSkus = condition.metadata?.target_skus || [condition.value];

        console.log('Target SKUs:', targetSkus);

        // Check if any target SKU exists in cart
        const matchingItems = cart.items.filter((item: any) =>
            targetSkus.includes(item.sku)
        );

        const success = matchingItems.length > 0;

        console.log('SKU Condition - Result:', {
            targetSkus,
            matchingItems,
            success
        });

        return {
            success,
            message: success
                ? `Found ${matchingItems.length} matching items in cart`
                : 'No matching SKUs found in cart',
            metadata: {
                matchingItems,
                targetSkus: targetSkus as string[],
                dateValidation: condition.startDate || condition.endDate ? {
                    isWithinRange: true,
                    currentDate: new Date().toISOString(),
                    startDate: condition.startDate,
                    endDate: condition.endDate
                } : undefined
            }
        };
    }

    validate(config: ConditionConfig): boolean {
        // Check if config exists
        if (!config) {
            return false;
        }

        // Validate date range if specified
        if (config.startDate || config.endDate) {
            // If one date is specified, both should be specified
            if (!(config.startDate && config.endDate)) {
                return false;
            }

            // Validate date formats
            const startDate = new Date(config.startDate);
            const endDate = new Date(config.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return false; // Invalid date format
            }

            if (startDate > endDate) {
                return false; // Start date should be before end date
            }
        }

        // Check for target_skus in metadata
        if (config.metadata?.target_skus) {
            return Array.isArray(config.metadata.target_skus) &&
                config.metadata.target_skus.length > 0 &&
                config.metadata.target_skus.every(sku => typeof sku === 'string' && sku.length > 0);
        }

        // Check for direct value
        if (config.value) {
            return typeof config.value === 'string' && config.value.length > 0;
        }

        return false;

    }
}
