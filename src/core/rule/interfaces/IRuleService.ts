import { Cart } from '../../cart/entities/Cart';
import { Rule } from '../entities/Rule';

export interface IRuleService {
  getRules(cart: Cart): Promise<Rule[]>;
}