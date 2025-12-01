import { MovementAdapter } from "./MovementAdapter";
import { JoystickInputConfig } from "../../InputTypes/Joystick/JoystickInput";
import { UnhandledEvent } from "../../Helpers/UnhandledEvent";

import { ComponentContext } from "../../ComponentContext";

import { JoystickWrapper } from "../../InputTypes/Joystick/JoystickWrapper";
import { assertNever } from "../../Helpers/Extensions";

export class JoystickMovementAdapter implements MovementAdapter {

    private readonly _onVelocityUpdate: UnhandledEvent<[direction: vec3]> = new UnhandledEvent();
    readonly onVelocityUpdate = this._onVelocityUpdate.immutable();

    constructor(
        private joystickWrapper: JoystickWrapper,
        private projectionPlane: vec3 | null,
        private projectionCamera: Camera | null,
        context: ComponentContext,
    ) {
        if (projectionPlane && !projectionCamera) {
            context.warn("Projection camera is not set, using world space projection. If character camera is not static, please set it in the config.");
        }

        context.doOnUpdate(deltaTime => this.onUpdate(deltaTime));
    }

    private onUpdate(deltaTime: number) {
        const direction = this.projectDirection(this.joystickWrapper.direction);
        if (direction.lengthSquared > 0) {
            this._onVelocityUpdate.notify(direction);
        }
    }

    private projectDirection(direction: vec2): vec3 {
        if (!this.projectionPlane) {
            return new vec3(direction.x, direction.y, 0);
        }

        const length = direction.length;
        if (length < 0.001) {
            return vec3.zero();
        }
        const cameraTransform = this.projectionCamera?.getTransform()?.getWorldTransform() ?? mat4.identity();
        const right = cameraTransform.multiplyDirection(vec3.right()).projectOnPlane(this.projectionPlane);
        const rotation = quat.lookAt(this.projectionPlane, right.cross(this.projectionPlane));

        return rotation.multiplyVec3(new vec3(direction.x, direction.y, 0)).normalize()
            .uniformScale(length);
    }

    static createFromConfig(config: JoystickDirectionAdapterConfig, context: ComponentContext): JoystickMovementAdapter | null {
        const joystickWrapper = JoystickWrapper.createFromConfig(config.joystickInputConfig, context);
        if (!joystickWrapper) {
            return null;
        }
        const projectionPlane = config.projectOnPlane ? JoystickDirectionAdapterConfig.fetchProjectionPlane(config) : null;

        return new JoystickMovementAdapter(joystickWrapper, projectionPlane, config.projectionCamera, context);
    }
}

@typedef
export class JoystickDirectionAdapterConfig {
    @input
    readonly joystickInputConfig!: JoystickInputConfig;

    @input
    @label("Constrain to Plane")
    readonly projectOnPlane: boolean = true;

    @ui.group_start("Plane Settings")
    @showIf("projectOnPlane")

    @input
    @label("Reference Camera")
    @hint("Camera used to project the joystick direction onto a plane. <br>Projects the direction relative to the camera's view. <br><font color='#FFAAAA'>If empty, world space is used.")
    readonly projectionCamera!: Camera;

    @input("int")
    @widget(new ComboBoxWidget(["XZ (Horizontal)", "XY (Front)", "Custom"].map((v, i) => new ComboBoxItem(v, i))))
    readonly planePreset: PlanePreset = 0;

    @ui.label("<font size = 2>Custom Plane Normal, normalized automatically.")
    @showIf("planePreset", 2)

    @input
    @showIf("planePreset", 2)
    readonly customPlane: vec3 = new vec3(0, 1, 0);

    @ui.group_end

    @input
    @showIf("__stub", -1)
    // @ts-ignore
    private readonly __stub!: number;
}

export namespace JoystickDirectionAdapterConfig {
    export function fetchProjectionPlane(config: JoystickDirectionAdapterConfig): vec3 {
        switch (config.planePreset) {
            case PlanePreset.XZ:
                return vec3.up();
            case PlanePreset.XY:
                return vec3.forward();
            case PlanePreset.Custom:
                return config.customPlane;
            default:
                assertNever(config.planePreset, "planePreset");
        }
    }
}

enum PlanePreset {
    XZ,
    XY,
    Custom,
}
