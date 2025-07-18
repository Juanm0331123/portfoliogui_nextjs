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

        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address'
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
        if (!formData.message.trim()) newErrors.message = 'Message is required'

        return newErrors
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newErrors = validateForm()

        if (Object.keys(newErrors).length === 0) {
            try {
                const res = await fetch(
                    'https://juanmigueldev.vercel.app/api/contact',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    }
                )
                if (res.ok) {
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
                    setErrors({ message: 'Error sending message. Try again later.' })
                }
            } catch {
                setErrors({ message: 'Error sending message. Try again later.' })
            }
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
                            Message Sent!
                        </h3>
                        <p className="text-[#D1D1F0] mb-6">
                            Thank you for contacting us. We will respond as soon as
                            possible.
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
        <section
            className="min-h-screen flex items-center justify-center px-4 py-16"
            id="contact"
        >
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center rounded-3xl py-2 px-4 border border-[#7C6AD9] bg-[#0D0528]/50 shadow-sm mb-6">
                        <Mail className="text-[#A99BEA] mr-2 h-5 w-5" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Contact Us
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Let&apos;s talk about your
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0]">
                            {' '}
                            next project!
                        </span>
                    </h2>

                    <p className="text-lg text-[#8A8AAA] max-w-2xl mx-auto">
                        Do you have an amazing idea? We&apos;re here to help you make it
                        a reality. Tell us about your project and let&apos;s begin this
                        journey together.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-transparent rounded-3xl p-8 md:p-12 border border-[#2A2A50] shadow-2xl"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="flex items-center text-[#D1D1F0] font-medium"
                                >
                                    <User className="w-4 h-4 mr-2 text-[#7C6AD9]" />
                                    Full Name
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
                                    placeholder="Your full name"
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
                                    Email
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
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="text-[#FF5F7E] text-sm">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <label
                                htmlFor="subject"
                                className="flex items-center text-[#D1D1F0] font-medium"
                            >
                                <MessageSquare className="w-4 h-4 mr-2 text-[#7C6AD9]" />
                                Subject
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
                                placeholder="What would you like to discuss?"
                            />
                            {errors.subject && (
                                <p className="text-[#FF5F7E] text-sm">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        {/* Inquiry Type */}
                        <div className="space-y-2">
                            <label
                                htmlFor="type"
                                className="text-[#D1D1F0] font-medium"
                            >
                                Inquiry Type
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
                                        General Inquiry
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
                                        Service Request
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label
                                htmlFor="message"
                                className="text-[#D1D1F0] font-medium"
                            >
                                Message
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
                                placeholder="Tell us more details about your project or inquiry..."
                            />
                            {errors.message && (
                                <p className="text-[#FF5F7E] text-sm">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] text-white font-semibold rounded-xl hover:from-[#8B7DE0] hover:to-[#31B6CE] focus:outline-none focus:ring-2 focus:ring-[#7C6AD9]/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Send Message
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
                                Clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Contact
