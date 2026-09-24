'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Copy } from 'lucide-react'
import { ContactForm } from '@/features/contact-form'
import { registerScrollTrigger } from '@/shared/animation'
import { site } from '@/shared/config'
import { cn } from '@/shared/lib'
import { TextLink } from '@/shared/ui'
import { contactLinks } from '../model'

/** The email as the primary action, a copy button, the socials, and the form behind a toggle. */
export function ContactActions() {
    const t = useTranslations('Contact')
    const formId = useId()
    const [copied, setCopied] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const mounted = useRef(false)

    useEffect(() => () => clearTimeout(copiedTimer.current), [])

    // Opening the form changes the page's height; every trigger below it has
    // to measure again, or the footer's band would end in the wrong place.
    useEffect(() => {
        // Not on mount: a refresh at load is the choreography's job, and an
        // extra one here landed mid-intro.
        if (!mounted.current) {
            mounted.current = true
            return
        }
        registerScrollTrigger()
        const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
        return () => cancelAnimationFrame(frame)
    }, [formOpen])

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(site.email)
            setCopied(true)
            clearTimeout(copiedTimer.current)
            copiedTimer.current = setTimeout(() => setCopied(false), 2200)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="flex w-full flex-col items-center">
            <div data-reveal="fade" className="flex max-w-full flex-wrap items-center justify-center gap-3">
                <a
                    href={`mailto:${site.email}`}
                    className="break-all border-b border-accent pb-1 text-[clamp(1.05rem,2.3vw,1.6rem)] font-light tracking-[0.01em] text-ink transition-colors duration-300 hover:text-accent"
                >
                    {site.email}
                </a>
                <button
                    type="button"
                    onClick={copy}
                    aria-label={copied ? t('copied') : t('copy')}
                    className="flex size-11 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-300 hover:border-accent hover:text-ink"
                >
                    {copied ? <Check aria-hidden="true" strokeWidth={1.5} className="size-4 text-accent" /> : <Copy aria-hidden="true" strokeWidth={1.5} className="size-4" />}
                </button>
                <span role="status" aria-live="polite" className="sr-only">
                    {copied ? t('copied') : ''}
                </span>
            </div>

            <ul data-reveal="fade" className="mt-6 flex flex-wrap items-center justify-center gap-x-8 font-mono text-[0.6875rem] uppercase tracking-[0.2em]">
                {contactLinks.map((link) => (
                    <li key={link.key}>
                        <TextLink
                            href={link.href}
                            tone="muted"
                            icon={link.external ? 'external' : 'down'}
                            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
                        >
                            {t(link.key)}
                        </TextLink>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                data-reveal="fade"
                aria-expanded={formOpen}
                aria-controls={formId}
                onClick={() => setFormOpen((open) => !open)}
                className="mt-6 min-h-11 text-sm text-ink-muted underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-ink hover:decoration-accent"
            >
                {formOpen ? t('formClose') : t('formOpen')}
            </button>

            <div
                id={formId}
                className={cn(
                    'grid w-full transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out)]',
                    formOpen ? 'mt-10 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
                inert={!formOpen}
            >
                <div className="overflow-hidden">
                    <div className="rounded-[3px] border border-hairline bg-bg/70 p-6 backdrop-blur-md md:p-8">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
