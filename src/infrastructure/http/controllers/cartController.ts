import { controller, httpPost, httpGet, requestBody, requestParam, httpDelete, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../../../ioc/types";
import { ICartService } from "../../../core/cart/interfaces/cartServiceInterface";
import { v4 as uuidv4 } from 'uuid';

@controller("/cart")
export class CartController {
    private cartService: ICartService;

    constructor(@inject(TYPES.CartService) cartService: ICartService) {
        this.cartService = cartService;
    }

    @httpPost('/')
    async createCart(
        @requestBody() body: { websiteId: string; customerGroupId: string }
    ) {
        const cartId = uuidv4();
        const { websiteId, customerGroupId } = body;
        const cart = await this.cartService.createCart(cartId, websiteId, customerGroupId);

        return {
            cartId,
            message: 'Cart created successfully.',
            cart
        };
    }

    @httpPut('/:cartId/items')
    async addOrUpdateCartItem(
        @requestParam('cartId') cartId: string,
        @requestBody() body: { sku: string; quantity: number; price: number }
    ) {
        const { sku, quantity, price } = body;
        const updatedCart = await this.cartService.addOrUpdateItem(cartId, { sku, quantity, price });
        return {
            message: 'Item added/updated successfully.',
            cart: updatedCart
        };
    }

    @httpPost('/:cartId/apply-rules')
    async applyCartRules(
        @requestParam('cartId') cartId: string
    ) {
        const updatedCart = await this.cartService.getCart(cartId);

        if (!updatedCart) {
            throw new Error('Cart not found');
        }

        return {
            cart: updatedCart
        };
    }
}
