import { Cart } from "../../../cart/entities/Cart";
import { ConditionInterface, DateRangeConfig, ConditionResult } from "../../interfaces/ConditionInterface";

export class DateRangeCondition implements ConditionInterface {
    evaluate(cart: Cart, config: DateRangeConfig): ConditionResult {
        const now = new Date();
        const startDate = new Date(config.startDate);
        const endDate = new Date(config.endDate);

        return {
            message: 'Date range condition evaluated',
            success: now >= startDate && now <= endDate,
            metadata: {
                currentDate: now.toISOString(),
                isWithinRange: now >= startDate && now <= endDate
            }
        };
    }
}