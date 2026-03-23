import {IEventEmitter} from "@/th4/mall/core/IEventEmitter";

/**
 * 基础组件
 */
export class IComponent extends IEventEmitter implements mall.Component {

    /**
     * 组件ID自增长序列码
     * @type {number}
     * @private
     */
    private static _serialNo: number = 0;

    /**
     * 数据
     * type {object}
     * @protected
     */
    protected _data: any;

    /**
     * 配置项
     * type {object}
     * @protected
     */
    protected _options: any;

    /**
     * 组件ID
     * @type {string}
     * @protected
     */
    protected _id:string;

    /**
     * 组件类型
     * @type {string}
     * @protected
     */
    protected _type: string;

    /**
     * 插件
     * @type {Plugin[]}
     * @protected
     */
    protected _plugins: {[key:string]: mall.Plugin};

    /**
     * 构造函数
     * @param _data 数据
     * @param options 配置项
     */
    constructor(_data: any,options?: any) {
        super();
        this._data = _data;
        this._options = options;
        this._type=this.constructor.name;
        this._id = this._type + IComponent._serialNo++;
        this._plugins = {};
    }

    removePlugin(plugin: mall.Plugin): void {
        if(plugin.id in this._plugins){
            plugin.uninstall&&plugin.uninstall(this);
            delete this._plugins[plugin.id];
            this._logger.info("插件["+plugin.id+"]已卸载");
        }else{
            this._logger.warn("插件["+plugin.id+"]不存在");
        }
    }

    usePlugin(plugin: mall.Plugin): void {
        if(plugin.id in this._plugins){
            this._logger.warn("插件["+plugin.id+"]已存在");
        }else{
            this._plugins[plugin.id] = plugin;
            plugin.install(this);
            this._logger.info("插件["+plugin.id+"]已安装");
        }
    }
    get id(): string {
        return this._id;
    }

    get type(): string {
        return this._type;
    }

    get data(): any {
        return this._data;
    }
}