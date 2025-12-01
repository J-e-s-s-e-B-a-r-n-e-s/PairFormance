"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotationComponentApiResponse = void 0;
const BaseComponentApiResponse_1 = require("../BaseComponentApiResponse");
class RotationComponentApiResponse {
    constructor(base) {
        this.base = base;
    }
    applyDeltaRotation(rotation) {
        this.base.trigger(rotation);
    }
    static createFromConfig(config, context) {
        const base = BaseComponentApiResponse_1.BaseComponentApiResponse.createFromConfig(config, context);
        return base ? new RotationComponentApiResponse(base) : null;
    }
}
exports.RotationComponentApiResponse = RotationComponentApiResponse;
//# sourceMappingURL=ComponentApiResponse.js.map