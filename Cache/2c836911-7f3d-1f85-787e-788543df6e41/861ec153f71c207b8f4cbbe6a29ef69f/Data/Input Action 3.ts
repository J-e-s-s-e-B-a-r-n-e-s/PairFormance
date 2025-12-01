import { RotationInputAction, RotationInputActionConfig } from "./InputActionTypes/Rotation/RotationInputAction";
import { assertNever } from "./Helpers/Extensions";
import { ComponentContext } from "./ComponentContext";
import { MovementInputAction, MovementInputActionConfig } from "./InputActionTypes/Movement/MovementInputAction";
import { DiscreteInputAction, DiscreteInputActionConfig } from "./InputActionTypes/Discrete/DiscreteInputAction";
import { ScalarInputAction, ScalarInputActionConfig } from "./InputActionTypes/Scalar/ScalarInputAction";

export interface InputAction {

}

@component
export class InputActionComponent extends BaseScriptComponent {
    @input("int")
    @widget(new ComboBoxWidget(["Movement", "Rotation", "Event", "Scalar"].map((v, i) => new ComboBoxItem(v, i))))
    readonly actionType: UserActionType = 2;

    @input
    @label("Action")
    @showIf("actionType", 0)
    readonly movementInput!: MovementInputActionConfig;

    @input
    @showIf("actionType", 1)
    readonly rotationInput!: RotationInputActionConfig;

    @input
    @showIf("actionType", 2)
    readonly discreteInput!: DiscreteInputActionConfig;

    @input
    @showIf("actionType", 3)
    readonly scalarInput!: ScalarInputActionConfig;

    @input
    @hint("Disables Snapchat gestures that might affect game experience, such as pinch to zoom or swipe to open popup. Useful for games that require full screen touch interaction.")
    private readonly enableTouchBlocking: boolean = true;

    @input
    private readonly printWarns: boolean = true;

    private context!: ComponentContext;

    onAwake() {
        this.context = new ComponentContext(this.getSceneObject(), this, this.printWarns);
        if (this.enableTouchBlocking) {
            global.touchSystem.touchBlocking = true;
        }

        this.createDerivedAction();
    }

    private createDerivedAction(): InputAction | null {
        switch (this.actionType) {
            case UserActionType.Direction:
                return MovementInputAction.createFromConfig(this.movementInput, this.context);
            case UserActionType.Rotation:
                return RotationInputAction.createFromConfig(this.rotationInput, this.context);
            case UserActionType.Discrete:
                return DiscreteInputAction.createFromConfig(this.discreteInput, this.context);
            case UserActionType.Scalar:
                return ScalarInputAction.createFromConfig(this.scalarInput, this.context);
            default:
                assertNever(this.actionType, "actionType");
        }
    }
}

export enum UserActionType {
    Direction,
    Rotation,
    Discrete,
    Scalar,
}
