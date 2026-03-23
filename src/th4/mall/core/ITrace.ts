import {logger} from "@/th4/mall/core/ILogger";

export class ITrace {

    /**
     * 日志对象
     * @type {mall.Logger}
     * @protected
     */
    protected _logger: mall.Logger;

    constructor() {
        this._logger = logger;
    }
}