'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    Plus, X, Search, Check, TrendingUp, Loader2
} from 'lucide-react'
import { fetchStartupsForCompare } from '@/app/actions/premium'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

const metrics: { key: string; label: string; numeric?: boolean }[] = [
    { key: 'health_score', label: 'Health Score', numeric: true },
    { key: 'stage', label: 'Stage' },
    { key: 'sectors', label: 'Sectors' },
    { key: 'team_size', label: 'Team Size', numeric: true },
    { key: 'total_raised', label: 'Total Raised', numeric: true },
    { key: 'founded_year', label: 'Founded' },
    { key: 'city', label: 'Location' },
    { key: 'is_verified', label: 'Verified' },
]

function formatValue(startup: DataRow, key: string): string {
    switch (key) {
        case 'health_score': return startup.health_score ? `${startup.health_score}/100` : '—'
        case 'stage': return startup.stage?.replaceAll('_', ' ') || '—'
        case 'sectors': return startup.sectors?.join(', ') || '—'
        case 'team_size': return startup.team_size ? String(startup.team_size) : '—'
        case 'total_raised': {
            const v = startup.total_raised
            if (!v) return '—'
            if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)} Cr`
            if (v >= 100000) return `₹${(v / 100000).toFixed(1)} L`
            return `₹${v.toLocaleString()}`
        }
        case 'founded_year': return startup.founded_year ? String(startup.founded_year) : '—'
        case 'city': return startup.profile?.city || '—'
        case 'is_verified': return startup.profile?.is_verified ? '✓ Verified' : 'No'
        default: return '—'
    }
}

export default function CompareStartupsPage() {
    const [allStartups, setAllStartups] = useState<DataRow[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [showSearch, setShowSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(async () => {
        setIsLoading(true)
        const result = await fetchStartupsForCompare()
        setAllStartups(result.startups)
        // Auto-select first two
        if (result.startups.length >= 2) {
            setSelectedIds([result.startups[0].id, result.startups[1].id])
        }
        setIsLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const selected = allStartups.filter((s: DataRow) => selectedIds.includes(s.id))
    const available = allStartups.filter((s: DataRow) =>
        !selectedIds.includes(s.id) &&
        (search === '' || s.startup_name?.toLowerCase().includes(search.toLowerCase()))
    )

    const addStartup = (id: string) => {
        if (selectedIds.length < 4 && !selectedIds.includes(id)) {
            setSelectedIds([...selectedIds, id])
            setShowSearch(false)
            setSearch('')
        }
    }
    const removeStartup = (id: string) => setSelectedIds(selectedIds.filter(i => i !== id))

    const isBest = (startup: DataRow, key: string): boolean => {
        if (selected.length < 2) return false
        const m = metrics.find(m => m.key === key)
        if (!m?.numeric) return false
        const values = selected.map((s: DataRow) => s[key] || 0)
        const max = Math.max(...values)
        return (startup[key] || 0) === max && max > 0
    }

    if (isLoading) {
        return (
            <AppLayout currentPage="compare">
                <div className="flex justify-center items-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
            </AppLayout>
        )
    }

    return (
        <AppLayout currentPage="compare">
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                        Compare Startups <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pro</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Compare up to 4 startups side by side.</p>
                </div>

                {/* Selected headers */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {selected.map((s: DataRow) => (
                        <div key={s.id} className="glass-card p-4 min-w-[180px] flex-shrink-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                    {s.startup_name?.slice(0, 2)?.toUpperCase() || '??'}
                                </div>
                                <button onClick={() => removeStartup(s.id)} className="text-muted-foreground hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            <p className="text-sm font-semibold text-foreground">{s.startup_name}</p>
                            <p className="text-xs text-muted-foreground">{s.sectors?.[0] || 'Startup'} · {s.stage?.replaceAll('_', ' ') || ''}</p>
                        </div>
                    ))}
                    {selectedIds.length < 4 && (
                        <div className="relative">
                            <button onClick={() => setShowSearch(!showSearch)} className="glass-card p-4 min-w-[180px] h-full flex flex-col items-center justify-center text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer">
                                <Plus className="w-6 h-6 mb-1" /><span className="text-xs">Add startup</span>
                            </button>
                            {showSearch && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 mt-2 w-64 bg-surface border border-white/10 rounded-xl shadow-xl z-20 p-3">
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search startups..."
                                            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50" autoFocus />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                        {available.map((s: DataRow) => (
                                            <button key={s.id} onClick={() => addStartup(s.id)} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 text-left transition-colors">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-foreground border border-white/5">{s.startup_name?.slice(0, 2)?.toUpperCase()}</div>
                                                <div><p className="text-sm font-medium text-foreground">{s.startup_name}</p><p className="text-xs text-muted-foreground">{s.sectors?.[0]}</p></div>
                                            </button>
                                        ))}
                                        {available.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No more startups to add</p>}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* Comparison Table */}
                {selected.length >= 2 ? (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4 w-40">Metric</th>
                                        {selected.map((s: DataRow) => (
                                            <th key={s.id} className="text-left text-sm font-semibold text-foreground p-4">{s.startup_name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.map((metric, i) => (
                                        <tr key={metric.key} className={`${i < metrics.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                                            <td className="text-sm text-muted-foreground p-4">{metric.label}</td>
                                            {selected.map((s: DataRow) => {
                                                const val = formatValue(s, metric.key)
                                                const best = isBest(s, metric.key)
                                                return (
                                                    <td key={s.id} className="p-4">
                                                        <span className={`text-sm font-medium ${best ? 'text-emerald-400' : 'text-foreground'}`}>
                                                            {best && <Check className="w-3.5 h-3.5 inline mr-1" />}
                                                            {val}
                                                        </span>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">Add at least 2 startups to compare</p>
                        <p className="text-sm text-muted-foreground">Click &ldquo;Add startup&rdquo; above to get started</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
