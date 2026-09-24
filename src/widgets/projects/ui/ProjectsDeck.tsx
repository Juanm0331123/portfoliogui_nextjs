'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { scrollToTarget } from '@/features/smooth-scroll'
import { registerScrollTrigger, scrubbed } from '@/shared/animation'
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/shared/hooks'
import { cardState, deckDuration, HOLD, type ProjectSlide } from '../model'
import { DataBridgeDiagram } from './DataBridgeDiagram'

const COPY_SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)' }
const COPY_HIDDEN = { opacity: 0, y: 28, filter: 'blur(8px)' }
const COPY_GONE = { opacity: 0, y: -20, filter: 'blur(8px)' }
const TAB_ACTIVE = { opacity: 1 }
const TAB_IDLE = { opacity: 0.38 }

type ProjectsDeckProps = {
    slides: ProjectSlide[]
    indexLabel: string
}

/**
 * The projects as a deck of huge cards stacked in depth. The one being read
 * fills the stage; the next waits behind it, dimmed and out of focus. Scroll
 * and the front card passes the viewer — lifting, growing, blurring away —
 * while the next rises out of the depth into focus.
 *
 * One scrubbed timeline owns every moving part (cards, their copy, the
 * counter, the tabs, the progress line), and every tween states both ends
 * explicitly, so any scroll position — reached in either direction, or after
 * a reload — draws exactly the same frame.
 */
