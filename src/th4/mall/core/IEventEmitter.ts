import {ITrace} from "@/th4/mall/core/ITrace";

/**
 * 事件驱动基类
 * @author SoMit
 */
export class IEventEmitter extends ITrace implements mall.EventEmitter {

    /**
     * 事件监听器集合
     * @type {{[key: string]: Function[]}}
     * @protected
     */
    protected _listeners: { [key: string]: Function[] }

    constructor() {
        super();
        this._listeners = {};
    }

    emit(event: string, ...args: any[]): void {
        if (this._listeners[event]) {
            this._listeners[event].forEach(listener => {
                try{
                    listener(args);
                }catch (e){
                    this._logger.error(e);
                }
            });
        }
    }

    off(event: string, listener: Function): void {
        if (!(event in this._listeners)) {
            return
        }
        if (listener) {
            this._listeners[event] = this._listeners[event].filter(item => item !== listener);
        }else{
            delete this._listeners[event];
        }
    }

    on(event: string, listener: Function): void {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(listener);
    }

    once(event: string, listener: Function): void {

    }

}