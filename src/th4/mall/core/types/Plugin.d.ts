/**
 * 商城模块
 */
namespace mall {
    /**
     * 插件
     * @interface
     * @author SoMit
     */
    interface Plugin {
        /**
         * 插件ID
         */
        id: string;

        /**
         * 安装插件
         * @param app
         */
        install(app: any): void;

        /**
         * 卸载插件
         * @param app
         */
        uninstall?(app: any): void;
    }
}