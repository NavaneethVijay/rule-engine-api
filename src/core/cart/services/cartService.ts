import { injectable, inject } from "inversify";
import { ICartService } from "../interfaces/cartServiceInterface";
import { Cart, CartItem } from "../entities/Cart";
import { RuleService } from "../../rule/services/RuleService";
import { TYPES } from "../../../ioc/types";
import { RuleEngine } from "../../rule/engine/RuleEngine";
import { CartRepository } from "../repository/cartRepository";

@injectable()
export class CartService implements ICartService {
    private ruleService: RuleService;
    private ruleEngine: RuleEngine;
    private cartRepository: CartRepository;

    constructor(
        @inject(TYPES.RuleService) ruleService: RuleService,
        @inject(TYPES.RuleEngine) ruleEngine: RuleEngine,
        @inject(TYPES.CartRepository) cartRepository: CartRepository
    ) {
        this.ruleService = ruleService;
        this.ruleEngine = ruleEngine;
        this.cartRepository = cartRepository;
    }

    async createCart(cartId: string, websiteId?: string, customerGroupId?: string): Promise<Cart> {
        return this.cartRepository.createCart(cartId, websiteId, customerGroupId);
    }

    async getCart(cartId: string): Promise<Cart> {
        try {
            const cart = await this.cartRepository.getCart(cartId);
            if (!cart) return null;

            // Get applicable rules
            const rules = await this.ruleService.getRules(cart);

            // Apply rules to cart
            return this.ruleEngine.applyRules(cart, rules);
        } catch (error) {
            console.error('Error in getCart:', error);
            throw error;
        }
    }

    async addOrUpdateItem(cartId: string, item: CartItem): Promise<Cart> {
        const cart = await this.getCart(cartId);
        const existingItem = cart.items.find(i => i.sku === item.sku);

        if (existingItem) {
            await this.cartRepository.updateCartItem(cartId, item);
        } else {
            await this.cartRepository.addCartItem(cartId, item);
        }

        return this.recalculateCart(cartId);
    }

    async recalculateCart(cartId: string): Promise<Cart> {
        const cart = await this.getCart(cartId);
        const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await this.cartRepository.updateCartSubtotal(cartId, subtotal);
        return cart;
    }

    async deleteItem(cartId: string, sku: string): Promise<Cart> {
        throw new Error("Method not implemented.");
    }

    async applyRules(cartId: string): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
}
