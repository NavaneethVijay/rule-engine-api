import { injectable } from "inversify";
import { supabase } from "../../../infrastructure/database/supabaseClient";
import { Rule, RuleRequest } from "../entities/Rule";
import { Cart } from "../../cart/entities/Cart";
import { ACTION_TYPES } from "../../../shared/constants/actionTypes";

@injectable()
export class RuleRepository {
    async getRules(websiteId: string, customerGroupId: string): Promise<Rule[]> {
        const { data: ruleData, error: ruleError } = await supabase
            .from('rule')
            .select(`
                rule_id,
                is_active,
                description,
                priority,
                allow_stacking,
                website_id,
                start_date,
                end_date,
                customer_group_id,
                conditions:rule_condition(
                    condition_id,
                    condition_type:condition_type_id(type_name),
                    value,
                    operator,
                    target,
                    metadata
                ),
                actions:rule_action(
                    action_id,
                    action_type,
                    action_value,
                    target,
                    metadata
                )
            `)
            .eq('website_id', websiteId)
            .eq('customer_group_id', customerGroupId);

        if (ruleError) throw new Error(`Error fetching rules: ${ruleError.message}`);

        return ruleData.map(rule => ({
            id: rule.rule_id,
            description: rule.description,
            isActive: rule.is_active,
            startDate: rule.start_date,
            endDate: rule.end_date,
            conditions: rule.conditions.map((condition: any) => ({
                type: condition.condition_type.type_name,
                value: condition.value,
                operator: condition.operator || 'equals',
                metadata: condition.metadata,
                itemIds: condition.metadata?.target_skus || []
            })),
            actions: rule.actions.map((action: any) => ({
                type: action.action_type,
                value: action.action_value,
                target: action?.target || 'total',
                metadata: action.metadata,
                maximumDiscount: action.metadata?.maximum_discount
            })),
            priority: rule.priority,
            allowStacking: rule.allow_stacking,
            websiteId: rule.website_id,
            customerGroupId: rule.customer_group_id
        }));
    }

    async createRule(ruleData: RuleRequest): Promise<string> {
        const { data: rule, error: ruleError } = await supabase
            .from('rule')
            .insert([{
                description: ruleData.description,
                priority: ruleData.priority,
                allow_stacking: ruleData.allowStacking,
                website_id: ruleData.websiteId,
                customer_group_id: ruleData.customerGroupId,
                is_active: ruleData.isActive ? true : false
            }])
            .select()
            .single();

        if (ruleError) throw new Error(`Error creating rule: ${ruleError.message}`);

        // Create conditions
        for (const condition of ruleData.conditions) {
            const { data: conditionType } = await supabase
                .from('condition_type')
                .select('condition_type_id')
                .eq('type_name', condition.type)
                .single();

            await supabase
                .from('rule_condition')
                .insert([{
                    rule_id: rule.rule_id,
                    condition_type_id: conditionType?.condition_type_id,
                    value: condition.value,
                    operator: condition.operator,
                    metadata: condition.metadata || null
                }]);
        }

        // Create actions
        for (const action of ruleData.actions) {
            let metadata = {};

            console.log('creating action', action.type);

            if (action.type === ACTION_TYPES.FREE_PRODUCT) {
                metadata = {
                    freeProducts: action.metadata?.freeProductSkus?.map(sku => ({
                        sku,
                        quantity: 1
                    })) || []
                };
            } else {
                metadata = {
                    target_skus: action.metadata?.targetSkus,
                    maximum_discount: action.metadata?.maximum_discount
                };
            }

            console.log('inserting in rule_action', JSON.stringify({
                rule_id: rule.rule_id,
                action_type: action.type,
                action_value: action.value,
                target: action.target,
                metadata
            }, null, 2));

            await supabase
                .from('rule_action')
                .insert([{
                    rule_id: rule.rule_id,
                    action_type: action.type,
                    action_value: action.value,
                    target: action.target,
                    metadata
                }]);
        }

        return rule.rule_id;
    }

    async getRule(ruleId: string): Promise<Rule> {
        const { data: rule, error } = await supabase
            .from('rule')
            .select(`
                rule_id,
                is_active,
                description,
                priority,
                allow_stacking,
                website_id,
                customer_group_id,
                conditions:rule_condition(
                    condition_id,
                    condition_type:condition_type_id(type_name),
                    value,
                    operator,
                    target,
                    metadata
                ),
                actions:rule_action(
                    action_id,
                    action_type,
                    action_value,
                    target,
                    metadata
                )
            `)
            .eq('rule_id', ruleId)
            .single();

        if (error) throw new Error(`Error fetching rule: ${error.message}`);

        const data = {
            id: rule.rule_id,
            isActive: rule.is_active,
            description: rule.description,
            conditions: rule.conditions.map((condition: any) => ({
                type: condition.condition_type.type_name,
                value: condition.value,
                operator: condition.operator || 'equals',
                metadata: condition.metadata,
                itemIds: condition.metadata?.target_skus || []
            })),
            actions: rule.actions.map((action: any) => ({
                type: action.action_type,
                value: action.action_value,
                target: action?.target || 'total',
                metadata: action.metadata,
                maximumDiscount: action.metadata?.maximum_discount
            })),
            priority: rule.priority,
            allowStacking: rule.allow_stacking,
            websiteId: rule.website_id,
            customerGroupId: rule.customer_group_id
        }

        return data;
    }

    async deleteRule(ruleId: string): Promise<void> {
        const { error } = await supabase
            .from('rule')
            .delete()
            .eq('rule_id', ruleId);

        if (error) throw new Error(`Error deleting rule: ${error.message}`);
    }
}
