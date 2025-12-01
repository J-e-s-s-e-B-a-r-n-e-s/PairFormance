# **Input Action Component Documentation**

The Input Action component is a powerful tool for developers in Lens Studio designed to streamline the process of
setting up controls for your game or interactive Lens.

### **What It Does:**

* **Maps Inputs:** It lets you connect different user inputs—like a joystick, a screen tap, a facial expression like a
  blink, or even microphone volume—to custom actions you define within your scene.
* **Flexible Controls:** You can easily change your game's control scheme, add multiple types of inputs for the same
  action, and manage everything from a single component.
* **Repurposed Joystick:** It allows you to use the standard character controller joystick as a selectable input option
  for a wide range of actions beyond just character movement.

### **InputActionComponent**

This is the main component that you add to a Scene Object. It serves as the entry point for configuring all input
actions.

| Property              | Type                      | Description                                                                                                                  |
|:----------------------|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------|
| Action Type           | UserActionType            | The primary type of input action you want to create: **Movement**, **Rotation**, **Event**, or **Scalar**.                   |
| Movement Input        | MovementInputActionConfig | (Visible if Action Type is **Movement**) Contains all settings related to movement input.                                    |
| Rotation Input        | RotationInputActionConfig | (Visible if Action Type is **Rotation**) Contains all settings related to rotation input.                                    |
| Discrete Input        | DiscreteInputActionConfig | (Visible if Action Type is **Event**) Contains all settings for event-based (discrete) actions.                              |
| Scalar Input          | ScalarInputActionConfig   | (Visible if Action Type is **Scalar**) Contains all settings for continuous value (scalar) inputs.                           |
| Enable Touch Blocking | boolean                   | If checked, it disables default Snapchat gestures like pinch-to-zoom, which is useful for games requiring full-screen touch. |
| Print Warns           | boolean                   | If checked, the script will print warning messages to the logger to help with debugging.                                     |

## **Movement Action Configurations**

### **MovementInputActionConfig**

Configures the source of movement input and how the system should respond.

| Property            | Type                           | Description                                                                            |
|:--------------------|:-------------------------------|:---------------------------------------------------------------------------------------|
| Input Type          | DirectionInputType             | The source of the movement input. Currently, only **Joystick** is supported.           |
| Joystick Settings   | JoystickDirectionAdapterConfig | (Visible if Input Type is **Joystick**) Settings for the joystick input.               |
| Movement Responses: | MovementResponseConfig\[\]     | A list of actions to perform in response to the movement input (e.g., move an object). |

### **JoystickDirectionAdapterConfig**

Defines how to interpret joystick input for movement.

| Property              | Type                | Description                                                                                                                                         |
|:----------------------|:--------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| Joystick Input Config | JoystickInputConfig | The core settings for the joystick component itself.                                                                                                |
| Constrain to Plane    | boolean             | If checked, the 2D joystick direction is projected onto a 3D plane for movement in the scene.                                                       |
| Reference Camera      | Camera              | (Visible if Constrain to Plane is checked) The camera to use as a reference for projecting the movement direction. If not set, world space is used. |
| Plane Preset          | PlanePreset         | (Visible if Constrain to Plane is checked) A preset for the plane to project onto (**XZ**, **XY**, or **Custom**).                                  |
| Custom Plane          | vec3                | (Visible if Plane Preset is **Custom**) The normal of the custom plane to project the movement onto.                                                |

### **MovementResponseConfig**

Defines a single response to a movement input.

| Property           | Type                  | Description                                                                                  |
|:-------------------|:----------------------|:---------------------------------------------------------------------------------------------|
| Response Type      | DirectionResponseType | The type of movement response: **Move Object** or **Move Character**.                        |
| Movement Settings  | MoveObjectConfig      | (Visible if Response Type is **Move Object**) Settings for moving a standard Scene Object.   |
| Character Settings | MoveCharacterConfig   | (Visible if Response Type is **Move Character**) Settings for moving a Character Controller. |

### **MoveObjectConfig**

Settings for the "Move Object" response.

| Property       | Type          | Description                                                     |
|:---------------|:--------------|:----------------------------------------------------------------|
| Target Object  | SceneObject   | The Scene Object that will be moved.                            |
| Speed          | number        | The speed at which the object will move.                        |
| Movement Space | MovementSpace | The coordinate space for the movement (**Local** or **World**). |

