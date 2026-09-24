import { createSignal } from './signal'

/**
 * The three beats of the intro, in the order they happen:
 *
 * - `wordmarkDissolve` — the Loader's wordmark, rasterised into points, at the
 *   instant it starts to dissolve. The swarm stands in the letterforms first.
 * - `appReady` — the Loader overlay is gone and the page is scrollable.
 * - `introBurst` — the singularity bursts into the Hero's ring; the Hero's
 *   headline rises with it.
 *
 * Nothing here is scroll-driven. The intro plays once per load, and when it is
 * done every value it touched sits at its resting state, which is exactly the
 * state the scroll-driven layer expects at the top of the page.
 */
export type WordmarkDissolve = {
    /** Interleaved x,y pairs in CSS pixels, viewport space. */
    points: Float32Array
}

const wordmark = createSignal<WordmarkDissolve>()
const ready = createSignal()
const burst = createSignal()

export const publishWordmarkDissolve = wordmark.fire
export const onWordmarkDissolve = wordmark.subscribe

export const markAppReady = () => ready.fire()
export const onAppReady = ready.subscribe
export const isAppReady = ready.hasFired

export const markIntroBurst = () => burst.fire()
export const onIntroBurst = burst.subscribe
