'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { ScrollReveal } from '@/features/scroll-reveal'
import { SmoothScroll } from '@/features/smooth-scroll'
import { SwarmChoreography } from '@/features/swarm-choreography'
import { markAppReady } from '@/shared/lib'
import { SwarmCanvas } from '@/shared/three'
import { Loader } from '@/widgets/loader'
import { Navbar } from '@/widgets/navbar'

/**
 * Composition root for everything that wraps the page: the WebGL canvas
 * behind it, the Loader in front of it, the navbar, and the headless
 * scroll-driven features. The headless ones are mounted after the page so
 * their effects run once every section is in the DOM.
 */
export function AppShell({ children }: { children: ReactNode }) {
    const [loaderVisible, setLoaderVisible] = useState(true)

    const onLoaderDismiss = useCallback(() => {
        setLoaderVisible(false)
        markAppReady()
    }, [])

    return (
        <>
            <SwarmCanvas />
            <Loader onDismiss={onLoaderDismiss} />
            <Navbar />
            {children}
            <SmoothScroll enabled={!loaderVisible} />
            <SwarmChoreography />
            <ScrollReveal />
        </>
    )
}
