import { setRequestLocale } from 'next-intl/server'
import { About } from '@/widgets/about'
import { Contact } from '@/widgets/contact'
import { Experience } from '@/widgets/experience'
import { Footer } from '@/widgets/footer'
import { Hero } from '@/widgets/hero'
import { Projects } from '@/widgets/projects'
import { Skills } from '@/widgets/skills'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    setRequestLocale(locale)

    // <main> stays transparent: an opaque background here would cover the
    // WebGL canvas, which sits behind the page.
    return (
        <>
            <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Experience />
                <Contact />
            </main>
            <Footer />
        </>
    )
}
