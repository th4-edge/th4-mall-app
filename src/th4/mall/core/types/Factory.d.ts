/**
 * 商城模块
 */
namespace mall {
    /**
     * 工厂模式
     */
    interface Factory<T extends mall.Component> extends EventEmitter {

        /**
         * 注册
         * @param constructor 构造函数
         * @param rule 匹配规则
         * @param order 排序
         */
        register(constructor: new (data: any, options?: any) => T, rule: (data: any, options?: any) => boolean, order?: number): void;
        /**
         * 创建实例
         * @param data 数据
         * @param options 选项
         */
        create(data: any, options?: any): T;
    }
}