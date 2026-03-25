import {IComponent} from "@/th4/mall/core/IComponent";
import {cartItemFactory} from "@/th4/mall/cart/factory/CartItemFactory";

export const CartEvent = {
    CalculatePrice: "calculate",
    CartItemChange: "CartItemChange",
}

export class ICart extends IComponent implements mall.Cart {

    protected _cartItemMap: { [key: string]: mall.CartItem };

    constructor() {
        super({});
        this._cartItemMap = {};
        this._totalPrice = 0;
    }

    protected _totalPrice: number;

    get totalPrice(): number {
        return this._totalPrice;
    }

    addGoodsItem(goodsItem: any, num: number = 1, options?: any): void {
        let cartItem = Object.values(this._cartItemMap).find(cartItem => cartItem.match(goodsItem, options));
        if (!cartItem) {
            cartItem = cartItemFactory.create(goodsItem, options);
            this._cartItemMap[cartItem.id] = cartItem;
        }
        cartItem.plus(num);
        this.emit(CartEvent.CartItemChange, cartItem)
        this._logger.debug("购物车添购商品", goodsItem, cartItem)
        this._calculatePrice();
    }

    removeGoodsItem(goodsItem: any, num: number = 1, options?: any): void {
        let cartItem = Object.values(this._cartItemMap).find(cartItem => cartItem.match(goodsItem, options));
        if (cartItem) {
            cartItem.minus(num);
            if (cartItem.num <= 0) {
                delete this._cartItemMap[cartItem.id];
                this._logger.debug("购物车商品数量为0,清空该商品", goodsItem, cartItem)
            }
            this.emit(CartEvent.CartItemChange, cartItem)
            this._logger.debug("购物车减购商品", goodsItem, cartItem)
            this._calculatePrice();
        }else{
            this._logger.warn("购物车减购商品失败,购物车里无此类商品", goodsItem)
        }
    }

    clear(): void {
        for(let id in this._cartItemMap){
            this._cartItemMap[id].minus(this._cartItemMap[id].num);
            this.emit(CartEvent.CartItemChange, this._cartItemMap[id])
            delete this._cartItemMap[id];
        }
        this._calculatePrice();
        this._logger.debug("购物车清空")
    }

    getCartItemCount(): number {
        return Object.values(this._cartItemMap).reduce((total, cartItem) => total + cartItem.num, 0);
    }

    getCartItems(): mall.CartItem[] {
        return Object.values(this._cartItemMap);
    }

    isEmpty(): boolean {
        return Object.values(this._cartItemMap).length <= 0;
    }

    loadCartItem(goodsItem: any, options?: any): mall.CartItem | null {
        return Object.values(this._cartItemMap).find(cartItem => cartItem.match(goodsItem, options)) || null;
    }

    groupCartItem(goodsItem: any): mall.CartItem[] {
        return Object.values(this._cartItemMap).filter(cartItem => cartItem.group(goodsItem));
    }

    /**
     * 计算价格
     * @protected
     */
    protected _calculatePrice(): void {
        this._totalPrice = Object.values(this._cartItemMap).reduce((total, cartItem) => total + cartItem.getTotalPrice(), 0);
        this.emit(CartEvent.CalculatePrice, this._totalPrice, this);
    }


}