'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Check, Sparkles, Shield, Users, TrendingUp, Eye, Zap,
    Lock, Star, ArrowRight, Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const plans = [
    {
        name: 'Free',
        price: '₹0',
        period: '/forever',
        desc: 'Perfect for getting started and exploring the ecosystem.',
        features: [
            'Create your founder/investor profile',
            'Browse the startup & investor directory',
            'Join up to 3 communities',
            'Post in feed',
            '5 connection requests/month',
        ],
        cta: 'Get Started',
        popular: false,
        gradient: '',
    },
    {
        name: 'Pro',
        price: '₹399',
        period: '/month',
        annualPrice: '₹333',
        annualTotal: '₹3,999/year',
        desc: 'For serious founders and investors who want to move fast.',
        features: [
            'Everything in Free',
            'Unlimited connection requests',
            'See who viewed your profile',
            'AI-powered investor matching',
            'Access Deal Room',
            'Priority search placement',
            'Startup comparison tool',
            'Direct message anyone',
            'Advanced analytics dashboard',
        ],
        cta: 'Start 14-Day Free Trial',
        popular: true,
        gradient: 'from-emerald-500 to-cyan-500',
    },
    {
        name: 'Enterprise',
        price: '₹4,999',
        period: '/month',
        desc: 'For VC firms, accelerators, and institutions.',
        features: [
            'Everything in Pro',
            'Multi-user team accounts',
            'API access & integrations',
            'Custom branded deal room',
            'Bulk startup data export',
            'Dedicated account manager',
            'White-label reports',
        ],
        cta: 'Contact Sales',
        popular: false,
        gradient: '',
    },
]

const faqs = [
    { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
    { q: 'Is there a free trial for Pro?', a: 'Yes! Pro comes with a 14-day free trial. No credit card required to start.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, UPI, and net banking through our Indian payment gateway.' },
    { q: 'Can I switch between plans?', a: 'Absolutely. You can upgrade or downgrade your plan at any time. Prorated credits will be applied.' },
]

export default function PricingPage() {
    const [annual, setAnnual] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Nav */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2"><Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" /><span className="text-sm font-bold text-foreground tracking-tight">instart</span></Link>
                <Link href="/login"><Button variant="outline" size="sm" className="border-white/10">Sign In</Button></Link>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 inline-block">
                            <Star className="w-3 h-3 inline mr-1" /> Simple Pricing
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4" style={{ letterSpacing: '-0.03em' }}>
                            Invest in your startup&apos;s growth
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that works for you. Start free and upgrade as you grow.</p>
                    </motion.div>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <span className={`text-sm ${!annual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Monthly</span>
                        <button onClick={() => setAnnual(!annual)} className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-emerald-500' : 'bg-white/10'}`}>
                            <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" animate={{ left: annual ? 26 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                        </button>
                        <span className={`text-sm ${annual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Annual</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">Save 16%</span>
                    </div>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {plans.map((plan, i) => (
                        <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className={`relative rounded-2xl p-6 md:p-8 border transition-all ${plan.popular
                                ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent'
                                : 'border-white/10 bg-white/2 hover:border-white/20'
                                }`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-black flex items-center gap-1">
                                    <Crown className="w-3 h-3" /> Most Popular
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-3xl md:text-4xl font-bold text-foreground">{annual && plan.annualPrice ? plan.annualPrice : plan.price}</span>
                                <span className="text-muted-foreground text-sm">{plan.period}</span>
                            </div>
                            {annual && plan.annualTotal && (
                                <p className="text-xs text-muted-foreground mb-2">Billed as {plan.annualTotal}</p>
                            )}
                            <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                            <Button
                                onClick={() => {
                                    if (plan.name === 'Enterprise') {
                                        window.location.href = 'mailto:sales@instart.in?subject=Enterprise Plan Inquiry'
                                    } else if (plan.name === 'Pro') {
                                        window.location.href = '/signup?plan=pro'
                                    } else {
                                        window.location.href = '/signup'
                                    }
                                }}
                                className={`w-full mb-6 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-white/5 hover:bg-white/10 text-foreground border border-white/10'}`}>
                                {plan.cta} {plan.popular && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                            <ul className="space-y-3">
                                {plan.features.map((f, fi) => (
                                    <li key={fi} className="flex items-start gap-2.5 text-sm">
                                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                                        <span className="text-foreground/80">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* FAQs */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground text-center mb-8" style={{ letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-muted-foreground text-lg">+</motion.span>
                                </button>
                                <motion.div animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }} className="overflow-hidden">
                                    <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
