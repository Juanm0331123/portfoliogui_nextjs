import { getTranslations } from 'next-intl/server'
import { sectionLabels, site } from '@/shared/config'
import { Container, RevealText, SectionLabel, TextLink } from '@/shared/ui'
import { AboutPortrait } from './AboutPortrait'

/** Results, in reading order; values and labels are copy under `About.proof`. */
const PROOF = ['analysis', 'time', 'agents'] as const

export async function About() {
    const t = await getTranslations('About')

    return (
        <section id="about" aria-labelledby="about-title" className="relative py-32 md:py-44">
            <Container className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
                <div className="order-2 lg:order-1 lg:col-span-5" data-reveal="fade" data-reveal-start="top 95%" data-reveal-end="top 45%">
                    <AboutPortrait alt={t('portraitAlt')} />
                </div>

                <div className="order-1 lg:order-2 lg:col-span-7">
                    <SectionLabel label={sectionLabels.about} />
                    <RevealText
                        as="h2"
                        id="about-title"
                        text={t('headline')}
                        className="mt-8 max-w-[18ch] font-display text-[clamp(2.1rem,4vw,3.6rem)] font-light leading-[1.08] text-ink"
                    />
                    <div className="mt-10 flex max-w-[60ch] flex-col gap-6 text-[1.0625rem] font-light leading-[1.7] text-ink-muted">
                        <p data-reveal="fade">{t('layers')}</p>
                        <p data-reveal="fade">
                            {t.rich('effect', {
                                strong: (chunks) => <strong className="font-normal text-ink">{chunks}</strong>,
                            })}
                        </p>
                    </div>
                    <dl
                        data-reveal="fade"
                        aria-label={t('proofLabel')}
                        className="mt-12 grid max-w-[60ch] gap-x-8 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-3"
                    >
                        {PROOF.map((key) => (
                            <div key={key} className="flex flex-col-reverse justify-end gap-2">
                                <dt className="text-sm font-light leading-[1.55] text-ink-soft">{t(`proof.${key}.label`)}</dt>
                                <dd className="font-display text-[1.75rem] font-light leading-none tracking-tight whitespace-nowrap text-ink">
                                    {t(`proof.${key}.value`)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <div data-reveal="fade" className="mt-10 flex flex-wrap items-center gap-x-8">
                        <TextLink href={site.cv} download icon="down">
                            {t('cv')}
                        </TextLink>
                        <TextLink href={site.linkedin} target="_blank" rel="noopener noreferrer" icon="external" tone="muted">
                            {t('linkedin')}
                        </TextLink>
                    </div>
                </div>
            </Container>
        </section>
    )
}
