import {IComponent} from "@/th4/mall/core/IComponent";

export class IFactory<T extends mall.Component> extends IComponent implements mall.Factory<T> {

    init() {

    }

    create(data: any, options?: any): T {
        throw new Error("Method not implemented.")
    }
}