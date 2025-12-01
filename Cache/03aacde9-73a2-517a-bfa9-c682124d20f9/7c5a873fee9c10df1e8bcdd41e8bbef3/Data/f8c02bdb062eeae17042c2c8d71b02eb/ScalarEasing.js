"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalarEasingConfig = exports.ScalarEasing = void 0;
const Extensions_1 = require("../../Helpers/Extensions");
const DEFAULT_UPDATE_RATE_MODIFIER = 30;
var ScalarEasing;
(function (ScalarEasing) {
    function createFromConfig(config, context) {
        switch (config.easingType) {
            case EasingType.Exponential:
                return (previousValue, newValue, deltaTime) => {
                    const factor = 1 - Math.pow(1 - config.easingFactor, deltaTime * DEFAULT_UPDATE_RATE_MODIFIER);
                    return MathUtils.lerp(previousValue, newValue, factor);
                };
            default:
                return (0, Extensions_1.assertNever)(config.easingType, "EasingType");
        }
    }
    ScalarEasing.createFromConfig = createFromConfig;
})(ScalarEasing || (exports.ScalarEasing = ScalarEasing = {}));
class ScalarEasingConfig {
    constructor() {
        this.easingFactor = 0.4;
    }
}
exports.ScalarEasingConfig = ScalarEasingConfig;
var EasingType;
(function (EasingType) {
    EasingType[EasingType["Exponential"] = 0] = "Exponential";
})(EasingType || (EasingType = {}));
//# sourceMappingURL=ScalarEasing.js.map