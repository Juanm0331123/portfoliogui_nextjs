/**
 * The portrait is a transparent cutout (`public/images/profile.webp`, 572×946).
 * These boxes are percentages of it, measured off the photo.
 */
export const PORTRAIT = {
    src: '/images/profile.webp',
    width: 572,
    height: 946,
    /** The face, padded. The swarm fades out inside this ellipse. */
    face: { left: '30%', top: '5%', width: '40%', height: '31%' },
    /**
     * The halo's box: a band across the chest, wider than the photo so the
     * orbits pass behind the shoulders. Its top edge stays below the chin.
     */
    halo: { left: '-14%', top: '46%', width: '128%', height: '22%' },
} as const
