import { ArrowUpRight, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'

interface Props {
    src: string
    title: string
    description: string
    link?: string
    tags: string[]
    year: string
    status: 'Live' | 'In Development'
    featured?: boolean
}

const ProjectCard = ({
    src,
    title,
    description,
    link,
    tags,
    year,
    status,
    featured = false,
}: Props) => {
    return (
        <article
            className={`group relative overflow-hidden rounded-2xl border h-full transition-all duration-300 ${
                featured
                    ? 'border-[#7C6AD9]/70 shadow-lg shadow-[#7C6AD9]/15'
                    : 'border-[#2A2A50]/70 hover:border-[#7C6AD9]/50'
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#10102E]/95 to-[#140634]/95"></div>

            <div className="relative h-56 overflow-hidden">
                <Image
                    src={src}
                    alt={title}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140634] via-[#140634]/60 to-transparent"></div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0D0528]/80 border border-[#7C6AD9]/40">
                    <span className="text-xs font-medium text-[#D1D1F0]">{status}</span>
                </div>

                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0528]/80 border border-[#2A2A50]">
                    <Calendar size={12} className="text-[#A99BEA]" />
                    <span className="text-xs text-[#D1D1F0]">{year}</span>
                </div>
            </div>

            <div className="relative p-6">
                <h3 className="text-xl font-bold text-[#D1D1F0] mb-3 transition-colors duration-300 group-hover:text-[#23A8C0]">
                    {title}
                </h3>
                <p className="text-[#8A8AAA] mb-5 leading-relaxed">{description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                        <span
                            key={`${title}-${tag}`}
                            className="px-2.5 py-1 text-xs rounded-lg border border-[#2A2A50] bg-[#0D0528]/60 text-[#A99BEA]"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-[#2A2A50]/70">
                    {link ? (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#7C6AD9] hover:text-[#23A8C0] transition-colors duration-300"
                        >
                            <span className="mr-1.5 font-medium">View Project</span>
                            <ArrowUpRight size={16} />
                        </a>
                    ) : (
                        <span className="text-sm text-[#8A8AAA]">Private Project</span>
                    )}

                    <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8A8AAA]">
                        <Tag size={12} />
                        <span>{tags.length} technologies</span>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#7C6AD9]/5 to-[#23A8C0]/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </article>
    )
}

export default ProjectCard
