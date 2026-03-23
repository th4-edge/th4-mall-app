/**
 * 购物车
 * @interface
 * @author SoMit
 */
interface Cart extends Component {

    /**
     * 添加商品
     * @param product 商品数据
     * @param num 商品数量,默认为1
     */
    addProduct(product: Product, num: number = 1): void;

    /**
     * 移除商品
     * @param product 商品数据
     * @param num 移除商品数量,默认为1
     */
    removeProduct(product: Product, num: number = 1): void;

    /**
     * 购物车商品增加数量
     * @param cartItem 购物车商品
     * @param num 加商品数量,默认为1
     */
    plusCartItem(cartItem: CartItem, num: number = 1): void;

    /**
     * 购物车商品减少数量
     * @param cartItem 购物车商品
     * @param num 减商品数量,默认为1
     */
    minusCartItem(cartItem: CartItem, num: number = 1): void;

    /**
     * 加载购物车商品
     * @param product 商品数据
     * @return 匹配到的商品
     */
    loadCartItem(product: Product): CartItem;

    /**
     * 匹配购物车商品
     * @param product 购物车商品
     * @return 匹配到的商品列表
     */
    matchCartItem(product: Product): CartItem[];

    /**
     * 获取购物车商品
     */
    getCartItems(): CartProduct[];

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