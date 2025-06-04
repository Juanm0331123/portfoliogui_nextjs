'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, Code, Home, Mail, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('hero')

    const navItems = useMemo(
        () => [
            { name: 'Home', href: '#hero', icon: Home },
            { name: 'About', href: '#about', icon: User },
            { name: 'Services', href: '#services', icon: Code },
            { name: 'Projects', href: '#projects', icon: Briefcase },
            { name: 'Contact', href: '#contact', icon: Mail },
        ],
        []
    )

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY

                if (currentScrollY < lastScrollY || currentScrollY < 10) {
                    setIsVisible(true)
                } else {
                    setIsVisible(false)
                    setIsMobileMenuOpen(false)
                }

                setLastScrollY(currentScrollY)

                const sections = navItems.map((item) => item.href.substring(1))
                for (const section of sections.reverse()) {
                    const element = document.getElementById(section)
                    if (element) {
                        const rect = element.getBoundingClientRect()
                        if (rect.top <= 100) {
                            setActiveSection(section)
                            break
                        }
                    }
                }
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar)
            return () => {
                window.removeEventListener('scroll', controlNavbar)
            }
        }
    }, [lastScrollY, navItems])

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const targetId = href.substring(1)
        const element = document.getElementById(targetId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
        }
    }

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mt-4">
                    <div
                        className="relative backdrop-blur-md bg-gradient-to-r from-[#10102E]/90 to-[#140634]/90 rounded-2xl border border-[#2A2A50]/50 shadow-2xl"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(124, 106, 217, 0.25)',
                        }}
                    >
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                {/* Logo */}
                                <div className="flex-shrink-0">
                                    <Link
                                        href="#hero"
                                        className="text-2xl font-bold bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5] bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                                        onClick={(e) => handleNavClick(e, '#hero')}
                                    >
                                        JuanMiguel Dev
                                    </Link>
                                </div>

                                {/* Desktop Navigation */}
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-8">
                                        {navItems.map((item) => {
                                            const isActive =
                                                activeSection === item.href.substring(1)

                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={`group relative px-3 py-2 transition-all duration-300 ease-in-out ${
                                                        isActive
                                                            ? 'text-white'
                                                            : 'text-[#D1D1F0] hover:text-[#23A8C0]'
                                                    }`}
                                                    onClick={(e) =>
                                                        handleNavClick(e, item.href)
                                                    }
                                                >
                                                    <span className="relative z-10 flex items-center space-x-2">
                                                        <item.icon size={18} />
                                                        <span>{item.name}</span>
                                                    </span>

                                                    {/* Hover effect */}
                                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7C6AD9]/20 to-[#23A8C0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    {/* Active indicator */}
                                                    <div
                                                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] transition-all duration-300 ${
                                                            isActive
                                                                ? 'w-full'
                                                                : 'w-0 group-hover:w-full'
                                                        }`}
                                                    ></div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* CTA Button - Desktop */}
                                <div className="hidden md:block">
                                    <Link
                                        href="#contact"
                                        onClick={(e) => handleNavClick(e, '#contact')}
                                        className="relative px-6 py-2.5 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] text-white font-medium rounded-xl hover:from-[#8B7DE0] hover:to-[#31B6CE] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="relative z-10">Contratar</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B7DE0]/20 to-[#31B6CE]/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </div>

                                {/* Mobile menu button */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() =>
                                            setIsMobileMenuOpen(!isMobileMenuOpen)
                                        }
                                        className="p-2 text-[#D1D1F0] hover:text-[#23A8C0] hover:bg-[#7C6AD9]/10 rounded-lg transition-colors duration-200"
                                    >
                                        {isMobileMenuOpen ? (
                                            <X size={24} />
                                        ) : (
                                            <Menu size={24} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="md:hidden overflow-hidden"
                                >
                                    <div className="px-6 py-4 border-t border-[#2A2A50]/50 bg-gradient-to-b from-transparent to-[#0A0A20]/50">
                                        <div className="space-y-1">
                                            {navItems.map((item) => {
                                                const isActive =
                                                    activeSection ===
                                                    item.href.substring(1)

                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                                            isActive
                                                                ? 'text-white bg-[#7C6AD9]/20'
                                                                : 'text-[#D1D1F0] hover:text-[#23A8C0] hover:bg-[#7C6AD9]/10'
                                                        }`}
                                                        onClick={(e) =>
                                                            handleNavClick(e, item.href)
                                                        }
                                                    >
                                                        <item.icon size={20} />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                )
                                            })}
                                            <div className="pt-4 border-t border-[#2A2A50]/30 mt-4">
                                                <Link
                                                    href="#contact"
                                                    onClick={(e) =>
                                                        handleNavClick(e, '#contact')
                                                    }
                                                    className="block w-full px-4 py-3 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] text-white font-medium rounded-lg hover:from-[#8B7DE0] hover:to-[#31B6CE] transition-all duration-300 text-center"
                                                >
                                                    Contratar
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
