import { getTranslations } from 'next-intl/server'
import { sectionLabels } from '@/shared/config'
import { SwarmAnchor } from '@/shared/three'
import { Container, RevealText, SectionLabel } from '@/shared/ui'
import { ContactActions } from './ContactActions'

export async function Contact() {
    const t = await getTranslations('Contact')

    return (
        <section
            id="contact"
            data-tone="warm"
            aria-labelledby="contact-title"
            className="relative flex min-h-svh flex-col justify-center py-32"
        >
            {/* The vortex's dark core: its inner lip wraps this box, so the
                call to action sits in the one calm spot of the section. */}
            <SwarmAnchor
                name="contact"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[min(46rem,94vw)] -translate-x-1/2 -translate-y-1/2"
            />

            <Container className="relative flex flex-col items-center text-center">
                <SectionLabel label={sectionLabels.contact} className="justify-center" />
                <RevealText
                    as="h2"
                    id="contact-title"
                    text={t('headline')}
                    className="mt-8 font-display text-[clamp(2.3rem,5.2vw,4.4rem)] font-light leading-[1.04] text-ink"
                />
                <p data-reveal="fade" className="mt-6 max-w-[42ch] text-[1.0625rem] font-light leading-[1.7] text-ink-muted">
                    {t('body')}
                </p>
                <div className="mt-10 w-full max-w-2xl">
                    <ContactActions />
                </div>
            </Container>
        </section>
    )
}
