import { getTranslations } from 'next-intl/server'
import { familyIndex, skillFamilies } from '@/entities/skill'
import { sectionLabels } from '@/shared/config'
import { Container, RevealText, SectionLabel } from '@/shared/ui'
import { SkillsLattice } from './SkillsLattice'

/**
 * Two columns on desktop (copy left, lattice right). On a phone the lattice
 * comes straight after the headline: it is formed while the top of the
 * section is on screen, and placed any lower it would only scroll into view
 * once the swarm had already started leaving for Projects.
 */
export async function Skills() {
    const t = await getTranslations('Skills')

    return (
        <section id="skills" aria-labelledby="skills-title" className="relative py-28 md:py-40">
            <Container className="grid items-center gap-x-10 gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
                <div className="lg:col-span-5 lg:row-start-1 lg:self-end">
                    <SectionLabel label={sectionLabels.skills} />
                    <RevealText
                        as="h2"
                        id="skills-title"
                        text={t('headline')}
                        className="mt-8 max-w-[16ch] font-display text-[clamp(2.1rem,3.6vw,3.3rem)] font-light leading-[1.08] text-ink"
                    />
                </div>

                <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
                    <SkillsLattice label={t('listLabel')} />
                </div>

                <div className="lg:col-span-5 lg:row-start-2 lg:self-start">
                    <p data-reveal="fade" className="max-w-[38ch] text-[1.0625rem] font-light leading-[1.7] text-ink-muted">
                        {t('body')}
                    </p>
                    <ol
                        data-reveal="fade"
                        aria-label={t('familiesLabel')}
                        className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-hairline pt-6 text-sm text-ink-soft"
                    >
                        {skillFamilies.map((family) => (
                            <li key={family} className="flex items-baseline gap-3">
                                <span aria-hidden="true" className="font-mono text-[0.625rem] text-accent">
                                    {familyIndex(family)}
                                </span>
                                {t(`families.${family}`)}
                            </li>
                        ))}
                    </ol>
                </div>
            </Container>
        </section>
    )
}
