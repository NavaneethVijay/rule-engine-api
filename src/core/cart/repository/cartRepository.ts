import { injectable } from "inversify";
import { supabase } from "../../../infrastructure/database/supabaseClient";
import { Cart, CartItem } from "../entities/Cart";

@injectable()
export class CartRepository {
    async createCart(cartId: string, websiteId?: string, customerGroupId?: string): Promise<Cart> {
        const { data, error } = await supabase
            .from('cart')
            .insert([{
                cart_id: cartId,
                subtotal: 0,
                total_discount: 0,
                final_price: 0,
                website_id: websiteId,
                customer_group_id: customerGroupId
            }])
            .select()
            .single();

        if (error) throw new Error(`Error creating cart: ${error.message}`);

        return {
            cartId: data.cart_id,
            items: [],
            subtotal: data.subtotal,
            totalDiscount: data.total_discount,
            finalPrice: data.final_price,
            websiteId: data.website_id,
            customerGroupId: data.customer_group_id,
            appliedRules: [],
            hasFreeShipping: false
        };
    }

    async getCart(cartId: string): Promise<Cart> {
        // Get cart items
        const { data: cartItems, error: itemsError } = await supabase
            .from('cart_item')
            .select('*')
            .eq('cart_id', cartId);

        if (itemsError) throw itemsError;

        // Get cart details
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*')
            .eq('cart_id', cartId)
            .single();

        if (cartError) throw cartError;
        if (!cartData) return null;

        return {
            cartId: cartData.cart_id,
            items: cartItems || [],
            subtotal: cartData.subtotal,
            totalDiscount: cartData.total_discount,
            finalPrice: cartData.final_price,
            websiteId: cartData.website_id,
            customerGroupId: cartData.customer_group_id,
            appliedRules: [],
            hasFreeShipping: false,
            shippingAddress: cartData.shipping_address,
            billingAddress: cartData.billing_address,
            shippingMethod: cartData.shipping_method,
            paymentMethod: cartData.payment_method
        };
    }

    async updateCartItem(cartId: string, item: CartItem): Promise<void> {
        const { error } = await supabase
            .from('cart_item')
            .update({ quantity: item.quantity, price: item.price })
            .eq('cart_id', cartId)
            .eq('sku', item.sku);

        if (error) throw new Error(`Error updating item: ${error.message}`);
    }

    async addCartItem(cartId: string, item: CartItem): Promise<void> {
        const { error } = await supabase
            .from('cart_item')
            .insert({
                cart_id: cartId,
                sku: item.sku,
                quantity: item.quantity,
                price: item.price
            });

        if (error) throw new Error(`Error adding item: ${error.message}`);
    }

    async updateCartSubtotal(cartId: string, subtotal: number): Promise<void> {
        const { error } = await supabase
            .from('cart')
            .update({ subtotal })
            .eq('cart_id', cartId);

        if (error) throw new Error(`Error updating cart subtotal: ${error.message}`);
    }
}
