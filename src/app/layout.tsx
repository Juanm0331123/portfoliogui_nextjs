import Footer from '@/components/main/Footer'
import Navbar from '@/components/main/Navbar'
import StarsCanvas from '@/components/main/StarBackground'
import { AnimatePresence } from 'framer-motion'
import type { Metadata } from 'next'
import { Noto_Sans_Display } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_Display({
    subsets: ['latin'],
    variable: '--font-noto',
})

export const metadata: Metadata = {
    title: 'Portfolio | Juan Miguel Dev',
    description:
        'Portfolio of Juan Miguel Dev, a software engineer specializing in web development.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={`${noto.variable} antialiased bg-[#020113] text-white`}>
                <StarsCanvas />
                <Navbar />
                <AnimatePresence mode="wait">{children}</AnimatePresence>
                <Footer />
            </body>
        </html>
    )
}
