import {logger} from "@/th4/mall/core/ILogger";

/**
 * 商品添加前置处理器插件
 */
export const GoodsItemAddPreparer = {

    /**
     * 插件ID
     */
    id: "GoodsItemAddPreparer",

    /**
     * 安装插件
     * @param cart
     */
    install(cart: mall.Cart) {
        // 强类型定义，避免 __ 污染原型
        const $cart = cart as mall.Cart & {
            __goodsItemAddPreparers: Array<(goodsItem: any, num: number, options?: any) => boolean>
            __addGoodsItem: typeof cart.addGoodsItem
            addGoodsItemAddPreparer: (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => void
            removeGoodsItemAddPreparer: (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => void
        }
        // 记录添加商品方法
        $cart.__addGoodsItem = cart.addGoodsItem;
        // 添加商品预处理
        $cart.__goodsItemAddPreparers = [];
        // 添加商品预处理方法
        $cart.addGoodsItemAddPreparer = (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => {
            if (!$cart.__goodsItemAddPreparers.includes(goodsItemPreparer)) {
                $cart.__goodsItemAddPreparers.push(goodsItemPreparer);
                logger.debug(`${this.id} 插件已添加该商品添加前置处理器`);
            }else{
                logger.warn(`${this.id} 插件已存在该商品添加前置处理器，请勿重复添加`);
            }
        }
        // 移除商品预处理方法
        $cart.removeGoodsItemAddPreparer = (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => {
            $cart.__goodsItemAddPreparers = $cart.__goodsItemAddPreparers.filter(item => item !== goodsItemPreparer);
        }

        // 重写添加商品方法
        $cart.addGoodsItem = (goodsItem: any, num: number, options?: any) => {
            for (let goodsItemPreparer of $cart.__goodsItemAddPreparers) {
                try {
                    if (!goodsItemPreparer(goodsItem, num, options)) {
                        logger.warn(`${this.id} 插件已取消添加商品`);
                        return;
                    }
                } catch (e) {
                    logger.error(`${this.id} 插件执行商品添加前置处理器异常`, e);
                    return;
                }
            }
            $cart.__addGoodsItem(goodsItem, num, options);
        }
    },
    uninstall(cart: mall.Cart) {
        // 强类型定义，避免 __ 污染原型
        const $cart = cart as mall.Cart & {
            __goodsItemAddPreparers: Array<(goodsItem: any, num: number, options?: any) => boolean>
            __addGoodsItem: typeof cart.addGoodsItem
        }
        if ($cart.__addGoodsItem) {
            $cart.addGoodsItem = $cart.__addGoodsItem;
        }
        if($cart.__goodsItemAddPreparers){
            // @ts-ignore
            delete $cart.__goodsItemPreparers
        }
        delete $cart.addGoodsItemAddPreparer
        delete $cart.removeGoodsItemAddPreparer
    }
}
/**
 * 扩展 mall.Cart 类型（必须加！TS 不报错）
 */
declare global {

    namespace mall {
        interface Cart {

            /**
             * 注册商品添加前置处理器
             * @optional 该方法由插件动态注入，并非 Cart 接口的强制实现
             */
            addGoodsItemAddPreparer?(goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean): void

            /**
             * 移除商品添加前置处理器
             * @optional 该方法由插件动态注入，并非 Cart 接口的强制实现
             */
            removeGoodsItemAddPreparer?(goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean): void
        }
    }
}