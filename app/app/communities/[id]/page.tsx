'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    ArrowLeft, Users, MessageCircle, Loader2, Hash,
    ArrowBigUp, ArrowBigDown, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchCommunityDetail } from '@/app/actions/premium'
import { toggleCommunityMembership } from '@/app/actions/communities'

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

export default function CommunityDetailPage() {
    const params = useParams()
    const idOrSlug = params.id as string
    const [community, setCommunity] = useState<DataRow>(null)
    const [posts, setPosts] = useState<DataRow[]>([])
    const [isMember, setIsMember] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(async () => {
        setIsLoading(true)
        const result = await fetchCommunityDetail(idOrSlug)
        setCommunity(result.community)
        setPosts(result.posts)
        setIsMember(result.isMember)
        setIsLoading(false)
    }, [idOrSlug])

    useEffect(() => { load() }, [load])

    const handleToggleJoin = async () => {
        if (!community) return
        setIsMember(!isMember)
        setCommunity((c: DataRow) => ({ ...c, member_count: isMember ? Math.max(0, c.member_count - 1) : c.member_count + 1 }))
        await toggleCommunityMembership(community.id)
    }

    if (isLoading) {
        return (
            <AppLayout currentPage="communities" userRole="founder">
                <div className="flex justify-center items-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
            </AppLayout>
        )
    }

    if (!community) {
        return (
            <AppLayout currentPage="communities" userRole="founder">
                <div className="text-center py-20">
                    <Hash className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-4">Community not found</p>
                    <Link href="/app/communities"><Button variant="outline">← Back to Communities</Button></Link>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout currentPage="communities" userRole="founder">
            <div className="max-w-4xl mx-auto p-4 md:p-6">
                <Link href="/app/communities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Communities
                </Link>

                {/* Community Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-3xl border border-white/5 flex-shrink-0">
                            {community.icon || '💬'}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>{community.name}</h1>
                            <p className="text-sm text-muted-foreground mt-1">{community.description || 'A community for discussions'}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> {community.member_count || 0} members</span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {community.post_count || 0} posts</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleToggleJoin}
                            className={isMember
                                ? 'border-white/10 text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }
                            variant={isMember ? 'outline' : 'default'}
                        >
                            {isMember ? 'Joined' : 'Join'}
                        </Button>
                    </div>
                </motion.div>

                {/* Posts */}
                <h2 className="text-lg font-semibold text-foreground mb-4">Posts</h2>
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">No posts in this community yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post: DataRow, i: number) => (
                            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                <Link href={`/app/feed/${post.id}`} className="block glass-card p-5 hover:border-white/10 transition-all group">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                            <ArrowBigUp className="w-5 h-5" />
                                            <span className="text-xs font-medium">{post.upvotes - post.downvotes}</span>
                                            <ArrowBigDown className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-400 transition-colors">{post.title}</h3>
                                            {post.body && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.body}</p>}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span>{post.author?.full_name || 'User'}</span>
                                                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
                                                <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" />{post.comment_count} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
