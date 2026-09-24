import type Lenis from 'lenis'

let current: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
    current = lenis
}

export function getLenis(): Lenis | null {
    return current
}

/**
 * Scrolls to a section through Lenis when it is running, so an in-page link
 * glides with the same inertia as the wheel; falls back to the browser.
 */
export function scrollToTarget(target: string | number) {
    const lenis = current
    if (lenis) {
        lenis.scrollTo(target, { duration: 1.6 })
        return
    }
    if (typeof target === 'number') {
        window.scrollTo({ top: target })
        return
    }
    document.querySelector(target)?.scrollIntoView()
}
