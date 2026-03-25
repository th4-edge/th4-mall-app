import {logger} from "@/th4/mall/core/ILogger";

/**
 * 商品减购前置处理器插件
 */
export const GoodsItemRemovePreparer = {

    /**
     * 插件ID
     */
    id: "GoodsItemRemovePreparer",

    /**
     * 安装插件
     * @param cart
     */
    install(cart: mall.Cart) {
        // 强类型定义，避免 __ 污染原型
        const $cart = cart as mall.Cart & {
            __goodsItemRemovePreparers: Array<(goodsItem: any, num: number, options?: any) => boolean>
            __removeGoodsItem: typeof cart.removeGoodsItem
            addGoodsItemRemovePreparer: (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => void
            removeGoodsItemRemovePreparer: (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => void
        }
        // 记录添加商品方法
        $cart.__removeGoodsItem = cart.removeGoodsItem;
        // 添加商品预处理
        $cart.__goodsItemRemovePreparers = [];
        // 添加商品预处理方法
        $cart.addGoodsItemRemovePreparer = (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => {
            if (!$cart.__goodsItemRemovePreparers.includes(goodsItemPreparer)) {
                $cart.__goodsItemRemovePreparers.push(goodsItemPreparer);
                logger.debug(`${this.id} 插件已添加该商品减购前置处理器`);
            }else{
                logger.warn(`${this.id} 插件已存在该商品减购前置处理器，请勿重复添加`);
            }
        }
        // 移除商品预处理方法
        $cart.removeGoodsItemRemovePreparer = (goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean) => {
            $cart.__goodsItemRemovePreparers = $cart.__goodsItemRemovePreparers.filter(item => item !== goodsItemPreparer);
        }

        // 重写添加商品方法
        $cart.removeGoodsItem = (goodsItem: any, num: number, options?: any) => {
            for (let goodsItemPreparer of $cart.__goodsItemRemovePreparers) {
                try {
                    if (!goodsItemPreparer(goodsItem, num, options)) {
                        logger.warn(`${this.id} 插件已取消减购商品`);
                        return;
                    }
                } catch (e) {
                    logger.error(`${this.id} 插件执行商品减购前置处理器异常`, e);
                    return;
                }
            }
            $cart.__removeGoodsItem(goodsItem, num, options);
        }
    },
    uninstall(cart: mall.Cart) {
        // 强类型定义，避免 __ 污染原型
        const $cart = cart as mall.Cart & {
            __goodsItemRemovePreparers: Array<(goodsItem: any, num: number, options?: any) => boolean>
            __removeGoodsItem: typeof cart.removeGoodsItem
        }
        if ($cart.__removeGoodsItem) {
            $cart.removeGoodsItem = $cart.__removeGoodsItem;
        }
        if($cart.__goodsItemRemovePreparers){
            // @ts-ignore
            delete $cart.__goodsItemRemovePreparers
        }
        delete $cart.addGoodsItemRemovePreparer
        delete $cart.removeGoodsItemRemovePreparer
    }
}
/**
 * 扩展 mall.Cart 类型（必须加！TS 不报错）
 */
declare global {

    namespace mall {
        interface Cart {

            /**
             * 注册商品减购前置处理器
             * @optional 该方法由插件动态注入，并非 Cart 接口的强制实现
             */
            addGoodsItemRemovePreparer?(goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean): void

            /**
             * 移除商品减购前置处理器
             * @optional 该方法由插件动态注入，并非 Cart 接口的强制实现
             */
            removeGoodsItemRemovePreparer?(goodsItemPreparer: (goodsItem: any, num: number, options?: any) => boolean): void
        }
    }
}