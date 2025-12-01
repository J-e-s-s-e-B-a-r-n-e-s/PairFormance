import { RotationResponse } from "./Responses/RotationResponse";
import { BaseComponentApiResponse, ComponentApiResponseConfig } from "../BaseComponentApiResponse";
import { ComponentContext } from "../../ComponentContext";

type TArgs = [rotation: quat];

export class RotationComponentApiResponse implements RotationResponse {
    protected constructor(private base: BaseComponentApiResponse<TArgs>) {}

    applyDeltaRotation(rotation: quat): void {
        this.base.trigger(rotation);
    }

    static createFromConfig(config: ComponentApiResponseConfig, context: ComponentContext): RotationComponentApiResponse | null {
        const base = BaseComponentApiResponse.createFromConfig<TArgs>(config, context);
        return base ? new RotationComponentApiResponse(base) : null;
    }
}
