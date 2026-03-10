'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    Search, SlidersHorizontal, X, MapPin,
    ChevronLeft, ChevronRight, Loader2, Code2, Lightbulb, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchCofounders } from '@/app/actions/explore'

const skillsList = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'Product', 'Data Science', 'Legal', 'Domain Expert']
const sectors = ['FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'SaaS', 'D2C', 'CleanTech', 'AI/ML', 'Logistics', 'Social Impact']
const commitmentLevels = ['full_time', 'part_time', 'weekends', 'flexible']
const commitmentLabels: Record<string, string> = {
    full_time: 'Full Time', part_time: 'Part Time', weekends: 'Weekends Only', flexible: 'Flexible',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CofounderRow = any

export default function ExploreCofoundersPage() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [selectedCommitment, setSelectedCommitment] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [cofounders, setCofounders] = useState<CofounderRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const perPage = 9

    const toggleFilter = (list: string[], set: (v: string[]) => void, val: string) => {
        set(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
    }

    const load = useCallback(async () => {
        setIsLoading(true)
        const { cofounders: data } = await fetchCofounders({
            search: search || undefined,
            skills: selectedSkills.length > 0 ? selectedSkills : undefined,
            sectors: selectedSectors.length > 0 ? selectedSectors : undefined,
            commitment: selectedCommitment || undefined,
            limit: perPage,
            offset: (currentPage - 1) * perPage,
        })
        setCofounders(data)
        setIsLoading(false)
    }, [search, selectedSkills, selectedSectors, selectedCommitment, currentPage])

    useEffect(() => {
        const debounce = setTimeout(() => load(), 300)
        return () => clearTimeout(debounce)
    }, [load])

    const FilterSidebar = () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Skills</h4>
                <div className="space-y-2">
                    {skillsList.map(s => (
                        <button key={s} type="button" className="flex items-center gap-2.5 cursor-pointer group text-left" onClick={() => toggleFilter(selectedSkills, setSelectedSkills, s)}>
                            <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedSkills.includes(s) ? 'bg-purple-500 border-purple-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                {selectedSkills.includes(s) && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{s}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Sectors</h4>
                <div className="space-y-2">
                    {sectors.map(s => (
                        <button key={s} type="button" className="flex items-center gap-2.5 cursor-pointer group text-left" onClick={() => toggleFilter(selectedSectors, setSelectedSectors, s)}>
                            <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${selectedSectors.includes(s) ? 'bg-purple-500 border-purple-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                {selectedSectors.includes(s) && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{s}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Commitment</h4>
                <div className="space-y-2">
                    {commitmentLevels.map(c => (
                        <button key={c} type="button" className="flex items-center gap-2.5 cursor-pointer group text-left" onClick={() => setSelectedCommitment(selectedCommitment === c ? '' : c)}>
                            <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${selectedCommitment === c ? 'bg-purple-500 border-purple-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                {selectedCommitment === c && <div className="w-2 h-2 rounded-full bg-black" />}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{commitmentLabels[c]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <Button onClick={() => { setSelectedSkills([]); setSelectedSectors([]); setSelectedCommitment('') }} variant="ghost" className="w-full text-muted-foreground text-sm">
                Clear All
            </Button>
        </div>
    )

    return (
        <AppLayout currentPage="cofounders">
            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-1" style={{ letterSpacing: '-0.02em' }}>Find Co-founders</h1>
                    <p className="text-sm text-muted-foreground">Connect with talented people looking to build together</p>
                </div>

                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} placeholder="Search by skills, experience, or keyword..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 transition-all" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className="md:hidden h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>
                </div>

                <div className="flex gap-6">
                    <div className="hidden md:block w-56 flex-shrink-0">
                        <div className="glass-card p-4 sticky top-20"><FilterSidebar /></div>
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
                                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                    Loading co-founders...
                                </div>
                            </div>
                        ) : cofounders.length === 0 ? (
                            <div className="text-center py-16">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-foreground font-medium mb-2">No co-founders found</p>
                                <p className="text-sm text-muted-foreground">Try different keywords or filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {cofounders.map((cf: CofounderRow, i: number) => (
                                    <motion.div
                                        key={cf.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => router.push(`/app/profile/${cf.user_id}`)}
                                        className="glass-card p-5 hover:border-white/10 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                                {cf.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-foreground group-hover:text-purple-400 transition-colors truncate">{cf.profiles?.full_name || 'Co-founder Seeker'}</h3>
                                                <p className="text-sm text-muted-foreground truncate">{cf.current_status || 'Looking for co-founder'}</p>
                                            </div>
                                        </div>

                                        {cf.experience_description && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{cf.experience_description}</p>
                                        )}

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {cf.skills?.slice(0, 3).map((s: string) => (
                                                <span key={s} className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                                                    <Code2 className="w-2.5 h-2.5" />{s}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Quick info */}
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cf.profiles?.city || 'India'}</span>
                                            {cf.commitment && (
                                                <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{commitmentLabels[cf.commitment] || cf.commitment}</span>
                                            )}
                                            {cf.has_idea && (
                                                <span className="flex items-center gap-1 text-amber-400"><Lightbulb className="w-3 h-3" />Has Idea</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!isLoading && cofounders.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                                <span className="text-sm text-muted-foreground px-4">Page {currentPage}</span>
                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={cofounders.length < perPage} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
