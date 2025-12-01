import { BaseComponentApiResponse, ComponentApiResponseConfig } from "../../BaseComponentApiResponse";
import { ComponentContext } from "../../../ComponentContext";
import { MovementResponse } from "./MovementResponse";

type TArgs = [direction: vec3];

export class MovementComponentApiResponse implements MovementResponse {
    protected constructor(private base: BaseComponentApiResponse<TArgs>) {}

    move(velocity: vec3): void {
        this.base.trigger(velocity);
    }

    static createFromConfig(config: ComponentApiResponseConfig, context: ComponentContext): MovementComponentApiResponse | null {
        const base = BaseComponentApiResponse.createFromConfig<TArgs>(config, context);
        return base ? new MovementComponentApiResponse(base) : null;
    }
}
