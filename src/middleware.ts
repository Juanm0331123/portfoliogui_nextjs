import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
    // API routes (the contact endpoint) and static files never take a locale.
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
