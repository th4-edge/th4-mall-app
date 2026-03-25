namespace mall {
    /**
     * 购物车商品
     * @interface
     * @author SoMit
     */
    interface CartItem extends mall.Component {

        /**
         * 判断商品是否相等
         * @param goodsItem
         * @param options
         */
        match(goodsItem: any, options?: any): boolean;

        /**
         * 判断商品是否属于归类
         * @param goodsItem
         */
        group(goodsItem: any): boolean;

        /**
         * 增加商品数量
         * @param num
         */
        plus(num: number): void;

        /**
         * 减少商品数量
         * @param num
         */
        minus(num: number): void;

        /**
         * 使用优惠折扣
         * @param discount 优惠折扣
         */
        useDiscount(discount: Discount): void;

        /**
         * 取消使用优惠折扣
         * @param discount 优惠折扣
         */
        unUseDiscount(discount?: Discount): void;

        /**
         * 获取商品总价
         * @returns {number} 商品总价
         */
        getTotalPrice(): number;

        /**
         * 获取商品价格
         * @returns {number} 商品价格
         */
        get price(): number;

        /**
         * 获取商品数量
         * @returns {number} 商品数量
         */
        get num(): number;
    }
}