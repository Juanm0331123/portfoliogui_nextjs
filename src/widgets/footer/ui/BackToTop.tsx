'use client'

import { ArrowUp } from 'lucide-react'
import { scrollToTarget } from '@/features/smooth-scroll'

export function BackToTop({ label }: { label: string }) {
    return (
        <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group inline-flex min-h-11 items-center gap-2.5 text-sm text-ink-soft transition-colors duration-300 hover:text-ink"
        >
            {label}
            <ArrowUp aria-hidden="true" strokeWidth={1.5} className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
        </button>
    )
}
