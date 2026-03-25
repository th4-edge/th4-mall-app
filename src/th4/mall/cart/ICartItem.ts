import {IComponent} from "@/th4/mall/core/IComponent";
import {cartItemFactory} from "@/th4/mall/cart/factory/CartItemFactory";
import {Register} from "@/th4/mall/core/IFactory";

/**
 * 默认购物车商品
 */
@Register<mall.CartItem>(cartItemFactory)
export class ICartItem extends IComponent implements mall.CartItem {

    /**
     * 商品价格(原价)
     * @type {number}
     * @protected
     */
    protected _price: number;

    /**
     * 商品数量
     * @type {number}
     * @protected
     */
    protected _num: number;

    constructor(data: any, options?: any) {
        super(data, options);
        this._price = data.price;
        this._num = 0;
    }



    get price(): number {
        return this._price;
    }


    get num(): number {
        return this._num;
    }

    getTotalPrice(): number {
        return this._price * this._num;
    }

    group(goodsItem: any): boolean {
        return this._data.id === goodsItem.id;
    }

    match(goodsItem: any, options?: any): boolean {
        return this._data.id === goodsItem.id;
    }

    minus(num: number = 1): void {
        this._num -= num;
    }

    plus(num: number = 1): void {
        this._num += num;
    }

    unUseDiscount(discount?: Discount): void {
    }

    useDiscount(discount: Discount): void {
    }

}