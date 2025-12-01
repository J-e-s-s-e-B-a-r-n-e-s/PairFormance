/**
 * CharacterController
 *
 * The Character Controller Component is a modular, customizable movement system designed to
 * support various gameplay formats, including third-person, first-person, side-scroller, and
 * top-down perspectives. It provides a non-physics-based movement model with optional physics
 * interactions, allowing for smooth, responsive controls without physics body dependencies.
 */
export declare interface CharacterController {
    /**
     * Moves the character in the specified direction. The Y component is ignored (set to 0).
     * Must be called each frame to maintain movement, otherwise the character will stop.
     * To use this API for manual control, set Input Control Type to None.
     * @param direction - Movement direction vector (will be normalized, Y value ignored)
     */
    move(direction: vec3): void;

    /**
     * Immediately stops all character movement by resetting velocity and direction.
     * Clears any pending movement commands from the current frame.
     */
    stopMovement(): void;

    /**
     * Teleports the character to a specific world position instantly.
     * Also resets ground detection state to re-evaluate grounding at the new position.
     * @param position - Target world position
     */
    setPosition(position: vec3): void;

    /**
     * Returns a copy of the character's current world position.
     * @returns Current world position vector
     */
    getPosition(): vec3;

    /**
     * Sets the character's facing rotation. Only rotates around the Y axis (yaw).
     * Pitch and roll components are ignored to maintain upright orientation.
     * @param rotation - Target rotation quaternion
     */
    setRotation(rotation: quat): void;

    /**
     * Returns the character's current rotation quaternion.
     * @returns Current rotation
     */
    getRotation(): quat;

    /**
     * Returns a copy of the current movement direction vector.
     * This is the next direction the character will move in, or zero if stationary.
     * @returns Movement direction vector (Y component is always 0)
     */
    getDirection(): vec3;

    /**
     * Enables or disables sprint mode, switching between sprintSpeed and moveSpeed.
     *
     * When enabled:
     * - Uses sprintSpeed as the target speed
     * - Ignores targetSpeedModifier (always uses full sprint speed)
     * - Smoothly accelerates from current speed to sprint speed
     *
     * When disabled:
     * - Uses moveSpeed * targetSpeedModifier as the target speed
     * - Smoothly decelerates from sprint speed to walk speed
     *
     * Note: Speed transitions are governed by acceleration/deceleration settings,
     * so toggling sprint won't cause instant speed changes.
     *
     * @param enabled - true to enable sprint mode, false to switch to normal walking
     */
    setSprintEnabled(enabled: boolean): void;

    /**
     * Returns whether sprint mode is currently active.
     *
     * Note: This returns the sprint state, not whether the character has reached
     * sprint speed. The character may still be accelerating when this returns true.
     *
     * @returns true if sprint mode is enabled, false if in walk mode
     */
    isSprinting(): boolean;

    /**
     * Sets the character's base walking speed in units per second.
     *
     * This speed is used when sprint is disabled. The actual movement speed
     * may be lower if:
     * - targetSpeedModifier is less than 1.0 (e.g., analog input)
     * - Character is still accelerating to target speed
     * - Movement is restricted by collision or slope limits
     *
     * Must be non-negative. Setting to 0 allows rotation without movement.
     *
     * @param speed - Movement speed in units/second (>= 0)
     */
    setMoveSpeed(speed: number): void;

    /**
     * Returns the current base walking speed in units per second.
     * @returns Current move speed
     */
    getMoveSpeed(): number;

    /**
     * Sets the character's sprint speed in units per second.
     *
     * This speed is used when sprint is enabled. Unlike moveSpeed, sprint speed
     * ignores targetSpeedModifier and always uses the full value (when not
     * accelerating/decelerating).
     *
     * Typically set higher than moveSpeed for faster movement. Can be set equal
     * to or lower than moveSpeed if needed for game design purposes.
     *
     * Must be non-negative. Setting to 0 effectively stops movement when sprinting.
     *
     * @param speed - Sprint speed in units/second (>= 0)
     */
    setSprintSpeed(speed: number): void;

    /**
     * Returns the current sprint speed in units per second.
     * @returns Current sprint speed
     */
    getSprintSpeed(): number;

    /**
     * Returns whether the character is currently on the ground.
     * Ground detection uses either ground plane (Y=0) or raycasting based on configuration.
     * @returns true if grounded, false if airborne
     */
    isGrounded(): boolean;

    /**
     * Returns whether the character is currently in motion.
     * Based on actual velocity, not just input state.
     * @returns true if moving, false if stationary
     */
    isMoving(): boolean;

    /**
     * Returns the character's current velocity vector in units per second.
     * Includes both horizontal and vertical (gravity-affected) components.
     * @returns Current velocity vector
     */
    getVelocity(): vec3;

    /**
     * Enables or disables automatic rotation to face the direction of movement.
     * When enabled, character smoothly rotates toward the movement direction.
     * Smoothing is controlled by the rotationSmoothing setting.
     * @param enabled - true to auto-face movement direction, false to allow manual rotation
     */
    setAutoFaceMovement(enabled: boolean): void;

    /**
     * Returns whether automatic facing toward movement direction is enabled.
     * @returns true if auto-facing is enabled, false otherwise
     */
    getAutoFaceMovement(): boolean;

    /**
     * Sets how quickly the character reaches full speed in units per second squared.
     * Higher values result in more responsive, snappy movement.
     * Must be non-negative.
     * @param value - Acceleration rate in units/second²
     */
    setAcceleration(value: number): void;

