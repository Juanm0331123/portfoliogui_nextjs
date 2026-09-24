/**
 * The palette, as values the WebGL layer can read. The same colors are mirrored
 * as CSS custom properties in `app/[locale]/globals.css`; change both together.
 *
 * Each accent has a deep partner in the same hue family. The swarm shades every
 * formation across the pair, which is what gives it volume without introducing
 * a second accent into a section that only gets one.
 */
export const tokens = {
    bg: '#050507',
    ink: '#EDEEF2',
    inkSoft: '#C9CAD3',
    inkMuted: '#9A9CA8',
    cool: '#5BE9FF',
    coolDeep: '#3F63FF',
    warm: '#FF7A2F',
    /** The middle of the swarm's gradient, between the blue base and the amber crown. */
    violet: '#8C5BFF',
    warmDeep: '#FF2E4D',
} as const
