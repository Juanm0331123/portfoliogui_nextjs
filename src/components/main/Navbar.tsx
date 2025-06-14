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
                } else if (!isMobileMenuOpen) {
                    setIsVisible(false)
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
    }, [lastScrollY, navItems, isMobileMenuOpen])

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const targetId = href.substring(1)
        const element = document.getElementById(targetId)

        if (element) {
            setIsMobileMenuOpen(false)

            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' })
                setIsVisible(true)
            }, 300)
        }
    }

    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsVisible(true)
        }
    }, [isMobileMenuOpen])

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="w-auto mx-auto mt-3 px-4">
                <div
                    className="relative backdrop-blur-md bg-gradient-to-r from-[#10102E]/60 to-[#140634]/40 rounded-2xl border border-[#2A2A50]/30 shadow-2xl"
                    style={{
                        boxShadow: '0 20px 40px -10px rgba(124, 106, 217, 0.15)',
                    }}
                >
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <Link
                                    href="#hero"
                                    className="text-lg font-bold bg-gradient-to-r from-[#7C6AD9] via-[#7178E2] to-[#10B1D5] bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
                                    onClick={(e) => handleNavClick(e, '#hero')}
                                >
                                    JuanMiguel Dev
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-2">
                                    {navItems.map((item) => {
                                        const isActive =
                                            activeSection === item.href.substring(1)

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`group relative px-2 py-1 transition-all duration-300 ease-in-out ${
                                                    isActive
                                                        ? 'text-white'
                                                        : 'text-[#D1D1F0] hover:text-[#23A8C0]'
                                                }`}
                                                onClick={(e) =>
                                                    handleNavClick(e, item.href)
                                                }
                                            >
                                                <span className="relative z-10 flex items-center space-x-[2px]">
                                                    <item.icon size={15} />
                                                    <span className="text-sm">
                                                        {item.name}
                                                    </span>
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

                            {/* Mobile menu button */}
                            <div className="md:hidden ml-4">
                                <button
                                    onClick={() =>
                                        setIsMobileMenuOpen(!isMobileMenuOpen)
                                    }
                                    className="p-2 text-[#D1D1F0] hover:text-[#23A8C0] hover:bg-[#7C6AD9]/10 rounded-lg transition-colors duration-200"
                                    aria-expanded={isMobileMenuOpen}
                                    aria-label="Menú principal"
                                >
                                    {isMobileMenuOpen ? (
                                        <X size={20} />
                                    ) : (
                                        <Menu size={20} />
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
                                <div className="px-5 py-3 border-t border-[#2A2A50]/30 bg-gradient-to-b from-transparent to-[#0A0A20]/40">
                                    <div className="space-y-1">
                                        {navItems.map((item) => {
                                            const isActive =
                                                activeSection === item.href.substring(1)

                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                                        isActive
                                                            ? 'text-white bg-[#7C6AD9]/20'
                                                            : 'text-[#D1D1F0] hover:text-[#23A8C0] hover:bg-[#7C6AD9]/10'
                                                    }`}
                                                    onClick={(e) =>
                                                        handleNavClick(e, item.href)
                                                    }
                                                >
                                                    <item.icon size={18} />
                                                    <span>{item.name}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
