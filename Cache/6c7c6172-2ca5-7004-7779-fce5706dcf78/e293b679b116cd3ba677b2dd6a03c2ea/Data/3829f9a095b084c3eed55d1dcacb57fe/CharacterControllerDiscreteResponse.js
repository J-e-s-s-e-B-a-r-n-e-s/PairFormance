"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterControllerDiscreteResponseConfig = exports.CharacterControllerDiscreteResponse = void 0;
const Extensions_1 = require("../../../Helpers/Extensions");
class CharacterControllerDiscreteResponse {
    constructor(characterController, responseFunctor, _context) {
        this.characterController = characterController;
        this.responseFunctor = responseFunctor;
    }
    trigger() {
        this.responseFunctor(this.characterController);
    }
    static createFromConfig(config, context) {
        if (!config.characterController) {
            context.warn("CharacterControllerDiscreteResponse: No character controller provided in config.");
            return null;
        }
        const responseFunctor = function fetchResponse() {
            switch (config.responseType) {
                case CharacterControllerDiscreteResponseType.SetPosition:
                    return (characterController) => {
                        characterController.setPosition(config.position);
                    };
                case CharacterControllerDiscreteResponseType.Jump:
                    return (characterController) => {
                        characterController.jump();
                    };
                case CharacterControllerDiscreteResponseType.CharacterAction:
                    if (config.actionName.length < 1) {
                        context.warn("CharacterControllerDiscreteResponse: No action name provided in config. Skipping response.");
                        return null;
                    }
                    return (characterController) => {
                        characterController.startAction(config.actionName);
                    };
                default:
                    (0, Extensions_1.assertNever)(config.responseType, "CharacterControllerDiscreteResponseType");
            }
        }();
        if (!responseFunctor) {
            return null;
        }
        return new CharacterControllerDiscreteResponse(config.characterController, responseFunctor, context);
    }
}
exports.CharacterControllerDiscreteResponse = CharacterControllerDiscreteResponse;
class CharacterControllerDiscreteResponseConfig {
}
exports.CharacterControllerDiscreteResponseConfig = CharacterControllerDiscreteResponseConfig;
var CharacterControllerDiscreteResponseType;
(function (CharacterControllerDiscreteResponseType) {
    CharacterControllerDiscreteResponseType[CharacterControllerDiscreteResponseType["SetPosition"] = 0] = "SetPosition";
    CharacterControllerDiscreteResponseType[CharacterControllerDiscreteResponseType["Jump"] = 1] = "Jump";
    CharacterControllerDiscreteResponseType[CharacterControllerDiscreteResponseType["CharacterAction"] = 2] = "CharacterAction";
})(CharacterControllerDiscreteResponseType || (CharacterControllerDiscreteResponseType = {}));
//# sourceMappingURL=CharacterControllerDiscreteResponse.js.map