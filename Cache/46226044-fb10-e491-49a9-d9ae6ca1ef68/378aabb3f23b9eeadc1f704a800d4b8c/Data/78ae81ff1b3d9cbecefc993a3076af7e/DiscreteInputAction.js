"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscreteInputActionConfig = exports.DiscreteInputAction = void 0;
const DiscreteResponse_1 = require("./Responses/DiscreteResponse");
const Extensions_1 = require("../../Helpers/Extensions");
const InteractionComponentDiscreteAdapter_1 = require("./InteractionComponentDiscreteAdapter");
const FaceEventDiscreteAdapter_1 = require("./FaceEventDiscreteAdapter");
class DiscreteInputAction {
    constructor(adapter, responses) {
        for (const response of responses) {
            adapter.onAction.subscribe(() => response.trigger());
        }
    }
    static createFromConfig(config, context) {
        const adapter = function fetchAdapter() {
            switch (config.inputType) {
                case DiscreteInputType.InteractionComponent:
                    return InteractionComponentDiscreteAdapter_1.InteractionComponentDiscreteAdapter.createFromConfig(config.interactionComponentConfig, context);
                case DiscreteInputType.FaceEvent:
                    return FaceEventDiscreteAdapter_1.FaceEventDiscreteAdapter.createFromConfig(config.faceEventConfig, context);
                default:
                    (0, Extensions_1.assertNever)(config.inputType, "DiscreteInputType");
            }
        }();
        if (!adapter) {
            return null;
        }
        const responses = config.responses
            .map(responseConfig => DiscreteResponse_1.DiscreteResponse.createFromConfig(responseConfig, context))
            .filter(response => !!response);
        return new DiscreteInputAction(adapter, responses);
    }
}
exports.DiscreteInputAction = DiscreteInputAction;
class DiscreteInputActionConfig {
}
exports.DiscreteInputActionConfig = DiscreteInputActionConfig;
var DiscreteInputType;
(function (DiscreteInputType) {
    DiscreteInputType[DiscreteInputType["InteractionComponent"] = 0] = "InteractionComponent";
    DiscreteInputType[DiscreteInputType["FaceEvent"] = 1] = "FaceEvent";
})(DiscreteInputType || (DiscreteInputType = {}));
//# sourceMappingURL=DiscreteInputAction.js.map