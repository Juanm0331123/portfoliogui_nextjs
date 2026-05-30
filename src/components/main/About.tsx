'use client'

import { Download, ExternalLink, Github, Linkedin, Mail, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const About = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 },
        )

        const section = document.getElementById('about')
        if (section) {
            observer.observe(section)
        }

        return () => {
            if (section) {
                observer.unobserve(section)
            }
        }
    }, [])

    const socialLinks = [
        {
            icon: Github,
            href: 'https://github.com/Juanm0331123',
            label: 'GitHub',
            color: 'hover:text-[#23A8C0]',
        },
        {
            icon: Linkedin,
            href: 'https://www.linkedin.com/in/juanmigueldev/',
            label: 'LinkedIn',
            color: 'hover:text-[#7C6AD9]',
        },
        {
            icon: Mail,
            href: 'mailto:juanmiguelleon5@gmail.com',
            label: 'Email',
            color: 'hover:text-[#7C6AD9]',
        },
    ]

    const profileHighlights = [
        'Full Stack Development',
        'Informatics Engineering',
        'Energy Analysis Solutions',
    ]

    const handleDownloadCV = () => {
        const link = document.createElement('a')
        link.href = '/Juan_Miguel_Leon_HV_2026.pdf'
        link.download = 'Juan_Miguel_Leon_HV_2026.pdf'
        document.body.appendChild(link)

        link.click()
        document.body.removeChild(link)
    }

    return (
        <section
            id="about"
            className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#7C6AD9]/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#23A8C0]/10 blur-3xl"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div
                    className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 motion-reduce:transform-none motion-reduce:transition-none sm:mb-14 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                    }`}
                >
                    <div className="mb-6 inline-flex items-center rounded-full border border-[#7C6AD9]/50 bg-[#0D0528]/60 px-5 py-2.5">
                        <Sparkles className="mr-3 h-5 w-5 text-[#A99BEA]" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Learn more about me
                        </span>
                    </div>
                    <h2 className="mb-4 text-balance text-4xl font-bold text-[#D1D1F0] sm:text-5xl md:text-6xl">
                        About Me
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-[#8A8AAA] sm:text-xl">
                        Full Stack Developer focused on clear architecture, responsive
                        interfaces, and practical digital products.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:gap-12 xl:gap-16">
                    <div
                        className={`mx-auto flex w-full max-w-[360px] flex-col items-center transition-all delay-150 duration-700 motion-reduce:transform-none motion-reduce:transition-none lg:mx-0 lg:max-w-[340px] xl:max-w-[360px] ${
                            isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-10'
                        }`}
                    >
                        <div className="group relative w-full">
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#7C6AD9] via-[#23A8C0] to-[#F65ACD] opacity-80 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"></div>
                            <div className="relative aspect-[572/892] overflow-hidden rounded-2xl border border-[#2A2A50]/70 bg-gradient-to-br from-[#10102E] to-[#140634]">
                                <Image
                                    src="/About-me.png"
                                    alt="Portrait of Juan Miguel Leon Gomez"
                                    fill
                                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 360px, 360px"
                                    className="h-full w-full object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020113]/25 via-transparent to-transparent"></div>
                            </div>
                        </div>

                        <div className="mt-6 flex w-full flex-col items-center gap-5">
                            <div className="flex flex-wrap justify-center gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#2A2A50]/70 bg-[#10102E]/70 text-[#D1D1F0] transition duration-300 hover:-translate-y-0.5 hover:border-[#7C6AD9]/70 hover:bg-[#140634]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A8C0] motion-reduce:transform-none motion-reduce:transition-none ${social.color}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={21} />
                                    </a>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleDownloadCV}
                                className="group flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] px-6 py-3 font-medium text-white transition duration-300 hover:from-[#8B7DE0] hover:to-[#31B6CE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23A8C0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020113] motion-reduce:transition-none sm:w-fit"
                            >
                                <Download size={20} />
                                <span>Download CV</span>
                                <ExternalLink
                                    size={16}
                                    className="opacity-80 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                                />
                            </button>
                        </div>
                    </div>

                    <div
                        className={`mx-auto flex max-w-3xl flex-col justify-center transition-all delay-300 duration-700 motion-reduce:transform-none motion-reduce:transition-none lg:mx-0 ${
                            isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-10'
                        }`}
                    >
                        <div className="space-y-6 text-center lg:text-left">
                            <h3 className="text-balance text-2xl font-bold leading-tight text-[#A99BEA] sm:text-3xl">
                                Hello, I&apos;m Juan Miguel Leon Gomez
                            </h3>
                            <div className="space-y-5 text-base leading-8 text-[#D1D1F0] sm:text-lg">
                                <p className="text-pretty">
                                    I&apos;m a passionate and versatile software
                                    developer with extensive experience in Java, Python,
                                    JavaScript, and TypeScript. I specialize in Full
                                    Stack web development using modern technologies like
                                    Next.js, Express, Node.js, and TypeScript, creating
                                    solutions for energy analysis and sustainable
                                    consulting.
                                </p>
                                <p className="text-pretty">
                                    My approach focuses on building robust, efficient,
                                    and easily maintainable systems by applying best
                                    development practices, design patterns, and agile
                                    frameworks. I have experience in microservices
                                    architecture, REST API development, and cloud
                                    application deployment, efficiently integrating
                                    relational and non-relational databases (SQL,
                                    PostgreSQL, and MongoDB) to ensure high performance
                                    and scalability.
                                </p>
                                <p className="text-pretty">
                                    I&apos;m committed to improving through each
                                    experience, working well with teams, and adapting to
                                    new challenges. That mindset helps me stay proactive
                                    and deliver efficient solutions in every project.
                                </p>
                            </div>

                            <ul className="flex flex-wrap justify-center gap-3 pt-1 lg:justify-start">
                                {profileHighlights.map((highlight) => (
                                    <li
                                        key={highlight}
                                        className="rounded-full border border-[#2A2A50]/70 bg-[#10102E]/60 px-4 py-2 text-sm font-medium text-[#D1D1F0]"
                                    >
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
