'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import { Eye, Loader2, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { fetchProfileViewers } from '@/app/actions/connections'

function timeAgo(dateStr: string): string {
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

export default function ProfileViewersPage() {
    const [viewers, setViewers] = useState<DataRow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchProfileViewers()
            setViewers(result.viewers)
            setIsLoading(false)
        }
        load()
    }, [])

    return (
        <AppLayout currentPage="settings">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>Profile Viewers</h1>
                    <p className="text-sm text-muted-foreground mt-1">See who viewed your profile recently</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-emerald-400" /></div>
                ) : viewers.length === 0 ? (
                    <div className="text-center py-16">
                        <Eye className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">No profile views yet</p>
                        <p className="text-sm text-muted-foreground">Share your profile to get more visibility</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {viewers.map((view: DataRow, i: number) => {
                            const viewer = view.viewer
                            const roleRoute = viewer?.role === 'founder' ? 'startup' : viewer?.role === 'investor' ? 'investor' : null
                            return (
                                <motion.div key={view.id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10 flex-shrink-0">
                                        {viewer?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {roleRoute ? (
                                            <Link href={`/app/${roleRoute}/${viewer.id}`} className="text-sm font-medium text-foreground hover:text-emerald-400 transition-colors">{viewer?.full_name || 'User'}</Link>
                                        ) : (
                                            <p className="text-sm font-medium text-foreground">{viewer?.full_name || 'User'}</p>
                                        )}
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-muted-foreground capitalize">{viewer?.role?.replaceAll('_', ' ') || ''}</span>
                                            {viewer?.city && <span className="text-xs text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" />{viewer.city}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                        <Clock className="w-3.5 h-3.5" /> {timeAgo(view.viewed_at)}
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
