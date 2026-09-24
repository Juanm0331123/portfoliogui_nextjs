import type { ComponentPropsWithoutRef } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/lib'

const ICONS = { right: ArrowRight, down: ArrowDown, external: ArrowUpRight } as const

type TextLinkProps = ComponentPropsWithoutRef<'a'> & {
    icon?: keyof typeof ICONS
    tone?: 'strong' | 'muted'
}

/**
 * The site's only link style: text, a thin arrow, and a hairline that draws in
 * on hover. No pills, no filled buttons — the swarm is the loud thing here.
 */
export function TextLink({ icon = 'right', tone = 'strong', className, children, ...rest }: TextLinkProps) {
    const Icon = ICONS[icon]
    return (
        <a
            className={cn(
                'group relative inline-flex min-h-11 items-center gap-2.5 text-sm transition-colors duration-300 ease-[var(--ease-out)]',
                'focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-accent',
                tone === 'strong' ? 'text-ink hover:text-accent' : 'text-ink-muted hover:text-ink',
                className,
            )}
            {...rest}
        >
            <span className="relative">
                {children}
                <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-out)] group-hover:origin-left group-hover:scale-x-100"
                />
            </span>
            <Icon
                aria-hidden="true"
                strokeWidth={1.5}
                className={cn(
                    'size-4 transition-transform duration-500 ease-[var(--ease-out)]',
                    icon === 'right' && 'group-hover:translate-x-1',
                    icon === 'down' && 'group-hover:translate-y-0.5',
                    icon === 'external' && 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
                )}
            />
        </a>
    )
}
