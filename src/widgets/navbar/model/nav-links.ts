import type { SectionId } from '@/shared/config'

export type NavLink = {
    section: Exclude<SectionId, 'hero' | 'footer'>
    /** Key in the `Navbar` namespace of messages/*.json. */
    key: 'about' | 'skills' | 'projects' | 'experience' | 'contact'
}

export const navLinks: NavLink[] = [
    { section: 'about', key: 'about' },
    { section: 'skills', key: 'skills' },
    { section: 'projects', key: 'projects' },
    { section: 'experience', key: 'experience' },
    { section: 'contact', key: 'contact' },
]

/** Sections in the warm stretch of the page; the navbar's accent follows them. */
export const warmSections: SectionId[] = ['projects', 'experience', 'contact']
