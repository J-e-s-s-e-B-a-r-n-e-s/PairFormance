import { UnhandledEvent } from "../../Helpers/UnhandledEvent";

export interface MovementAdapter {
    readonly onVelocityUpdate: UnhandledEvent.Immutable<[velocity: vec3]>;
}
