import About from '@/components/main/About'
import Contact from '@/components/main/Contact'
import Hero from '@/components/main/Hero'
import Projects from '@/components/main/Projects'
import Services from '@/components/main/Services'

export default function Home() {
    return (
        <main className="h-full w-full">
            <div className="flex flex-col gap-20">
                <Hero />
                <About />
                <Services />
                <Projects />
                <Contact />
            </div>
        </main>
    )
}
