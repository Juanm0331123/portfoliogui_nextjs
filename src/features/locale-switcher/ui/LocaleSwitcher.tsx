'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'
import { cn } from '@/shared/lib'

export function LocaleSwitcher({ className }: { className?: string }) {
    const t = useTranslations('LocaleSwitcher')
    const locale = useLocale() as AppLocale
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const switchTo = (next: AppLocale) => {
        if (next === locale) return
        // scroll: false keeps the reader where they are in the story.
        startTransition(() => router.replace(pathname, { locale: next, scroll: false }))
    }

    return (
        <div role="group" aria-label={t('label')} className={cn('flex items-center font-mono text-[0.6875rem] tracking-[0.18em]', className)}>
            {routing.locales.map((option, index) => (
                <span key={option} className="flex items-center">
                    {index > 0 ? (
                        <span aria-hidden="true" className="px-1.5 text-ink-faint">
                            /
                        </span>
                    ) : null}
                    <button
                        type="button"
                        lang={option}
                        disabled={isPending}
                        aria-current={option === locale ? 'true' : undefined}
                        aria-label={t('switchTo', { language: t(`names.${option}`) })}
                        onClick={() => switchTo(option)}
                        className={cn(
                            'min-h-11 min-w-8 transition-colors duration-300',
                            option === locale ? 'text-ink' : 'text-ink-muted hover:text-ink',
                        )}
                    >
                        {t(option)}
                    </button>
                </span>
            ))}
        </div>
    )
}
