import { InputAction } from "../../Input Action";
import { ComponentContext } from "../../ComponentContext";
import { JoystickDirectionAdapterConfig, JoystickMovementAdapter } from "./JoystickMovementAdapter";
import { assertNever } from "../../Helpers/Extensions";
import { MovementResponse, MovementResponseConfig } from "./Responses/MovementResponse";

export class MovementInputAction implements InputAction {

    constructor(adapter: JoystickMovementAdapter, responses: Iterable<MovementResponse>) {
        for (const response of responses) {
            adapter.onVelocityUpdate.subscribe(velocity => {
                response.move(velocity);
            });
        }
    }

    static createFromConfig(config: MovementInputActionConfig, context: ComponentContext): MovementInputAction | null {
        const adapter = fetchAdapter();
        if (!adapter) {
            return null;
        }
        const responses = config.responses
            .map(responseConfig => MovementResponse.createFromConfig(responseConfig, context))
            .filter(response => !!response);

        return new MovementInputAction(adapter, responses);

        function fetchAdapter() {
            switch (config.inputType) {
                case DirectionInputType.Joystick:
                    return JoystickMovementAdapter.createFromConfig(config.joystickAdapterConfig, context);
                default:
                    assertNever(config.inputType, "DirectionInputType");
            }
        }
    }
}

@typedef
export class MovementInputActionConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Joystick"].map((v, i) => new ComboBoxItem(v, i))))
    readonly inputType!: DirectionInputType;

    @input
    @showIf("inputType", 0)
    @label("Joystick Settings")
    readonly joystickAdapterConfig!: JoystickDirectionAdapterConfig;

    @input
    @label("<h4><font color='#44C4C4'>Movement Responses: ⤵")
    readonly responses: MovementResponseConfig[] = [];
}

export enum DirectionInputType {
    Joystick,
}
