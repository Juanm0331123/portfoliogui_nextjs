/**
 * Experience, education and certifications. Dates are ISO months and get
 * formatted per locale; organisations and certificate names are proper nouns.
 * Roles and summaries are copy, under `Experience.items.<id>`.
 */
export type ExperienceId = 'vallesalud' | 'uao' | 'master' | 'degree' | 'sena' | 'certifications'

export type ExperienceEntry = {
    id: ExperienceId
    kind: 'work' | 'education'
    organization: string
    /** `YYYY-MM`. */
    start: string
    /** `YYYY-MM`, or null for "present". */
    end: string | null
    /** Show months, or years only when the source only states years. */
    precision: 'month' | 'year'
    /** `span` reads as a range (start — end); `list` as separate dates (start · end). */
    range: 'span' | 'list'
    /** Proper nouns shown instead of a summary, e.g. certificate titles. */
    detail?: string
    hasSummary: boolean
}

export const experience: ExperienceEntry[] = [
    {
        id: 'vallesalud',
        kind: 'work',
        organization: 'Red ValleSalud',
        start: '2025-11',
        end: null,
        precision: 'month',
        range: 'span',
        hasSummary: true,
    },
    {
        id: 'uao',
        kind: 'work',
        organization: 'PEVI-UAO · Universidad Autónoma de Occidente',
        start: '2024-11',
        end: '2025-11',
        precision: 'month',
        range: 'span',
        hasSummary: true,
    },
    {
        id: 'master',
        kind: 'education',
        organization: 'Universidad Autónoma de Occidente',
        start: '2026-01',
        end: null,
        precision: 'year',
        range: 'span',
        hasSummary: false,
    },
    {
        id: 'degree',
        kind: 'education',
        organization: 'Universidad Autónoma de Occidente',
        start: '2021-07',
        end: '2025-12',
        precision: 'year',
        range: 'span',
        hasSummary: false,
    },
    {
        id: 'sena',
        kind: 'education',
        organization: 'SENA',
        start: '2019-06',
        end: '2021-07',
        precision: 'year',
        range: 'span',
        hasSummary: false,
    },
    {
        id: 'certifications',
        kind: 'education',
        organization: 'AWS · Anthropic · Google Cloud',
        start: '2024-04',
        end: '2026-09',
        precision: 'year',
        range: 'list',
        detail: 'AWS Agentic AI Demonstrated · Claude Code in Action · Prompt Design in Vertex AI · Google Cloud Computing Foundations',
        hasSummary: false,
    },
]
