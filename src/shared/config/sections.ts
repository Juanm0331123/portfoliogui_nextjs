/**
 * The page is one scroll journey in eight formations. Stage 0 (the singularity)
 * has no section of its own: it only exists during the intro, before the pool
 * bursts into the Hero's ring.
 */
export type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact' | 'footer'

export const sectionIds: SectionId[] = ['hero', 'about', 'skills', 'projects', 'experience', 'contact', 'footer']

/** Formation index each section holds while it is on screen. */
export const sectionStage: Record<SectionId, number> = {
    hero: 1,
    about: 2,
    skills: 3,
    projects: 4,
    experience: 5,
    contact: 6,
    footer: 7,
}

export const STAGE_COUNT = 8

/**
 * Section labels are part of the brand's voice and stay in English in both
 * locales. They live here rather than in `messages/*.json` for that reason.
 */
export const sectionLabels: Record<Exclude<SectionId, 'hero' | 'footer'>, string> = {
    about: 'About',
    skills: 'Stack',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
}
