export interface Rule {
  id: string;
  description: string;
  conditions: Condition[];
  actions: Action[];
  priority: number;
  allowStacking: boolean;
  websiteId: string;
  customerGroupId: string;
}

export interface Condition {
  type: string;
  value: string;
  operator: string;
  metadata?: {
    target_skus?: string[];
  };
  itemIds?: string[];
}

export interface Action {
  type: string;
  value: number;
  target: string;
  itemIds?: string[];
  maximumDiscount?: number;
}