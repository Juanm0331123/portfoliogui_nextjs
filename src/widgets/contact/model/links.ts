import { site } from '@/shared/config'

export type ContactLink = {
    /** Key in the `Contact` namespace of messages/*.json. */
    key: 'github' | 'linkedin' | 'cv'
    href: string
    external: boolean
}

export const contactLinks: ContactLink[] = [
    { key: 'github', href: site.github, external: true },
    { key: 'linkedin', href: site.linkedin, external: true },
    { key: 'cv', href: site.cv, external: false },
]
