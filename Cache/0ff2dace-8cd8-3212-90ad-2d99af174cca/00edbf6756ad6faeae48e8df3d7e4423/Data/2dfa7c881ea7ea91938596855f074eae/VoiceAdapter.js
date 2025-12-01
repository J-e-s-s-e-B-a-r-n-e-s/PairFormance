"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceAdapterConfig = exports.VoiceAdapter = void 0;
const UnhandledEvent_1 = require("../../Helpers/UnhandledEvent");
const VoiceAnalyzer_1 = require("../../Helpers/VoiceAnalyzer");
const ScalarEasing_1 = require("./ScalarEasing");
const Extensions_1 = require("../../Helpers/Extensions");
const SAMPLE_RATE = 16000; // 16kHz sample rate for better performance
const DEFAULT_MULTIPLIER = 50; // Multiplier to scale the RMS value to a more usable range
class VoiceAdapter {
    constructor(microphoneAudioProvider, easing, context) {
        this._onValueChange = new UnhandledEvent_1.UnhandledEvent();
        this.onValueChange = this._onValueChange.immutable();
        if (easing) {
            this.onValueChange = (0, Extensions_1.easeEvent)(this._onValueChange, easing, 0);
        }
        this.voiceAnalyzer = new VoiceAnalyzer_1.VoiceAnalyzer(microphoneAudioProvider);
        context.doOnUpdate(() => this.onUpdate());
        microphoneAudioProvider.start();
    }
    onUpdate() {
        const frameValue = this.voiceAnalyzer.processFrame();
        if (frameValue !== null) {
            this._onValueChange.notify(frameValue * DEFAULT_MULTIPLIER);
        }
    }
    static createFromConfig(config, context) {
        let easing = null;
        if (config.enableEasing) {
            easing = ScalarEasing_1.ScalarEasing.createFromConfig(config.easingConfig, context);
            if (!easing) {
                context.warn("VoiceAdapter: Failed to create easing from config.");
                return null;
            }
        }
        if (!config.microphoneAudioAsset) {
            context.warn("VoiceAdapter: No Microphone Audio asset assigned.");
            return null;
        }
        const control = config.microphoneAudioAsset.control;
        if (!control?.getTypeName()?.includes("MicrophoneAudioProvider")) {
            context.warn("VoiceAdapter: Assigned Audio asset is not a Microphone Audio.");
            return null;
        }
        control.sampleRate = SAMPLE_RATE;
        return new VoiceAdapter(control, easing, context);
    }
}
exports.VoiceAdapter = VoiceAdapter;
class VoiceAdapterConfig {
    constructor() {
        this.enableEasing = false;
    }
}
exports.VoiceAdapterConfig = VoiceAdapterConfig;
//# sourceMappingURL=VoiceAdapter.js.map