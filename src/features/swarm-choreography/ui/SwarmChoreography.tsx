'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { gsapEase, registerGsapEasing, registerScrollTrigger, scrubbed, settleScrollTriggers } from '@/shared/animation'
import { readPrefersReducedMotion } from '@/shared/hooks'
import { markIntroBurst, onAppReady, onWordmarkDissolve } from '@/shared/lib'
import { onSwarmReady, setSwarmWordmark, swarmState, type ScrollBand } from '@/shared/three'
import { SWARM_BANDS } from '../model/bands'

/** Beat the wordmark holds as particles before it starts to fall in. */
const WORDMARK_HOLD_S = 0.15
const COLLAPSE_S = 0.95
/** The singularity breathes this long before it bursts. */
const BREATH_S = 0.2
const BURST_S = 1.6

/**
 * Drives the swarm. Two independent layers:
 *
 * - The scroll layer. One scrubbed tween per band, writing a 0..1 value that
 *   the engine sums into `uProgress`. Nothing here listens for enter or leave:
 *   the value IS the scroll position, smoothed by `scrub`, so scrolling back
 *   through a range plays the transition backwards, exactly.
 *
 * - The intro. Plays once per load, on the clock, and ends with `intro` and
 *   `burst` at 1 — the values the scroll layer assumes from then on. Wordmark
 *   → collapse into a single breathing point → burst into the Hero's ring.
 */
export function SwarmChoreography() {
    useEffect(() => {
        registerScrollTrigger()

        const bands: ScrollBand[] = SWARM_BANDS.map(() => ({ value: 0 }))
        swarmState.bands = bands

        const context = gsap.context(() => {
            SWARM_BANDS.forEach((band, index) => {
                if (!document.querySelector(band.trigger)) return
                gsap.fromTo(
                    bands[index],
                    { value: 0 },
                    {
                        value: 1,
                        ease: 'none',
                        scrollTrigger: scrubbed({ trigger: band.trigger, start: band.start, end: band.end }),
                    },
                )
            })
        })

        // Web fonts change line heights, and with them every section's offset.
        document.fonts?.ready.then(settleScrollTriggers)

        return () => {
            context.revert()
            swarmState.bands = []
        }
    }, [])

    useEffect(() => {
        registerGsapEasing()
        const reduced = readPrefersReducedMotion()
        let started = false
        let timeline: gsap.core.Timeline | null = null
        const stops: (() => void)[] = []

        // Nothing starts until the engine has actually drawn a few frames.
        // Starting on the clock while shaders were still compiling made the
        // first second of the intro jump ahead in one step.
        const whenSwarmReady = (run: () => void) => stops.push(onSwarmReady(run))

        stops.push(
            onWordmarkDissolve(({ points }) => {
                if (started) return
                started = true
                setSwarmWordmark(points)
                swarmState.intro = 0

                // Reloaded below the Hero: the wordmark dissolves straight into
                // the formation the reader is looking at, instead of collapsing
                // into the point and flying back out through every formation
                // above them.
                if (window.scrollY > window.innerHeight * 0.5) {
                    swarmState.burst = 1
                    whenSwarmReady(() => {
                        timeline = gsap
                            .timeline()
                            .call(markIntroBurst)
                            .to(swarmState, { intro: 1, duration: COLLAPSE_S * 1.3, ease: gsapEase.inOut }, WORDMARK_HOLD_S)
                    })
                    return
                }

                swarmState.burst = 0
                whenSwarmReady(() => {
                    timeline = gsap
                        .timeline()
                        .to(swarmState, { intro: 1, duration: COLLAPSE_S, ease: gsapEase.inOut }, WORDMARK_HOLD_S)
                        .call(markIntroBurst, undefined, `+=${BREATH_S}`)
                        .to(swarmState, { burst: 1, duration: BURST_S, ease: gsapEase.expo }, '<')
                })
            }),
        )

        stops.push(
            onAppReady(() => {
                // The Loader held the page at overflow: hidden, so every trigger
                // measured a page that could not scroll. Settle them where the
                // reader actually is, with no catch-up animation.
                settleScrollTriggers()

                if (started) return
                started = true
                swarmState.intro = 1

                // Reduced motion, or a reload that restored a scroll position
                // below the Hero: no singularity. Collapsing into the point and
                // flying back out through every formation above the reader
                // would be a detour, not an intro.
                if (reduced || window.scrollY > window.innerHeight * 0.5) {
                    swarmState.burst = 1
                    markIntroBurst()
                    return
                }

                whenSwarmReady(() => {
                    timeline = gsap
                        .timeline()
                        .call(markIntroBurst)
                        .to(swarmState, { burst: 1, duration: BURST_S * 0.9, ease: gsapEase.expo }, 0)
                })
            }),
        )

        return () => {
            stops.forEach((stop) => stop())
            timeline?.kill()
        }
    }, [])

    return null
}
