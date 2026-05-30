'use client'

import { ArrowUpRight, Filter, LayoutGrid, Rocket, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import ProjectCard from '../sub/ProjectCard'

type Category = 'all' | 'platform' | 'portfolio' | 'management'

interface ProjectType {
    src: string
    title: string
    description: string
    link?: string
    tags: string[]
    year: string
    status: 'Live' | 'In Development'
    category: Exclude<Category, 'all'>
    featured?: boolean
}

const filters: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'platform', label: 'Platforms' },
    { id: 'portfolio', label: 'Portfolios' },
    { id: 'management', label: 'Management' },
]

const projectsData: ProjectType[] = [
    {
        src: '/Peviuao-card.png',
        title: 'PEVI UAO Platform',
        description:
            'Energy efficiency analysis platform for industrial sector developed for Universidad Autonoma de Occidente, featuring data visualization, expert consultation, and membership services.',
        link: 'https://peviuao.vercel.app/',
        tags: ['Next.js', 'TypeScript', 'Dashboards', 'Data Visualization'],
        year: '2025',
        status: 'Live',
        category: 'platform',
        featured: true,
    },
    {
        src: '/NextPortfolio-card.png',
        title: 'Next.js Portfolio',
        description:
            'Modern personal portfolio site built with Next.js 15, TypeScript, and animated UI components to showcase professional skills and projects.',
        link: 'https://juanmigueldev.vercel.app/',
        tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'UI Motion'],
        year: '2025',
        status: 'Live',
        category: 'portfolio',
    },
    {
        src: '/WestAutomation.png',
        title: 'West Automation Website',
        description:
            'Corporate website for a Canadian industrial automation company built with Next.js and Tailwind CSS, deployed on Vercel.',
        link: 'https://www.westautomation.co/',
        tags: ['Next.js', 'Tailwind CSS', 'Industrial Automation'],
        year: 'Nov 2025',
        status: 'Live',
        category: 'platform',
    },
    {
        src: '/Barber-card.png',
        title: 'Barbershop Management System',
        description:
            'Professional web application for barbershop management with appointment booking, client records, and role-based access workflows.',
        link: 'https://netxjs-barbershop.vercel.app/',
        tags: ['Next.js', 'Tailwind CSS', 'RBAC', 'Booking Flow'],
        year: '2026',
        status: 'In Development',
        category: 'management',
    },
]

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState<Category>('all')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' },
        )

        const section = document.getElementById('projects')
        if (section) observer.observe(section)

        return () => observer.disconnect()
    }, [])

    const featuredProject = useMemo(
        () => projectsData.find((project) => project.featured),
        [],
    )

    const filteredProjects = useMemo(
        () =>
            projectsData.filter((project) => {
                if (project.featured) return false
                if (activeFilter === 'all') return true
                return project.category === activeFilter
            }),
        [activeFilter],
    )

    const stats = useMemo(() => {
        const technologyCount = new Set(projectsData.flatMap((item) => item.tags)).size
        const liveCount = projectsData.filter((item) => item.status === 'Live').length

        return [
            {
                icon: LayoutGrid,
                label: 'Total Projects',
                value: String(projectsData.length),
            },
            {
                icon: Rocket,
                label: 'Projects Live',
                value: String(liveCount),
            },
            {
                icon: Sparkles,
                label: 'Tech Stack Items',
                value: String(technologyCount),
            },
        ]
    }, [])

    const fadeInClass = isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-10'

    return (
        <section className="relative py-20 px-4 md:px-10 overflow-hidden" id="projects">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-1/6 w-72 h-72 bg-[#7C6AD9]/8 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/6 w-80 h-80 bg-[#23A8C0]/8 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div
                    className={`text-center mb-14 transition-all duration-700 ${fadeInClass}`}
                >
                    <div className="inline-flex items-center rounded-3xl py-3 px-6 border border-[#7C6AD9]/50 bg-[#0D0528]/50 shadow-md mb-6">
                        <Sparkles className="text-[#A99BEA] mr-3 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Case Studies & Real Work
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5]">
                        My Projects
                    </h2>

                    <p className="text-xl text-[#8A8AAA] max-w-3xl mx-auto">
                        A selection of products focused on performance, clean UI, and
                        practical business value.
                    </p>
                </div>

                <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 transition-all duration-700 delay-100 ${fadeInClass}`}
                >
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="p-5 rounded-2xl border border-[#2A2A50]/70 bg-gradient-to-br from-[#10102E]/90 to-[#140634]/90"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-[#7C6AD9]/25 to-[#23A8C0]/25">
                                    <item.icon className="text-[#A99BEA]" size={18} />
                                </div>
                                <span className="text-sm text-[#8A8AAA]">
                                    {item.label}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-[#D1D1F0]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {featuredProject && (
                    <article
                        className={`group mb-12 rounded-3xl overflow-hidden border border-[#7C6AD9]/40 bg-gradient-to-br from-[#10102E]/95 to-[#140634]/95 shadow-xl shadow-[#7C6AD9]/10 transition-all duration-700 delay-150 ${fadeInClass}`}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative min-h-[280px]">
                                <Image
                                    src={featuredProject.src}
                                    alt={featuredProject.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#140634] via-[#140634]/30 to-transparent"></div>
                            </div>

                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <span className="inline-flex items-center w-fit rounded-full px-3 py-1 text-xs font-medium bg-[#7C6AD9]/20 border border-[#7C6AD9]/50 text-[#D1D1F0] mb-4">
                                    Featured Project
                                </span>

                                <h3 className="text-3xl md:text-4xl font-bold text-[#D1D1F0] mb-4">
                                    {featuredProject.title}
                                </h3>

                                <p className="text-[#8A8AAA] leading-relaxed mb-6">
                                    {featuredProject.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-7">
                                    {featuredProject.tags.map((tag) => (
                                        <span
                                            key={`featured-${tag}`}
                                            className="px-3 py-1 rounded-lg text-xs border border-[#2A2A50] bg-[#0D0528]/50 text-[#A99BEA]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {featuredProject.link && (
                                        <a
                                            href={featuredProject.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold"
                                        >
                                            Visit Project
                                            <ArrowUpRight size={16} />
                                        </a>
                                    )}
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2A2A50] text-[#D1D1F0] hover:border-[#7C6AD9]/50 hover:bg-[#140634]/70 transition-colors duration-300"
                                    >
                                        Build Something Similar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </article>
                )}

                <div
                    className={`flex flex-wrap items-center justify-center gap-3 mb-8 transition-all duration-700 delay-200 ${fadeInClass}`}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2A2A50] bg-[#0D0528]/40 text-[#8A8AAA] text-sm">
                        <Filter size={14} />
                        <span>Filter</span>
                    </div>

                    {filters.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveFilter(item.id)}
                            className={`px-4 py-2 rounded-lg border text-sm transition-colors duration-300 ${
                                activeFilter === item.id
                                    ? 'border-[#7C6AD9]/60 bg-gradient-to-r from-[#7C6AD9]/20 to-[#23A8C0]/20 text-[#D1D1F0]'
                                    : 'border-[#2A2A50] bg-[#0D0528]/40 text-[#8A8AAA] hover:text-[#D1D1F0] hover:border-[#7C6AD9]/40'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-700 delay-300 ${fadeInClass}`}
                >
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.title}
                            src={project.src}
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            tags={project.tags}
                            year={project.year}
                            status={project.status}
                            featured={project.featured}
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="mt-8 text-center text-[#8A8AAA] border border-[#2A2A50]/70 rounded-xl p-6 bg-[#0D0528]/30">
                        There are no projects in this category yet.
                    </div>
                )}
            </div>
        </section>
    )
}

export default Projects
