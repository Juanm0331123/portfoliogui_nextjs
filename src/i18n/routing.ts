import { defineRouting } from 'next-intl/routing'

/**
 * Spanish is the default and lives unprefixed at `/`; English lives at `/en`.
 * Detection is off on purpose: `/` always answers in Spanish, so a shared link
 * shows the same page to everyone who opens it.
 */
export const routing = defineRouting({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localePrefix: 'as-needed',
    localeDetection: false,
})

export type AppLocale = (typeof routing.locales)[number]
