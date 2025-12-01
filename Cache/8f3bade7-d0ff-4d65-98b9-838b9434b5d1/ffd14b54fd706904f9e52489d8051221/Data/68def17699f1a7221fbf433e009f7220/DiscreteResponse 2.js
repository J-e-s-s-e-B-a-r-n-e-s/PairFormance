"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscreteResponseConfig = exports.DiscreteResponse = void 0;
const CharacterControllerDiscreteResponse_1 = require("./CharacterControllerDiscreteResponse");
const Extensions_1 = require("../../../Helpers/Extensions");
const ComponentApiResponse_1 = require("./ComponentApiResponse");
const BehaviorResponse_1 = require("./BehaviorResponse");
var DiscreteResponse;
(function (DiscreteResponse) {
    function createFromConfig(config, context) {
        switch (config.responseType) {
            case DiscreteResponseType.CharacterController:
                return CharacterControllerDiscreteResponse_1.CharacterControllerDiscreteResponse.createFromConfig(config.characterControllerConfig, context);
            case DiscreteResponseType.ComponentApi:
                return ComponentApiResponse_1.DiscreteComponentApiResponse.createFromConfig(config.componentApiResponseConfig, context);
            case DiscreteResponseType.Behavior:
                return BehaviorResponse_1.BehaviorResponse.createFromConfig(config.behaviorResponseConfig, context);
            default:
                (0, Extensions_1.assertNever)(config.responseType, "responseType");
        }
    }
    DiscreteResponse.createFromConfig = createFromConfig;
})(DiscreteResponse || (exports.DiscreteResponse = DiscreteResponse = {}));
class DiscreteResponseConfig {
}
exports.DiscreteResponseConfig = DiscreteResponseConfig;
var DiscreteResponseType;
(function (DiscreteResponseType) {
    DiscreteResponseType[DiscreteResponseType["CharacterController"] = 0] = "CharacterController";
    DiscreteResponseType[DiscreteResponseType["ComponentApi"] = 1] = "ComponentApi";
    DiscreteResponseType[DiscreteResponseType["Behavior"] = 2] = "Behavior";
})(DiscreteResponseType || (DiscreteResponseType = {}));
//# sourceMappingURL=DiscreteResponse%202.js.map