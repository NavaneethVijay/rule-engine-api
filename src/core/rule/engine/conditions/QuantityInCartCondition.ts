import {
    ConditionInterface,
    ConditionConfig,
    ConditionResult
} from '../../interfaces/ConditionInterface';

interface ItemQuantityRequirement {
    sku: string;
    minQuantity?: number;
    maxQuantity?: number;
}

interface ItemQuantityResult {
    sku: string;
    actual: number;
    required?: number;
    maximum?: number;
    meets: boolean;
}

export class QuantityInCartCondition implements ConditionInterface {
    evaluate(cart: any, config: ConditionConfig): ConditionResult {
        if (!this.validate(config)) {
            return {
                success: false,
                message: 'Invalid quantity condition configuration'
            };
        }

        // Check if we're validating specific SKUs or total cart quantity
        if (config.itemIds?.length) {
            return this.evaluateSpecificItems(cart, config);
        }

        return this.evaluateTotalQuantity(cart, config);
    }

    private evaluateTotalQuantity(cart: any, config: ConditionConfig): ConditionResult {
        const totalQuantity = cart.items.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0
        );

        const numericValue = typeof config.value === 'string'
            ? parseFloat(config.value)
            : (config.value as number);

        return this.compareQuantity(
            totalQuantity,
            numericValue,
            config.operator,
            'Total cart quantity'
        );
    }

    private evaluateSpecificItems(cart: any, config: ConditionConfig): ConditionResult {
        const itemRequirements: ItemQuantityRequirement[] =
            this.parseItemRequirements(config);

        const itemResults: ItemQuantityResult[] = itemRequirements.map(requirement => {
            const cartItem = cart.items.find(
                (item: any) => item.sku === requirement.sku
            );
            const quantity = cartItem?.quantity || 0;

            // Check if quantity is within the required range
            const withinRange = (
                (!requirement.minQuantity || quantity >= requirement.minQuantity) &&
                (!requirement.maxQuantity || quantity <= requirement.maxQuantity)
            );

            return {
                sku: requirement.sku,
                actual: quantity,
                required: requirement.minQuantity,
                maximum: requirement.maxQuantity,
                meets: withinRange
            };
        });

        const allMet = itemResults.every(result => result.meets);

        return {
            success: allMet,
            message: this.generateItemsMessage(itemResults),
            metadata: {
                itemResults,
                totalItems: itemResults.reduce((sum, item) => sum + item.actual, 0)
            }
        };
    }

    private parseItemRequirements(config: ConditionConfig): ItemQuantityRequirement[] {
        // Handle simple quantity requirement for all specified SKUs
        if (typeof config.value === 'number' || typeof config.value === 'string') {
            const numericValue = typeof config.value === 'string'
                ? parseFloat(config.value)
                : config.value;

            return (config.itemIds || []).map(sku => ({
                sku,
                minQuantity: numericValue
            }));
        }

        // Handle detailed requirements from metadata
        if (config.metadata?.itemRequirements) {
            return config.metadata.itemRequirements;
        }

        return (config.itemIds || []).map(sku => ({ sku }));
    }

    private compareQuantity(
        actual: number,
        target: number,
        operator: string,
        subject: string
    ): ConditionResult {
        switch (operator) {
            case 'greater_than':
                return {
                    success: actual > target,
                    message: `${subject} (${actual}) is ${actual > target ? 'above' : 'below'} required quantity (${target})`,
                    metadata: { actual, target, difference: actual - target }
                };

            case 'greater_than_equals':
                return {
                    success: actual >= target,
                    message: `${subject} (${actual}) is ${actual >= target ? 'at or above' : 'below'} required quantity (${target})`,
                    metadata: { actual, target, difference: actual - target }
                };

            case 'equals':
                return {
                    success: actual === target,
                    message: `${subject} (${actual}) ${actual === target ? 'matches' : 'does not match'} required quantity (${target})`,
                    metadata: { actual, target }
                };

            default:
                return {
                    success: false,
                    message: `Unsupported operator: ${operator}`
                };
        }
    }

    private generateItemsMessage(results: ItemQuantityResult[]): string {
        const failedItems = results.filter(r => !r.meets);

        if (results.every(r => r.meets)) {
            return 'All item quantity requirements met';
        }

        return `Quantity requirements not met for: ${failedItems.map(item =>
            `${item.sku} (has: ${item.actual}, needs: ${item.required})`
        ).join(', ')}`;
    }

    validate(config: ConditionConfig): boolean {
        if (config.target !== 'item_quantity') {
            return false;
        }

        if (config.itemIds?.length) {
            // Validate specific item requirements
            return Array.isArray(config.itemIds) && (
                (typeof config.value === 'number' || typeof config.value === 'string') ||
                Array.isArray(config.metadata?.itemRequirements)
            );
        }

        // Validate total quantity requirement
        const numericValue = typeof config.value === 'string'
            ? parseFloat(config.value)
            : (config.value as number);

        return !isNaN(numericValue) && numericValue >= 0;
    }
}
