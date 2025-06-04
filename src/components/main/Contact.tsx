'use client'

import { CheckCircle, Mail, MessageSquare, Send, User } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'

interface FormData {
    name: string
    email: string
    subject: string
    type: 'inquiry' | 'service'
    message: string
}

interface FormErrors {
    name?: string
    email?: string
    subject?: string
    message?: string
}

const Contact = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        type: 'inquiry',
        message: '',
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }))
        }
    }

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
        if (!formData.email.trim()) {
            newErrors.email = 'El correo es requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido'
        }
        if (!formData.subject.trim()) newErrors.subject = 'El asunto es requerido'
        if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido'

        return newErrors
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newErrors = validateForm()

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitted(true)
            setTimeout(() => {
                setIsSubmitted(false)
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    type: 'inquiry',
                    message: '',
                })
            }, 3000)
        } else {
            setErrors(newErrors)
        }
    }

    if (isSubmitted) {
        return (
            <section className="min-h-screen flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full text-center">
                    <div className="bg-gradient-to-br from-[#10102E]/90 to-[#0D0528]/90 rounded-3xl p-8 border border-[#2A2A50] shadow-2xl">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#4DEEAB] to-[#23A8C0] flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            ¡Mensaje Enviado!
                        </h3>
                        <p className="text-[#D1D1F0] mb-6">
                            Gracias por contactarnos. Te responderemos lo antes posible.
                        </p>
                        <div className="w-full h-2 bg-[#2A2A50] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center rounded-3xl py-2 px-4 border border-[#7C6AD9] bg-[#0D0528]/50 shadow-sm mb-6">
                        <Mail className="text-[#A99BEA] mr-2 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Contáctanos
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Hablemos de tu
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0]">
                            {' '}
                            próximo proyecto
                        </span>
                    </h2>

                    <p className="text-lg text-[#8A8AAA] max-w-2xl mx-auto">
                        ¿Tienes una idea increíble? Estamos aquí para ayudarte a hacerla
                        realidad. Cuéntanos sobre tu proyecto y comencemos esta aventura
                        juntos.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-[#10102E]/90 to-[#0D0528]/90 rounded-3xl p-8 md:p-12 border border-[#2A2A50] shadow-2xl"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="flex items-center text-[#D1D1F0] font-medium"
                                >
                                    <User className="w-4 h-4 mr-2 text-[#7C6AD9]" />
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-[#140634] border ${
                                        errors.name
                                            ? 'border-[#FF5F7E]'
                                            : 'border-[#2A2A50]'
                                    } rounded-xl text-white placeholder-[#8A8AAA] focus:outline-none focus:border-[#7C6AD9] focus:ring-2 focus:ring-[#7C6AD9]/20 transition-all duration-300`}
                                    placeholder="Tu nombre completo"
                                />
                                {errors.name && (
                                    <p className="text-[#FF5F7E] text-sm">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="flex items-center text-[#D1D1F0] font-medium"
                                >
                                    <Mail className="w-4 h-4 mr-2 text-[#7C6AD9]" />
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-[#140634] border ${
                                        errors.email
                                            ? 'border-[#FF5F7E]'
                                            : 'border-[#2A2A50]'
                                    } rounded-xl text-white placeholder-[#8A8AAA] focus:outline-none focus:border-[#7C6AD9] focus:ring-2 focus:ring-[#7C6AD9]/20 transition-all duration-300`}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-[#FF5F7E] text-sm">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Asunto */}
                        <div className="space-y-2">
                            <label
                                htmlFor="subject"
                                className="flex items-center text-[#D1D1F0] font-medium"
                            >
                                <MessageSquare className="w-4 h-4 mr-2 text-[#7C6AD9]" />
                                Asunto
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-[#140634] border ${
                                    errors.subject
                                        ? 'border-[#FF5F7E]'
                                        : 'border-[#2A2A50]'
                                } rounded-xl text-white placeholder-[#8A8AAA] focus:outline-none focus:border-[#7C6AD9] focus:ring-2 focus:ring-[#7C6AD9]/20 transition-all duration-300`}
                                placeholder="¿De qué quieres hablar?"
                            />
                            {errors.subject && (
                                <p className="text-[#FF5F7E] text-sm">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        {/* Tipo de consulta */}
                        <div className="space-y-2">
                            <label
                                htmlFor="type"
                                className="text-[#D1D1F0] font-medium"
                            >
                                Tipo de consulta
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="inquiry"
                                        checked={formData.type === 'inquiry'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#7C6AD9] bg-[#140634] border-[#2A2A50] focus:ring-[#7C6AD9] focus:ring-2"
                                    />
                                    <span className="text-[#D1D1F0]">
                                        Consulta general
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="service"
                                        checked={formData.type === 'service'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#7C6AD9] bg-[#140634] border-[#2A2A50] focus:ring-[#7C6AD9] focus:ring-2"
                                    />
                                    <span className="text-[#D1D1F0]">
                                        Solicitar servicio
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Mensaje */}
                        <div className="space-y-2">
                            <label
                                htmlFor="message"
                                className="text-[#D1D1F0] font-medium"
                            >
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                value={formData.message}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-[#140634] border ${
                                    errors.message
                                        ? 'border-[#FF5F7E]'
                                        : 'border-[#2A2A50]'
                                } rounded-xl text-white placeholder-[#8A8AAA] focus:outline-none focus:border-[#7C6AD9] focus:ring-2 focus:ring-[#7C6AD9]/20 transition-all duration-300 resize-none`}
                                placeholder="Cuéntanos más detalles sobre tu proyecto o consulta..."
                            />
                            {errors.message && (
                                <p className="text-[#FF5F7E] text-sm">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] text-white font-semibold rounded-xl hover:from-[#8B7DE0] hover:to-[#31B6CE] focus:outline-none focus:ring-2 focus:ring-[#7C6AD9]/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Enviar mensaje
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        name: '',
                                        email: '',
                                        subject: '',
                                        type: 'inquiry',
                                        message: '',
                                    })
                                }
                                className="flex-1 sm:flex-initial px-8 py-4 border border-[#2A2A50] text-[#D1D1F0] font-semibold rounded-xl hover:bg-[#140634] focus:outline-none focus:ring-2 focus:ring-[#2A2A50] transition-all duration-300"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </form>

                {/* Información adicional */}
                <div className="mt-12 text-center">
                    <p className="text-[#8A8AAA] mb-4">
                        También puedes encontrarnos en nuestras redes sociales
                    </p>
                    <div className="flex justify-center space-x-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7C6AD9] to-[#23A8C0] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                            <span className="text-white font-bold">@</span>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7C6AD9] to-[#23A8C0] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                            <span className="text-white font-bold">in</span>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7C6AD9] to-[#23A8C0] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                            <span className="text-white font-bold">tw</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
