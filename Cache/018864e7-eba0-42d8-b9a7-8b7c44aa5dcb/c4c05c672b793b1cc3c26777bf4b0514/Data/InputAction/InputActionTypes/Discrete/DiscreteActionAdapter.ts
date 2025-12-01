import { UnhandledEvent } from "../../Helpers/UnhandledEvent";

export interface DiscreteActionAdapter {
    readonly onAction: UnhandledEvent.Immutable;
}
