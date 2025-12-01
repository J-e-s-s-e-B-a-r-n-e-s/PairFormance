"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoystickDirectionAdapterConfig = exports.JoystickMovementAdapter = void 0;
const UnhandledEvent_1 = require("../../Helpers/UnhandledEvent");
const JoystickWrapper_1 = require("../../InputTypes/Joystick/JoystickWrapper");
const Extensions_1 = require("../../Helpers/Extensions");
class JoystickMovementAdapter {
    constructor(joystickWrapper, projectionPlane, projectionCamera, context) {
        this.joystickWrapper = joystickWrapper;
        this.projectionPlane = projectionPlane;
        this.projectionCamera = projectionCamera;
        this._onVelocityUpdate = new UnhandledEvent_1.UnhandledEvent();
        this.onVelocityUpdate = this._onVelocityUpdate.immutable();
        if (projectionPlane && !projectionCamera) {
            context.warn("Projection camera is not set, using world space projection. If character camera is not static, please set it in the config.");
        }
        context.doOnUpdate(deltaTime => this.onUpdate(deltaTime));
    }
    onUpdate(deltaTime) {
        const direction = this.projectDirection(this.joystickWrapper.direction);
        if (direction.lengthSquared > 0) {
            this._onVelocityUpdate.notify(direction);
        }
    }
    projectDirection(direction) {
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
    static createFromConfig(config, context) {
        const joystickWrapper = JoystickWrapper_1.JoystickWrapper.createFromConfig(config.joystickInputConfig, context);
        if (!joystickWrapper) {
            return null;
        }
        const projectionPlane = config.projectOnPlane ? JoystickDirectionAdapterConfig.fetchProjectionPlane(config) : null;
        return new JoystickMovementAdapter(joystickWrapper, projectionPlane, config.projectionCamera, context);
    }
}
exports.JoystickMovementAdapter = JoystickMovementAdapter;
class JoystickDirectionAdapterConfig {
    constructor() {
        this.projectOnPlane = true;
        this.planePreset = 0;
        this.customPlane = new vec3(0, 1, 0);
    }
}
exports.JoystickDirectionAdapterConfig = JoystickDirectionAdapterConfig;
(function (JoystickDirectionAdapterConfig) {
    function fetchProjectionPlane(config) {
        switch (config.planePreset) {
            case PlanePreset.XZ:
                return vec3.up();
            case PlanePreset.XY:
                return vec3.forward();
            case PlanePreset.Custom:
                return config.customPlane;
            default:
                (0, Extensions_1.assertNever)(config.planePreset, "planePreset");
        }
    }
    JoystickDirectionAdapterConfig.fetchProjectionPlane = fetchProjectionPlane;
})(JoystickDirectionAdapterConfig || (exports.JoystickDirectionAdapterConfig = JoystickDirectionAdapterConfig = {}));
var PlanePreset;
(function (PlanePreset) {
    PlanePreset[PlanePreset["XZ"] = 0] = "XZ";
    PlanePreset[PlanePreset["XY"] = 1] = "XY";
    PlanePreset[PlanePreset["Custom"] = 2] = "Custom";
})(PlanePreset || (PlanePreset = {}));
//# sourceMappingURL=JoystickMovementAdapter.js.map