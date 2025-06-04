'use client'

import {
    Calendar,
    Download,
    ExternalLink,
    Github,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Sparkles,
    Twitter,
} from 'lucide-react'
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
            href: 'https://github.com',
            label: 'GitHub',
            color: 'hover:text-[#23A8C0]',
        },
        {
            icon: Linkedin,
            href: 'https://linkedin.com',
            label: 'LinkedIn',
            color: 'hover:text-[#7C6AD9]',
        },
        {
            icon: Twitter,
            href: 'https://twitter.com',
            label: 'Twitter',
            color: 'hover:text-[#23A8C0]',
        },
        {
            icon: Instagram,
            href: 'https://instagram.com',
            label: 'Instagram',
            color: 'hover:text-[#F65ACD]',
        },
        {
            icon: Mail,
            href: 'mailto:tu-email@ejemplo.com',
            label: 'Email',
            color: 'hover:text-[#7C6AD9]',
        },
    ]

    return (
        <section
            id="about"
            className="relative min-h-screen py-20 px-4 overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C6AD9]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#23A8C0]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div
                    className={`text-center mb-16 transition-all duration-1000 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                    }`}
                >
                    <div className="inline-flex items-center rounded-3xl py-3 px-6 border border-[#7C6AD9]/50 bg-[#0D0528]/50 shadow-lg mb-6">
                        <Sparkles className="text-[#A99BEA] mr-3 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Conoce más sobre mí
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5] bg-clip-text text-transparent">
                        Sobre Mí
                    </h2>
                    <p className="text-xl text-[#8A8AAA] max-w-2xl mx-auto">
                        Desarrollador Full Stack apasionado por crear experiencias
                        digitales excepcionales
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Side - Profile Info */}
                    <div
                        className={`space-y-8 transition-all duration-1000 delay-300 ${
                            isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-10'
                        }`}
                    >
                        {/* Profile Image */}
                        <div className="relative group">
                            <div className="relative w-80 h-80 mx-auto lg:mx-0">
                                {/* Gradient border */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#7C6AD9] via-[#23A8C0] to-[#F65ACD] rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-gradient-to-br from-[#10102E] to-[#140634] rounded-3xl p-1 overflow-hidden">
                                    <Image
                                        src="/About-me.png"
                                        alt="Perfil"
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover rounded-3xl"
                                        priority
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020113]/20 to-transparent rounded-3xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-[#D1D1F0]">
                                <MapPin className="text-[#23A8C0]" size={20} />
                                <span>Santiago de Cali, Colombia</span>
                            </div>
                            <div className="flex items-center space-x-3 text-[#D1D1F0]">
                                <Calendar className="text-[#23A8C0]" size={20} />
                                <span>3+ años de experiencia</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#A99BEA]">
                                Conecta conmigo
                            </h3>
                            <div className="flex space-x-4">
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
                        <button className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] text-white font-medium rounded-xl hover:from-[#8B7DE0] hover:to-[#31B6CE] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <Download size={20} />
                            <span>Descargar CV</span>
                            <ExternalLink
                                size={16}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </button>
                    </div>

                    {/* Right Side - About Content */}
                    <div
                        className={`space-y-8 transition-all duration-1000 delay-500 ${
                            isVisible
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-10'
                        }`}
                    >
                        {/* Description */}
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-[#A99BEA]">
                                ¡Hola! Soy tu próximo desarrollador
                            </h3>
                            <div className="space-y-4 text-[#D1D1F0] leading-relaxed">
                                <p>
                                    Soy un desarrollador Full Stack apasionado por crear
                                    soluciones digitales innovadoras que combinan
                                    funcionalidad excepcional con diseños atractivos.
                                    Con más de 3 años de experiencia, me especializo en
                                    tecnologías modernas como React, Next.js, Node.js y
                                    bases de datos.
                                </p>
                                <p>
                                    Mi enfoque se centra en escribir código limpio,
                                    escalable y mantenible, siempre buscando las mejores
                                    prácticas y las últimas tendencias en desarrollo
                                    web. Me encanta enfrentar desafíos complejos y
                                    convertir ideas en realidades digitales.
                                </p>
                                <p>
                                    Cuando no estoy programando, disfruto aprendiendo
                                    nuevas tecnologías, contribuyendo a proyectos open
                                    source y compartiendo conocimientos con la comunidad
                                    de desarrolladores.
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
