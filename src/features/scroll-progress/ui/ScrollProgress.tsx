'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { registerScrollTrigger, scrubbed } from '@/shared/animation'
import { useIsomorphicLayoutEffect } from '@/shared/hooks'
import { cn } from '@/shared/lib'

/** A hairline that fills with the page's scroll progress. */
export function ScrollProgress({ className }: { className?: string }) {
    const ref = useRef<HTMLSpanElement>(null)

    useIsomorphicLayoutEffect(() => {
        const bar = ref.current
        if (!bar) return
        registerScrollTrigger()
        const tween = gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: scrubbed({ trigger: document.documentElement, start: 'top top', end: 'max' }),
            },
        )
        return () => {
            tween.scrollTrigger?.kill()
            tween.kill()
        }
    }, [])

    return <span ref={ref} aria-hidden="true" className={cn('block h-px origin-left bg-accent', className)} />
}
