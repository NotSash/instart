'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    MapPin, Globe, Linkedin, FileText, Video, Users,
    TrendingUp, BadgeCheck, Loader2, ArrowLeft, MessageSquare,
    Calendar, IndianRupee, Target, Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchFounderProfile, recordProfileView } from '@/app/actions/profiles'

const stageLabels: Record<string, string> = {
    idea: 'Idea', mvp: 'MVP', early_traction: 'Early Traction', growth: 'Growth', scale: 'Scale',
    pre_seed: 'Pre-Seed', seed: 'Seed', series_a: 'Series A', series_b: 'Series B', series_c_plus: 'Series C+',
}

const roundTypeLabels: Record<string, string> = {
    pre_seed: 'Pre-Seed', seed: 'Seed', series_a: 'Series A', series_b: 'Series B', series_c_plus: 'Series C+', grant: 'Grant', debt: 'Debt',
}

function formatAmount(n: number | null): string {
    if (!n) return '–'
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
    return `₹${n.toLocaleString('en-IN')}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function StartupProfilePage() {
    const params = useParams()
    const userId = params.id as string
    const [profile, setProfile] = useState<DataRow>(null)
    const [founderProfile, setFounderProfile] = useState<DataRow>(null)
    const [team, setTeam] = useState<DataRow[]>([])
    const [funding, setFunding] = useState<DataRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchFounderProfile(userId)
            setProfile(result.profile)
            setFounderProfile(result.founderProfile)
            setTeam(result.team)
            setFunding(result.funding)
            setIsLoading(false)
            // Record profile view
            recordProfileView(userId)
        }
        load()
    }, [userId])

    if (isLoading) {
        return (
            <AppLayout currentPage="explore" userRole="investor">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                </div>
            </AppLayout>
        )
    }

    if (!profile || !founderProfile) {
        return (
            <AppLayout currentPage="explore" userRole="investor">
                <div className="text-center py-20">
                    <p className="text-foreground font-medium mb-4">Startup not found</p>
                    <Link href="/app/explore/startups"><Button variant="outline">← Back to Explore</Button></Link>
                </div>
            </AppLayout>
        )
    }

    const tabs = ['overview', 'team', 'funding', 'updates']

    return (
        <AppLayout currentPage="explore" userRole="investor">
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                {/* Back Button */}
                <Link href="/app/explore/startups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>

                {/* Hero Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-2xl font-bold text-foreground border border-white/10 flex-shrink-0">
                            {founderProfile.startup_name?.slice(0, 2)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>{founderProfile.startup_name}</h1>
                                {profile.is_verified && <BadgeCheck className="w-6 h-6 text-emerald-400" />}
                            </div>
                            {founderProfile.one_liner && <p className="text-muted-foreground mb-3">{founderProfile.one_liner}</p>}

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                                {profile.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.city}</span>}
                                {founderProfile.stage && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{stageLabels[founderProfile.stage] || founderProfile.stage}</span>}
                                {founderProfile.founded_year && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Founded {founderProfile.founded_year}</span>}
                                {founderProfile.team_size && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{founderProfile.team_size} members</span>}
                            </div>

                            {/* Sectors */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {founderProfile.sectors?.map((s: string) => (
                                    <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/5">{s}</span>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-2">
                                {founderProfile.website_url && (
                                    <a href={founderProfile.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all">
                                        <Globe className="w-3.5 h-3.5" /> Website
                                    </a>
                                )}
                                {profile.linkedin_url && (
                                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all">
                                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                                {founderProfile.pitch_deck_url && (
                                    <a href={founderProfile.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-sm text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                                        <FileText className="w-3.5 h-3.5" /> Pitch Deck
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Health Score */}
                        <div className="flex flex-col items-center gap-1">
                            {founderProfile.health_score && (
                                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-xl font-bold ${founderProfile.health_score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : founderProfile.health_score >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                                    {founderProfile.health_score}
                                </div>
                            )}
                            <span className="text-xs text-muted-foreground">Health Score</span>
                            <Button className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm">
                                <MessageSquare className="w-4 h-4 mr-1.5" /> Contact
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-white/5 pb-px overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'text-emerald-400 border-emerald-400' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Pitch */}
                            {founderProfile.pitch && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-400" /> About</h3>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{founderProfile.pitch}</p>
                                </div>
                            )}

                            {/* Video Pitch */}
                            {founderProfile.video_pitch_url && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Video className="w-5 h-5 text-emerald-400" /> Video Pitch</h3>
                                    <div className="aspect-video rounded-xl overflow-hidden bg-black/50">
                                        <iframe src={founderProfile.video_pitch_url} className="w-full h-full" allowFullScreen />
                                    </div>
                                </div>
                            )}

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{formatAmount(founderProfile.total_raised)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Total Raised</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{founderProfile.team_size || '–'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Team Size</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{founderProfile.founded_year || '–'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Founded</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-2xl font-bold text-foreground">{stageLabels[founderProfile.stage] || '–'}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Stage</p>
                                </div>
                            </div>

                            {/* Looking For */}
                            {founderProfile.looking_for?.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-400" /> Looking For</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {founderProfile.looking_for.map((item: string) => (
                                            <span key={item} className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{item}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div>
                            {team.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground">No team members listed yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {team.map((member: DataRow) => (
                                        <div key={member.id} className="glass-card p-5 flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                                {member.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{member.name}</h4>
                                                <p className="text-sm text-emerald-400">{member.role}</p>
                                                {member.bio && <p className="text-sm text-muted-foreground mt-1">{member.bio}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'funding' && (
                        <div>
                            {funding.length === 0 ? (
                                <div className="text-center py-12">
                                    <IndianRupee className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground">No funding rounds listed yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {funding.map((round: DataRow) => (
                                        <div key={round.id} className="glass-card p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-foreground">{roundTypeLabels[round.round_type] || round.round_type}</h4>
                                                <span className="text-lg font-bold text-emerald-400">{formatAmount(round.amount)}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{new Date(round.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                                            {round.investors && <p className="text-sm text-muted-foreground mt-1">Investors: {round.investors}</p>}
                                            {round.notes && <p className="text-sm text-muted-foreground mt-1">{round.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'updates' && (
                        <div className="text-center py-12">
                            <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No updates posted yet</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AppLayout>
    )
}
