import { ActionPayload } from "../interfaces/ActionInterface";
import { ConditionConfig } from "../interfaces/ConditionInterface";

export interface Condition {
    type: string;
    value: any;
    operator?: string;
    metadata?: any;
    itemIds?: string[];
  }

  export interface Action {
    type: string;
    value: number;
    target?: string;
    itemIds?: string[];
    maximumDiscount?: number;
  }

  export interface Rule {
    endDate?: string;
    startDate?: string;
    id: string;
    description: string;
    conditions: ConditionConfig[];
    actions: ActionPayload[];
    priority: number;
    allowStacking: boolean;
    websiteId?: string;
    customerGroupId?: string;
  }

  export interface RuleRequest {
    isActive?: boolean;
    description: string;
    priority: number;
    allowStacking: boolean;
    websiteId?: string;
    customerGroupId?: string;
    conditions: {
      conditionType: string;
      value: any;
      type: any;
      metadata?: any;
      operator?: string;
      targetSkus?: string[];
    }[];
    actions: {
      type: string;
      value: number;
      target?: string;
      metadata?: any;
    }[];
  }