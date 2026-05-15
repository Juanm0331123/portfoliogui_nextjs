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
            { threshold: 0.1 }
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

    const handleDownloadCV = () => {
        const link = document.createElement('a')
        link.href = '/Juan_Miguel_Leon_HV_2025.pdf'
        link.download = 'Juan_Miguel_Leon_HV_2025.pdf'
        document.body.appendChild(link)

        link.click()
        document.body.removeChild(link)
    }

    return (
        <section
            id="about"
            className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C6AD9]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#23A8C0]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div
                    className={`mb-12 text-center transition-all duration-1000 sm:mb-16 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                    }`}
                >
                    <div className="inline-flex items-center rounded-3xl py-3 px-6 border border-[#7C6AD9]/50 bg-[#0D0528]/50 shadow-lg mb-6">
                        <Sparkles className="text-[#A99BEA] mr-3 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Learn more about me
                        </span>
                    </div>
                    <h2 className="mb-4 bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5] bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
                        About Me
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-[#8A8AAA] sm:text-xl">
                        Full Stack Developer passionate about creating exceptional
                        digital experiences
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
                    {/* Left Side - Profile Info */}
                    <div
                        className={`space-y-8 transition-all duration-1000 delay-300 lg:pr-4 ${
                            isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-10'
                        }`}
                    >
                        {/* Profile Image */}
                        <div className="group relative mb-8 sm:mb-10">
                            <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] sm:max-w-[380px] lg:mx-0 lg:max-w-[420px] xl:max-w-[460px]">
                                {/* Gradient border que se ajusta a la foto */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#7C6AD9] via-[#23A8C0] to-[#F65ACD] rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#10102E] to-[#140634] rounded-3xl overflow-hidden">
                                    <Image
                                        src="/About-me.png"
                                        alt="Juan Miguel León Gómez"
                                        fill
                                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, (max-width: 1280px) 420px, 460px"
                                        className="w-full h-full object-cover rounded-3xl"
                                        priority
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020113]/20 to-transparent rounded-3xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links - movido claramente debajo de la imagen */}
                        <div className="mt-6 space-y-4 sm:mt-8">
                            <h3 className="text-center text-xl font-semibold text-[#A99BEA] lg:text-left">
                                Connect with me
                            </h3>
                            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className={`p-3 bg-[#10102E]/50 hover:bg-[#140634]/80 border border-[#2A2A50]/50 rounded-xl text-[#8A8AAA] ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={24} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Download CV Button */}
                        <button
                            onClick={handleDownloadCV}
                            className="group flex w-full items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#8B7DE0] hover:to-[#31B6CE] hover:shadow-xl sm:w-fit"
                        >
                            <Download size={20} />
                            <span>Download CV</span>
                            <ExternalLink
                                size={16}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </button>
                    </div>

                    {/* Right Side - About Content */}
                    <div
                        className={`space-y-6 transition-all duration-1000 delay-500 lg:space-y-8 ${
                            isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-10'
                        }`}
                    >
                        {/* Description */}
                        <div className="mx-auto max-w-2xl space-y-5 lg:mx-0">
                            <h3 className="text-2xl font-bold text-[#A99BEA] sm:text-3xl">
                                Hello! I&apos;m Juan Miguel León Gómez
                            </h3>
                            <div className="space-y-4 text-base leading-8 text-[#D1D1F0] sm:text-lg">
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
                                    I&apos;m committed to my work, always looking to
                                    improve and learn through each experience. I enjoy
                                    working in teams and facing challenges, which drives
                                    me to be proactive and productive in every project.
                                    My ability to adapt to new situations and my
                                    willingness to take on challenges allow me to
                                    provide innovative and efficient solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