### **MoveCharacterConfig**

Settings for the "Move Character" response.

| Property             | Type                | Description                                                           |
|:---------------------|:--------------------|:----------------------------------------------------------------------|
| Movement Speed       | number              | A multiplier for the character's movement speed.                      |
| Character Controller | CharacterController | A reference to the Character Controller script component to be moved. |

## **Rotation Action Configurations**

### **RotationInputActionConfig**

Configures the source of rotation input and the corresponding responses.

| Property            | Type                           | Description                                                                                      |
|:--------------------|:-------------------------------|:-------------------------------------------------------------------------------------------------|
| Input Type          | RotationInputType              | The source of the rotation input: **Joystick** or **Gyroscope**.                                 |
| Joystick Settings   | JoystickRotationAdapterConfig  | (Visible if Input Type is **Joystick**) Settings for using a joystick for rotation.              |
| Gyroscope Settings  | GyroscopeRotationAdapterConfig | (Visible if Input Type is **Gyroscope**) Settings for using the device's gyroscope for rotation. |
| Rotation Responses: | RotationResponseConfig\[\]     | A list of actions to perform in response to the rotation input.                                  |

### **JoystickRotationAdapterConfig**

Defines how to interpret joystick input for rotation.

| Property              | Type                | Description                                                                           |
|:----------------------|:--------------------|:--------------------------------------------------------------------------------------|
| Joystick Input Config | JoystickInputConfig | The core settings for the joystick component.                                         |
| Speed                 | number              | The speed of the rotation.                                                            |
| Block Flips           | boolean             | If checked, prevents the object from rotating upside down (flipping over the Y-axis). |

### **GyroscopeRotationAdapterConfig**

Defines how to interpret gyroscope input.

| Property            | Type              | Description                                                                                        |
|:--------------------|:------------------|:---------------------------------------------------------------------------------------------------|
| Allow Roll Rotation | boolean           | If checked, allows for "rolling" rotation (like a plane banking).                                  |
| Invert Rotation     | boolean           | If checked, inverts the rotation input from the gyroscope.                                         |
| Rotation Blend Mode | RotationBlendMode | How the rotation is applied: **Additive** (accumulates over time) or **Absolute** (sets directly). |

### **RotationResponseConfig**

Defines a single response to a rotation input.

| Property          | Type                       | Description                                                                           |
|:------------------|:---------------------------|:--------------------------------------------------------------------------------------|
| Response Type     | RotationResponseType       | The type of rotation response. Currently, only **Rotate Object** is supported.        |
| Rotation Settings | RotateObjectResponseConfig | (Visible if Response Type is **Rotate Object**) Settings for rotating a Scene Object. |

### **RotateObjectResponseConfig**

Settings for the "Rotate Object" response.

| Property       | Type          | Description                                                     |
|:---------------|:--------------|:----------------------------------------------------------------|
| Target Object  | SceneObject   | The Scene Object that will be rotated.                          |
| Rotation Space | RotationSpace | The coordinate space for the rotation (**Local** or **World**). |

## **Discrete (Event) Action Configurations**

### **DiscreteInputActionConfig**

Configures event-based triggers and their responses.

| Property                       | Type                                      | Description                                                                                                    |
|:-------------------------------|:------------------------------------------|:---------------------------------------------------------------------------------------------------------------|
| Input Type                     | DiscreteInputType                         | The source of the event: **Interaction Component** or **Face Event**.                                          |
| Interaction Component Settings | InteractionComponentDiscreteAdapterConfig | (Visible if Input Type is **Interaction Component**) Settings for using an Interaction Component as a trigger. |
| Face Event Settings            | FaceEventDiscreteAdapterConfig            | (Visible if Input Type is **Face Event**) Settings for using a face gesture as a trigger.                      |
| Event Responses:               | DiscreteResponseConfig\[\]                | A list of actions to perform when the event is triggered.                                                      |

### **InteractionComponentDiscreteAdapterConfig**

Settings for using an Interaction Component as an event source.

