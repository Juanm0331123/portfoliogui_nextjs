'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerScrollTrigger, scrubbed } from '@/shared/animation'
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/shared/hooks'
import { groupWordsByLine } from '../model/lines'

/**
 * Headless. Every `[data-reveal]` element on the page gets its own scrubbed
 * timeline, so a reveal is a function of scroll position like the swarm is:
 * scroll back above it and it un-reveals along the same path.
 *
 * - `lines`  a RevealText: word by word, each rises out of a blur, in reading order.
 * - `label`  a SectionLabel: fades in while its hairline draws.
 * - `fade`   any block: rises and fades.
 * - `rule`   a hairline: draws from the left.
 * - `rail`   a vertical line: draws downward, linearly, across its range.
 *
 * `data-reveal-start` / `data-reveal-end` override the range.
 *
 * Under reduced motion nothing is set up and every element simply stays
 * visible, which is also what a no-JavaScript visitor gets.
 */
export function ScrollReveal() {
    const prefersReducedMotion = usePrefersReducedMotion()

    useIsomorphicLayoutEffect(() => {
        if (prefersReducedMotion) return
        registerScrollTrigger()

        const build = () =>
            gsap.context(() => {
                document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
                    if (element.dataset.revealTrigger === 'intro') return

                    const timeline = gsap.timeline({
                        scrollTrigger: scrubbed({
                            trigger: element,
                            start: element.dataset.revealStart ?? 'top 90%',
                            end: element.dataset.revealEnd ?? 'top 60%',
                        }),
                    })

                    switch (element.dataset.reveal) {
                        case 'lines': {
                            // Reading order: line by line, left to right within
                            // a line — the way the eye would focus on them.
                            // Set every word's start state explicitly: a staggered
                            // fromTo inside a timeline only renders its first
                            // target immediately, which left the rest visible
                            // until their turn came.
                            const words = groupWordsByLine(element).flat()
                            gsap.set(words, { opacity: 0, yPercent: 40, filter: 'blur(12px)' })
                            timeline.to(words, {
                                opacity: 1,
                                yPercent: 0,
                                filter: 'blur(0px)',
                                duration: 1,
                                ease: 'power2.out',
                                stagger: { each: 0.12 },
                            })
                            break
                        }
                        case 'label': {
                            timeline.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'none' }, 0)
                            const rule = element.querySelector('[data-reveal-rule]')
                            if (rule) timeline.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, 0)
                            break
                        }
                        case 'rule':
                            timeline.fromTo(
                                element,
                                { scaleX: 0, transformOrigin: 'left center' },
                                { scaleX: 1, duration: 1, ease: 'power2.inOut' },
                            )
                            break
                        case 'rail':
                            timeline.fromTo(
                                element,
                                { scaleY: 0, transformOrigin: 'center top' },
                                { scaleY: 1, duration: 1, ease: 'none' },
                            )
                            break
                        default:
                            timeline.fromTo(
                                element,
                                { opacity: 0, y: 36, filter: 'blur(10px)' },
                                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
                            )
                    }
                })
            })

        let context = build()

        // Which words share a line depends on the width; rebuild when it changes.
        let width = window.innerWidth
        let timer: ReturnType<typeof setTimeout> | undefined
        const onResize = () => {
            if (window.innerWidth === width) return
            width = window.innerWidth
            clearTimeout(timer)
            timer = setTimeout(() => {
                context.revert()
                context = build()
                ScrollTrigger.refresh()
            }, 200)
        }
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            clearTimeout(timer)
            context.revert()
        }
    }, [prefersReducedMotion])

    return null
}
