'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { groupWordsByLine } from '@/features/scroll-reveal'
import { gsapEase, registerGsapEasing, registerScrollTrigger, scrubbed } from '@/shared/animation'
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/shared/hooks'
import { onAppReady, onIntroBurst } from '@/shared/lib'
import { HERO_EXIT, INTRO_FALLBACK_MS } from '../model'

type HeroStageProps = {
    children: ReactNode
}

/**
 * Owns the Hero copy's motion.
 *
 * - Intro, once: as the singularity bursts into the ring, the words come into
 *   focus one after another, out of a blur, and the badge and actions follow.
 * - Exit, scrubbed: scrolling away blurs, lifts and fades the whole block;
 *   scrolling back brings it into focus along the same path.
 *
 * The intro animates the words and `[data-hero-fade]` blocks; the exit
 * animates the wrapper around them. Different elements on purpose, so the
 * one-time intro and the scrubbed exit never fight over a property.
 */
export function HeroStage({ children }: HeroStageProps) {
    const rootRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = usePrefersReducedMotion()

    useIsomorphicLayoutEffect(() => {
        const root = rootRef.current
        const section = root?.closest('section')
        if (!root || !section || prefersReducedMotion) return
        registerGsapEasing()
        registerScrollTrigger()

        const words = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-trigger="intro"]')).flatMap((element) =>
            groupWordsByLine(element).flat(),
        )
        const fades = section.querySelectorAll<HTMLElement>('[data-hero-fade]')
        let fallback: ReturnType<typeof setTimeout> | undefined
        let stopBurst = () => {}

        const context = gsap.context(() => {
            gsap.set(words, { opacity: 0, yPercent: 30, filter: 'blur(16px)' })
            gsap.set(fades, { opacity: 0, y: 16, filter: 'blur(8px)' })

            gsap.fromTo(
                root,
                { yPercent: 0, opacity: 1, filter: 'blur(0px)' },
                {
                    yPercent: -14,
                    opacity: 0,
                    filter: 'blur(14px)',
                    ease: 'none',
                    // The element, not '#hero': selector strings inside a scoped
                    // gsap.context resolve within the scope only.
                    scrollTrigger: scrubbed({ trigger: section, start: HERO_EXIT.start, end: HERO_EXIT.end }),
                },
            )
        }, root)

        let played = false
        const play = () => {
            if (played) return
            played = true
            clearTimeout(fallback)
            context.add(() => {
                gsap.timeline()
                    .to(fades[0] ?? [], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: gsapEase.out }, 0.2)
                    .to(words, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1.4, ease: gsapEase.expo, stagger: 0.07 }, 0.35)
                    .to(Array.from(fades).slice(1), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: gsapEase.out, stagger: 0.1 }, 1.1)
            })
        }

        const stopReady = onAppReady(() => {
            fallback = setTimeout(play, INTRO_FALLBACK_MS)
            stopBurst = onIntroBurst(play)
        })

        return () => {
            stopReady()
            stopBurst()
            clearTimeout(fallback)
            context.revert()
        }
    }, [prefersReducedMotion])

    return (
        <div ref={rootRef} className="relative flex flex-col items-center text-center will-change-transform">
            {children}
        </div>
    )
}
