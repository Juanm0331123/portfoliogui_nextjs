/**
 * Projects. Only facts that are the same in every language live here (names,
 * years, links, images); what a project does and the decision behind it are
 * copy, under `Projects.items.<id>` in messages/*.json.
 */
export type ProjectId = 'pevi' | 'dataBridge' | 'westAutomation' | 'barbershop'

export type Project = {
    id: ProjectId
    title: string
    year: string
    status: 'live' | 'building'
    url?: string
    /**
     * A screenshot, or none: a project without one is drawn as a diagram.
     * `focus` is the CSS object-position that keeps the screenshot's own
     * headline in frame when the card crops it.
     */
    image?: { src: string; width: number; height: number; focus: string }
    /** Proper nouns, never translated. */
    stack: string[]
}

export const projects: Project[] = [
    {
        id: 'pevi',
        title: 'PEVI UAO',
        year: '2025',
        status: 'live',
        url: 'https://peviuao.vercel.app/',
        image: { src: '/images/project-pevi.webp', width: 1900, height: 906, focus: 'center top' },
        stack: ['Next.js', 'PostgreSQL', 'Docker', 'Vertex AI'],
    },
    {
        id: 'dataBridge',
        title: 'Data Bridge',
        year: '2026',
        status: 'building',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'Zoho Analytics'],
    },
    {
        id: 'westAutomation',
        title: 'West Automation',
        year: '2025',
        status: 'live',
        url: 'https://www.westautomation.co/',
        image: { src: '/images/project-west-automation.webp', width: 1900, height: 1034, focus: 'left top' },
        stack: ['Next.js', 'Tailwind CSS', 'Vercel'],
    },
    {
        id: 'barbershop',
        title: 'Barbershop',
        year: '2026',
        status: 'building',
        url: 'https://netxjs-barbershop.vercel.app/',
        image: { src: '/images/project-barbershop.webp', width: 1892, height: 901, focus: 'left top' },
        stack: ['Next.js', 'Tailwind CSS', 'RBAC'],
    },
]
