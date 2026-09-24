export type ContactFormValues = {
    name: string
    email: string
    subject: string
    type: 'inquiry' | 'service'
    message: string
}

export type ContactFormErrorKey = 'name' | 'email' | 'emailInvalid' | 'subject' | 'message'

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, ContactFormErrorKey>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Mirrors the checks in app/api/contact/route.ts, so the server rarely has to refuse. */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
    const errors: ContactFormErrors = {}
    if (!values.name.trim()) errors.name = 'name'
    if (!values.email.trim()) errors.email = 'email'
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'emailInvalid'
    if (!values.subject.trim()) errors.subject = 'subject'
    if (!values.message.trim()) errors.message = 'message'
    return errors
}

export const EMPTY_CONTACT_FORM: ContactFormValues = {
    name: '',
    email: '',
    subject: '',
    type: 'inquiry',
    message: '',
}
