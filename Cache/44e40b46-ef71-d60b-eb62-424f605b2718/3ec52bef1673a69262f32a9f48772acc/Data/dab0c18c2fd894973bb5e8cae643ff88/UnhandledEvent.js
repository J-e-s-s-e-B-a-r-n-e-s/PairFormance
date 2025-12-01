"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnhandledEvent = void 0;
/**
 * Event without try/catch handling.
 */
class UnhandledEvent {
    constructor() {
        this.listeners = new Set();
    }
    subscribe(listener) {
        const wrapper = (...args) => {
            listener(...args);
        };
        this.listeners.add(wrapper);
        return {
            destroy: () => {
                this.listeners.delete(wrapper);
            },
        };
    }
    subscribeOnce(listener) {
        const wrapper = (...args) => {
            this.listeners.delete(wrapper);
            listener(...args);
        };
        this.listeners.add(wrapper);
        return {
            destroy: () => {
                this.listeners.delete(wrapper);
            },
        };
    }
    notify(...args) {
        const listeners = [...this.listeners];
        for (const listener of listeners) {
            listener(...args);
        }
    }
    immutable() {
        return {
            subscribe: this.subscribe.bind(this),
            subscribeOnce: this.subscribeOnce.bind(this),
        };
    }
    map(mapper) {
        return UnhandledEvent.map(this.immutable(), mapper);
    }
    mapSingle(mapper) {
        return UnhandledEvent.mapSingle(this.immutable(), mapper);
    }
}
exports.UnhandledEvent = UnhandledEvent;
(function (UnhandledEvent) {
    function map(baseEvent, mapper) {
        return {
            subscribe: (listener) => baseEvent.subscribe((...args) => {
                listener(...mapper(...args));
            }),
            subscribeOnce: (listener) => baseEvent.subscribeOnce((...args) => {
                listener(...mapper(...args));
            }),
        };
    }
    UnhandledEvent.map = map;
    function mapSingle(baseEvent, mapper) {
        return map(baseEvent, (...args) => [mapper(...args)]);
    }
    UnhandledEvent.mapSingle = mapSingle;
})(UnhandledEvent || (exports.UnhandledEvent = UnhandledEvent = {}));
//# sourceMappingURL=UnhandledEvent.js.map