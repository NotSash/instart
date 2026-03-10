'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    Search, SlidersHorizontal, X, MapPin,
    ChevronLeft, ChevronRight, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchStartups } from '@/app/actions/explore'

const sectors = ['FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'SaaS', 'D2C', 'CleanTech', 'AI/ML', 'Logistics', 'Social Impact']
const stagesList = ['idea', 'mvp', 'early_traction', 'growth', 'scale']
const stageLabels: Record<string, string> = {
    idea: 'Idea', mvp: 'MVP', early_traction: 'Early Traction', growth: 'Growth', scale: 'Scale',
    pre_seed: 'Pre-Seed', seed: 'Seed', series_a: 'Series A', series_b: 'Series B', series_c_plus: 'Series C+',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StartupRow = any

function ScoreBadge({ score }: Readonly<{ score: number | null }>) {
    if (score == null) return null
    const color = score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : score >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'
    return (
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold ${color}`}>
            {score}
        </div>
    )
}

export default function ExploreStartupsPage() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [selectedStages, setSelectedStages] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [startups, setStartups] = useState<StartupRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const perPage = 9

    const toggleFilter = (list: string[], set: (v: string[]) => void, val: string) => {
        set(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
    }

    const loadStartups = useCallback(async () => {
        setIsLoading(true)
        const { startups: data } = await fetchStartups({
            search: search || undefined,
            sectors: selectedSectors.length > 0 ? selectedSectors : undefined,
            stages: selectedStages.length > 0 ? selectedStages : undefined,
            limit: perPage,
            offset: (currentPage - 1) * perPage,
        })
        setStartups(data)
        setIsLoading(false)
    }, [search, selectedSectors, selectedStages, currentPage])

    useEffect(() => {
        const debounce = setTimeout(() => loadStartups(), 300)
        return () => clearTimeout(debounce)
    }, [loadStartups])

    const FilterSidebar = () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Sector</h4>
                <div className="space-y-2">
                    {sectors.map(s => (
                        <button key={s} type="button" className="flex items-center gap-2.5 cursor-pointer group text-left" onClick={() => toggleFilter(selectedSectors, setSelectedSectors, s)}>
                            <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedSectors.includes(s) ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                {selectedSectors.includes(s) && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{s}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Stage</h4>
                <div className="space-y-2">
                    {stagesList.map(s => (
                        <button key={s} type="button" className="flex items-center gap-2.5 cursor-pointer group text-left" onClick={() => toggleFilter(selectedStages, setSelectedStages, s)}>
                            <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedStages.includes(s) ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                {selectedStages.includes(s) && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stageLabels[s] || s}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Button onClick={() => { setSelectedSectors([]); setSelectedStages([]) }} variant="ghost" className="w-full text-muted-foreground text-sm">
                    Clear All
                </Button>
            </div>
        </div>
    )

    return (
        <AppLayout currentPage="explore">
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-1" style={{ letterSpacing: '-0.02em' }}>Explore Startups</h1>
                    <p className="text-sm text-muted-foreground">Discover startups building the future of India</p>
                </div>

                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} placeholder="Search startups by name or keyword..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className="md:hidden h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>
                </div>

                <div className="flex gap-6">
                    <div className="hidden md:block w-56 flex-shrink-0">
                        <div className="glass-card p-4 sticky top-20">
                            <FilterSidebar />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/60 z-50 md:hidden" />
                                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 w-72 bg-surface border-r border-white/10 z-50 p-5 overflow-y-auto md:hidden">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-semibold text-foreground">Filters</h3>
                                        <button onClick={() => setShowFilters(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
                                    </div>
                                    <FilterSidebar />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center py-16">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                    Loading startups...
                                </div>
                            </div>
                        ) : startups.length === 0 ? (
                            <div className="text-center py-16">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-foreground font-medium mb-2">No startups found</p>
                                <p className="text-sm text-muted-foreground">Try different keywords or filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {startups.map((startup: StartupRow, i: number) => (
                                    <motion.div
                                        key={startup.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => router.push(`/app/startup/${startup.user_id}`)}
                                        className="glass-card p-5 hover:border-white/10 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                                {startup.startup_name?.slice(0, 2)?.toUpperCase() || '??'}
                                            </div>
                                            <ScoreBadge score={startup.health_score} />
                                        </div>

                                        <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-emerald-400 transition-colors">{startup.startup_name}</h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{startup.one_liner || 'No description yet'}</p>

                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {startup.sectors?.slice(0, 2).map((s: string) => (
                                                <span key={s} className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/5">{s}</span>
                                            ))}
                                            {startup.stage && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{stageLabels[startup.stage] || startup.stage}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{startup.profiles?.city || 'India'}</span>
                                            <span className="text-xs text-emerald-400 font-medium group-hover:underline">View Profile →</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && startups.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                                <span className="text-sm text-muted-foreground px-4">Page {currentPage}</span>
                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={startups.length < perPage} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
