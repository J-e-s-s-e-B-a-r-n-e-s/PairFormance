import { RotationResponse } from "./RotationResponse";
import { assertNever } from "../../../Helpers/Extensions";
import { ComponentContext } from "../../../ComponentContext";

export class RotateObjectResponse implements RotationResponse {
    private readonly rotationProperty: { get: () => quat, set: (value: quat) => void };

    protected constructor(config: RotateObjectResponseConfig, _context: ComponentContext) {
        const targetObject = config.targetObject;
        this.rotationProperty = getRotationProperty(config.RotationSpace, targetObject);
    }

    applyDeltaRotation(deltaRotation: quat) {
        const currentRotation = this.rotationProperty.get();
        this.rotationProperty.set(currentRotation.multiply(deltaRotation));
    }

    static createFromConfig(config: RotateObjectResponseConfig, context: ComponentContext): RotateObjectResponse | null {
        if (!config.targetObject) {
            context.warn("RotateObjectResponse: No target object provided in config.");
            return null;
        }
        return new RotateObjectResponse(config, context);
    }
}

@typedef
export class RotateObjectResponseConfig {
    @input
    readonly targetObject!: SceneObject;

    @input("int")
    @widget(new ComboBoxWidget(["Local", "World"].map((v, i) => new ComboBoxItem(v, i))))
    readonly RotationSpace: RotationSpace = 0;
}

export enum RotationSpace {
    Local,
    World,
}

function getRotationProperty(
    rotationSpace: RotationSpace,
    targetObject: SceneObject,
): { get: () => quat, set: (value: quat) => void } {
    const transform = targetObject.getTransform();
    switch (rotationSpace) {
        case RotationSpace.Local:
            return {
                get: () => transform.getLocalRotation(),
                set: (value: quat) => transform.setLocalRotation(value),
            };
        case RotationSpace.World:
            return {
                get: () => transform.getWorldRotation(),
                set: (value: quat) => transform.setWorldRotation(value),
            };
        default:
            assertNever(rotationSpace, "rotationSpace");
    }
}
