'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    MapPin, Linkedin, BadgeCheck, Loader2, ArrowLeft, MessageSquare,
    Briefcase, TrendingUp, Target, CheckCircle2, XCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchInvestorProfile, recordProfileView } from '@/app/actions/profiles'

function formatCheckSize(min: number | null, max: number | null): string {
    const fmt = (n: number) => {
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
        if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
        return `₹${n.toLocaleString('en-IN')}`
    }
    if (min && max) return `${fmt(min)} – ${fmt(max)}`
    if (min) return `${fmt(min)}+`
    if (max) return `Up to ${fmt(max)}`
    return 'Not disclosed'
}

const stageLabels: Record<string, string> = {
    idea: 'Idea', mvp: 'MVP', early_traction: 'Early Traction', growth: 'Growth', scale: 'Scale',
    pre_seed: 'Pre-Seed', seed: 'Seed', series_a: 'Series A', series_b: 'Series B', series_c_plus: 'Series C+',
}

const outcomeColors: Record<string, { icon: typeof CheckCircle2; color: string }> = {
    active: { icon: Clock, color: 'text-cyan-400' },
    exited: { icon: CheckCircle2, color: 'text-emerald-400' },
    written_off: { icon: XCircle, color: 'text-red-400' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function InvestorProfilePage() {
    const params = useParams()
    const userId = params.id as string
    const [profile, setProfile] = useState<DataRow>(null)
    const [investorProfile, setInvestorProfile] = useState<DataRow>(null)
    const [portfolio, setPortfolio] = useState<DataRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchInvestorProfile(userId)
            setProfile(result.profile)
            setInvestorProfile(result.investorProfile)
            setPortfolio(result.portfolio)
            setIsLoading(false)
            recordProfileView(userId)
        }
        load()
    }, [userId])

    if (isLoading) {
        return (
            <AppLayout currentPage="explore">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                </div>
            </AppLayout>
        )
    }

    if (!profile || !investorProfile) {
        return (
            <AppLayout currentPage="explore">
                <div className="text-center py-20">
                    <p className="text-foreground font-medium mb-4">Investor not found</p>
                    <Link href="/app/explore/investors"><Button variant="outline">← Back to Explore</Button></Link>
                </div>
            </AppLayout>
        )
    }

    const tabs = ['overview', 'portfolio']

    return (
        <AppLayout currentPage="explore">
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <Link href="/app/explore/investors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>

                {/* Hero Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-2xl font-bold text-foreground border border-white/10 flex-shrink-0">
                            {profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>{profile.full_name}</h1>
                                {profile.is_verified && <BadgeCheck className="w-6 h-6 text-cyan-400" />}
                            </div>
                            <p className="text-lg text-muted-foreground mb-3">{investorProfile.professional_title || 'Investor'}</p>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                                {profile.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.city}</span>}
                                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{investorProfile.total_investments} investments</span>
                                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{formatCheckSize(investorProfile.min_check_size, investorProfile.max_check_size)}</span>
                            </div>

                            {/* Sectors */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {investorProfile.sectors_of_interest?.map((s: string) => (
                                    <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/5">{s}</span>
                                ))}
                            </div>

                            {/* Status badges */}
                            <div className="flex flex-wrap gap-2">
                                {investorProfile.is_actively_investing && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-sm text-green-400 border border-green-500/20">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Actively Investing
                                    </span>
                                )}
                                {investorProfile.open_to_syndicate && (
                                    <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-sm text-cyan-400 border border-cyan-500/20">Open to Syndicates</span>
                                )}
                                {investorProfile.open_to_mentoring && (
                                    <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-sm text-purple-400 border border-purple-500/20">Open to Mentoring</span>
                                )}
                                {profile.linkedin_url && (
                                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all">
                                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm flex-shrink-0">
                            <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                        </Button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-white/5 pb-px">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 ${activeTab === tab ? 'text-cyan-400 border-cyan-400' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Investment Thesis */}
                            {investorProfile.investment_thesis && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-cyan-400" /> Investment Thesis</h3>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{investorProfile.investment_thesis}</p>
                                </div>
                            )}

                            {/* Bio */}
                            {profile.bio && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                                </div>
                            )}

                            {/* Preferred Stages */}
                            {investorProfile.preferred_stages?.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Preferred Stages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {investorProfile.preferred_stages.map((s: string) => (
                                            <span key={s} className="px-3 py-1.5 rounded-lg text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{stageLabels[s] || s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{investorProfile.total_investments}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Total Investments</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{formatCheckSize(investorProfile.min_check_size, investorProfile.max_check_size)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Check Size</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{portfolio.length}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Portfolio Companies</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div>
                            {portfolio.length === 0 ? (
                                <div className="text-center py-12">
                                    <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground">No portfolio companies listed yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {portfolio.map((inv: DataRow) => {
                                        const outcome = outcomeColors[inv.outcome] || outcomeColors.active
                                        const OutcomeIcon = outcome.icon
                                        return (
                                            <div key={inv.id} className="glass-card p-5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-foreground">{inv.startup_name}</h4>
                                                    <span className={`flex items-center gap-1 text-xs font-medium ${outcome.color}`}>
                                                        <OutcomeIcon className="w-3.5 h-3.5" /> {inv.outcome}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Invested in {inv.year}</p>
                                                {inv.notes && <p className="text-sm text-muted-foreground mt-1">{inv.notes}</p>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AppLayout>
    )
}
