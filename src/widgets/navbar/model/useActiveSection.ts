'use client'

import { useEffect, useState } from 'react'
import { sectionIds, type SectionId } from '@/shared/config'

/**
 * The section the reader is in, recomputed from the layout on every scroll —
 * a pure function of the scroll position, so it is always right in either
 * direction, after a jump, or after a resize.
 */
export function useActiveSection(): SectionId {
    const [active, setActive] = useState<SectionId>('hero')

    useEffect(() => {
        let frame = 0
        const measure = () => {
            frame = 0
            const line = window.innerHeight * 0.45
            let current: SectionId = 'hero'
            for (const id of sectionIds) {
                const element = document.getElementById(id)
                if (element && element.getBoundingClientRect().top <= line) current = id
            }
            setActive(current)
        }
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure)
        }
        measure()
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
        }
    }, [])

    return active
}
