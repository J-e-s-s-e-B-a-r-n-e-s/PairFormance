import { CharacterControllerDiscreteResponse, CharacterControllerDiscreteResponseConfig } from "./CharacterControllerDiscreteResponse";
import { assertNever } from "../../../Helpers/Extensions";
import { ComponentContext } from "../../../ComponentContext";
import { ComponentApiResponseConfig } from "../../BaseComponentApiResponse";
import { DiscreteComponentApiResponse } from "./ComponentApiResponse";
import { BehaviorResponse, BehaviorResponseConfig } from "./BehaviorResponse";

export interface DiscreteResponse {
    trigger(): void;
}

export namespace DiscreteResponse {
    export function createFromConfig(config: DiscreteResponseConfig, context: ComponentContext): DiscreteResponse | null {
        switch (config.responseType) {
            case DiscreteResponseType.CharacterController:
                return CharacterControllerDiscreteResponse.createFromConfig(config.characterControllerConfig, context);
            case DiscreteResponseType.ComponentApi:
                return DiscreteComponentApiResponse.createFromConfig(config.componentApiResponseConfig, context);
            case DiscreteResponseType.Behavior:
                return BehaviorResponse.createFromConfig(config.behaviorResponseConfig, context);
            default:
                assertNever(config.responseType, "responseType");
        }
    }
}

@typedef
export class DiscreteResponseConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Character Controller", "Component API Call", "Behavior"]
        .map((v, i) => new ComboBoxItem(v, i))))
    readonly responseType!: DiscreteResponseType;

    @input
    @showIf("responseType", 0)
    @label("Character Controller Settings")
    readonly characterControllerConfig!: CharacterControllerDiscreteResponseConfig;

    @input
    @showIf("responseType", 1)
    readonly componentApiResponseConfig!: ComponentApiResponseConfig;

    @input
    @showIf("responseType", 2)
    @label("Behavior Custom Component integration.")
    readonly behaviorResponseConfig!: BehaviorResponseConfig;
}

enum DiscreteResponseType {
    CharacterController,
    ComponentApi,
    Behavior,
}
