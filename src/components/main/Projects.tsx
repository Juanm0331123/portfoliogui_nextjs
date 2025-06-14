import { useMemo } from 'react'
import ProjectCard from '../sub/ProjectCard'

const Projects = () => {
    const projects = useMemo(
        () => [
            {
                src: '/Peviuao-card.png',
                title: 'PEVI UAO Platform',
                description:
                    'Energy efficiency analysis platform for industrial sector developed for Universidad Autónoma de Occidente, featuring data visualization, expert consultation, and membership services.',
                link: 'https://peviuao.vercel.app/',
            },
            {
                src: '/NextPortfolio-card.png',
                title: 'Next.js Portfolio',
                description:
                    'Modern personal portfolio site built with Next.js 15, TypeScript and animated components to showcase professional skills and projects.',
                link: 'https://juanmigueldev.vercel.app/',
            },
            {
                src: '/Barber-card.png',
                title: 'Barbershop Management System',
                description:
                    'Professional web application for barbershop management built with Next.js and Tailwind CSS, featuring appointment booking, client management, and role-based access control. (In development)',
                link: 'https://netxjs-barbershop.vercel.app/',
            },
        ],
        []
    )

    const gridClass = useMemo(() => {
        switch (projects.length) {
            case 1:
                return 'grid-cols-1'
            case 2:
                return 'grid-cols-1 md:grid-cols-2'
            case 3:
                return 'grid-cols-1 md:grid-cols-3'
            default:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }
    }, [projects.length])

    return (
        <section className="py-20 px-4 md:px-10" id="projects">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5]">
                    My Projects
                </h2>

                <div className={`grid ${gridClass} gap-6 md:gap-10`}>
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            src={project.src}
                            title={project.title}
                            description={project.description}
                            link={project.link}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Projects
