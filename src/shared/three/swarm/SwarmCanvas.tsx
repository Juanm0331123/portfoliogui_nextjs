'use client'

import { useEffect, useRef } from 'react'
import { readPrefersReducedMotion } from '@/shared/hooks'
import { SwarmEngine } from './engine'

declare global {
    interface Window {
        __swarm?: SwarmEngine
    }
}

/**
 * Mounts the one WebGL canvas: fixed, full-viewport, behind every section.
 * React only owns its lifetime; everything it draws is the engine's.
 */
export function SwarmCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        let engine: SwarmEngine | null = null
        try {
            engine = new SwarmEngine(canvas, { reducedMotion: readPrefersReducedMotion() })
        } catch (error) {
            // No WebGL: the page is fully readable without the swarm.
            console.warn('[swarm] WebGL unavailable, rendering without it.', error)
            return
        }

        if (process.env.NODE_ENV === 'development') window.__swarm = engine

        return () => {
            engine?.dispose()
            if (window.__swarm === engine) delete window.__swarm
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-lvh w-screen" />
}
