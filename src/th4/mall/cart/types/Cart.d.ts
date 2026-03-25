namespace mall {
    /**
     * 购物车
     * @interface
     * @author SoMit
     */
    interface Cart extends mall.Component {

        /**
         * 添加
         * @param goodsItem
         * @param num
         * @param options
         */
        addGoodsItem(goodsItem: any, num: number, options?: any): void;

        /**
         * 移除商品
         * @param goodsItem 商品数据
         * @param num 移除商品数量,默认为1
         * @param options
         */
        removeGoodsItem(goodsItem: Product, num: number, options?: any): void;

        /**
         * 加载购物车商品
         * @param goodsItem 商品数据
         * @param options
         * @return 匹配到的商品
         */
        loadCartItem(goodsItem: any, options?: any): CartItem | null;

        /**
         * 匹配购物车商品
         * @param product 购物车商品
         * @return 匹配到的商品列表
         */
        groupCartItem(product: any): CartItem[];

        /**
         * 获取购物车商品
         */
        getCartItems(): CartItem[];

        /**
         * 获取购物车商品数量
         * @return 购物车商品数量
         */
        getCartItemCount(): number;

        /**
         * 购物车是否为空
         * @return 购物车是否为空
         */
        isEmpty(): boolean;

        /**
         * 清空购物车
         */
        clear(): void;

        /**
         * 获取购物车商品总价
         * @return 购物车商品总价
         */
        get totalPrice(): number;
    }
}