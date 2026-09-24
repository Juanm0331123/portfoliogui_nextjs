/**
 * The Projects deck. The section is tall and its stage is sticky; one scrubbed
 * timeline maps the scroll through it onto the deck. Each project owns one
 * unit of that timeline: it holds still for the first part (the reader gets
 * time to look), then hands over to the next card for the rest.
 */

/** Share of each project's unit spent holding still before the hand-over. */
export const HOLD = 0.4

/** Viewports of scroll per timeline unit. */
export const VIEWPORTS_PER_UNIT = 1.2

/** Timeline length: a unit per hand-over, plus the last project's hold. */
export function deckDuration(count: number): number {
    return count - 1 + HOLD
}

/**
 * Where a card sits by its distance `d` from the focus: 0 is the card being
 * read, 1 waits behind it, 2+ is still out of sight in the depth, -1 has
 * passed the viewer. Plain values, so every state can be written explicitly
 * and scrolling back always lands on exactly these numbers.
 */
export function cardState(d: number) {
    if (d <= -1) return { yPercent: -10, scale: 1.1, opacity: 0, rotateX: -6, filter: 'blur(12px) brightness(1)' }
    if (d === 0) return { yPercent: 0, scale: 1, opacity: 1, rotateX: 0, filter: 'blur(0px) brightness(1)' }
    if (d === 1) return { yPercent: 12, scale: 0.9, opacity: 0.45, rotateX: 7, filter: 'blur(3px) brightness(0.55)' }
    return { yPercent: 20, scale: 0.8, opacity: 0, rotateX: 10, filter: 'blur(10px) brightness(0.4)' }
}

export type ProjectSlide = {
    id: string
    index: string
    title: string
    meta: string
    summary: string
    decisionLabel: string
    decision: string
    stack: string[]
    url?: string
    visitLabel: string
    image?: { src: string; width: number; height: number; focus: string; alt: string }
    diagramLabel?: string
}
