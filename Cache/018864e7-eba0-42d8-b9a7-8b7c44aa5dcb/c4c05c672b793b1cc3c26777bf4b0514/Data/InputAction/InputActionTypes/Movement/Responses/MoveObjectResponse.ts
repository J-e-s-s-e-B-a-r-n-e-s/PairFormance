import { MovementResponse } from "./MovementResponse";
import { ComponentContext } from "../../../ComponentContext";
import { assertNever } from "../../../Helpers/Extensions";

export class MoveObjectResponse implements MovementResponse {
    private readonly positionProperty: { get: () => vec3, set: (value: vec3) => void };

    private constructor(
        private config: MoveObjectConfig,
        context: ComponentContext,
    ) {
        this.positionProperty = MovementSpace.getPositionProperty(config.movementSpace, config.targetObject);
    }

    move(velocity: vec3) {
        const translation = velocity.uniformScale(this.config.speed * getDeltaTime());
        const position = this.positionProperty.get();
        this.positionProperty.set(position.add(translation));
    }

    static createFromConfig(config: MoveObjectConfig, context: ComponentContext): MoveObjectResponse | null {
        if (!config.targetObject) {
            return null;
        }
        return new MoveObjectResponse(config, context);
    }
}

@typedef
export class MoveObjectConfig {
    @input
    readonly targetObject!: SceneObject;

    @input("float")
    readonly speed: number = 1.0;

    @input("int")
    @widget(new ComboBoxWidget(["Local", "World"].map((v, i) => new ComboBoxItem(v, i))))
    readonly movementSpace: MovementSpace = 0;
}

enum MovementSpace {
    Local,
    World,
}

namespace MovementSpace {
    export function getPositionProperty(
        movementSpace: MovementSpace,
        targetObject: SceneObject,
    ): { get: () => vec3, set: (value: vec3) => void } {
        const transform = targetObject.getTransform();
        switch (movementSpace) {
            case MovementSpace.Local:
                return {
                    get: () => transform.getLocalPosition(),
                    set: (value: vec3) => transform.setLocalPosition(value),
                };
            case MovementSpace.World:
                return {
                    get: () => transform.getWorldPosition(),
                    set: (value: vec3) => transform.setWorldPosition(value),
                };
            default:
                assertNever(movementSpace, "movementSpace");
        }
    }
}
