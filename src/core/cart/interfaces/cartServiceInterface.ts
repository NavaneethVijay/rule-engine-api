import { Cart, CartItem } from "../entities/Cart";

export interface ICartService {
  createCart(cartId: string, websiteId?: string, customerGroupId?: string): Promise<Cart>;
  getCart(cartId: string): Promise<Cart>;
  addOrUpdateItem(cartId: string, item: CartItem): Promise<Cart>;
  deleteItem(cartId: string, sku: string): Promise<Cart>;
  // addShippingAddress(cartId: string, address: any, shippingMethod: any): Promise<Cart>;
  // addBillingAddress(cartId: string, address: any, paymentMethod: any): Promise<Cart>;
  applyRules(cartId: string): Promise<Cart>;
}