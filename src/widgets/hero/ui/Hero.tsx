import { getTranslations } from 'next-intl/server'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { site } from '@/shared/config'
import { SwarmAnchor } from '@/shared/three'
import { Container, RevealText } from '@/shared/ui'
import { HeroStage } from './HeroStage'

/**
 * Centred inside the ring: badge, headline, one line of intent, two actions.
 * The ring is anchored to the whole section and sized by the engine to run
 * off the top and bottom of a landscape screen, so the copy always sits in its
 * dark centre.
 */
export async function Hero() {
    const t = await getTranslations('Hero')

    return (
        <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden py-28">
            <SwarmAnchor name="hero" className="pointer-events-none absolute inset-0" />

            <Container className="relative">
                <HeroStage>
                    <p
                        data-hero-fade
                        className="inline-flex items-center gap-2.5 rounded-full border border-ink/12 bg-ink/[0.04] px-4 py-1.5 text-[0.8125rem] text-ink-soft backdrop-blur-md"
                    >
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-warm shadow-[0_0_10px_var(--warm)]" />
                        {t('badge')}
                    </p>

                    <RevealText
                        as="h1"
                        id="hero-title"
                        trigger="intro"
                        text={site.brand}
                        className="mt-8 font-display text-[clamp(3.2rem,8.4vw,7.6rem)] font-light leading-[0.98] tracking-[-0.035em] text-ink"
                    />

                    <RevealText
                        trigger="intro"
                        text={t('subtitle')}
                        className="mx-auto mt-7 max-w-[40ch] text-base leading-relaxed text-ink-muted md:text-lg"
                    />

                    <div data-hero-fade className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a
                            href="#projects"
                            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-ink/25 bg-ink/[0.06] py-1.5 pl-6 pr-1.5 text-sm text-ink backdrop-blur-md transition-colors duration-300 hover:border-ink/45 hover:bg-ink/10"
                        >
                            {t('ctaWork')}
                            <span className="flex size-9 items-center justify-center rounded-full border border-ink/25 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-rotate-45">
                                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                            </span>
                        </a>
                        <a
                            href={site.cv}
                            download
                            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink/[0.03] px-6 text-sm text-ink-soft transition-colors duration-300 hover:bg-ink/[0.07] hover:text-ink"
                        >
                            {t('ctaCv')}
                            <ArrowDown aria-hidden="true" strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                        </a>
                    </div>
                </HeroStage>
            </Container>

            <p
                aria-hidden="true"
                data-hero-fade
                className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-ink-muted"
            >
                {t('scroll')}
                <span className="h-10 w-px bg-gradient-to-b from-ink/50 to-transparent" />
            </p>
        </section>
    )
}
