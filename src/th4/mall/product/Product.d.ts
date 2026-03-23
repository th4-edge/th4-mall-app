/**
 * 点单商品,后端接口获取的商品信息封装成点单商品
 * @interface
 * @author SoMit
 */
interface Product {

    /**
     * 商品id
     * @type {string}
     * @description 商品id
     */
    id: string;
    /**
     * 商品价格
     * @type {number}
     * @description 商品价格
     */
    price: number;
}