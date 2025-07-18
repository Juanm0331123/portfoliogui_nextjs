import { Github, Instagram, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="w-full bg-transparent text-gray-200 shadow-lg p-6">
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
                <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8 py-6">
                    <div className="flex flex-col items-center">
                        <div className="font-bold text-lg mb-2">Social Media</div>
                        <a
                            href="https://github.com/Juanm0331123"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center my-2 hover:text-[#7C6AD9] transition-colors"
                        >
                            <Github size={18} />
                            <span className="ml-2">GitHub</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/juanmigueldev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center my-2 hover:text-[#0A66C2] transition-colors"
                        >
                            <Linkedin size={18} />
                            <span className="ml-2">LinkedIn</span>
                        </a>
                        <a
                            href="https://www.instagram.com/juanm0331123/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center my-2 hover:text-[#E1306C] transition-colors"
                        >
                            <Instagram size={18} />
                            <span className="ml-2">Instagram</span>
                        </a>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-bold text-lg mb-2">Contact</div>
                        <a
                            href="mailto:juanmiguelleon5@gmail.com"
                            className="flex items-center my-2 hover:text-[#7C6AD9] transition-colors"
                        >
                            <Mail size={18} />
                            <span className="ml-2">juanmiguelleon5@gmail.com</span>
                        </a>
                        <span className="text-sm text-gray-400 mt-2">
                            Cali, Colombia
                        </span>
                    </div>
                </div>
                <div className="text-center text-sm text-gray-400 mt-4">
                    &copy; {new Date().getFullYear()} JuanMiguel Dev. All rights
                    reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
