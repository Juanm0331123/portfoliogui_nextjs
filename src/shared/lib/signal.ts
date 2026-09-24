/**
 * A one-shot signal: fires once, and a listener that subscribes afterwards is
 * called immediately. Used for moments in the intro (the Loader is gone, the
 * singularity bursts) that code several layers apart has to react to — some of
 * it inside the WebGL loop, where no React prop or provider reaches.
 */
export function createSignal<T = void>() {
    let fired = false
    let payload: T
    const listeners = new Set<(value: T) => void>()

    return {
        fire(value: T) {
            if (fired) return
            fired = true
            payload = value
            listeners.forEach((listener) => listener(value))
            listeners.clear()
        },
        hasFired() {
            return fired
        },
        subscribe(listener: (value: T) => void): () => void {
            if (fired) {
                listener(payload)
                return () => {}
            }
            listeners.add(listener)
            return () => listeners.delete(listener)
        },
    }
}
