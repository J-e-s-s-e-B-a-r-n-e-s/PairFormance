import { UnhandledEvent } from "../../Helpers/UnhandledEvent";
import { ScalarAdapter } from "./ScalarAdapter";
import { ComponentContext } from "../../ComponentContext";
import { VoiceAnalyzer } from "../../Helpers/VoiceAnalyzer";
import { ScalarEasing, ScalarEasingConfig } from "./ScalarEasing";
import { easeEvent } from "../../Helpers/Extensions";

const SAMPLE_RATE = 16000; // 16kHz sample rate for better performance
const DEFAULT_MULTIPLIER = 50; // Multiplier to scale the RMS value to a more usable range

export class VoiceAdapter implements ScalarAdapter {
    private readonly voiceAnalyzer: VoiceAnalyzer;
    private readonly _onValueChange = new UnhandledEvent<[value: number]>();
    readonly onValueChange = this._onValueChange.immutable();

    constructor(
        microphoneAudioProvider: MicrophoneAudioProvider,
        easing: ScalarEasing | null,
        context: ComponentContext,
    ) {
        if (easing) {
            this.onValueChange = easeEvent(this._onValueChange, easing, 0);
        }
        this.voiceAnalyzer = new VoiceAnalyzer(microphoneAudioProvider);
        context.doOnUpdate(() => this.onUpdate());
        microphoneAudioProvider.start();
    }

    onUpdate() {
        const frameValue = this.voiceAnalyzer.processFrame();
        if (frameValue !== null) {
            this._onValueChange.notify(frameValue * DEFAULT_MULTIPLIER);
        }
    }

    static createFromConfig(config: VoiceAdapterConfig, context: ComponentContext): VoiceAdapter | null {
        let easing = null;
        if (config.enableEasing) {
            easing = ScalarEasing.createFromConfig(config.easingConfig, context);
            if (!easing) {
                context.warn("VoiceAdapter: Failed to create easing from config.");
                return null;
            }
        }

        if (!config.microphoneAudioAsset) {
            context.warn("VoiceAdapter: No Microphone Audio asset assigned.");
            return null;
        }

        const control = config.microphoneAudioAsset.control as MicrophoneAudioProvider;
        if (!control?.getTypeName()?.includes("MicrophoneAudioProvider")) {
            context.warn("VoiceAdapter: Assigned Audio asset is not a Microphone Audio.");
            return null;
        }
        control.sampleRate = SAMPLE_RATE;
        return new VoiceAdapter(control, easing, context);
    }
}

@typedef
export class VoiceAdapterConfig {
    @ui.label("To add Microphone Audio, press '<b></b><font size='5'>+</font></b>' in Asset Browser, select Audio → <font color='#44C4C4'>Microphone Audio</font>.")
    @input
    readonly microphoneAudioAsset!: AudioTrackAsset;
    @ui.label("<font color='#FFBB00'>Note: When using the Microphone Audio asset, Custom Remote API usage is restricted (ex. Leaderboard)")

    @input
    readonly enableEasing: boolean = false;

    @input
    @showIf("enableEasing")
    readonly easingConfig!: ScalarEasingConfig;
}
