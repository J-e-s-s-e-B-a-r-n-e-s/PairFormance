import { DiscreteResponse } from "./DiscreteResponse";
import { BaseComponentApiResponse, ComponentApiResponseConfig } from "../../BaseComponentApiResponse";
import { ComponentContext } from "../../../ComponentContext";

type TArgs = [];

export class DiscreteComponentApiResponse extends BaseComponentApiResponse<TArgs> implements DiscreteResponse {
    static createFromConfig(config: ComponentApiResponseConfig, context: ComponentContext): DiscreteComponentApiResponse | null {
        return BaseComponentApiResponse.createFromConfig<TArgs>(config, context);
    }
}
