'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerScrollTrigger } from '@/shared/animation'
import { usePrefersReducedMotion } from '@/shared/hooks'
import { getLenis, setLenis } from '../model/lenis'

type SmoothScrollProps = {
    /** False while the Loader holds the page. */
    enabled: boolean
}

/**
 * Lenis driven by GSAP's ticker, so the smoothed scroll position and every
 * scrubbed ScrollTrigger advance in the same frame. `lagSmoothing(0)` stops
 * GSAP from compensating for a slow frame by jumping time, which would make a
 * scrub drift away from the actual scroll position.
 *
 * Under reduced motion there is no Lenis at all: native scroll, no inertia.
 */
export function SmoothScroll({ enabled }: SmoothScrollProps) {
    const prefersReducedMotion = usePrefersReducedMotion()

    useEffect(() => {
        registerScrollTrigger()
        if (prefersReducedMotion) return

        const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: true })
        setLenis(lenis)
        // Development handle for the reversibility checks (scripted scrolling).
        if (process.env.NODE_ENV === 'development') (window as Window & { __lenis?: Lenis }).__lenis = lenis

        lenis.on('scroll', ScrollTrigger.update)

        const onTick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(onTick)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(onTick)
            lenis.destroy()
            setLenis(null)
        }
    }, [prefersReducedMotion])

    useEffect(() => {
        // Stopping (rather than destroying) keeps one Lenis for the whole visit.
        const lenis = getLenis()
        if (!lenis) return
        if (enabled) lenis.start()
        else lenis.stop()
    }, [enabled, prefersReducedMotion])

    return null
}
