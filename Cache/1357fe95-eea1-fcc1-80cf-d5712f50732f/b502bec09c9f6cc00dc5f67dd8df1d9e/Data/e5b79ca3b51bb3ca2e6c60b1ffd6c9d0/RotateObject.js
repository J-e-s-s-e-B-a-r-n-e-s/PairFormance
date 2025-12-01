"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotationSpace = exports.RotateObjectResponseConfig = exports.RotateObjectResponse = void 0;
const Extensions_1 = require("../../../Helpers/Extensions");
class RotateObjectResponse {
    constructor(config, _context) {
        const targetObject = config.targetObject;
        this.rotationProperty = getRotationProperty(config.RotationSpace, targetObject);
    }
    applyDeltaRotation(deltaRotation) {
        const currentRotation = this.rotationProperty.get();
        this.rotationProperty.set(currentRotation.multiply(deltaRotation));
    }
    static createFromConfig(config, context) {
        if (!config.targetObject) {
            context.warn("RotateObjectResponse: No target object provided in config.");
            return null;
        }
        return new RotateObjectResponse(config, context);
    }
}
exports.RotateObjectResponse = RotateObjectResponse;
class RotateObjectResponseConfig {
    constructor() {
        this.RotationSpace = 0;
    }
}
exports.RotateObjectResponseConfig = RotateObjectResponseConfig;
var RotationSpace;
(function (RotationSpace) {
    RotationSpace[RotationSpace["Local"] = 0] = "Local";
    RotationSpace[RotationSpace["World"] = 1] = "World";
})(RotationSpace || (exports.RotationSpace = RotationSpace = {}));
function getRotationProperty(rotationSpace, targetObject) {
    const transform = targetObject.getTransform();
    switch (rotationSpace) {
        case RotationSpace.Local:
            return {
                get: () => transform.getLocalRotation(),
                set: (value) => transform.setLocalRotation(value),
            };
        case RotationSpace.World:
            return {
                get: () => transform.getWorldRotation(),
                set: (value) => transform.setWorldRotation(value),
            };
        default:
            (0, Extensions_1.assertNever)(rotationSpace, "rotationSpace");
    }
}
//# sourceMappingURL=RotateObject.js.map