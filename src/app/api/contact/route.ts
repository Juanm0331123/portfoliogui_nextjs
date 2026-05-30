export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

type ContactPayload = {
    name?: unknown
    email?: unknown
    subject?: unknown
    type?: unknown
    message?: unknown
}

type ContactForm = {
    name: string
    email: string
    subject: string
    type: 'inquiry' | 'service'
    message: string
}

const CONTACT_RECIPIENT = 'juanmiguelleon5@gmail.com'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isString = (value: unknown): value is string => typeof value === 'string'

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

const sanitizeHeader = (value: string) => value.replace(/[\r\n]+/g, ' ')

const normalizePayload = (payload: ContactPayload): ContactForm | null => {
    if (
        !isString(payload.name) ||
        !isString(payload.email) ||
        !isString(payload.subject) ||
        !isString(payload.message)
    ) {
        return null
    }

    const name = payload.name.trim()
    const email = payload.email.trim()
    const subject = payload.subject.trim()
    const message = payload.message.trim()
    const type = payload.type === 'service' ? 'service' : 'inquiry'

    if (!name || !EMAIL_PATTERN.test(email) || !subject || !message) {
        return null
    }

    return {
        name: sanitizeHeader(name),
        email,
        subject: sanitizeHeader(subject),
        type,
        message,
    }
}

export async function POST(req: NextRequest) {
    let payload: ContactPayload

    try {
        payload = await req.json()
    } catch {
        return NextResponse.json(
            { ok: false, error: 'Invalid request body.' },
            { status: 400 },
        )
    }

    const form = normalizePayload(payload)

    if (!form) {
        return NextResponse.json(
            { ok: false, error: 'Invalid contact form data.' },
            { status: 400 },
        )
    }

    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
        console.error('Contact form email credentials are not configured.')

        return NextResponse.json(
            { ok: false, error: 'Email service is not configured.' },
            { status: 500 },
        )
    }

    const inquiryLabel =
        form.type === 'service' ? 'Solicitud de servicio' : 'Consulta'
    const safeName = escapeHtml(form.name)
    const safeEmail = escapeHtml(form.email)
    const safeSubject = escapeHtml(form.subject)
    const safeMessage = escapeHtml(form.message).replace(/\n/g, '<br/>')

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    })

    const htmlContent = `
    <div style="background: linear-gradient(135deg, #020113 0%, #140634 100%); padding: 40px 0;">
      <div style="max-width: 500px; margin: 0 auto; background: #10102E; border-radius: 18px; padding: 32px; color: #D1D1F0; font-family: Arial, sans-serif;">
        <h2 style="text-align:center; color: #A99BEA; margin-bottom: 24px;">
          Nuevo mensaje de tu portafolio
        </h2>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Nombre:</strong> ${safeName}
        </div>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Correo:</strong> <a href="mailto:${safeEmail}" style="color:#A99BEA;">${safeEmail}</a>
        </div>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Tipo:</strong> ${inquiryLabel}
        </div>
        <div style="margin-bottom: 18px;">
          <strong style="color:#23A8C0;">Asunto:</strong> ${safeSubject}
        </div>
        <div style="margin-bottom: 24px;">
          <strong style="color:#23A8C0;">Mensaje:</strong>
          <div style="background:#140634; border-radius:10px; padding:16px; margin-top:8px; color:#D1D1F0;">
            ${safeMessage}
          </div>
        </div>
        <div style="text-align:center; margin-top:32px;">
          <span style="font-size:13px; color:#8A8AAA;">
            ${new Date().getFullYear()} JuanMiguel Dev - Cali, Colombia
          </span>
        </div>
      </div>
    </div>
    `

    try {
        await transporter.sendMail({
            from: {
                name: 'Juan Miguel Portfolio',
                address: emailUser,
            },
            to: CONTACT_RECIPIENT,
            replyTo: {
                name: form.name,
                address: form.email,
            },
            subject: `[${form.type === 'service' ? 'Service' : 'Inquiry'}] ${
                form.subject
            }`,
            html: htmlContent,
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Contact form email failed:', error)

        return NextResponse.json(
            { ok: false, error: 'Message could not be sent.' },
            { status: 500 },
        )
    }
}
