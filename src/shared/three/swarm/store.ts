/**
 * The handoff between the DOM (scroll triggers, the Loader, widgets) and the
 * WebGL engine, which runs its own loop and reads this every frame.
 *
 * Module-level and mutable on purpose: nothing here goes through React state,
 * so a scrubbed tween writing a band value costs no re-render.
 */

/** One scroll-driven transition, 0..1, written only by a scrubbed tween. */
export type ScrollBand = { value: number }

export const swarmState = {
    /**
     * One band per section after the Hero. The formation coordinate is
     * `1 + Σ bands` — a sum of scrubbed, position-derived values, so it is a
     * pure function of the scroll position.
     */
    bands: [] as ScrollBand[],
    /** 0 = the swarm stands in the Loader's wordmark, 1 = released. */
    intro: 1,
    /** 0 = collapsed into the singularity, 1 = following the scroll. */
    burst: 0,
}

// --- Readiness ----------------------------------------------------------------

let ready = false
const readyListeners = new Set<() => void>()

/** Fired by the engine once its first frames have rendered. */
export function markSwarmReady() {
    if (ready) return
    ready = true
    readyListeners.forEach((listener) => listener())
    readyListeners.clear()
}

/** Calls `listener` once the swarm is drawing — immediately if it already is. */
export function onSwarmReady(listener: () => void): () => void {
    if (ready) {
        listener()
        return () => {}
    }
    readyListeners.add(listener)
    return () => readyListeners.delete(listener)
}

export function getScrollProgress(): number {
    let progress = 1
    for (const band of swarmState.bands) progress += band.value
    return Math.min(Math.max(progress, 1), 7)
}

// --- Wordmark ---------------------------------------------------------------

let wordmark: Float32Array | null = null
let wordmarkVersion = 0

/** Interleaved x,y CSS-pixel pairs of the Loader's wordmark ink. */
export function setSwarmWordmark(points: Float32Array) {
    wordmark = points
    wordmarkVersion += 1
}

export function getSwarmWordmark() {
    return { points: wordmark, version: wordmarkVersion }
}

// --- DOM anchors --------------------------------------------------------------

/**
 * Formations that belong to a piece of content are placed on a DOM element:
 * its box on screen is where the formation sits and how big it is. Layout
 * stays in CSS, and a formation scrolls with its section.
 */
export type SwarmAnchorName = 'hero' | 'about' | 'face' | 'skills' | 'contact'

const anchors = new Map<SwarmAnchorName, HTMLElement>()

export function registerSwarmAnchor(name: SwarmAnchorName, element: HTMLElement): () => void {
    anchors.set(name, element)
    return () => {
        if (anchors.get(name) === element) anchors.delete(name)
    }
}

export function getSwarmAnchor(name: SwarmAnchorName): HTMLElement | null {
    return anchors.get(name) ?? null
}

// --- Skills lattice nodes -------------------------------------------------------

export type SkillNodesFrame = {
    /** Per node: x, y in CSS px relative to the skills anchor, and a 0..1 depth. */
    points: Float32Array
    /** 0 = labels hidden, 1 = the lattice is fully formed. */
    visibility: number
}

const nodeListeners = new Set<(frame: SkillNodesFrame) => void>()

export function onSkillNodes(listener: (frame: SkillNodesFrame) => void): () => void {
    nodeListeners.add(listener)
    return () => nodeListeners.delete(listener)
}

export function emitSkillNodes(frame: SkillNodesFrame) {
    nodeListeners.forEach((listener) => listener(frame))
}