| Property              | Type                           | Description                                                                                                  |
|:----------------------|:-------------------------------|:-------------------------------------------------------------------------------------------------------------|
| Interaction Component | InteractionComponent           | A reference to the Interaction Component to listen to.                                                       |
| Action Type           | InteractionComponentActionType | The specific event to listen for (**Tap**, **TouchStart**, **TouchEnd**, **onHoverEnter**, **onHoverExit**). |

### **FaceEventDiscreteAdapterConfig**

Settings for using face events as a trigger.

| Property            | Type          | Description                                                                                                     |
|:--------------------|:--------------|:----------------------------------------------------------------------------------------------------------------|
| Face Event Type     | FaceEventType | The category of face event to use (**Smile**, **Mouth**, **Kiss**, **Brows**, **Face Tracking**).               |
| Smile Event         | number        | (Visible if Face Event Type is **Smile**) The specific smile event (**Smile Started**, **Smile Finished**).     |
| Mouth Event         | number        | (Visible if Face Event Type is **Mouth**) The specific mouth event (**Mouth Opened**, **Mouth Closed**).        |
| Kiss Event          | number        | (Visible if Face Event Type is **Kiss**) The specific kiss event (**Kiss Started**, **Kiss Finished**).         |
| Brows Event         | number        | (Visible if Face Event Type is **Brows**) The specific brows event (**Brows Raised**, **Brows Lowered**, etc.). |
| Face Tracking Event | number        | (Visible if Face Event Type is **Face Tracking**) The specific tracking event (**Face Found**, **Face Lost**).  |

### **DiscreteResponseConfig**

Defines a single response to a discrete event.

| Property                               | Type                                      | Description                                                                                                  |
|:---------------------------------------|:------------------------------------------|:-------------------------------------------------------------------------------------------------------------|
| Response Type                          | DiscreteResponseType                      | The type of response: **Character Controller**, **Component API Call**, or **Behavior**.                     |
| Character Controller Settings          | CharacterControllerDiscreteResponseConfig | (Visible if Response Type is **Character Controller**) Settings for interacting with a Character Controller. |
| Component Api Response Config          | ComponentApiResponseConfig                | (Visible if Response Type is **Component API Call**) Settings for calling a function on another script.      |
| Behavior Custom Component integration. | BehaviorResponseConfig                    | (Visible if Response Type is **Behavior**) Settings for triggering a Behavior script.                        |

### **CharacterControllerDiscreteResponseConfig**

Settings for the "Character Controller" discrete response.

| Property             | Type                                    | Description                                                                                           |
|:---------------------|:----------------------------------------|:------------------------------------------------------------------------------------------------------|
| Character Controller | CharacterController                     | A reference to the Character Controller script component.                                             |
| Response Type        | CharacterControllerDiscreteResponseType | The action to perform. Currently, only **Set Character Position** is supported.                       |
| Position             | vec3                                    | (Visible if Response Type is **Set Character Position**) The world position to move the character to. |

### **ComponentApiResponseConfig**

Settings for the "Component API Call" response.

| Property    | Type                | Description                                                           |
|:------------|:--------------------|:----------------------------------------------------------------------|
| Component   | BaseScriptComponent | The script component that contains the method you want to call.       |
| Method Name | string              | The name of the method (function) to call on the specified component. |

### **BehaviorResponseConfig**

Settings for the "Behavior" response.

| Property              | Type                 | Description                                                                                                                        |
|:----------------------|:---------------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| Behavior trigger type | BehaviorResponseType | The method for triggering the behavior script: **Global CustomTrigger** or **Manual Trigger**.                                     |
| Custom Trigger Name   | string               | (Visible if Behavior trigger type is **Global CustomTrigger**) The name of the global custom trigger to send.                      |
| Behavior Script       | BaseScriptComponent  | (Visible if Behavior trigger type is **Manual Trigger**) A reference to the Behavior script whose trigger function will be called. |

## **Scalar Action Configurations**

### **ScalarInputActionConfig**

Configures inputs that produce a continuous value (a scalar) and their responses.

