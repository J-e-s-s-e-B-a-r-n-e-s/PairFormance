import { ComponentContext } from "../../ComponentContext";
import { assertNever } from "../../Helpers/Extensions";

const DEFAULT_UPDATE_RATE_MODIFIER = 30;

export type ScalarEasing = (previousValue: number, newValue: number, deltaTime: number) => number;

export namespace ScalarEasing {
    export function createFromConfig(config: ScalarEasingConfig, context: ComponentContext): ScalarEasing {
        switch (config.easingType) {
            case EasingType.Exponential:
                return (previousValue: number, newValue: number, deltaTime: number) => {
                    const factor = 1 - Math.pow(1 - config.easingFactor, deltaTime * DEFAULT_UPDATE_RATE_MODIFIER);
                    return MathUtils.lerp(previousValue, newValue, factor);
                };
            default:
                return assertNever(config.easingType, "EasingType");
        }
    }
}

@typedef
export class ScalarEasingConfig {
    @input("int")
    @widget(new ComboBoxWidget(["Exponential (lerp)"].map((v, i) => new ComboBoxItem(v, i))))
    readonly easingType!: EasingType;

    @input
    @showIf("easingType", 0)
    @widget(new SliderWidget(0.01, 1))
    readonly easingFactor: number = 0.4;
}

enum EasingType {
    Exponential,
}
