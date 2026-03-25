import {ICartItem} from "@/th4/mall/cart/ICartItem";
import {Register} from "@/th4/mall/core/IFactory";
import {cartItemFactory} from "@/th4/mall/cart/factory/CartItemFactory";

/**
 * 有规格商品
 */
@Register<mall.CartItem>(cartItemFactory, (data: any,options: any) =>options,1)
export class SkuCartItem extends ICartItem {

    /**
     * 商品规格
     * @type {any}
     * @protected
     */
    protected _sku: any;

    constructor(data: any, options?: any) {
        super(data, options);
        this._sku = options;
    }

    match(goodsItem: any, options?: any): boolean {
        return super.match(goodsItem, options)&&options&&JSON.stringify(options)===JSON.stringify(this._sku);
    }
}