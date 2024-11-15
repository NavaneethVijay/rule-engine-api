import { Cart } from "../../cart/entities/Cart";
import { Rule } from "../../rule/entities/Rule";
import { SKUCondition } from "./conditions/SKUCondition";
import { CartSubtotalCondition } from "./conditions/CartSubtotalCondition";
import { QuantityInCartCondition } from "./conditions/QuantityInCartCondition";
import { FreeProductAction } from "./actions/FreeProductAction";
import { PercentageDiscountAction } from "./actions/PercentageDiscountAction";
import { FixedAmountAction } from "./actions/FixedAmountAction";
import { BuyXGetYDiscountAction } from "./actions/BuyXGetYDiscountAction";
import { FreeShippingAction } from "./actions/FreeShippingAction";
import { DateRangeCondition } from "./conditions/DateRangeCondition";
import {
    ActionInterface,
} from '../interfaces/ActionInterface';
import {
    ConditionInterface,
} from '../interfaces/ConditionInterface';
import { injectable } from "inversify";
import { ACTION_TYPES } from "../../../shared/constants/actionTypes";

@injectable()
export class RuleEngine {
    private conditions: Map<string, ConditionInterface>;
    private actions: Map<string, ActionInterface>;

    constructor() {
        // Initialize condition handlers
        this.conditions = new Map<string, ConditionInterface>([
            ['SKU', new SKUCondition()],
            ['CartSubtotal', new CartSubtotalCondition()],
            ['QuantityInCart', new QuantityInCartCondition()],
            ['DateRange', new DateRangeCondition()]
        ]);

        // Initialize action handlers
        this.actions = new Map<string, ActionInterface>([
            [ACTION_TYPES.PERCENTAGE_DISCOUNT, new PercentageDiscountAction()],
            [ACTION_TYPES.FREE_PRODUCT, new FreeProductAction()],
            [ACTION_TYPES.FIXED_AMOUNT, new FixedAmountAction()],
            [ACTION_TYPES.BUY_X_GET_Y_DISCOUNT, new BuyXGetYDiscountAction()],
            [ACTION_TYPES.FREE_SHIPPING, new FreeShippingAction()]
        ]);
    }

    public applyRules(cart: Cart, rules: Rule[]): Cart {
        console.log('Applying rules to cart:', {
            cartItems: cart.items,
            rules
        });

        // Create a copy of the cart to modify
        const workingCart = { ...cart };
        workingCart.appliedRules = [];
        workingCart.totalDiscount = 0;

        // Sort rules by priority (higher priority first)
        const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

        for (const rule of sortedRules) {
            console.log('Evaluating rule:', rule.description);

            // Skip rule if stacking is not allowed and we already have a discount
            if (!rule.allowStacking && workingCart.totalDiscount > 0) {
                console.log('Skipping rule due to stacking restrictions');
                continue;
            }

            // Skip rule if website or customer group doesn't match
            if (!this.isApplicable(workingCart, rule)) {
                console.log('Rule not applicable due to website/customer group restrictions');
                continue;
            }

            // Check if all conditions are met
            const conditionsMet = rule.conditions.every(condition => {
                const handler = this.conditions.get(condition.type);
                if (!handler) {
                    console.log(`No handler for condition type: ${condition.type}`);
                    return false;
                }

                const result = handler.evaluate(workingCart, {
                    ...condition,
                    startDate: rule.startDate,
                    endDate: rule.endDate
                });
                console.log(`Condition ${condition.type} result:`, result);
                return result.success;
            });

            if (conditionsMet) {
                console.log('All conditions met for rule:', rule.description);

                // Apply all actions
                for (const action of rule.actions) {
                    const handler = this.actions.get(action.type);
                    if (!handler) {
                        console.log(`No handler for action type: ${action.type}`);
                        continue;
                    }

                    const result = handler.apply(workingCart, action);
                    console.log(`Action ${action.type} result:`, result);
                    if (result.success) {
                        // TODO: Shipping amount is not being updated in cart
                        if(action.type === ACTION_TYPES.FREE_SHIPPING && result.success){
                            workingCart.hasFreeShipping = true;
                        }
                        workingCart.totalDiscount += result.modifiedAmount;
                        workingCart.appliedRules.push({
                            ruleId: rule.id,
                            description: rule.description,
                            discountAmount: result.modifiedAmount,
                            affectedItems: result.affectedItems,
                        });
                    }
                }
            }
        }

        // Calculate final price
        workingCart.finalPrice = workingCart.subtotal - workingCart.totalDiscount;

        console.log('Final cart state:', {
            subtotal: workingCart.subtotal,
            totalDiscount: workingCart.totalDiscount,
            finalPrice: workingCart.finalPrice,
            appliedRules: workingCart.appliedRules
        });

        return workingCart;
    }

    private isApplicable(cart: Cart, rule: Rule): boolean {
        return (
            (!rule.websiteId || rule.websiteId === cart.websiteId) &&
            (!rule.customerGroupId || rule.customerGroupId === cart.customerGroupId)
        );
    }
}
