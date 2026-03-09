'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Eye, Database, Lock, Globe, UserCheck, Bell, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const sections = [
    {
        title: '1. Information We Collect',
        icon: Database,
        content: `We collect information you provide directly to us when you create an account, complete your profile, or interact with the platform. This includes: your name, email address, phone number, company information, job title, profile photo, and any content you post or share. We also automatically collect usage data including IP address, browser type, device information, pages visited, and interactions with features.`,
    },
    {
        title: '2. How We Use Your Information',
        icon: Eye,
        content: `We use the information we collect to: (a) provide, maintain, and improve the Service; (b) power our AI-driven matching algorithm to connect founders with relevant investors; (c) personalize your experience and surface relevant content; (d) send you transactional notifications and updates; (e) analyze platform usage and trends to improve our product; (f) detect, prevent, and address fraud and security issues; (g) comply with legal obligations.`,
    },
    {
        title: '3. Information Sharing',
        icon: UserCheck,
        content: `Your profile information is visible to other users of the platform based on your privacy settings. We do not sell your personal information to third parties. We may share your information with: (a) other users as part of the platform's core functionality (e.g., when you connect with an investor, they can see your startup profile); (b) service providers who assist us in operating the platform; (c) law enforcement or government agencies when required by law; (d) parties involved in a merger, acquisition, or sale of company assets.`,
    },
    {
        title: '4. Data Security',
        icon: Lock,
        content: `We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS 1.3) and at rest (AES-256), regular security audits, and access controls. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee the absolute security of your information but are committed to protecting it to the best of our ability.`,
    },
    {
        title: '5. Data Retention',
        icon: Database,
        content: `We retain your personal information for as long as your account is active or as needed to provide you the Service. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal, tax, or regulatory purposes. Aggregated, anonymized data that cannot be used to identify you may be retained indefinitely for analytics purposes.`,
    },
    {
        title: '6. Your Rights',
        icon: Shield,
        content: `You have the right to: (a) access and receive a copy of your personal data; (b) correct inaccurate or incomplete personal data; (c) request deletion of your personal data; (d) object to or restrict the processing of your personal data; (e) data portability — receive your data in a structured, commonly used, machine-readable format; (f) withdraw consent at any time where processing is based on consent. To exercise any of these rights, please contact us at privacy@instart.in.`,
    },
    {
        title: '7. Cookies and Tracking',
        icon: Globe,
        content: `We use cookies and similar tracking technologies to collect usage data, remember your preferences, and improve your experience. Essential cookies are required for the platform to function. Analytics cookies help us understand how users interact with the platform. You can control cookie preferences through your browser settings, but disabling certain cookies may affect the functionality of the Service.`,
    },
    {
        title: '8. Changes to This Policy',
        icon: Bell,
        content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a notice on the platform, sending you an email, or through other appropriate channels. Your continued use of the Service after the effective date of the updated policy constitutes your acceptance of the changes.`,
    },
    {
        title: '9. Contact Us',
        icon: Mail,
        content: `If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@instart.in. For data protection inquiries, you may also write to: Instart Data Protection Officer, Bengaluru, Karnataka, India.`,
    },
]

export default function PrivacyPage() {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Nav */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" />
                    <span className="text-sm font-bold text-foreground tracking-tight">instart</span>
                </Link>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
                <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground mb-2">Last updated: March 1, 2026</p>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-10">
                        Your privacy is important to us. This Privacy Policy explains how Instart collects, uses, shares, and protects your personal information when you use our platform.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {sections.map((section, i) => {
                        const Icon = section.icon
                        return (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="glass-card p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                                </div>
                                <p className="text-sm text-foreground/70 leading-relaxed">{section.content}</p>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 pt-8 border-t border-white/5 text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        Have questions about your privacy?{' '}
                        <a href="mailto:privacy@instart.in" className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer underline">
                            Contact our privacy team
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
