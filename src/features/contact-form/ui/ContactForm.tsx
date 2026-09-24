'use client'

import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/shared/lib'
import {
    EMPTY_CONTACT_FORM,
    validateContactForm,
    type ContactFormErrors,
    type ContactFormValues,
} from '../model/validate'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const FIELD =
    'w-full border-0 border-b border-hairline bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-faint outline-none transition-colors duration-300 focus:border-accent'

/**
 * The message form behind the contact CTA. Posts to the existing
 * `/api/contact` route (Nodemailer, EMAIL_USER / EMAIL_PASS) with the same
 * payload it has always accepted.
 */
export function ContactForm() {
    const t = useTranslations('ContactForm')
    const id = useId()
    const [values, setValues] = useState<ContactFormValues>(EMPTY_CONTACT_FORM)
    const [errors, setErrors] = useState<ContactFormErrors>({})
    const [status, setStatus] = useState<Status>('idle')

    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setValues((previous) => ({ ...previous, [name]: value }))
        if (errors[name as keyof ContactFormValues]) setErrors((previous) => ({ ...previous, [name]: undefined }))
        if (status === 'failed' || status === 'sent') setStatus('idle')
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (status === 'sending') return

        const nextErrors = validateContactForm(values)
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) return

        setStatus('sending')
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            if (!response.ok) throw new Error(String(response.status))
            setStatus('sent')
            setValues(EMPTY_CONTACT_FORM)
        } catch {
            setStatus('failed')
        }
    }

    const field = (name: 'name' | 'email' | 'subject', type = 'text', autoComplete?: string) => {
        const error = errors[name]
        const errorId = `${id}-${name}-error`
        return (
            <div className="flex flex-col gap-1">
                <label htmlFor={`${id}-${name}`} className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-muted">
                    {t(name)}
                </label>
                <input
                    id={`${id}-${name}`}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    value={values[name]}
                    onChange={onChange}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={cn(FIELD, error && 'border-warm')}
                />
                {error ? (
                    <p id={errorId} className="text-sm text-warm">
                        {t(`errors.${error}`)}
                    </p>
                ) : null}
            </div>
        )
    }

    const messageError = errors.message

    return (
        <form onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`} className="flex w-full flex-col gap-7 text-left">
            <h3 id={`${id}-title`} className="sr-only">
                {t('title')}
            </h3>

            <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-muted">{t('typeLegend')}</legend>
                <div className="flex gap-2">
                    {(['inquiry', 'service'] as const).map((type) => (
                        <label
                            key={type}
                            className={cn(
                                'flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm transition-colors duration-300',
                                values.type === type ? 'border-accent text-ink' : 'border-hairline text-ink-muted hover:text-ink',
                                'has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent',
                            )}
                        >
                            <input
                                type="radio"
                                name="type"
                                value={type}
                                checked={values.type === type}
                                onChange={() => setValues((previous) => ({ ...previous, type }))}
                                className="sr-only"
                            />
                            {t(`types.${type}`)}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-7 sm:grid-cols-2">
                {field('name', 'text', 'name')}
                {field('email', 'email', 'email')}
            </div>
            {field('subject')}

            <div className="flex flex-col gap-1">
                <label htmlFor={`${id}-message`} className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-muted">
                    {t('message')}
                </label>
                <textarea
                    id={`${id}-message`}
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={onChange}
                    aria-invalid={messageError ? true : undefined}
                    aria-describedby={messageError ? `${id}-message-error` : undefined}
                    className={cn(FIELD, 'resize-none', messageError && 'border-warm')}
                />
                {messageError ? (
                    <p id={`${id}-message-error`} className="text-sm text-warm">
                        {t(`errors.${messageError}`)}
                    </p>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-5">
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-ink px-6 text-sm font-medium text-bg transition-[background-color,transform] duration-300 hover:bg-accent active:scale-[0.98] disabled:opacity-60"
                >
                    {status === 'sending' ? t('sending') : t('send')}
                    <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
                <p role="status" aria-live="polite" className="text-sm">
                    {status === 'sent' ? (
                        <span className="inline-flex items-center gap-2 text-ink">
                            <Check aria-hidden="true" strokeWidth={1.5} className="size-4 text-accent" />
                            {t('success')}
                        </span>
                    ) : null}
                    {status === 'failed' ? <span className="text-warm">{t('errors.failed')}</span> : null}
                </p>
            </div>
        </form>
    )
}
