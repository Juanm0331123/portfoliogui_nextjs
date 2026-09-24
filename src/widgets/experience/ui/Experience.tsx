import { getFormatter, getTranslations } from 'next-intl/server'
import { experience } from '@/entities/experience'
import { sectionLabels } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Container, RevealText, SectionLabel } from '@/shared/ui'
import { formatEntryDates, type DateOptions } from '../model'

export async function Experience() {
    const t = await getTranslations('Experience')
    const format = await getFormatter()
    const formatDate = (date: Date, options: DateOptions) => format.dateTime(date, options)

    return (
        <section
            id="experience"
            data-tone="warm"
            aria-labelledby="experience-title"
            // The wave field fills the lower half of the viewport; the extra
            // bottom room lets it be seen on its own before Contact arrives.
            className="relative pb-[38svh] pt-32 md:pt-44"
        >
            <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                    <SectionLabel label={sectionLabels.experience} />
                    <RevealText
                        as="h2"
                        id="experience-title"
                        text={t('headline')}
                        className="mt-8 max-w-[14ch] font-display text-[clamp(2.1rem,3.6vw,3.3rem)] font-light leading-[1.08] text-ink"
                    />
                    <p data-reveal="fade" className="mt-8 max-w-[36ch] text-[1.0625rem] font-light leading-[1.7] text-ink-muted">
                        {t('lede')}
                    </p>
                </div>

                <div className="relative lg:col-span-7 lg:col-start-6">
                    {/* The rail draws itself with the scroll, top to bottom. */}
                    <span aria-hidden="true" className="absolute bottom-2 left-[3px] top-2 w-px bg-ink/10" />
                    <span
                        aria-hidden="true"
                        data-reveal="rail"
                        data-reveal-start="top 75%"
                        data-reveal-end="bottom 55%"
                        className="absolute bottom-2 left-[3px] top-2 w-px origin-top bg-accent"
                    />
                    <ol className="flex flex-col gap-12 pl-10 md:gap-14 md:pl-14">
                        {experience.map((entry) => {
                            const isWork = entry.kind === 'work'
                            return (
                                <li key={entry.id} data-reveal="fade" data-reveal-end="top 70%" className="relative">
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'absolute top-1.5 size-[7px] rounded-full',
                                            '-left-10 md:-left-14',
                                            isWork ? 'bg-accent shadow-[0_0_14px_var(--accent)]' : 'border border-ink/40',
                                        )}
                                    />
                                    <p className={cn('font-mono text-[0.6875rem] uppercase tracking-[0.2em]', isWork ? 'text-accent' : 'text-ink-muted')}>
                                        {formatEntryDates(entry, formatDate, t('present'))}
                                    </p>
                                    <h3 className={cn('mt-2 text-ink', isWork ? 'text-xl font-normal md:text-[1.375rem]' : 'text-lg font-light')}>
                                        {isWork ? entry.organization : t(`items.${entry.id}.role`)}
                                    </h3>
                                    <p className="mt-1 text-[0.9375rem] text-ink-soft">
                                        {isWork ? t(`items.${entry.id}.role`) : (entry.detail ?? entry.organization)}
                                    </p>
                                    {entry.hasSummary ? (
                                        <p className="mt-3 max-w-[58ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                                            {t(`items.${entry.id}.summary`)}
                                        </p>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </Container>
        </section>
    )
}
