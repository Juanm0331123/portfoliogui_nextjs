/**
 * The scroll ranges that move the swarm from one formation to the next. Each
 * is a scrubbed trigger on the section it leads INTO: the band runs 0 → 1 as
 * that section rises through the viewport, and the formation coordinate is
 * `1 + Σ bands`.
 *
 * The ranges never overlap (each ends before the next one's section can reach
 * its start), so the sum only ever has one band in motion.
 */
export type SwarmBand = {
    /** Formation reached when this band completes. */
    to: number
    trigger: string
    start: string
    end: string
}

export const SWARM_BANDS: SwarmBand[] = [
    { to: 2, trigger: '#about', start: 'top 85%', end: 'top 22%' },
    { to: 3, trigger: '#skills', start: 'top 85%', end: 'top 22%' },
    { to: 4, trigger: '#projects', start: 'top 85%', end: 'top top' },
    { to: 5, trigger: '#experience', start: 'top 85%', end: 'top 22%' },
    { to: 6, trigger: '#contact', start: 'top 85%', end: 'top 22%' },
    // The footer is the last thing on the page and never reaches the top of
    // the viewport, so its band ends exactly at the maximum scroll position.
    { to: 7, trigger: '#footer', start: 'top bottom', end: 'bottom bottom' },
]
