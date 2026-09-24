/**
 * The Hero's two motions.
 *
 * - Intro: plays once, when the singularity bursts into the ring (or after
 *   INTRO_FALLBACK_MS if the swarm never signals — no WebGL, a stalled tab).
 * - Exit: scrubbed to the scroll, from the top of the page until the Hero is
 *   mostly gone. Scroll back up and the copy returns along the same path.
 */
export const INTRO_FALLBACK_MS = 3200

export const HERO_EXIT = {
    start: 'top top',
    end: 'bottom 35%',
} as const
