import { getTranslations } from 'next-intl/server'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { site } from '@/shared/config'
import { Container, RevealText } from '@/shared/ui'
import { footerContacts, footerSections } from '../model'
import { BackToTop } from './BackToTop'

export async function Footer() {
    const [t, nav] = await Promise.all([getTranslations('Footer'), getTranslations('Navbar')])

    return (
        <footer id="footer" className="relative flex min-h-svh flex-col justify-between pb-8 pt-40">
            <Container className="flex flex-1 items-center justify-center">
                <RevealText
                    text={t('closing')}
                    className="max-w-[18ch] text-center font-display text-[clamp(1.9rem,3.8vw,3.2rem)] font-extralight leading-[1.15] text-ink"
                />
            </Container>

            <Container>
                <div data-reveal="fade" data-reveal-start="top 100%" data-reveal-end="top 80%" className="grid gap-10 border-t border-hairline pt-10 md:grid-cols-4 md:gap-8">
                    <p className="font-display text-[1.75rem] font-extralight leading-none tracking-[0.02em] text-ink">{site.brand}</p>
                    <nav aria-label={nav('primary')}>
                        <ul className="flex flex-col gap-1">
                            {footerSections.map((section) => (
                                <li key={section}>
                                    <a href={`#${section}`} className="inline-flex min-h-9 items-center text-sm text-ink-soft transition-colors duration-300 hover:text-ink">
                                        {nav(section)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <ul className="flex flex-col gap-1">
                        {footerContacts.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    className="inline-flex min-h-9 items-center break-all text-sm text-ink-soft transition-colors duration-300 hover:text-ink"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                        <BackToTop label={t('backToTop')} />
                        <LocaleSwitcher />
                    </div>
                </div>
                <div className="mt-10 flex flex-col gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-ink-faint sm:flex-row sm:justify-between">
                    <p>{t('rights', { year: new Date().getFullYear() })}</p>
                    <p>{site.builtWith}</p>
                </div>
            </Container>
        </footer>
    )
}
