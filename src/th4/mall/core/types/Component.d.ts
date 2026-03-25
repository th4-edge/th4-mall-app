/**
 * 商城模块
 */
namespace mall {
    /**
     * 组件
     * @author SoMit
     */
    interface Component extends mall.EventEmitter {

        /**
         * 组件ID
         * @type {string}
         */
        get id(): string;

        /**
         * 组件类型
         * @type {string}
         */
        get type(): string;

        /**
         * 组件数据
         * @type {any}
         */
        get data(): any;

        /**
         * 组件配置项
         */
        get options(): any;

        /**
         * 初始化
         */
        init?(): void;

        /**
         * 销毁
         */
        destroy?(): void;

        /**
         * 使用插件
         * @param plugin
         */
        usePlugin(plugin: mall.Plugin): void;

        /**
         * 移除插件
         * @param plugin
         */
        removePlugin(plugin: mall.Plugin): void;

    }
}