import { site } from '@/shared/config'

export const footerSections = ['about', 'skills', 'projects', 'experience'] as const

export const footerContacts = [
    { label: site.email, href: `mailto:${site.email}`, external: false },
    { label: 'LinkedIn', href: site.linkedin, external: true },
    { label: 'GitHub', href: site.github, external: true },
] as const
