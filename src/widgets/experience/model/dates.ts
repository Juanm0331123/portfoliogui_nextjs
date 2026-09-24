import type { ExperienceEntry } from '@/entities/experience'

export type DateOptions = { year: 'numeric'; month?: 'short'; timeZone: 'UTC' }
type DateFormatter = (date: Date, options: DateOptions) => string

function toDate(month: string): Date {
    // Mid-month at noon UTC: no timezone can push it into the previous month.
    return new Date(`${month}-15T12:00:00Z`)
}

/** "nov 2025 — Actualidad", "2021 — 2026", "2024 · 2025", per entry and locale. */
export function formatEntryDates(entry: ExperienceEntry, format: DateFormatter, present: string): string {
    const options: DateOptions =
        entry.precision === 'month' ? { month: 'short', year: 'numeric', timeZone: 'UTC' } : { year: 'numeric', timeZone: 'UTC' }
    const start = format(toDate(entry.start), options)
    const end = entry.end ? format(toDate(entry.end), options) : present
    return `${start} ${entry.range === 'span' ? '—' : '·'} ${end}`
}
