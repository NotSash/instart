'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    FileText, Clock, CheckCircle, AlertCircle, Plus, Search, Loader2,
    Download, MessageSquare, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchDealRooms } from '@/app/actions/premium'

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    active: { label: 'Active', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: Clock },
    under_review: { label: 'Under Review', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: AlertCircle },
    completed: { label: 'Completed', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: AlertCircle },
}

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return ''
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function DealRoomPage() {
    const [deals, setDeals] = useState<DataRow[]>([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchDealRooms()
            setDeals(result.deals)
            setIsLoading(false)
        }
        load()
    }, [])

    const filtered = deals.filter((d: DataRow) => {
        if (search && !d.name?.toLowerCase().includes(search.toLowerCase())) return false
        if (statusFilter !== 'all' && d.status !== statusFilter) return false
        return true
    })

    const activeDealCount = deals.filter((d: DataRow) => d.status === 'active').length
    const reviewCount = deals.filter((d: DataRow) => d.status === 'under_review').length
    const completedCount = deals.filter((d: DataRow) => d.status === 'completed').length
    const totalDocs = deals.reduce((sum: number, d: DataRow) => sum + (d.doc_count || 0), 0)

    return (
        <AppLayout currentPage="dealroom">
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                            Deal Room <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pro</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Securely share documents and manage your fundraising pipeline.</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white hidden md:flex"><Plus className="w-4 h-4 mr-2" /> New Deal</Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Active Deals', value: activeDealCount, color: 'text-emerald-400' },
                        { label: 'Under Review', value: reviewCount, color: 'text-amber-400' },
                        { label: 'Completed', value: completedCount, color: 'text-cyan-400' },
                        { label: 'Documents', value: totalDocs, color: 'text-foreground' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-4">
                            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deals..."
                            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'active', 'under_review', 'completed'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-all hidden md:block ${statusFilter === s ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                                {s === 'under_review' ? 'Review' : s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Deals */}
                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-emerald-400" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">{deals.length === 0 ? 'No deal rooms yet' : 'No deals match your filter'}</p>
                        <p className="text-sm text-muted-foreground">Create a new deal to get started with secure document sharing</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((deal: DataRow, i: number) => {
                            const config = statusConfig[deal.status] || statusConfig.active
                            const StatusIcon = config.icon
                            const otherParty = deal.founder || deal.investor
                            return (
                                <motion.div key={deal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="glass-card p-5 hover:border-white/10 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                            {deal.name?.slice(0, 2)?.toUpperCase() || 'DR'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-400 transition-colors">{deal.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${config.color}`}>
                                                    <StatusIcon className="w-3 h-3" /> {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                                {otherParty && <span className="text-xs text-muted-foreground">with {otherParty.full_name}</span>}
                                                <span className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="w-3 h-3" /> {deal.doc_count} docs</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(deal.updated_at)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"><Download className="w-4 h-4" /></button>
                                            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"><MessageSquare className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
