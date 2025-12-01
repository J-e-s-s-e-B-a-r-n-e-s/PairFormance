import { InputAction } from "../../Input Action";
import { DiscreteActionAdapter } from "./DiscreteActionAdapter";
import { DiscreteResponse, DiscreteResponseConfig } from "./Responses/DiscreteResponse";
import { assertNever } from "../../Helpers/Extensions";
import { InteractionComponentDiscreteAdapter, InteractionComponentDiscreteAdapterConfig } from "./InteractionComponentDiscreteAdapter";
import { ComponentContext } from "../../ComponentContext";
import { FaceEventDiscreteAdapter, FaceEventDiscreteAdapterConfig } from "./FaceEventDiscreteAdapter";

export class DiscreteInputAction implements InputAction {
    constructor(adapter: DiscreteActionAdapter, responses: Iterable<DiscreteResponse>) {
        for (const response of responses) {
            adapter.onAction.subscribe(() => response.trigger());
        }
    }

    static createFromConfig(config: DiscreteInputActionConfig, context: ComponentContext): DiscreteInputAction | null {
        const adapter = function fetchAdapter() {
            switch (config.inputType) {
                case DiscreteInputType.InteractionComponent:
                    return InteractionComponentDiscreteAdapter.createFromConfig(config.interactionComponentConfig, context);
                case DiscreteInputType.FaceEvent:
                    return FaceEventDiscreteAdapter.createFromConfig(config.faceEventConfig, context);
                default:
                    assertNever(config.inputType, "DiscreteInputType");
            }
        }();
        if (!adapter) {
            return null;
        }
        const responses = config.responses
            .map(responseConfig => DiscreteResponse.createFromConfig(responseConfig, context))
            .filter(response => !!response);
        return new DiscreteInputAction(adapter, responses);
    }
}

@typedef
export class DiscreteInputActionConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Interaction Component", "Face Event"].map((v, i) => new ComboBoxItem(v, i))))
    readonly inputType!: DiscreteInputType;

    @input
    @showIf("inputType", 0)
    @label("Interaction Component Settings")
    readonly interactionComponentConfig!: InteractionComponentDiscreteAdapterConfig;

    @input
    @showIf("inputType", 1)
    @label("Face Event Settings")
    readonly faceEventConfig!: FaceEventDiscreteAdapterConfig;

    @input
    @label("<h4><font color='#44C4C4'>Event Responses: ⤵")
    readonly responses!: DiscreteResponseConfig[];
}

enum DiscreteInputType {
    InteractionComponent,
    FaceEvent,
}
