import {IFactory} from "@/th4/mall/core/IFactory";

/**
 * 购物车商品工厂
 */
class CartItemFactory extends IFactory<mall.CartItem> implements mall.Factory<mall.CartItem> {
}

export const cartItemFactory = new CartItemFactory();