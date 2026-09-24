import { cn } from '@/shared/lib'

type SectionLabelProps = {
    label: string
    className?: string
}

/** The chapter marker: a hairline in the section's accent and an English label. */
export function SectionLabel({ label, className }: SectionLabelProps) {
    return (
        <p
            data-reveal="label"
            className={cn('flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-ink-muted', className)}
        >
            <span data-reveal-rule aria-hidden="true" className="h-px w-6 origin-left bg-accent" />
            {label}
        </p>
    )
}
