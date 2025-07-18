'use client'

import {
    ArrowRight,
    BarChart4,
    CheckCircle,
    Cloud,
    Code,
    Database,
    LucideProps,
    Monitor,
    Palette,
    Server,
    Sparkles,
    Zap,
} from 'lucide-react'

import {
    FC,
    ForwardRefExoticComponent,
    memo,
    RefAttributes,
    useEffect,
    useState,
} from 'react'

interface SkillType {
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    name: string
    tech: string
}

interface ServiceType {
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    title: string
    description: string
    features: string[]
    popular: boolean
}

interface SkillCardProps {
    skill: SkillType
}

interface ServiceCardProps {
    service: ServiceType
    index: number
    isActive?: boolean
}

const SkillCard: FC<SkillCardProps> = memo(({ skill }) => (
    <div className="group p-6 bg-gradient-to-br from-[#10102E]/80 to-[#140634]/80 rounded-xl border border-[#2A2A50]/50 hover:border-[#7C6AD9]/50 transition-colors duration-300">
        <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-r from-[#7C6AD9]/20 to-[#23A8C0]/20 rounded-lg">
                <skill.icon
                    className="text-[#7C6AD9] group-hover:text-[#23A8C0] transition-colors duration-300"
                    size={24}
                />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-[#D1D1F0] mb-2 group-hover:text-[#23A8C0] transition-colors duration-300">
                    {skill.name}
                </h4>
                <p className="text-sm text-[#8A8AAA] leading-relaxed">{skill.tech}</p>
            </div>
        </div>
    </div>
))

SkillCard.displayName = 'SkillCard'

const ServiceCard: FC<ServiceCardProps> = memo(({ service }) => (
    <div
        className={`group relative p-8 bg-gradient-to-br from-[#10102E]/90 to-[#140634]/90 rounded-2xl border transition-colors duration-300 ${
            service.popular
                ? 'border-[#7C6AD9]/80 shadow-lg shadow-[#7C6AD9]/10'
                : 'border-[#2A2A50]/50 hover:border-[#7C6AD9]/50'
        }`}
    >
        {service.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] rounded-full text-white text-sm font-medium">
                Most Popular
            </div>
        )}

        <div className="flex items-start space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-[#7C6AD9]/20 to-[#23A8C0]/20 rounded-xl">
                <service.icon
                    className="text-[#7C6AD9] group-hover:text-[#23A8C0]"
                    size={32}
                />
            </div>
            <div className="flex-1">
                <h4 className="text-xl font-bold text-[#D1D1F0] mb-2">
                    {service.title}
                </h4>
                <p className="text-[#8A8AAA] mb-4">{service.description}</p>
            </div>
        </div>

        <div className="space-y-3 mb-6">
            {service.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="text-[#4DEEAB]" size={16} />
                    <span className="text-[#D1D1F0] text-sm">{feature}</span>
                </div>
            ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#2A2A50]/50">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#7C6AD9]/20 to-[#23A8C0]/20 hover:from-[#7C6AD9]/30 hover:to-[#23A8C0]/30 rounded-lg text-[#D1D1F0] transition-colors duration-300">
                <span>Request</span>
                <ArrowRight size={16} />
            </button>
        </div>
    </div>
))

ServiceCard.displayName = 'ServiceCard'

const Services = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        )

        const section = document.getElementById('services')
        if (section) observer.observe(section)

        return () => observer.disconnect()
    }, [])

    const skills: SkillType[] = [
        {
            icon: Code,
            name: 'Frontend Development',
            tech: 'Next.js, React.js, React Native, TypeScript, Angular',
        },
        {
            icon: Server,
            name: 'Backend Development',
            tech: 'NodeJS, Express, NestJS, RESTful APIs, Java',
        },
        {
            icon: Database,
            name: 'Database Management',
            tech: 'MongoDB, PostgreSQL, MySQL, SQL',
        },
        {
            icon: BarChart4,
            name: 'Data Analysis',
            tech: 'Excel, Data Visualization, Interactive Reports',
        },
        {
            icon: Cloud,
            name: 'Cloud Services',
            tech: 'Google Cloud, Deployment, Infrastructure',
        },
        {
            icon: Palette,
            name: 'UX/UI Design',
            tech: 'User Experience, Interface Design, Prototyping',
        },
    ]

    const services: ServiceType[] = [
        {
            icon: Monitor,
            title: 'Web Application Development',
            description:
                'Modern, responsive web applications built with Next.js, React, and TypeScript.',
            features: [
                'Full Stack Development',
                'Responsive Design',
                'Advanced Performance',
                'Secure Authentication',
            ],
            popular: true,
        },
        {
            icon: BarChart4,
            title: 'Energy Analysis Solutions',
            description:
                'Digital tools for energy efficiency analysis and sustainable consulting.',
            features: [
                'Data Processing & Analysis',
                'Interactive Dashboards',
                'Report Generation',
                'Optimization Recommendations',
            ],
            popular: false,
        },
        {
            icon: Database,
            title: 'Database Development',
            description:
                'Efficient database design and implementation for scalable applications.',
            features: [
                'Schema Design',
                'Query Optimization',
                'Data Migration',
                'Relational & NoSQL',
            ],
            popular: false,
        },
        {
            icon: Zap,
            title: 'API Development & Integration',
            description:
                'RESTful API design and third-party service integration for seamless functionality.',
            features: [
                'API Architecture',
                'Authentication',
                'Documentation',
                'Testing & Monitoring',
            ],
            popular: false,
        },
    ]

    const fadeInClass = isVisible ? 'opacity-100' : 'opacity-0'

    return (
        <section id="services" className="relative py-20 px-4 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-[#7C6AD9]/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-[#23A8C0]/5 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div
                    className={`text-center mb-16 transition-opacity duration-700 ${fadeInClass}`}
                >
                    <div className="inline-flex items-center rounded-3xl py-3 px-6 border border-[#7C6AD9]/50 bg-[#0D0528]/50 shadow-md mb-6">
                        <Sparkles className="text-[#A99BEA] mr-3 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Professional Services
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5] bg-clip-text text-transparent">
                        My Services
                    </h2>
                    <p className="text-xl text-[#8A8AAA] max-w-3xl mx-auto">
                        Transforming ideas into exceptional digital solutions with
                        modern technologies and innovative design for energy analysis
                        and sustainable consulting
                    </p>
                </div>

                {/* Skills Section */}
                <div
                    className={`mb-20 transition-opacity duration-700 delay-100 ${fadeInClass}`}
                >
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#A99BEA] text-center">
                            My Technical Skills
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.map((skill, index) => (
                                <SkillCard key={index} skill={skill} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div
                    className={`mb-20 transition-opacity duration-700 delay-200 ${fadeInClass}`}
                >
                    <h3 className="text-3xl font-bold text-[#A99BEA] text-center mb-12">
                        Services I Offer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services
