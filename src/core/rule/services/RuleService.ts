import { injectable, inject } from "inversify";
import { Cart } from "../../cart/entities/Cart";
import { Rule, RuleRequest } from "../entities/Rule";
import { RuleRepository } from "../repository/ruleRepository";
import { TYPES } from "../../../ioc/types";

@injectable()
export class RuleService {
    private ruleRepository: RuleRepository;

    constructor(@inject(TYPES.RuleRepository) ruleRepository: RuleRepository) {
        this.ruleRepository = ruleRepository;
    }

    async getRules(cart: Cart): Promise<Rule[]> {
        return this.ruleRepository.getRules(cart.websiteId, cart.customerGroupId);
    }

    async createRule(ruleData: RuleRequest): Promise<Rule> {
        try {
            const ruleId = await this.ruleRepository.createRule(ruleData);
            return await this.getRule(ruleId);
        } catch (error) {
            console.error('Error in createRule:', error);
            throw error;
        }
    }

    async getRule(ruleId: string): Promise<Rule> {
        return this.ruleRepository.getRule(ruleId);
    }

    async deleteRule(ruleId: string): Promise<void> {
        try {
            await this.ruleRepository.deleteRule(ruleId);
        } catch (error) {
            console.error('Error in deleteRule:', error);
            throw error;
        }
    }
}
