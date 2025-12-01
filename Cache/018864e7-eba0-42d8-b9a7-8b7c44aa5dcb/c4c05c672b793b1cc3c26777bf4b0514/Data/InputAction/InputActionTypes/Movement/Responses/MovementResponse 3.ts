import { assertNever } from "../../../Helpers/Extensions";
import { MoveObjectConfig, MoveObjectResponse } from "./MoveObjectResponse";
import { ComponentContext } from "../../../ComponentContext";
import { MoveCharacterConfig, MoveCharacterResponse } from "./MoveCharacterResponse";
import { ComponentApiResponseConfig } from "../../BaseComponentApiResponse";
import { MovementComponentApiResponse } from "./ComponentApiResponse";

export interface MovementResponse {
    move(velocity: vec3): void;
}

export namespace MovementResponse {
    export function createFromConfig(config: MovementResponseConfig, context: ComponentContext): MovementResponse | null {
        switch (config.responseType) {
            case DirectionResponseType.MoveObject:
                return MoveObjectResponse.createFromConfig(config.moveObjectResponseConfig, context);
            case DirectionResponseType.MoveCharacter:
                return MoveCharacterResponse.createFromConfig(config.moveCharacterResponseConfig, context);
            case DirectionResponseType.ComponentApiResponse:
                return MovementComponentApiResponse.createFromConfig(config.componentApiResponseConfig, context);
            default:
                assertNever(config.responseType, "responseType");
        }
    }
}

@typedef
export class MovementResponseConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Move Object", "Move Character", "Component API Response"].map((v, i) => new ComboBoxItem(v, i))))
    readonly responseType!: DirectionResponseType;

    @input
    @showIf("responseType", 0)
    @label("Movement Settings")
    readonly moveObjectResponseConfig!: MoveObjectConfig;

    @input
    @showIf("responseType", 1)
    @label("Character Settings")
    readonly moveCharacterResponseConfig!: MoveCharacterConfig;

    @input
    @showIf("responseType", 2)
    @label("Component API Settings")
    readonly componentApiResponseConfig!: ComponentApiResponseConfig;
}

enum DirectionResponseType {
    MoveObject,
    MoveCharacter,
    ComponentApiResponse,
}