    /**
     * Returns the current acceleration rate in units per second squared.
     * @returns Current acceleration value
     */
    getAcceleration(): number;

    /**
     * Sets how quickly the character slows down when input stops, in units per second squared.
     * Higher values result in quicker stops with less sliding.
     * Must be non-negative.
     * @param value - Deceleration rate in units/second²
     */
    setDeceleration(value: number): void;

    /**
     * Returns the current deceleration rate in units per second squared.
     * @returns Current deceleration value
     */
    getDeceleration(): number;

    /**
     * Enables or disables debug visualization of the character's capsule collider.
     * Useful for debugging collision issues and tuning collider size.
     * @param value - true to show collider, false to hide
     */
    setShowCollider(value: boolean): void;

    /**
     * Returns whether the character's collider debug visualization is enabled.
     * @returns true if collider is visible, false otherwise
     */
    getShowCollider(): boolean;

    /**
     * Returns the character's ColliderComponent for advanced collision control.
     * Can be used to modify collision filtering, shape properties, or physics material.
     * @returns The character's capsule collider component
     */
    getCollider(): ColliderComponent;

    /**
     * Makes the character jump if currently grounded and able to move.
     * Applies initial upward velocity based on jumpSpeed setting.
     * Also triggers jump animation if animation system is enabled.
     */
    jump(): void;

    /**
     * Event triggered when the character's collider begins colliding with another collider.
     * Provides collision details including contact points and the other collider.
     */
    get onCollisionEnter(): event1<CollisionEnterEventArgs, void>;

    /**
     * Event triggered each frame while the character remains in collision with another collider.
     * Fires continuously during sustained contact.
     */
    get onCollisionStay(): event1<CollisionEnterEventArgs, void>;

    /**
     * Event triggered when the character's collider stops colliding with another collider.
     * Fired once when collision ends.
     */
    get onCollisionExit(): event1<CollisionEnterEventArgs, void>;

    /**
     * Event triggered when the character enters an overlap (trigger) volume.
     * Overlap volumes don't generate collision responses but can detect presence.
     */
    get onOverlapEnter(): event1<OverlapEnterEventArgs, void>;

    /**
     * Event triggered each frame while the character remains inside an overlap volume.
     * Fires continuously while overlapping.
     */
    get onOverlapStay(): event1<OverlapEnterEventArgs, void>;

    /**
     * Event triggered when the character exits an overlap (trigger) volume.
     * Fired once when overlap ends.
     */
    get onOverlapExit(): event1<OverlapEnterEventArgs, void>;

    /**
     * Locks or unlocks movement along the X axis (horizontal left/right in world space).
     * When locked, all X-axis movement and velocity is prevented.
     * Useful for side-scrollers or constrained movement scenarios.
     * @param enabled - true to lock X axis, false to allow movement
     */
    setLockXAxis(enabled: boolean): void;

    /**
     * Returns whether movement along the X axis is currently locked.
     * @returns true if X axis is locked, false otherwise
     */
    getLockXAxis(): boolean;

    /**
     * Locks or unlocks movement along the Y axis (vertical up/down in world space).
     * When locked, all Y-axis movement and velocity is prevented, including gravity.
     * Useful for 2D games or platformers with fixed vertical planes.
     * @param enabled - true to lock Y axis, false to allow movement
     */
    setLockYAxis(enabled: boolean): void;

    /**
     * Returns whether movement along the Y axis is currently locked.
     * @returns true if Y axis is locked, false otherwise
     */
    getLockYAxis(): boolean;

    /**
     * Locks or unlocks movement along the Z axis (horizontal forward/back in world space).
     * When locked, all Z-axis movement and velocity is prevented.
     * Useful for side-scrollers or constrained movement scenarios.
     * @param enabled - true to lock Z axis, false to allow movement
     */
    setLockZAxis(enabled: boolean): void;

    /**
     * Returns whether movement along the Z axis is currently locked.
     * @returns true if Z axis is locked, false otherwise
     */
    getLockZAxis(): boolean;

    /**
     * Triggers a custom action by name. Actions control animation playback and can optionally
     * disable movement during execution. Actions must be pre-configured in the Actions settings.
     * @param actionName - Name of the action to trigger (case-sensitive)
     */
    startAction(actionName: string): void;

    /**
     * Sets a multiplier for the target movement speed (0-1 range recommended).
     * Allows for gradual speed changes, such as analog stick input where partial tilts
     * result in slower movement. Applied before acceleration/deceleration.
     * @param modifier - Speed multiplier (0 = no movement, 1 = full speed, values between create partial speed)
     */
    setTargetSpeedModifier(modifier: number): void;

    /**
     * Shows the input controls (joystick) if input control is configured.
     * Enables the joystick visual interface for user interaction.
     */
    showControls(): void;

    /**
     * Hides the input controls (joystick) if input control is configured.
     * Disables the joystick visual interface, preventing user interaction.
     */
    hideControls(): void;

    /**
     * Enables automatic forward movement in the character's facing direction.
     * Character will continuously move forward each frame without input.
     * Useful for endless runner or racing games. Can be combined with rotation controls.
     */
    enableAutoMovement(): void;

    /**
     * Disables automatic forward movement.
     * Returns control to normal input-based movement.
     */
    disableAutoMovement(): void;
}
