'use client'

import { useEffect, useState } from 'react'
import { onSwarmReady } from '@/shared/three'

export type LoaderProgress = {
    /** 0–100. */
    progress: number
    isComplete: boolean
}

const DEFAULT_DURATION_MS = 1200
/**
 * The most the Loader waits for the swarm. Without WebGL (or on a device that
 * takes too long) the page must still open; the intro simply plays without
 * the particle handoff.
 */
const SWARM_WAIT_LIMIT_MS = 3500

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
}

/**
 * The number is paced by a time ramp (nothing here is fetched through a
 * loading manager — the swarm is procedural), but it cannot finish before:
 *
 * - the web fonts: the Loader hands its wordmark to the swarm by rasterising
 *   it, and a fallback font would put the particles in the wrong letterforms;
 * - the swarm: dissolving the overlay before the engine draws would uncover
 *   an empty screen and then pop the particles in.
 */
export function useLoaderProgress(durationMs = DEFAULT_DURATION_MS): LoaderProgress {
    const [ramp, setRamp] = useState(0)
    const [fontsReady, setFontsReady] = useState(false)
    const [swarmReady, setSwarmReady] = useState(false)

    useEffect(() => {
        const limit = setTimeout(() => setSwarmReady(true), SWARM_WAIT_LIMIT_MS)
        const stop = onSwarmReady(() => setSwarmReady(true))
        return () => {
            clearTimeout(limit)
            stop()
        }
    }, [])

    useEffect(() => {
        let frame = 0
        const start = performance.now()
        const tick = (now: number) => {
            const t = Math.min((now - start) / durationMs, 1)
            setRamp(easeOutCubic(t) * 100)
            if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [durationMs])

    useEffect(() => {
        let cancelled = false
        const ready = document.fonts ? document.fonts.ready : Promise.resolve()
        ready.then(() => {
            if (!cancelled) setFontsReady(true)
        })
        return () => {
            cancelled = true
        }
    }, [])

    const ready = fontsReady && swarmReady
    const progress = Math.round(ready ? ramp : Math.min(ramp, 96))
    return { progress, isComplete: ready && progress >= 100 }
}
