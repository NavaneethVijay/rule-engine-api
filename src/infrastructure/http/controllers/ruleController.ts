import { controller, httpPost, httpGet, httpDelete, requestBody, requestParam, response } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../../../ioc/types";
import { RuleService } from "../../../core/rule/services/RuleService";
import { RuleRequest } from "../../../core/rule/entities/Rule";
import { Request, Response } from "express";
@controller("/rules")
export class RuleController {
    constructor(
        @inject(TYPES.RuleService) private ruleService: RuleService
    ) {}


    @httpPost('/search')
    async getAllRules(
        @requestBody() body: { websiteId: string; customerGroupId: string }
    ) {

        try {
            const { websiteId, customerGroupId } = body;
            const rules = await this.ruleService.getRules({
                websiteId,
                customerGroupId
            } as any);
            return {
                rules
            };
        } catch (error) {
            throw new Error(`Failed to fetch rules: ${error.message}`);
        }
    }

    @httpPost('/create')
    async createRule(@requestBody() ruleData: RuleRequest) {
        console.log('Received body:', ruleData);
        try {
            const rule = await this.ruleService.createRule(ruleData);
            return {
                message: 'Rule created successfully',
                rule
            };
        } catch (error) {
            throw new Error(`Failed to create rule: ${error.message}`);
        }
    }


    @httpGet('/:ruleId')
    async getRule(@requestParam('ruleId') ruleId: string) {
        try {
            const rule = await this.ruleService.getRule(ruleId);
            return {
                rule
            };
        } catch (error) {
            throw new Error(`Failed to fetch rule: ${error.message}`);
        }
    }

    @httpDelete('/:ruleId')
    async deleteRule(@requestParam('ruleId') ruleId: string) {
        try {
            await this.ruleService.deleteRule(ruleId);
            return {
                message: 'Rule deleted successfully'
            };
        } catch (error) {
            throw new Error(`Failed to delete rule: ${error.message}`);
        }
    }
}
