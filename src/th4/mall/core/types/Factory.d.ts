/**
 * 商城模块
 */
namespace mall {
    /**
     * 工厂模式
     */
    interface Factory<T extends mall.Component> extends EventEmitter {

        /**
         * 创建实例
         * @param data 数据
         * @param options 选项
         */
        create(data: any, options?: any = {}): T;
    }
}