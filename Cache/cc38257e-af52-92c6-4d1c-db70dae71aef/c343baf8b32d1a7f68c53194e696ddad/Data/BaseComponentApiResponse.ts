import { ComponentContext } from "../ComponentContext";

export class BaseComponentApiResponse<T extends [...any]> {
    protected constructor(private config: ComponentApiResponseConfig, private context: ComponentContext) {}

    trigger(...args: T): void {
        const method = (this.config.component as any)[this.config.methodName];
        if (typeof method === "function") {
            method.call(this.config.component, ...args);
        } else {
            this.context.warn(`: Method '${this.config.methodName}' not found on component. Skipping call.`);
        }
    }

    static createFromConfig<T extends [...any]>(config: ComponentApiResponseConfig, context: ComponentContext): BaseComponentApiResponse<T> | null {
        if (!config.component) {
            context.warn("ComponentApiResponse: No component provided in config.");
            return null;
        }
        if (config.methodName.length < 1) {
            context.warn("ComponentApiResponse: No method name provided in config.");
            return null;
        }
        return new BaseComponentApiResponse<T>(config, context);
    }
}

@typedef
export class ComponentApiResponseConfig {
    @ui.label("This response calls a specified method on a script component.")
    @input("Component.ScriptComponent")
    readonly component!: BaseScriptComponent;

    @input("string")
    @label("Method Name")
    readonly methodName: string = "";
}
