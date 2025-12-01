export interface IJoystick {
    directionUpdateEvent: {
        add(listener: (direction: vec2) => void): void,
        remove(listener: (direction: vec2) => void): void,
    },

    get direction(): vec2,

    getTransform(): Transform,
}
