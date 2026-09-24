import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AppShell } from '@/app-shell'
import { routing } from '@/i18n/routing'
import '../globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
    themeColor: '#050507',
    colorScheme: 'dark',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata' })
    return {
        title: t('title'),
        description: t('description'),
        alternates: { languages: { es: '/', en: '/en' } },
    }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) notFound()
    setRequestLocale(locale)

    return (
        <html lang={locale} className={`${sans.variable} ${mono.variable}`}>
            <body>
                <NextIntlClientProvider>
                    <AppShell>{children}</AppShell>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
