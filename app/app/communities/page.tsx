'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import { Search, Users, MessageCircle, Hash, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchAllCommunities, toggleCommunityMembership } from '@/app/actions/communities'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function CommunitiesPage() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'joined' | 'trending'>('all')
    const [communities, setCommunities] = useState<DataRow[]>([])
    const [joinedIds, setJoinedIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(async () => {
        setIsLoading(true)
        const result = await fetchAllCommunities(search || undefined)
        setCommunities(result.communities)
        setJoinedIds(result.joinedIds)
        setIsLoading(false)
    }, [search])

    useEffect(() => {
        const debounce = setTimeout(() => load(), 300)
        return () => clearTimeout(debounce)
    }, [load])

    const handleToggleJoin = async (communityId: string) => {
        const wasJoined = joinedIds.includes(communityId)
        // Optimistic
        setJoinedIds(prev => wasJoined ? prev.filter(id => id !== communityId) : [...prev, communityId])
        setCommunities(prev => prev.map(c => c.id === communityId
            ? { ...c, member_count: wasJoined ? Math.max(0, c.member_count - 1) : c.member_count + 1 }
            : c
        ))
        await toggleCommunityMembership(communityId)
    }

    const filtered = communities.filter(c => {
        if (filter === 'joined' && !joinedIds.includes(c.id)) return false
        return true
    })

    function formatCount(n: number): string {
        if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
        return n.toString()
    }

    return (
        <AppLayout currentPage="communities">
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>Communities</h1>
                        <p className="text-sm text-muted-foreground mt-1">Join communities to connect with like-minded founders and investors</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities..."
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all" />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'joined'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Hash className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">No communities found</p>
                        <p className="text-sm text-muted-foreground">{filter === 'joined' ? 'You haven\'t joined any communities yet' : 'Try a different search'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((community: DataRow, i: number) => {
                            const isJoined = joinedIds.includes(community.id)
                            return (
                                <motion.div key={community.id}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="glass-card p-5 hover:border-white/10 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/5 flex-shrink-0">
                                            {community.icon || '💬'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/app/communities/${community.slug || community.id}`} className="text-base font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                                                    {community.name}
                                                </Link>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{community.description || 'A community for discussions'}</p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> {formatCount(community.member_count || 0)}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatCount(community.post_count || 0)} posts</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleToggleJoin(community.id)}
                                            className={isJoined
                                                ? 'border-white/10 text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10'
                                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                            }
                                            variant={isJoined ? 'outline' : 'default'}
                                        >
                                            {isJoined ? 'Joined' : 'Join'}
                                        </Button>
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
