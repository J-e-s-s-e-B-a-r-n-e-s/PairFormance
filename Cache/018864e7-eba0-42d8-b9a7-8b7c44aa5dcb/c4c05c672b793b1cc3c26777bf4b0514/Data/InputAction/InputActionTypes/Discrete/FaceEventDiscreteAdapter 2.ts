import { DiscreteActionAdapter } from "./DiscreteActionAdapter";
import { ComponentContext } from "../../ComponentContext";
import { UnhandledEvent } from "../../Helpers/UnhandledEvent";
import { assertNever } from "../../Helpers/Extensions";

export class FaceEventDiscreteAdapter implements DiscreteActionAdapter {
    private readonly _onAction = new UnhandledEvent();
    readonly onAction = this._onAction.immutable();

    constructor(faceEventName: keyof EventNameMap, context: ComponentContext) {
        const event: FaceTrackingEvent = context.hostingScript.createEvent(faceEventName) as FaceTrackingEvent;
        event.bind(() => this._onAction.notify());
    }

    static createFromConfig(config: FaceEventDiscreteAdapterConfig, context: ComponentContext): FaceEventDiscreteAdapter | null {
        const type = config.faceEventType;
        const selectedIndex = (function getSelectedIndex() {
            switch (type) {
                case FaceEventType.Smile:
                    return config.smileEvent;
                case FaceEventType.Mouth:
                    return config.mouthEvent;
                case FaceEventType.Kiss:
                    return config.kissEvent;
                case FaceEventType.Brows:
                    return config.browsEvent;
                case FaceEventType.FaceTracking:
                    return config.faceTrackingEvent;
                default:
                    assertNever(type, "FaceEventType");
            }
        })();

        const options = FaceEventsMap[type];
        const eventName = options[selectedIndex];

        if (!eventName) {
            throw new Error("FaceEventDiscreteAdapter: Invalid event name.");
        }

        return new FaceEventDiscreteAdapter(eventName as any, context);
    }
}

@typedef
export class FaceEventDiscreteAdapterConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Smile", "Mouth", "Kiss", "Brows", "Face Tracking"].map((v, i) => new ComboBoxItem(v, i))))
    readonly faceEventType!: FaceEventType;

    @input("int")
    @showIf("faceEventType", 0)
    @widget(new ComboBoxWidget(["Smile Started", "Smile Finished"].map((v, i) => new ComboBoxItem(v, i))))
    readonly smileEvent!: number;

    @input("int")
    @showIf("faceEventType", 1)
    @widget(new ComboBoxWidget(["Mouth Opened", "Mouth Closed"].map((v, i) => new ComboBoxItem(v, i))))
    readonly mouthEvent!: number;

    @input("int")
    @showIf("faceEventType", 2)
    @widget(new ComboBoxWidget(["Kiss Started", "Kiss Finished"].map((v, i) => new ComboBoxItem(v, i))))
    readonly kissEvent!: number;

    @input("int")
    @showIf("faceEventType", 3)
    @widget(new ComboBoxWidget(["Brows Raised", "Brows Lowered", "Brows Returned to Normal"].map((v, i) => new ComboBoxItem(v, i))))
    readonly browsEvent!: number;

    @input("int")
    @showIf("faceEventType", 4)
    @widget(new ComboBoxWidget(["Face Found", "Face Lost"].map((v, i) => new ComboBoxItem(v, i))))
    readonly faceTrackingEvent!: number;
}

enum FaceEventType {
    Smile,
    Mouth,
    Kiss,
    Brows,
    FaceTracking,
}

const FaceEventsMap = {
    [FaceEventType.Smile]: ["SmileStartedEvent", "SmileFinishedEvent"],
    [FaceEventType.Mouth]: ["MouthOpenedEvent", "MouthClosedEvent"],
    [FaceEventType.Kiss]: ["KissStartedEvent", "KissFinishedEvent"],
    [FaceEventType.Brows]: ["BrowsRaisedEvent", "BrowsLoweredEvent", "BrowsReturnedToNormalEvent"],
    [FaceEventType.FaceTracking]: ["FaceFoundEvent", "FaceLostEvent"],
};
