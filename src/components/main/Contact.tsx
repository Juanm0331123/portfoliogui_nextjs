'use client'

import {
    BriefcaseBusiness,
    CheckCircle,
    Clock3,
    Mail,
    MapPin,
    MessageSquare,
    RotateCcw,
    Send,
    Sparkles,
    User,
} from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

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
    const [isVisible, setIsVisible] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' },
        )

        const section = document.getElementById('contact')
        if (section) observer.observe(section)

        return () => observer.disconnect()
    }, [])

    const contactDetails = [
        {
            icon: Mail,
            label: 'Email',
            value: 'juanmiguelleon5@gmail.com',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Cali, Colombia',
        },
        {
            icon: Clock3,
            label: 'Response window',
            value: 'Usually within 24 hours',
        },
    ]

    const inquiryTypes = [
        {
            value: 'inquiry' as const,
            label: 'General Inquiry',
            description: 'Questions, collaborations, and professional introductions.',
            icon: MessageSquare,
        },
        {
            value: 'service' as const,
            label: 'Service Request',
            description: 'Project work, product builds, and technical consulting.',
            icon: BriefcaseBusiness,
        },
    ]

    const fieldClass = (hasError?: boolean) =>
        `min-h-12 w-full rounded-xl border bg-[#0D0528]/80 px-4 py-3 text-[#F5F3FF] outline-none transition-[background-color,border-color,box-shadow,transform] duration-300 placeholder:text-[#8A8AAA] hover:bg-[#10102E]/90 focus:border-[#23A8C0] focus:bg-[#10102E] focus:shadow-[0_0_0_3px_rgba(35,168,192,0.16)] motion-reduce:transition-none ${
            hasError ? 'border-[#FF5F7E]' : 'border-[#2A2A50]/80'
        }`

    const fadeInClass = isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            subject: '',
            type: 'inquiry',
            message: '',
        })
        setErrors({})
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
                    },
                )
                if (res.ok) {
                    setIsSubmitted(true)
                    setTimeout(() => {
                        setIsSubmitted(false)
                        resetForm()
                    }, 3000)
                } else {
                    setErrors({ message: 'Error sending message. Try again later!.' })
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
            <section
                className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 sm:px-6"
                id="contact"
            >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-[#7C6AD9]/10 blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#23A8C0]/10 blur-3xl"></div>
                </div>

                <div className="relative z-10 w-full max-w-md text-center">
                    <div className="rounded-2xl border border-[#2A2A50]/80 bg-gradient-to-br from-[#10102E]/95 to-[#0D0528]/95 p-8">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4DEEAB] to-[#23A8C0]">
                            <CheckCircle className="h-8 w-8 text-[#020113]" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-[#F5F3FF]">
                            Message sent
                        </h3>
                        <p className="mb-7 text-[#D1D1F0]">
                            Thank you for reaching out. I will review your message and
                            respond as soon as possible.
                        </p>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2A2A50]">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#7C6AD9] to-[#23A8C0] motion-safe:animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section
            className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-24"
            id="contact"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-8rem] top-1/4 h-96 w-96 rounded-full bg-[#7C6AD9]/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-[-6rem] h-96 w-96 rounded-full bg-[#23A8C0]/10 blur-3xl"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div
                    className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 motion-reduce:transform-none motion-reduce:transition-none ${fadeInClass}`}
                >
                    <div className="mb-6 inline-flex items-center rounded-full border border-[#7C6AD9]/50 bg-[#0D0528]/60 px-5 py-2.5">
                        <Sparkles className="mr-3 h-5 w-5 text-[#A99BEA]" />
                        <span className="text-sm font-medium text-[#D1D1F0]">
                            Contact Us
                        </span>
                    </div>

                    <h2 className="mb-5 text-balance text-4xl font-bold text-[#F5F3FF] sm:text-5xl md:text-6xl">
                        Let&apos;s discuss the right next step
                    </h2>

                    <p className="mx-auto max-w-2xl text-lg leading-8 text-[#8A8AAA] sm:text-xl">
                        Share the context, goals, and constraints. I will use that to
                        understand where I can create value for your project.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.86fr_1.14fr] xl:gap-8">
                    <aside
                        className={`relative overflow-hidden rounded-2xl border border-[#2A2A50]/80 bg-gradient-to-br from-[#10102E]/92 to-[#140634]/92 p-6 transition-all delay-100 duration-700 motion-reduce:transform-none motion-reduce:transition-none sm:p-8 ${fadeInClass}`}
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#23A8C0]/70 to-transparent"></div>

                        <div className="mb-10">
                            <p className="mb-3 text-sm font-medium text-[#A99BEA]">
                                Professional contact
                            </p>
                            <h3 className="mb-4 text-2xl font-bold leading-tight text-[#F5F3FF] sm:text-3xl">
                                Clear communication before clean execution.
                            </h3>
                            <p className="leading-8 text-[#D1D1F0]">
                                I work best when the conversation starts with the
                                problem, expected outcome, and technical context. Use
                                this form to open that discussion.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {contactDetails.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-start gap-4 rounded-xl border border-[#2A2A50]/60 bg-[#0D0528]/55 p-4"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C6AD9]/22 to-[#23A8C0]/22">
                                        <item.icon
                                            className="text-[#A99BEA]"
                                            size={20}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#8A8AAA]">
                                            {item.label}
                                        </p>
                                        <p className="break-words font-medium text-[#D1D1F0]">
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 rounded-xl border border-[#23A8C0]/30 bg-[#23A8C0]/8 p-4">
                            <p className="text-sm leading-6 text-[#D1D1F0]">
                                Best fit: web platforms, portfolio systems, dashboards,
                                API integrations, and technical product builds.
                            </p>
                        </div>
                    </aside>

                    <form
                        onSubmit={handleSubmit}
                        className={`relative overflow-hidden rounded-2xl border border-[#2A2A50]/80 bg-[#0D0528]/72 p-5 transition-all delay-200 duration-700 motion-reduce:transform-none motion-reduce:transition-none sm:p-6 lg:p-8 ${fadeInClass}`}
                    >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7C6AD9]/70 to-transparent"></div>

                        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-medium text-[#A99BEA]">
                                    Project details
                                </p>
                                <h3 className="text-2xl font-bold text-[#F5F3FF]">
                                    Send a message
                                </h3>
                            </div>
                            <p className="text-sm text-[#8A8AAA]">
                                All fields are required
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="name"
                                        className="flex items-center text-sm font-medium text-[#D1D1F0]"
                                    >
                                        <User className="mr-2 h-4 w-4 text-[#7C6AD9]" />
                                        Full Name
                                    </label>
                                    <input
                                        aria-describedby={
                                            errors.name ? 'name-error' : undefined
                                        }
                                        aria-invalid={Boolean(errors.name)}
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={fieldClass(Boolean(errors.name))}
                                        placeholder="Juan Miguel Leon"
                                    />
                                    {errors.name && (
                                        <p
                                            id="name-error"
                                            className="text-sm text-[#FF5F7E]"
                                        >
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="flex items-center text-sm font-medium text-[#D1D1F0]"
                                    >
                                        <Mail className="mr-2 h-4 w-4 text-[#7C6AD9]" />
                                        Email
                                    </label>
                                    <input
                                        aria-describedby={
                                            errors.email ? 'email-error' : undefined
                                        }
                                        aria-invalid={Boolean(errors.email)}
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={fieldClass(Boolean(errors.email))}
                                        placeholder="you@company.com"
                                    />
                                    {errors.email && (
                                        <p
                                            id="email-error"
                                            className="text-sm text-[#FF5F7E]"
                                        >
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="flex items-center text-sm font-medium text-[#D1D1F0]"
                                >
                                    <MessageSquare className="mr-2 h-4 w-4 text-[#7C6AD9]" />
                                    Subject
                                </label>
                                <input
                                    aria-describedby={
                                        errors.subject ? 'subject-error' : undefined
                                    }
                                    aria-invalid={Boolean(errors.subject)}
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className={fieldClass(Boolean(errors.subject))}
                                    placeholder="What would you like to build or discuss?"
                                />
                                {errors.subject && (
                                    <p
                                        id="subject-error"
                                        className="text-sm text-[#FF5F7E]"
                                    >
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            <fieldset className="space-y-3">
                                <legend className="text-sm font-medium text-[#D1D1F0]">
                                    Inquiry Type
                                </legend>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {inquiryTypes.map((option) => {
                                        const Icon = option.icon

                                        return (
                                            <label
                                                key={option.value}
                                                htmlFor={`type-${option.value}`}
                                                className="group relative min-h-[116px] cursor-pointer rounded-xl border border-[#2A2A50]/80 bg-[#10102E]/52 p-4 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#7C6AD9]/70 hover:bg-[#10102E]/82 motion-reduce:transform-none motion-reduce:transition-none"
                                            >
                                                <input
                                                    type="radio"
                                                    id={`type-${option.value}`}
                                                    name="type"
                                                    value={option.value}
                                                    checked={
                                                        formData.type === option.value
                                                    }
                                                    onChange={handleInputChange}
                                                    className="peer sr-only"
                                                />
                                                <span className="absolute inset-0 rounded-xl border border-transparent transition duration-300 peer-checked:border-[#23A8C0] peer-checked:shadow-[0_0_0_3px_rgba(35,168,192,0.14)] motion-reduce:transition-none"></span>
                                                <span className="relative flex items-start gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6AD9]/22 to-[#23A8C0]/22">
                                                        <Icon
                                                            className="text-[#A99BEA]"
                                                            size={19}
                                                        />
                                                    </span>
                                                    <span>
                                                        <span className="block font-semibold text-[#F5F3FF]">
                                                            {option.label}
                                                        </span>
                                                        <span className="mt-1 block text-sm leading-6 text-[#8A8AAA]">
                                                            {option.description}
                                                        </span>
                                                    </span>
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </fieldset>

                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium text-[#D1D1F0]"
                                >
                                    Message
                                </label>
                                <textarea
                                    aria-describedby={
                                        errors.message ? 'message-error' : undefined
                                    }
                                    aria-invalid={Boolean(errors.message)}
                                    id="message"
                                    name="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={`${fieldClass(
                                        Boolean(errors.message),
                                    )} min-h-40 resize-none leading-7`}
                                    placeholder="Tell me about the goal, timeline, technical context, and what a successful result looks like."
                                />
                                {errors.message && (
                                    <p
                                        id="message-error"
                                        className="text-sm text-[#FF5F7E]"
                                    >
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                <button
                                    type="submit"
                                    className="button-primary group flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-7 py-3.5 font-semibold"
                                >
                                    <Send
                                        className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                                        size={19}
                                    />
                                    Send Message
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#2A2A50]/90 bg-[#10102E]/45 px-7 py-3.5 font-semibold text-[#D1D1F0] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#7C6AD9]/70 hover:bg-[#140634]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6AD9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020113] motion-reduce:transform-none motion-reduce:transition-none"
                                >
                                    <RotateCcw size={18} />
                                    Clear
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Contact
