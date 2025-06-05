'use client'

import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/utils/motion'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface TypewriterTextProps {
    words: string[]
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ words }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)
    const [currentText, setCurrentText] = useState<string>('')
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [typingSpeed, setTypingSpeed] = useState<number>(150)
    const [showCursor, setShowCursor] = useState<boolean>(true)

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev)
        }, 500)

        return () => clearInterval(cursorInterval)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentWord = words[currentWordIndex]

            if (isDeleting) {
                setCurrentText((prev) => prev.substring(0, prev.length - 1))
                setTypingSpeed(80)

                if (currentText === '') {
                    setIsDeleting(false)
                    setCurrentWordIndex((prev) => (prev + 1) % words.length)
                    setTypingSpeed(150)
                }
            } else {
                setCurrentText(currentWord.substring(0, currentText.length + 1))
                setTypingSpeed(150)

                if (currentText === currentWord) {
                    setTypingSpeed(2000)
                    setTimeout(() => {
                        setIsDeleting(true)
                        setTypingSpeed(80)
                    }, 2000)
                }
            }
        }, typingSpeed)

        return () => clearTimeout(timer)
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed])

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 inline-flex">
            {currentText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
        </span>
    )
}

const HeroContent = () => {
    const typewriterWords: string[] = [
        'innovative',
        'efficient',
        'scalable',
        'responsive',
        'modern',
        'specialized',
        'full-stack',
        'adaptable',
    ]

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20] select-none"
        >
            <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">
                <motion.div
                    variants={slideInFromTop}
                    className="inline-flex items-center rounded-3xl py-[8px] px-[10px] border border-[#7C6AD9] bg-[#0D0528]/50 shadow-sm w-fit"
                >
                    <SparklesIcon className="text-[#A99BEA] mr-[10px] h-5 w-5" />
                    <h1 className="text-[13px] font-medium text-[#D1D1F0]">
                        Full Stack Developer Portfolio
                    </h1>
                </motion.div>

                <motion.div
                    variants={slideInFromLeft(0.5)}
                    className="flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
                >
                    {/* Contenedor para mantener el layout estable */}
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <span>Building</span>
                            <span className="hidden md:inline-block">&nbsp;</span>
                            <TypewriterText words={typewriterWords} />
                        </div>
                        <span className="text-white">digital solutions</span>
                    </div>
                </motion.div>

                <motion.p
                    variants={slideInFromLeft(0.8)}
                    className="text-lg text-gray-400 my-5 max-w-[600px]"
                >
                    I&apos;m a Full Stack Developer specialized in Next.js, Node.js, and
                    TypeScript, creating web applications and digital solutions for
                    energy analysis and sustainable consulting. Check out my projects
                    and skills.
                </motion.p>
                <motion.a
                    variants={slideInFromLeft(1)}
                    className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
                    href="#about"
                >
                    Learn More
                </motion.a>
            </div>

            <motion.div
                variants={slideInFromRight(0.8)}
                className="w-full h-full flex justify-center items-center"
            >
                <Image
                    src="/mainIconsdark.svg"
                    alt="Programming technologies"
                    height={650}
                    width={650}
                />
            </motion.div>
        </motion.div>
    )
}

export default HeroContent
