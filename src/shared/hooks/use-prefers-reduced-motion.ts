'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
    const mediaQueryList = window.matchMedia(QUERY)
    mediaQueryList.addEventListener('change', onChange)
    return () => mediaQueryList.removeEventListener('change', onChange)
}

/** Synchronous read for code that runs outside React (the WebGL engine). */
export function readPrefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia(QUERY).matches
}

/** The server renders the full-motion markup; the client corrects it on hydration. */
export function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, readPrefersReducedMotion, () => false)
}
