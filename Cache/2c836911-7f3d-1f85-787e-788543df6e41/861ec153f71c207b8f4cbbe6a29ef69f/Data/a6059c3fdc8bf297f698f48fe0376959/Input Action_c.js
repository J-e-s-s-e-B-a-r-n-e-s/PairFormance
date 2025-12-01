if (script.onAwake) {
    script.onAwake();
    return;
}
/*
@typedef JoystickInputConfig
@ui {"widget":"label", "label":"<font color = '#55CCCC'>*Place the <a href='https://developers.snap.com/lens-studio/features/games/joystick'>Joystick&nbsp;Component</a> in the scene and reference it here."}
@property {Component.ScriptComponent} joystick
@property {bool} invertX {"label":"Invert X Axis"}
@property {bool} invertY {"label":"Invert Y Axis"}
*/
/*
@typedef JoystickDirectionAdapterConfig
@property {JoystickInputConfig} joystickInputConfig
@property {bool} projectOnPlane = true {"label":"Constrain to Plane"}
@ui {"widget":"group_start", "label":"Plane Settings", "showIf":"projectOnPlane"}
@property {Component.Camera} projectionCamera {"label":"Reference Camera", "hint":"Camera used to project the joystick direction onto a plane. <br>Projects the direction relative to the camera's view. <br><font color='#FFAAAA'>If empty, world space is used."}
@property {int} planePreset {"widget":"combobox", "values":[{"label":"XZ (Horizontal)", "value":0}, {"label":"XY (Front)", "value":1}, {"label":"Custom", "value":2}]}
@ui {"widget":"label", "label":"<font size = 2>Custom Plane Normal, normalized automatically.", "showIf":"planePreset", "showIfValue":2}
@property {vec3} customPlane = {0,1,0} {"showIf":"planePreset", "showIfValue":2}
@ui {"widget":"group_end"}
@property {float} __stub {"showIf":"__stub", "showIfValue":-1}
*/
/*
@typedef MoveObjectConfig
@property {SceneObject} targetObject
@property {float} speed = 1
@property {int} movementSpace {"widget":"combobox", "values":[{"label":"Local", "value":0}, {"label":"World", "value":1}]}
*/
/*
@typedef MoveCharacterConfig
@property {float} movementSpeed = 1
@property {Component.ScriptComponent} characterController
*/
/*
@typedef ComponentApiResponseConfig
@ui {"widget":"label", "label":"This response calls a specified method on a script component."}
@property {Component.ScriptComponent} component
@property {string} methodName {"label":"Method Name"}
*/
/*
@typedef MovementResponseConfig
@property {int} responseType {"widget":"combobox", "values":[{"label":"Move Object", "value":0}, {"label":"Move Character", "value":1}, {"label":"Component API Response", "value":2}]}
@property {MoveObjectConfig} moveObjectResponseConfig {"label":"Movement Settings", "showIf":"responseType", "showIfValue":0}
@property {MoveCharacterConfig} moveCharacterResponseConfig {"label":"Character Settings", "showIf":"responseType", "showIfValue":1}
@property {ComponentApiResponseConfig} componentApiResponseConfig {"label":"Component API Settings", "showIf":"responseType", "showIfValue":2}
*/
/*
@typedef MovementInputActionConfig
@property {int} inputType {"widget":"combobox", "values":[{"label":"Joystick", "value":0}]}
@property {JoystickDirectionAdapterConfig} joystickAdapterConfig {"label":"Joystick Settings", "showIf":"inputType", "showIfValue":0}
@property {MovementResponseConfig[]} responses = {} {"label":"<h4><font color='#44C4C4'>Movement Responses: ⤵"}
*/
/*
@typedef JoystickRotationAdapterConfig
@property {JoystickInputConfig} joystickInputConfig
@property {float} speed = 1
@property {bool} blockFlips = true {"hint":"Block from rotating upside down."}
*/
/*
@typedef GyroscopeRotationAdapterConfig
@property {bool} allowRollRotation
@property {bool} invertRotation
@property {int} rotationBlendMode = 1 {"widget":"combobox", "values":[{"label":"Additive", "value":0}, {"label":"Absolute", "value":1}]}
*/
/*
@typedef RotateObjectResponseConfig
@property {SceneObject} targetObject
@property {int} RotationSpace {"widget":"combobox", "values":[{"label":"Local", "value":0}, {"label":"World", "value":1}]}
*/
/*
@typedef RotationResponseConfig
@property {int} responseType {"widget":"combobox", "values":[{"label":"Rotate Object", "value":0}, {"label":"Component API Call", "value":1}]}
@property {RotateObjectResponseConfig} rotateObjectResponseConfig {"label":"Rotation Settings", "showIf":"responseType", "showIfValue":0}
@property {ComponentApiResponseConfig} componentApiResponseConfig {"label":"Component API Response Settings", "showIf":"responseType", "showIfValue":1}
*/
/*
@typedef RotationInputActionConfig
@property {int} inputType {"widget":"combobox", "values":[{"label":"Joystick", "value":0}, {"label":"Gyroscope", "value":1}]}
@property {JoystickRotationAdapterConfig} joystickAdapterConfig {"label":"Joystick Settings", "showIf":"inputType", "showIfValue":0}
@property {GyroscopeRotationAdapterConfig} gyroscopeAdapterConfig {"label":"Gyroscope Settings", "showIf":"inputType", "showIfValue":1}
@property {RotationResponseConfig[]} responses = {} {"label":"<h4><font color='#44C4C4'>Rotation Responses: ⤵"}
*/
/*
@typedef InteractionComponentDiscreteAdapterConfig
@property {Component.InteractionComponent} interactionComponent
@property {int} actionType {"widget":"combobox", "values":[{"label":"Tap", "value":0}, {"label":"TouchStart", "value":1}, {"label":"TouchEnd", "value":2}, {"label":"onHoverEnter", "value":3}, {"label":"onHoverExit", "value":4}]}
*/
/*
@typedef FaceEventDiscreteAdapterConfig
@property {int} faceEventType {"widget":"combobox", "values":[{"label":"Smile", "value":0}, {"label":"Mouth", "value":1}, {"label":"Kiss", "value":2}, {"label":"Brows", "value":3}, {"label":"Face Tracking", "value":4}]}
@property {int} smileEvent {"widget":"combobox", "values":[{"label":"Smile Started", "value":0}, {"label":"Smile Finished", "value":1}], "showIf":"faceEventType", "showIfValue":0}
@property {int} mouthEvent {"widget":"combobox", "values":[{"label":"Mouth Opened", "value":0}, {"label":"Mouth Closed", "value":1}], "showIf":"faceEventType", "showIfValue":1}
@property {int} kissEvent {"widget":"combobox", "values":[{"label":"Kiss Started", "value":0}, {"label":"Kiss Finished", "value":1}], "showIf":"faceEventType", "showIfValue":2}
@property {int} browsEvent {"widget":"combobox", "values":[{"label":"Brows Raised", "value":0}, {"label":"Brows Lowered", "value":1}, {"label":"Brows Returned to Normal", "value":2}], "showIf":"faceEventType", "showIfValue":3}
@property {int} faceTrackingEvent {"widget":"combobox", "values":[{"label":"Face Found", "value":0}, {"label":"Face Lost", "value":1}], "showIf":"faceEventType", "showIfValue":4}
*/
/*
@typedef CharacterControllerDiscreteResponseConfig
@property {Component.ScriptComponent} characterController
@property {int} responseType {"widget":"combobox", "values":[{"label":"Set Character Position", "value":0}, {"label":"Jump", "value":1}, {"label":"Start Character Action", "value":2}]}
@property {vec3} position {"showIf":"responseType", "showIfValue":0}
@property {string} actionName {"showIf":"responseType", "showIfValue":2}
*/
/*
@typedef BehaviorResponseConfig
@ui {"widget":"label", "label":"For more information, see <a href='https://developers.snap.com/lens-studio/lens-studio-workflow/adding-interactivity/behavior'>Behavior&nbsp;Documentation.</a>"}
@property {int} behaviorResponseType {"label":"Behavior trigger type", "widget":"combobox", "values":[{"label":"Global CustomTrigger", "value":0}, {"label":"Manual Trigger", "value":1}]}
@property {string} customTriggerName {"showIf":"behaviorResponseType", "showIfValue":0}
@property {Component.ScriptComponent} behaviorScript {"showIf":"behaviorResponseType", "showIfValue":1}
*/
/*
@typedef DiscreteResponseConfig
@property {int} responseType {"widget":"combobox", "values":[{"label":"Character Controller", "value":0}, {"label":"Component API Call", "value":1}, {"label":"Behavior", "value":2}]}
@property {CharacterControllerDiscreteResponseConfig} characterControllerConfig {"label":"Character Controller Settings", "showIf":"responseType", "showIfValue":0}
@property {ComponentApiResponseConfig} componentApiResponseConfig {"showIf":"responseType", "showIfValue":1}
@property {BehaviorResponseConfig} behaviorResponseConfig {"label":"Behavior Custom Component integration.", "showIf":"responseType", "showIfValue":2}
*/
/*
@typedef DiscreteInputActionConfig
@property {int} inputType {"widget":"combobox", "values":[{"label":"Interaction Component", "value":0}, {"label":"Face Event", "value":1}]}
@property {InteractionComponentDiscreteAdapterConfig} interactionComponentConfig {"label":"Interaction Component Settings", "showIf":"inputType", "showIfValue":0}
@property {FaceEventDiscreteAdapterConfig} faceEventConfig {"label":"Face Event Settings", "showIf":"inputType", "showIfValue":1}
@property {DiscreteResponseConfig[]} responses {"label":"<h4><font color='#44C4C4'>Event Responses: ⤵"}
*/
/*
@typedef ScalarEasingConfig
@property {int} easingType {"widget":"combobox", "values":[{"label":"Exponential (lerp)", "value":0}]}
@property {float} easingFactor = 0.4 {"widget":"slider", "min":0.01, "max":1, "showIf":"easingType", "showIfValue":0}
*/
/*
@typedef VoiceAdapterConfig
@ui {"widget":"label", "label":"To add Microphone Audio, press '<b></b><font size='5'>+</font></b>' in Asset Browser, select Audio → <font color='#44C4C4'>Microphone Audio</font>."}
@property {Asset.AudioTrackAsset} microphoneAudioAsset
@ui {"widget":"label", "label":"<font color='#FFBB00'>Note: When using the Microphone Audio asset, Custom Remote API usage is restricted (ex. Leaderboard)"}
@property {bool} enableEasing
@property {ScalarEasingConfig} easingConfig {"showIf":"enableEasing"}
*/
/*
@typedef WiredParamsAdapterConfig
@ui {"widget":"label", "label":"How to use:"}
@ui {"widget":"label", "label":"• Add the <a href='https://developers.snap.com/lens-studio/lens-studio-workflow/adding-interactivity/wired-parameters'>Wired&nbsp;Parameters</a> Component to your scene."}
@ui {"widget":"label", "label":"• Set its ‘Output&nbsp;Mode’ to 'Component' and select this <span style='color: #55CCCC'>Input&nbsp;Action</span> Component."}
@ui {"widget":"label", "label":"•  Set the Wired&nbsp;Parameters ‘Property&nbsp;Name’ to: <span style=\"color: #FFBB00; font-family: monospace;\">wiredParamsValue</span> (Copyable).</p>"}
@property {float} __stub {"showIf":"__stub", "showIfValue":-1}
*/
/*
@typedef RemapConfig
@property {float} inputMin
@property {float} inputMax = 1
@property {float} outputMin
@property {float} outputMax = 1
@property {bool} clampOutput = true
*/
/*
@typedef CharacterControllerResponseConfig
@property {int} responseType {"widget":"combobox", "values":[{"label":"Set Movement Speed", "value":0}]}
@property {Component.ScriptComponent} characterController {"label":"Character Controller Component"}
*/
/*
@typedef MapToMovementResponseConfig
@ui {"widget":"label", "label":"This response maps a scalar input to movement in a specified direction."}
@property {vec3} movementVector = {1,0,0}
@property {MovementResponseConfig} movementResponseConfig {"label":"Movement Response Settings"}
*/
/*
@typedef ScalarResponseConfig
@property {int} responseType {"widget":"combobox", "values":[{"label":"Character Controller", "value":0}, {"label":"Map To Movement", "value":1}, {"label":"Component API Call", "value":2}]}
@property {CharacterControllerResponseConfig} characterControllerResponseConfig {"label":"Character Controller Response Settings", "showIf":"responseType", "showIfValue":0}
@property {MapToMovementResponseConfig} mapToMovementResponseConfig {"label":"Map To Movement Response Settings", "showIf":"responseType", "showIfValue":1}
@property {ComponentApiResponseConfig} componentApiResponseConfig {"label":"Component API Response Settings", "showIf":"responseType", "showIfValue":2}
*/
/*
@typedef ScalarInputActionConfig
@property {int} inputType = 1 {"widget":"combobox", "values":[{"label":"Microphone Volume", "value":0}, {"label":"Wired Params", "value":1}]}
@property {VoiceAdapterConfig} voiceInputConfig {"label":"Volume Input Settings", "showIf":"inputType", "showIfValue":0}
@property {WiredParamsAdapterConfig} wiredParamsInputConfig {"label":"<h4>Wired Params Custom Component Config</h4>", "showIf":"inputType", "showIfValue":1}
@ui {"widget":"separator"}
@property {bool} enableRemap {"label":"Remap Value"}
@property {RemapConfig} remapConfig {"label":"Remap Settings", "showIf":"enableRemap"}
@ui {"widget":"separator"}
@property {ScalarResponseConfig[]} responses {"label":"<h4><font color='#44C4C4'>Scalar Responses: ⤵"}
*/
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @input int actionType = 2 {"widget":"combobox", "values":[{"label":"Movement", "value":0}, {"label":"Rotation", "value":1}, {"label":"Event", "value":2}, {"label":"Scalar", "value":3}]}
// @input MovementInputActionConfig movementInput {"label":"Action", "showIf":"actionType", "showIfValue":0}
// @input RotationInputActionConfig rotationInput {"showIf":"actionType", "showIfValue":1}
// @input DiscreteInputActionConfig discreteInput {"showIf":"actionType", "showIfValue":2}
// @input ScalarInputActionConfig scalarInput {"showIf":"actionType", "showIfValue":3}
// @input bool enableTouchBlocking = true {"hint":"Disables Snapchat gestures that might affect game experience, such as pinch to zoom or swipe to open popup. Useful for games that require full screen touch interaction."}
// @input bool printWarns = true
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/Input Action.lsc/InputAction/Input Action");
Object.setPrototypeOf(script, Module.InputActionComponent.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("actionType", []);
    checkUndefined("movementInput", [["actionType",0]]);
    checkUndefined("rotationInput", [["actionType",1]]);
    checkUndefined("discreteInput", [["actionType",2]]);
    checkUndefined("scalarInput", [["actionType",3]]);
    checkUndefined("enableTouchBlocking", []);
    checkUndefined("printWarns", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
