/**
 * Event without try/catch handling.
 */
export class UnhandledEvent<T extends [...any] = []> implements UnhandledEvent.Immutable<T> {
    private listeners = new Set<UnhandledEvent.Listener<T>>();

    subscribe(listener: UnhandledEvent.Listener<T>): UnhandledEvent.Subscription {
        const wrapper = (...args: T) => {
            listener(...args);
        };
        this.listeners.add(wrapper);
        return {
            destroy: () => {
                this.listeners.delete(wrapper);
            },
        };
    }

    subscribeOnce(listener: UnhandledEvent.Listener<T>): UnhandledEvent.Subscription {
        const wrapper = (...args: T) => {
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

    notify(...args: T): void {
        const listeners = [...this.listeners];
        for (const listener of listeners) {
            listener(...args);
        }
    }

    immutable(): UnhandledEvent.Immutable<T> {
        return {
            subscribe: this.subscribe.bind(this),
            subscribeOnce: this.subscribeOnce.bind(this),
        };
    }

    map(mapper: (...data: T) => [...any]): UnhandledEvent.Immutable<[...any]> {
        return UnhandledEvent.map(this.immutable(), mapper);
    }

    mapSingle<U extends any>(mapper: (...data: T) => U): UnhandledEvent.Immutable<[U]> {
        return UnhandledEvent.mapSingle(this.immutable(), mapper);
    }
}

export namespace UnhandledEvent {
    export type Subscription = {
        destroy: () => void;
    }
    export type Listener<T extends [...any] = []> = (...args: T) => void;

    export interface Immutable<T extends [...any] = []> {
        subscribe: (listener: Listener<T>) => Subscription;
        subscribeOnce: (listener: Listener<T>) => Subscription;
    }

    export function map<T extends [...any], U extends [...any]>(baseEvent: UnhandledEvent.Immutable<T>, mapper: (...data: T) => U): UnhandledEvent.Immutable<U> {
        return {
            subscribe: (listener: UnhandledEvent.Listener<U>) => baseEvent.subscribe((...args: T) => {
                listener(...mapper(...args));
            }),
            subscribeOnce: (listener: UnhandledEvent.Listener<U>) => baseEvent.subscribeOnce((...args: T) => {
                listener(...mapper(...args));
            }),
        };
    }

    export function mapSingle<T extends [...any], U extends any>(baseEvent: UnhandledEvent.Immutable<T>, mapper: (...data: T) => U): UnhandledEvent.Immutable<[U]> {
        return map(baseEvent, (...args: T) => [mapper(...args)]);
    }
}
