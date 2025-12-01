import { CharacterController } from "../../../Helpers/Declarations/CharacterController";
import { ComponentContext } from "../../../ComponentContext";
import { DiscreteResponse } from "./DiscreteResponse";
import { assertNever } from "../../../Helpers/Extensions";

type ResponseFunctor = (characterController: CharacterController) => void;

export class CharacterControllerDiscreteResponse implements DiscreteResponse {

    constructor(
        private readonly characterController: CharacterController,
        private readonly responseFunctor: ResponseFunctor,
        _context: ComponentContext
    ) {}

    trigger(): void {
        this.responseFunctor(this.characterController);
    }

    static createFromConfig(config: CharacterControllerDiscreteResponseConfig, context: ComponentContext): CharacterControllerDiscreteResponse | null {
        if (!config.characterController) {
            context.warn("CharacterControllerDiscreteResponse: No character controller provided in config.");
            return null;
        }

        const responseFunctor: ResponseFunctor | null = function fetchResponse() {
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
                    assertNever(config.responseType, "CharacterControllerDiscreteResponseType");
            }
        }();

        if (!responseFunctor) {
            return null;
        }

        return new CharacterControllerDiscreteResponse(config.characterController, responseFunctor, context);
    }
}

@typedef
export class CharacterControllerDiscreteResponseConfig {
    @input("Component.ScriptComponent")
    readonly characterController!: CharacterController;

    @input("int")
    @widget(new ComboBoxWidget(["Set Character Position", "Jump", "Start Character Action"]
        .map((v, i) => new ComboBoxItem(v, i))))
    readonly responseType!: CharacterControllerDiscreteResponseType;

    @input
    @showIf("responseType", 0)
    readonly position!: vec3;

    @input
    @showIf("responseType", 2)
    readonly actionName!: string;
}

enum CharacterControllerDiscreteResponseType {
    SetPosition,
    Jump,
    CharacterAction,
}