| Property                             | Type                     | Description                                                                                           |
|:-------------------------------------|:-------------------------|:------------------------------------------------------------------------------------------------------|
| Input Type                           | ScalarInputType          | The source of the scalar value: **Microphone Volume** or **Wired Params**.                            |
| Volume Input Settings                | VoiceAdapterConfig       | (Visible if Input Type is **Microphone Volume**) Settings for using microphone volume as input.       |
| Wired Params Custom Component Config | WiredParamsAdapterConfig | (Visible if Input Type is **Wired Params**) Settings for using a Wired Parameters component as input. |
| Remap Value                          | boolean                  | If checked, the input value will be remapped to a new range.                                          |
| Remap Settings                       | RemapConfig              | (Visible if Remap Value is checked) The settings for remapping the value.                             |
| Scalar Responses:                    | ScalarResponseConfig\[\] | A list of actions to perform in response to the scalar value.                                         |

### **VoiceAdapterConfig**

Settings for using microphone volume as a scalar input.

| Property               | Type               | Description                                                                  |
|:-----------------------|:-------------------|:-----------------------------------------------------------------------------|
| Microphone Audio Asset | AudioTrackAsset    | A reference to the Microphone Audio asset in your project.                   |
| Enable Easing          | boolean            | If checked, the input value will be smoothed over time.                      |
| Easing Config          | ScalarEasingConfig | (Visible if Enable Easing is checked) The settings for the smoothing effect. |

### **ScalarEasingConfig**

Settings for smoothing a scalar value.

| Property      | Type       | Description                                                                                                              |
|:--------------|:-----------|:-------------------------------------------------------------------------------------------------------------------------|
| Easing Type   | EasingType | The type of easing to apply. Currently, only **Exponential (lerp)** is supported.                                        |
| Easing Factor | number     | (Visible if Easing Type is **Exponential**) The amount of smoothing to apply (0.01 to 1). Higher values are less smooth. |

### **WiredParamsAdapterConfig**

Instructions for connecting a Wired Parameters component.
Does not have any configurable properties.

### **RemapConfig**

Settings for remapping a scalar value from one range to another.

| Property     | Type    | Description                                                                                     |
|:-------------|:--------|:------------------------------------------------------------------------------------------------|
| Input Min    | number  | The minimum expected value from the input source.                                               |
| Input Max    | number  | The maximum expected value from the input source.                                               |
| Output Min   | number  | The new minimum value to map to.                                                                |
| Output Max   | number  | The new maximum value to map to.                                                                |
| Clamp Output | boolean | If checked, the output value will be forced to stay within the Output Min and Output Max range. |

### **ScalarResponseConfig**

Defines a single response to a scalar input.

| Property                               | Type                              | Description                                                                                                                   |
|:---------------------------------------|:----------------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| Response Type                          | ScalarResponseType                | The type of response: **Character Controller** or **Map To Movement**.                                                        |
| Character Controller Response Settings | CharacterControllerResponseConfig | (Visible if Response Type is **Character Controller**) Settings for controlling a Character Controller with the scalar value. |
| Map To Movement Response Settings      | MapToMovementResponseConfig       | (Visible if Response Type is **Map To Movement**) Settings for using the scalar value to drive movement.                      |

### **CharacterControllerResponseConfig**

Settings for the "Character Controller" scalar response.

| Property                       | Type                | Description                                                                 |
|:-------------------------------|:--------------------|:----------------------------------------------------------------------------|
| Response Type                  | ResponseType        | The action to perform. Currently, only **Set Movement Speed** is supported. |
| Character Controller Component | CharacterController | A reference to the Character Controller script component.                   |

### **MapToMovementResponseConfig**

Settings for the "Map To Movement" scalar response.

| Property                   | Type                   | Description                                                                           |
|:---------------------------|:-----------------------|:--------------------------------------------------------------------------------------|
| Movement Vector            | vec3                   | The direction of movement. The scalar value will control the speed in this direction. |
| Movement Response Settings | MovementResponseConfig | The underlying movement response to use (e.g., Move Object or Move Character).        |

## **General Configurations**

### **JoystickInputConfig**

Core settings for any joystick input.

| Property      | Type               | Description                                                          |
|:--------------|:-------------------|:---------------------------------------------------------------------|
| Joystick      | Joystick Component | A reference to the Joystick script component in the scene.           |
| Invert X Axis | boolean            | If checked, inverts the horizontal (X-axis) input from the joystick. |
| Invert Y Axis | boolean            | If checked, inverts the vertical (Y-axis) input from the joystick.   |
