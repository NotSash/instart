'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, FileText, Scale, UserCheck, Globe, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const sections = [
    {
        title: '1. Acceptance of Terms',
        icon: FileText,
        content: `By accessing or using the Instart platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you may not use our Service. Instart reserves the right to update these Terms at any time, and continued use of the Service constitutes acceptance of the updated Terms.`,
    },
    {
        title: '2. User Accounts',
        icon: UserCheck,
        content: `You must register for an account to access most features of the Service. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify Instart of any unauthorized use of your account.`,
    },
    {
        title: '3. Acceptable Use',
        icon: Shield,
        content: `You agree not to use the Service to: (a) violate any applicable laws or regulations; (b) post false, misleading, or fraudulent information about startups, funding, or investment opportunities; (c) harass, abuse, or threaten other users; (d) spam or send unsolicited communications; (e) attempt to gain unauthorized access to other accounts or systems; (f) scrape, crawl, or use automated tools to extract data from the platform without prior written consent; (g) impersonate other individuals or entities.`,
    },
    {
        title: '4. Intellectual Property',
        icon: Scale,
        content: `All content, features, and functionality of the Service — including text, graphics, logos, icons, images, and software — are the exclusive property of Instart or its licensors and are protected by international copyright, trademark, patent, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on the Service without prior written consent.`,
    },
    {
        title: '5. Investment Disclaimers',
        icon: Globe,
        content: `Instart is a platform that facilitates connections between startups and investors. Instart does not provide investment advice, endorse any startup or investor, guarantee any returns, or facilitate actual financial transactions. All investment decisions are made solely between the parties involved. Users should conduct their own due diligence and seek independent financial advice before making any investment decisions. Instart is not registered as a broker-dealer, investment advisor, or under any equivalent regulatory framework.`,
    },
    {
        title: '6. Limitation of Liability',
        icon: Shield,
        content: `To the maximum extent permitted by applicable law, Instart and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, business opportunities, or goodwill, arising out of or related to your use of the Service. Instart's total liability for any claims arising from the use of the Service shall not exceed the amount paid by you to Instart in the twelve (12) months preceding the claim.`,
    },
    {
        title: '7. Termination',
        icon: FileText,
        content: `Instart may suspend or terminate your account at any time, with or without cause, with or without notice. Upon termination, your right to use the Service will immediately cease. Provisions that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, limitation of liability, and dispute resolution provisions.`,
    },
    {
        title: '8. Governing Law',
        icon: Scale,
        content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or the Service will be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, India.`,
    },
    {
        title: '9. Contact Us',
        icon: Mail,
        content: `If you have any questions about these Terms of Service, please reach out to us at legal@instart.in.`,
    },
]

export default function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground mb-2">Last updated: March 1, 2026</p>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-10">
                        Please read these Terms of Service carefully before using the Instart platform. By using our Service, you agree to be bound by these terms.
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
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-emerald-400" />
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
                        Have questions about our terms?{' '}
                        <a href="mailto:legal@instart.in" className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer underline">
                            Contact our legal team
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
