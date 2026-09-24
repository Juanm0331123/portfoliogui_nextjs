'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { ScrollProgress } from '@/features/scroll-progress'
import { getLenis, scrollToTarget } from '@/features/smooth-scroll'
import { site } from '@/shared/config'
import { cn } from '@/shared/lib'
import { navLinks, useActiveSection, warmSections } from '../model'

/**
 * Thin glass bar, fixed at the top. Its accent follows the section in view,
 * and a hairline along its bottom edge fills with the scroll.
 */
export function Navbar() {
    const t = useTranslations('Navbar')
    const active = useActiveSection()
    const [isOpen, setIsOpen] = useState(false)
    const tone = warmSections.includes(active) ? 'warm' : 'cool'

    useEffect(() => {
        if (!isOpen) return
        const lenis = getLenis()
        lenis?.stop()
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => {
            lenis?.start()
            document.body.style.overflow = previous
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen])

    const go = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        setIsOpen(false)
        // Let the menu release the scroll lock before gliding.
        requestAnimationFrame(() => scrollToTarget(target))
    }

    return (
        <header data-tone={tone} className="fixed inset-x-0 top-0 z-50">
            <div className="relative border-b border-hairline bg-glass backdrop-blur-xl backdrop-saturate-150">
                <nav aria-label={t('primary')} className="mx-auto flex h-14 w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
                    <a
                        href="#hero"
                        onClick={go('#hero')}
                        aria-label={t('home')}
                        className="flex min-h-11 items-center font-display text-[0.75rem] font-light uppercase tracking-[0.3em] text-ink"
                    >
                        {site.shortBrand}
                    </a>

                    <ul className="hidden items-center gap-9 md:flex">
                        {navLinks.map((link) => (
                            <li key={link.section}>
                                <a
                                    href={`#${link.section}`}
                                    onClick={go(`#${link.section}`)}
                                    aria-current={active === link.section ? 'location' : undefined}
                                    className={cn(
                                        'relative flex min-h-11 items-center text-[0.8125rem] transition-colors duration-300',
                                        active === link.section ? 'text-ink' : 'text-ink-muted hover:text-ink',
                                    )}
                                >
                                    {t(link.key)}
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'absolute bottom-2.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-[var(--ease-out)]',
                                            active === link.section ? 'scale-x-100' : 'scale-x-0',
                                        )}
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden items-center gap-6 md:flex">
                        <LocaleSwitcher />
                        <a
                            href="#contact"
                            onClick={go('#contact')}
                            className="flex min-h-11 items-center font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:text-accent"
                        >
                            <span className="border-b border-accent pb-0.5">{t('cta')}</span>
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? t('closeMenu') : t('openMenu')}
                        className="relative flex size-11 items-center justify-center md:hidden"
                    >
                        <span
                            className={cn(
                                'absolute h-px w-5 bg-ink transition-transform duration-500 ease-[var(--ease-out)]',
                                isOpen ? 'rotate-45' : '-translate-y-[3px]',
                            )}
                        />
                        <span
                            className={cn(
                                'absolute h-px w-5 bg-ink transition-transform duration-500 ease-[var(--ease-out)]',
                                isOpen ? '-rotate-45' : 'translate-y-[3px]',
                            )}
                        />
                    </button>
                </nav>
                <ScrollProgress className="absolute inset-x-0 -bottom-px" />
            </div>

            <div
                id="mobile-menu"
                inert={!isOpen}
                className={cn(
                    'fixed inset-x-0 bottom-0 top-14 flex flex-col justify-between bg-bg/95 px-5 pb-10 pt-12 backdrop-blur-2xl transition-opacity duration-500 ease-[var(--ease-out)] md:hidden',
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            >
                <ul className="flex flex-col gap-2">
                    {navLinks.map((link, index) => (
                        <li
                            key={link.section}
                            className={cn(
                                'transition-[opacity,transform] duration-500 ease-[var(--ease-out)]',
                                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                            )}
                            style={{ transitionDelay: isOpen ? `${80 + index * 50}ms` : '0ms' }}
                        >
                            <a
                                href={`#${link.section}`}
                                onClick={go(`#${link.section}`)}
                                className="flex min-h-14 items-center font-display text-3xl font-extralight text-ink"
                            >
                                {t(link.key)}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between">
                    <LocaleSwitcher />
                    <a href="#contact" onClick={go('#contact')} className="flex min-h-11 items-center font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink">
                        <span className="border-b border-accent pb-0.5">{t('cta')}</span>
                    </a>
                </div>
            </div>
        </header>
    )
}
