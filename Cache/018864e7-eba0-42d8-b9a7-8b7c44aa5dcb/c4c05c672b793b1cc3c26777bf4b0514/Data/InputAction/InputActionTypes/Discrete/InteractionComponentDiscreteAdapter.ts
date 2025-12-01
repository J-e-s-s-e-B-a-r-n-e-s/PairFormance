import { DiscreteActionAdapter } from "./DiscreteActionAdapter";
import { UnhandledEvent } from "../../Helpers/UnhandledEvent";
import { ComponentContext } from "../../ComponentContext";
import { assertNever } from "../../Helpers/Extensions";

export class InteractionComponentDiscreteAdapter implements DiscreteActionAdapter {
    private readonly _onAction = new UnhandledEvent();
    readonly onAction = this._onAction.immutable();

    constructor(config: InteractionComponentDiscreteAdapterConfig, context: ComponentContext) {
        const interactionComponent = config.interactionComponent;
        const event = function fetchEvent() {
            switch (config.actionType) {
                case InteractionComponentActionType.Tap:
                    return interactionComponent.onTap;
                case InteractionComponentActionType.TouchStart:
                    return interactionComponent.onTouchStart;
                case InteractionComponentActionType.TouchEnd:
                    return interactionComponent.onTouchEnd;
                case InteractionComponentActionType.onHoverEnter:
                    return interactionComponent.onHoverStart;
                case InteractionComponentActionType.onHoverExit:
                    return interactionComponent.onHoverEnd;
                default:
                    assertNever(config.actionType, "InteractionComponentActionType");
            }
        }();

        event.add(() => this._onAction.notify());
    }

    static createFromConfig(config: InteractionComponentDiscreteAdapterConfig, context: ComponentContext): InteractionComponentDiscreteAdapter | null {
        if (!config.interactionComponent) {
            context.warn("InteractionComponentDiscreteAdapter: No interaction component provided in config.");
            return null;
        }

        return new InteractionComponentDiscreteAdapter(config, context);
    }
}

@typedef
export class InteractionComponentDiscreteAdapterConfig {
    @input
    readonly interactionComponent!: InteractionComponent;

    @input("int")
    @widget(new ComboBoxWidget(["Tap", "TouchStart", "TouchEnd", "onHoverEnter", "onHoverExit"].map((v, i) => new ComboBoxItem(v, i))))
    readonly actionType!: InteractionComponentActionType;
}

enum InteractionComponentActionType {
    Tap,
    TouchStart,
    TouchEnd,
    onHoverEnter,
    onHoverExit,
}
