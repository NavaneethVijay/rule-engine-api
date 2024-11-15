import { Rule } from '../entities/Rule';
import { Cart } from '../../cart/entities/Cart';
export interface IRuleEngine {
  applyRules(cart: Cart, rules: Rule[]): Cart;
}