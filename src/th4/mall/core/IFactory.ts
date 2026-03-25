import {IComponent} from "@/th4/mall/core/IComponent";

/**
 * 通用注册装饰器,适用所有工厂类,需要先进行类加载扫描
 * @param factory
 * @param rule
 * @param order
 * @constructor
 */
export const Register = <T>(
    factory: mall.Factory<any>,
    rule?: (data: any, options?: any) => boolean,
    order?: number) => {
    return <C extends { new(...args: any[]): T }>(constructor: C) => {
        // 自动注册到工厂
        factory.register(
            constructor,
            rule || (() => true),
            order
        );
    };
}

/**
 * 默认工厂模式
 */
export class IFactory<T extends mall.Component> extends IComponent implements mall.Factory<T> {

    /**
     * 注册器规则
     * @protected
     */
    protected _rules: {
        rule: (data: any, options?: any) => boolean,
        constructor: { new(data: any, options?: any): T },
        order: number
    }[];

    constructor() {
        super({});
        this._rules = [];
    }
    create(data: any, options?: any): T {
        for (let rule of this._rules) {
            if (rule.rule(data, options)) {
                return new rule.constructor(data, options);
            }
        }
        return null as any;
    }

    register(constructor: {
        new(data: any, options?: any): T
    }, rule: (data: any, options?: any) => boolean, order: number = 999): void {
        this._rules.push({rule, constructor, order});
        // 去重
        this._rules = this._rules.filter((item, index, arr) => arr.findIndex(i => i.constructor === item.constructor) === index)
        //
        this._rules.sort((a, b) => a.order - b.order)
    }
}