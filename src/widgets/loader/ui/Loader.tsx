'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { gsapEase, registerGsapEasing } from '@/shared/animation'
import { site } from '@/shared/config'
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/shared/hooks'
import { publishWordmarkDissolve, sampleTextElement } from '@/shared/lib'
import { useLoaderProgress } from '../model'

const SESSION_KEY = 'immiguel:loader-seen'
const HOLD_AFTER_COMPLETE_MS = 220
/** How long the backdrop takes to uncover the particles standing behind it. */
const UNCOVER_S = 0.4
const TEXT_FADE_DELAY_S = 0.1
const TEXT_FADE_S = 0.3
/**
 * Upper bound on the exit. A throttled or background tab can stall rAF for
 * seconds, and a tween that never completes must not leave the overlay up.
 */
const EXIT_SAFETY_TIMEOUT_MS = 2000

type LoaderProps = {
    /** Fires once, the moment the overlay is gone. */
    onDismiss: () => void
}

/**
 * The first thing on screen, rendered by the server so it covers the very
 * first paint. Its exit is a handoff, not a wipe: the wordmark is rasterised
 * into points, the swarm takes those exact positions behind the overlay, and
 * only then does the overlay fade away to uncover it.
 */
export function Loader({ onDismiss }: LoaderProps) {
    const t = useTranslations('Loader')
    // Visible by default on purpose: this is what SSR renders.
    const [isDismissed, setIsDismissed] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const wordmarkRef = useRef<HTMLParagraphElement>(null)
    const checkedSession = useRef(false)
    const startedExit = useRef(false)
    const notified = useRef(false)

    const prefersReducedMotion = usePrefersReducedMotion()
    const { progress, isComplete } = useLoaderProgress(prefersReducedMotion ? 250 : undefined)

    useIsomorphicLayoutEffect(() => {
        if (checkedSession.current) return
        checkedSession.current = true
        // Always play in development, so it can be watched on every reload.
        if (process.env.NODE_ENV === 'development') return
        if (sessionStorage.getItem(SESSION_KEY) === '1') {
            setIsDismissed(true)
            return
        }
        sessionStorage.setItem(SESSION_KEY, '1')
    }, [])

    useEffect(() => {
        if (!isDismissed || notified.current) return
        notified.current = true
        onDismiss()
    }, [isDismissed, onDismiss])

    useEffect(() => {
        if (isDismissed) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [isDismissed])

    useEffect(() => {
        if (isDismissed || !isComplete || startedExit.current) return
        startedExit.current = true

        const dismiss = () => setIsDismissed(true)
        let safety: ReturnType<typeof setTimeout> | undefined

        const hold = setTimeout(
            () => {
                const overlay = overlayRef.current
                if (!overlay) return dismiss()
                safety = setTimeout(dismiss, EXIT_SAFETY_TIMEOUT_MS)

                if (prefersReducedMotion) {
                    gsap.to(overlay, { opacity: 0, duration: 0.2, ease: 'power1.out', onComplete: dismiss })
                    return
                }

                registerGsapEasing()
                const wordmark = wordmarkRef.current
                const points = wordmark ? sampleTextElement(wordmark) : null
                const backdrop = backdropRef.current
                const content = contentRef.current

                if (!points || !backdrop || !content) {
                    gsap.to(overlay, { opacity: 0, duration: 0.6, ease: gsapEase.inOut, onComplete: dismiss })
                    return
                }

                publishWordmarkDissolve({ points })
                gsap
                    .timeline({ onComplete: dismiss })
                    .to(backdrop, { opacity: 0, duration: UNCOVER_S, ease: gsapEase.out }, 0)
                    .to(content, { opacity: 0, duration: TEXT_FADE_S, ease: 'power1.out' }, TEXT_FADE_DELAY_S)
            },
            prefersReducedMotion ? 0 : HOLD_AFTER_COMPLETE_MS,
        )

        return () => {
            clearTimeout(hold)
            clearTimeout(safety)
        }
    }, [isComplete, isDismissed, prefersReducedMotion])

    if (isDismissed) return null

    const letters = Array.from(site.brand)

    return (
        <div
            ref={overlayRef}
            role="status"
            aria-live="polite"
            aria-busy={!isComplete}
            aria-label={t('status')}
            className="fixed inset-0 z-[70] flex items-center justify-center"
        >
            <div ref={backdropRef} aria-hidden="true" className="absolute inset-0 bg-bg" />
            <div ref={contentRef} className="relative flex flex-col items-center gap-8">
                <p
                    ref={wordmarkRef}
                    aria-label={site.brand}
                    className="font-display text-2xl font-light tracking-[0.14em] text-ink md:text-[2.125rem]"
                >
                    {letters.map((letter, index) => (
                        <span
                            key={index}
                            aria-hidden="true"
                            className="inline-block animate-[loader-letter_700ms_var(--ease-out)_both] motion-reduce:animate-none"
                            style={{ animationDelay: `${index * 45}ms` } as CSSProperties}
                        >
                            {letter === ' ' ? ' ' : letter}
                        </span>
                    ))}
                </p>
                <p className="font-mono text-[0.6875rem] tabular-nums tracking-[0.3em] text-ink-muted">{progress}%</p>
            </div>
        </div>
    )
}
