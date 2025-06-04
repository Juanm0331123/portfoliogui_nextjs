'use client'

import {
    ArrowRight,
    CheckCircle,
    Code,
    Database,
    Globe,
    LucideProps,
    Monitor,
    Palette,
    Server,
    ShoppingCart,
    Smartphone,
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
                Más Popular
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
                <span>Solicitar</span>
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
            tech: 'React, Next.js, Vue.js, TypeScript',
        },
        {
            icon: Server,
            name: 'Backend Development',
            tech: 'Node.js, Python, Express, FastAPI',
        },
        {
            icon: Database,
            name: 'Database Management',
            tech: 'MongoDB, PostgreSQL, MySQL, Redis',
        },
        {
            icon: Smartphone,
            name: 'Mobile Development',
            tech: 'React Native, Flutter, Expo',
        },
        { icon: Globe, name: 'Web Design', tech: 'UI/UX, Responsive Design, Figma' },
        {
            icon: Palette,
            name: 'Creative Design',
            tech: 'Adobe Suite, Prototyping, Branding',
        },
    ]

    const services: ServiceType[] = [
        {
            icon: Monitor,
            title: 'Desarrollo Web Completo',
            description:
                'Aplicaciones web modernas y responsivas desde el concepto hasta el despliegue.',
            features: [
                'Diseño Responsivo',
                'SEO Optimizado',
                'Performance Avanzado',
                'Seguridad Integrada',
            ],
            popular: false,
        },
        {
            icon: Smartphone,
            title: 'Aplicaciones Móviles',
            description:
                'Apps nativas y multiplataforma con experiencia de usuario excepcional.',
            features: [
                'iOS & Android',
                'UI/UX Nativo',
                'Push Notifications',
                'Integración API',
            ],
            popular: true,
        },
        {
            icon: ShoppingCart,
            title: 'E-commerce Solutions',
            description:
                'Tiendas online completas con sistemas de pago y gestión de inventario.',
            features: [
                'Carrito de Compras',
                'Pasarelas de Pago',
                'Panel Admin',
                'Analytics',
            ],
            popular: false,
        },
        {
            icon: Zap,
            title: 'Optimización & Performance',
            description:
                'Mejoro la velocidad y rendimiento de aplicaciones web existentes.',
            features: [
                'Auditoría Completa',
                'Optimización Core',
                'CDN Setup',
                'Monitoring',
            ],
            popular: false,
        },
    ]

    const fadeInClass = isVisible ? 'opacity-100' : 'opacity-0'

    return (
        <section id="services" className="relative py-20 px-4 overflow-hidden">
            {/* Decorative elements - usando menos blur */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/6 w-72 h-72 bg-[#7C6AD9]/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-[#23A8C0]/5 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header - animación simplificada */}
                <div
                    className={`text-center mb-16 transition-opacity duration-700 ${fadeInClass}`}
                >
                    <div className="inline-flex items-center rounded-3xl py-3 px-6 border border-[#7C6AD9]/50 bg-[#0D0528]/50 shadow-md mb-6">
                        <Sparkles className="text-[#A99BEA] mr-3 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Servicios Profesionales
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5] bg-clip-text text-transparent">
                        Mis Servicios
                    </h2>
                    <p className="text-xl text-[#8A8AAA] max-w-3xl mx-auto">
                        Transformo ideas en soluciones digitales excepcionales con
                        tecnologías modernas y diseño innovador
                    </p>
                </div>

                {/* Skills Section - transición simplificada */}
                <div
                    className={`mb-20 transition-opacity duration-700 delay-100 ${fadeInClass}`}
                >
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#A99BEA] text-center">
                            Mis Habilidades Técnicas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.map((skill, index) => (
                                <SkillCard key={index} skill={skill} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Services Grid - animación más simple */}
                <div
                    className={`mb-20 transition-opacity duration-700 delay-200 ${fadeInClass}`}
                >
                    <h3 className="text-3xl font-bold text-[#A99BEA] text-center mb-12">
                        Servicios Que Ofrezco
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