export function ProjectsDeck({ slides, indexLabel }: ProjectsDeckProps) {
    const rootRef = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = usePrefersReducedMotion()

    useIsomorphicLayoutEffect(() => {
        const root = rootRef.current
        const section = root?.closest('section')
        if (!root || !section || prefersReducedMotion) return
        registerScrollTrigger()

        const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector))
        const cards = all('[data-card]')
        const copies = all('[data-card-copy]')
        const images = all('[data-card-image]')
        const counts = all('[data-count]')
        const tabs = all('[data-tab]')
        const progress = root.querySelector<HTMLElement>('[data-progress]')
        const n = cards.length
        const total = deckDuration(n)

        const context = gsap.context(() => {
            // Explicit resting states for the top of the section.
            cards.forEach((card, i) => gsap.set(card, { ...cardState(i), zIndex: n - i, transformPerspective: 1600 }))
            copies.forEach((copy, i) => gsap.set(copy, i === 0 ? COPY_SHOWN : COPY_HIDDEN))
            images.forEach((image, i) => gsap.set(image, { scale: i === 0 ? 1 : 1.14 }))
            counts.forEach((count, i) => gsap.set(count, { yPercent: i === 0 ? 0 : 100, opacity: i === 0 ? 1 : 0 }))
            tabs.forEach((tab, i) => gsap.set(tab, i === 0 ? TAB_ACTIVE : TAB_IDLE))
            if (progress) gsap.set(progress, { scaleX: 1 / n, transformOrigin: 'left center' })

            const timeline = gsap.timeline({
                scrollTrigger: scrubbed({ trigger: section, start: 'top top', end: 'bottom bottom' }),
                defaults: { ease: 'none', immediateRender: false },
            })

            // Hand-over k: project k passes the viewer, k + 1 comes into focus.
            for (let k = 0; k < n - 1; k++) {
                const at = k + HOLD
                const span = 1 - HOLD

                cards.forEach((card, i) => {
                    const from = i - k
                    const to = i - k - 1
                    if ((from > 2 && to > 2) || (from < -1 && to < -1)) return
                    timeline.fromTo(card, cardState(from), { ...cardState(to), duration: span, ease: 'power2.inOut' }, at)
                })

                timeline.fromTo(copies[k], COPY_SHOWN, { ...COPY_GONE, duration: span * 0.4, ease: 'power2.in' }, at)
                timeline.fromTo(copies[k + 1], COPY_HIDDEN, { ...COPY_SHOWN, duration: span * 0.45, ease: 'power2.out' }, at + span * 0.55)
                timeline.fromTo(images[k + 1], { scale: 1.14 }, { scale: 1, duration: span, ease: 'power2.out' }, at)

                timeline.fromTo(counts[k], { yPercent: 0, opacity: 1 }, { yPercent: -100, opacity: 0, duration: span * 0.4 }, at + span * 0.3)
                timeline.fromTo(counts[k + 1], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: span * 0.4 }, at + span * 0.3)
                timeline.fromTo(tabs[k], TAB_ACTIVE, { ...TAB_IDLE, duration: span }, at)
                timeline.fromTo(tabs[k + 1], TAB_IDLE, { ...TAB_ACTIVE, duration: span }, at)
            }

            if (progress) timeline.fromTo(progress, { scaleX: 1 / n }, { scaleX: 1, duration: total - HOLD }, HOLD)
            // Pin the timeline's length: the last project's hold is part of it.
            timeline.set({}, {}, total)
        }, root)

        return () => context.revert()
    }, [prefersReducedMotion, slides.length])

    // Jump to the moment a project has just come into focus.
    const goTo = (index: number) => {
        const section = rootRef.current?.closest('section')
        if (!section) return
        const top = section.getBoundingClientRect().top + window.scrollY
        const travel = section.offsetHeight - window.innerHeight
        scrollToTarget(Math.round(top + (Math.max(index, 0.02) / deckDuration(slides.length)) * travel))
    }

    const total = String(slides.length).padStart(2, '0')

    return (
        <div ref={rootRef} className="relative flex min-h-0 flex-1 flex-col motion-reduce:block">
            <div className="relative grid min-h-0 flex-1 place-items-center px-4 motion-reduce:block motion-reduce:space-y-16 motion-reduce:px-5">
                {slides.map((slide, i) => (
                    <article
                        key={slide.id}
                        data-card
                        aria-labelledby={`project-${slide.id}`}
                        className="col-start-1 row-start-1 w-full max-w-[92vw] will-change-transform md:w-[min(90vw,calc((100svh-16.5rem)*1.72),80rem)] motion-reduce:mx-auto motion-reduce:max-w-5xl"
                    >
                        <div className="relative overflow-hidden rounded-[18px] border border-ink/10 bg-[#07070a] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] md:aspect-[1.72]">
                            <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[16/10] md:absolute md:inset-0 md:aspect-auto">
                                <div data-card-image className="h-full w-full will-change-transform">
                                    {slide.image ? (
                                        <Image
                                            src={slide.image.src}
                                            alt={slide.image.alt}
                                            width={slide.image.width}
                                            height={slide.image.height}
                                            priority={i === 0}
                                            sizes="(min-width: 768px) 80rem, 92vw"
                                            className="h-full w-full object-cover"
                                            style={{ objectPosition: slide.image.focus }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(255,122,47,0.08),transparent_70%)] md:items-start md:pt-[6%]">
                                            <div className="w-full max-w-3xl">
                                                <DataBridgeDiagram label={slide.diagramLabel ?? slide.title} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Legibility for the copy that sits on the image on wide screens. */}
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 hidden bg-gradient-to-t from-[#050507] from-[8%] via-[#050507]/75 via-[38%] to-transparent to-[72%] md:block"
                                />
                                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07070a] to-transparent md:hidden" />
                            </div>

                            <div
                                data-card-copy
                                className="relative grid gap-4 p-5 sm:gap-5 sm:p-7 md:absolute md:inset-x-0 md:bottom-0 md:grid-cols-12 md:items-end md:gap-8 md:p-10 lg:p-12"
                            >
                                <div className="md:col-span-7">
                                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-accent">
                                        {slide.index} · {slide.meta}
                                    </p>
                                    <h3
                                        id={`project-${slide.id}`}
                                        className="mt-2 font-display text-[clamp(1.9rem,5vw,5.2rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink sm:mt-3"
                                    >
                                        {slide.title}
                                    </h3>
                                    <p className="mt-3 line-clamp-3 max-w-[46ch] text-sm leading-relaxed text-ink-soft sm:mt-4 sm:line-clamp-none md:text-[0.9375rem]">{slide.summary}</p>
                                </div>
                                <div className="md:col-span-5 md:border-l md:border-ink/10 md:pl-8">
                                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-ink-muted">{slide.decisionLabel}</p>
                                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink sm:line-clamp-none md:text-[0.9375rem]">{slide.decision}</p>
                                    <ul className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
                                        {slide.stack.map((tech) => (
                                            <li
                                                key={tech}
                                                className="rounded-full border border-ink/12 bg-ink/[0.04] px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.06em] text-ink-soft"
                                            >
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>
                                    {slide.url ? (
                                        <a
                                            href={slide.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group mt-4 inline-flex min-h-11 items-center gap-3 rounded-full border border-ink/25 bg-ink/[0.06] py-1 pl-5 pr-1 text-sm text-ink backdrop-blur-md transition-colors duration-300 hover:border-accent hover:bg-ink/10"
                                        >
                                            {slide.visitLabel}
                                            <span className="flex size-9 items-center justify-center rounded-full border border-ink/25 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-rotate-45">
                                                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                                            </span>
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mx-auto flex w-full max-w-[90rem] items-center gap-6 px-5 pb-6 pt-4 sm:px-8 lg:px-16 motion-reduce:hidden">
                <p aria-hidden="true" className="flex items-baseline gap-2 font-mono text-sm tracking-[0.2em] text-ink-muted">
                    <span className="relative inline-block h-[1.3em] w-[2.2ch] overflow-hidden text-ink">
                        {slides.map((slide, i) => (
                            <span key={slide.id} data-count className="absolute inset-0" style={i === 0 ? undefined : { opacity: 0 }}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        ))}
                    </span>
                    / {total}
                </p>
                <div className="relative h-px flex-1 bg-ink/12">
                    <span data-progress className="absolute inset-0 origin-left bg-accent" />
                </div>
                <nav aria-label={indexLabel} className="hidden items-center gap-6 md:flex">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.id}
                            type="button"
                            data-tab
                            onClick={() => goTo(i)}
                            className="min-h-11 whitespace-nowrap text-[0.8125rem] text-ink transition-colors duration-300 hover:text-accent"
                            style={i === 0 ? undefined : { opacity: 0.38 }}
                        >
                            {slide.title}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
