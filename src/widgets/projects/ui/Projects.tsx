import { getTranslations } from 'next-intl/server'
import { projects } from '@/entities/project'
import { sectionLabels } from '@/shared/config'
import { Container, RevealText, SectionLabel } from '@/shared/ui'
import { deckDuration, VIEWPORTS_PER_UNIT, type ProjectSlide } from '../model'
import { ProjectsDeck } from './ProjectsDeck'

export async function Projects() {
    const t = await getTranslations('Projects')

    const slides: ProjectSlide[] = projects.map((project, i) => ({
        id: project.id,
        index: String(i + 1).padStart(2, '0'),
        title: project.title,
        meta: `${project.year} · ${t(`status.${project.status}`)}`,
        summary: t(`items.${project.id}.summary`),
        decisionLabel: t('decisionLabel'),
        decision: t(`items.${project.id}.decision`),
        stack: project.stack,
        url: project.url,
        visitLabel: t('visit'),
        image: project.image ? { ...project.image, alt: t(`items.${project.id}.imageAlt`) } : undefined,
        diagramLabel: project.image ? undefined : t(`items.${project.id}.diagramLabel`),
    }))

    // Tall on purpose: the stage is sticky, and the extra height is the
    // scroll the deck travels through — a viewport and a bit per project.
    const height = `${(1 + deckDuration(slides.length) * VIEWPORTS_PER_UNIT) * 100}svh`

    return (
        <section
            id="projects"
            data-tone="warm"
            aria-labelledby="projects-title"
            className="relative motion-reduce:!h-auto motion-reduce:py-32"
            style={{ height }}
        >
            <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-20 md:pt-24 motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
                <Container className="flex items-end justify-between gap-6 pb-5 md:pb-6">
                    <div>
                        <SectionLabel label={sectionLabels.projects} />
                        <RevealText
                            as="h2"
                            id="projects-title"
                            text={t('headline')}
                            className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-light leading-[1.08] text-ink"
                        />
                    </div>
                </Container>
                <ProjectsDeck slides={slides} indexLabel={t('indexLabel')} />
            </div>
        </section>
    )
}
