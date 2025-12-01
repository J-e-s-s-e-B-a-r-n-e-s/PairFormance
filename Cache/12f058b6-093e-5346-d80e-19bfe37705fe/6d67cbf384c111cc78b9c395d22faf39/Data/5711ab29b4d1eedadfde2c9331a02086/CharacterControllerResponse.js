"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterControllerResponseConfig = exports.CharacterControllerResponse = void 0;
const Extensions_1 = require("../../../Helpers/Extensions");
class CharacterControllerResponse {
    constructor(config, _context) {
        const characterController = config.characterController;
        this.valueCallback = function fetchCallback() {
            switch (config.responseType) {
                case ResponseType.SetSpeed:
                    return (value) => characterController.setMoveSpeed(value);
                default:
                    (0, Extensions_1.assertNever)(config.responseType, "CharacterControllerResponseType");
            }
        }();
    }
    setValue(value) {
        this.valueCallback(value);
    }
    static createFromConfig(config, context) {
        if (!config.characterController) {
            context.warn("CharacterControllerResponse: No CharacterController component provided in config.");
            return null;
        }
        return new CharacterControllerResponse(config, context);
    }
}
exports.CharacterControllerResponse = CharacterControllerResponse;
class CharacterControllerResponseConfig {
}
exports.CharacterControllerResponseConfig = CharacterControllerResponseConfig;
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["SetSpeed"] = 0] = "SetSpeed";
})(ResponseType || (ResponseType = {}));
//# sourceMappingURL=CharacterControllerResponse.js.map