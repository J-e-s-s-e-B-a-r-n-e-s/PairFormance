"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentApiResponseConfig = exports.BaseComponentApiResponse = void 0;
class BaseComponentApiResponse {
    constructor(config, context) {
        this.config = config;
        this.context = context;
    }
    trigger(...args) {
        const method = this.config.component[this.config.methodName];
        if (typeof method === "function") {
            method.call(this.config.component, ...args);
        }
        else {
            this.context.warn(`: Method '${this.config.methodName}' not found on component. Skipping call.`);
        }
    }
    static createFromConfig(config, context) {
        if (!config.component) {
            context.warn("ComponentApiResponse: No component provided in config.");
            return null;
        }
        if (config.methodName.length < 1) {
            context.warn("ComponentApiResponse: No method name provided in config.");
            return null;
        }
        return new BaseComponentApiResponse(config, context);
    }
}
exports.BaseComponentApiResponse = BaseComponentApiResponse;
class ComponentApiResponseConfig {
    constructor() {
        this.methodName = "";
    }
}
exports.ComponentApiResponseConfig = ComponentApiResponseConfig;
//# sourceMappingURL=BaseComponentApiResponse.js.map