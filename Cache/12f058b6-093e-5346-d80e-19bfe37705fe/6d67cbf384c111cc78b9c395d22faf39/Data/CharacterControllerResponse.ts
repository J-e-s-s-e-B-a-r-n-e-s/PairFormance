import { ComponentContext } from "../../../ComponentContext";
import { ScalarResponse } from "./ScalarResponse";
import { CharacterController } from "../../../Helpers/Declarations/CharacterController";
import { assertNever } from "../../../Helpers/Extensions";

export class CharacterControllerResponse implements ScalarResponse {
    private readonly valueCallback: (value: number) => void;

    constructor(config: CharacterControllerResponseConfig, _context: ComponentContext) {
        const characterController = config.characterController;
        this.valueCallback = function fetchCallback() {
            switch (config.responseType) {
                case ResponseType.SetSpeed:
                    return (value: number) => characterController.setMoveSpeed(value);
                default:
                    assertNever(config.responseType, "CharacterControllerResponseType");
            }
        }();

    }

    setValue(value: number): void {
        this.valueCallback(value);
    }

    static createFromConfig(config: CharacterControllerResponseConfig, context: ComponentContext): CharacterControllerResponse | null {
        if (!config.characterController) {
            context.warn("CharacterControllerResponse: No CharacterController component provided in config.");
            return null;
        }
        return new CharacterControllerResponse(config, context);
    }

}

@typedef
export class CharacterControllerResponseConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Set Movement Speed"].map((v, i) => new ComboBoxItem(v, i))))
    readonly responseType!: ResponseType;

    @input("Component.ScriptComponent")
    @label("Character Controller Component")
    readonly characterController!: CharacterController;
}

enum ResponseType {
    SetSpeed,
}
