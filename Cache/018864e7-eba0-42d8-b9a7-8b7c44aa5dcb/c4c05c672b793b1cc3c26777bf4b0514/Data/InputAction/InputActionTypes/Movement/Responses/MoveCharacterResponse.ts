import { CharacterController } from "../../../Helpers/Declarations/CharacterController";
import { ComponentContext } from "../../../ComponentContext";
import { MovementResponse } from "./MovementResponse";

export class MoveCharacterResponse implements MovementResponse {
    private readonly characterController: CharacterController;
    private readonly movementSpeed: number;

    private constructor(config: MoveCharacterConfig, _context: ComponentContext) {
        this.characterController = config.characterController;
        this.movementSpeed = config.movementSpeed;
    }

    move(velocity: vec3): void {
        this.characterController.move(velocity.uniformScale(-1));
        this.characterController.setTargetSpeedModifier(velocity.length * this.movementSpeed);
    }

    static createFromConfig(config: MoveCharacterConfig, context: ComponentContext): MoveCharacterResponse | null {
        if (!config.characterController) {
            return null;
        }
        return new MoveCharacterResponse(config, context);
    }
}

@typedef
export class MoveCharacterConfig {
    @input
    readonly movementSpeed: number = 1;

    @input("Component.ScriptComponent")
    readonly characterController!: CharacterController;
}
