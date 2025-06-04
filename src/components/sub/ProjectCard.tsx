'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
    src: string
    title: string
    description: string
    link?: string
}

const ProjectCard = ({ src, title, description, link }: Props) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="group relative overflow-hidden rounded-xl shadow-lg border border-[#2A0E61] h-full transition-all duration-300 hover:border-[#7C6AD9]/50 hover:shadow-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                <Image
                    src={src}
                    alt={title}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140634]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="relative p-6">
                <h3 className="text-xl font-bold text-[#D1D1F0] mb-2 transition-colors duration-300 group-hover:text-[#23A8C0]">
                    {title}
                </h3>
                <p className="text-[#8A8AAA] mb-4">{description}</p>

                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#7C6AD9] hover:text-[#23A8C0] transition-colors duration-300"
                    >
                        <span className="mr-1">View Project</span>
                        <ArrowUpRight size={16} />
                    </a>
                )}
            </div>

            {/* Efecto de overlay al hacer hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-[#7C6AD9]/10 to-[#23A8C0]/10 pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
            ></div>
        </div>
    )
}

export default ProjectCard
