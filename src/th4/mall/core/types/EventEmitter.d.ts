/**
 * 商城
 */
namespace mall {
    /**
     * 事件驱动
     * @interface
     * @author SoMit
     */
    interface EventEmitter {

        /**
         * 添加事件监听
         * @param event 事件名称
         * @param listener 监听函数
         */
        on(event: string, listener: Function): void;

        /**
         * 移除事件监听
         * @param event 事件名称
         * @param listener 监听函数
         */
        off(event: string, listener: Function): void;

        /**
         * 触发事件
         * @param event 事件名称
         * @param args 参数
         */
        emit(event: string, ...args: any[]): void;

        /**
         * 添加一次事件监听
         * @param event 事件名称
         * @param listener 监听函数
         */
        once(event: string, listener: Function): void;
    }
}