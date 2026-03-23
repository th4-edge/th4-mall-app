/**
 * 商城模块
 */
namespace mall {

    /**
     * 日志
     * @interface
     * @author SoMit
     */
    interface Logger {
        /**
         * 调试信息
         * @param args
         */
        debug(...args: any[]): void;

        /**
         * 警告信息
         * @param args
         */
        warn(...args: any[]): void;

        /**
         * 错误信息
         * @param args
         */
        error(...args: any[]): void;

        /**
         * 一般信息
         * @param args
         */
        info(...args: any[]): void;

        /**
         * 日志信息
         * @param args
         */
        log(...args: any[]): void;
    }
}