"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionInputType = exports.MovementInputActionConfig = exports.MovementInputAction = void 0;
const JoystickMovementAdapter_1 = require("./JoystickMovementAdapter");
const Extensions_1 = require("../../Helpers/Extensions");
const MovementResponse_1 = require("./Responses/MovementResponse");
class MovementInputAction {
    constructor(adapter, responses) {
        for (const response of responses) {
            adapter.onVelocityUpdate.subscribe(velocity => {
                response.move(velocity);
            });
        }
    }
    static createFromConfig(config, context) {
        const adapter = fetchAdapter();
        if (!adapter) {
            return null;
        }
        const responses = config.responses
            .map(responseConfig => MovementResponse_1.MovementResponse.createFromConfig(responseConfig, context))
            .filter(response => !!response);
        return new MovementInputAction(adapter, responses);
        function fetchAdapter() {
            switch (config.inputType) {
                case DirectionInputType.Joystick:
                    return JoystickMovementAdapter_1.JoystickMovementAdapter.createFromConfig(config.joystickAdapterConfig, context);
                default:
                    (0, Extensions_1.assertNever)(config.inputType, "DirectionInputType");
            }
        }
    }
}
exports.MovementInputAction = MovementInputAction;
class MovementInputActionConfig {
    constructor() {
        this.responses = [];
    }
}
exports.MovementInputActionConfig = MovementInputActionConfig;
var DirectionInputType;
(function (DirectionInputType) {
    DirectionInputType[DirectionInputType["Joystick"] = 0] = "Joystick";
})(DirectionInputType || (exports.DirectionInputType = DirectionInputType = {}));
//# sourceMappingURL=MovementInputAction.js.map