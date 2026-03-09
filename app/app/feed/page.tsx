'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    ArrowBigUp, ArrowBigDown, MessageCircle, Share2, Bookmark, Plus,
    X, Image, Bold, Italic, Link2, List, TrendingUp, UserPlus, Sparkles,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    fetchPosts, createPost, voteOnPost, toggleSavePost,
    getUserVotes, getUserSavedPosts, fetchCommunities, fetchTrendingStartups
} from '@/app/actions/posts'

const sortTabs = ['Hot', 'New', 'Top'] as const
const postTypes = ['discussion', 'show_and_tell', 'ask', 'hiring'] as const
const postTypeLabels: Record<string, string> = {
    discussion: 'Discussion',
    show_and_tell: 'Show & Tell',
    ask: 'Ask',
    hiring: 'Hiring',
}

const roleColors: Record<string, string> = {
    founder: 'bg-emerald-500/15 text-emerald-400',
    investor: 'bg-cyan-500/15 text-cyan-400',
    cofounder_seeker: 'bg-purple-500/15 text-purple-400',
    browser: 'bg-amber-500/15 text-amber-400',
    admin: 'bg-red-500/15 text-red-400',
}

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PostRow = any

export default function FeedPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'hot' | 'new' | 'top'>('hot')
    const [posts, setPosts] = useState<PostRow[]>([])
    const [isLoadingPosts, setIsLoadingPosts] = useState(true)
    const [showCreatePost, setShowCreatePost] = useState(false)

    // Vote and save state
    const [votes, setVotes] = useState<Record<string, number>>({})
    const [saved, setSaved] = useState<Record<string, boolean>>({})

    // Create post form
    const [communities, setCommunities] = useState<{ id: string; name: string; slug: string; member_count: number }[]>([])
    const [postCommunity, setPostCommunity] = useState('')
    const [postType, setPostType] = useState<string>('discussion')
    const [postTitle, setPostTitle] = useState('')
    const [postBody, setPostBody] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createError, setCreateError] = useState('')

    // Sidebar data
    const [trendingStartups, setTrendingStartups] = useState<PostRow[]>([])

    const loadPosts = useCallback(async () => {
        setIsLoadingPosts(true)
        const { posts: fetchedPosts } = await fetchPosts({ sort: activeTab })
        setPosts(fetchedPosts)

        // Load user votes and saved status for these posts
        if (fetchedPosts.length > 0) {
            const postIds = fetchedPosts.map((p: PostRow) => p.id)
            const [votesResult, savedResult] = await Promise.all([
                getUserVotes(postIds),
                getUserSavedPosts(postIds),
            ])
            setVotes(votesResult.votes)
            const savedMap: Record<string, boolean> = {}
            savedResult.savedIds.forEach((id: string) => { savedMap[id] = true })
            setSaved(savedMap)
        }
        setIsLoadingPosts(false)
    }, [activeTab])

    useEffect(() => {
        loadPosts()
    }, [loadPosts])

    useEffect(() => {
        fetchCommunities().then(r => setCommunities(r.communities))
        fetchTrendingStartups().then(r => setTrendingStartups(r.startups))
    }, [])

    const handleVote = async (postId: string, dir: number) => {
        const currentVote = votes[postId] || 0
        const newVote = currentVote === dir ? 0 : dir

        // Optimistic update
        setVotes(prev => ({ ...prev, [postId]: newVote }))
        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p
            let upvotes = p.upvotes
            let downvotes = p.downvotes
            // Undo old vote
            if (currentVote === 1) upvotes--
            if (currentVote === -1) downvotes--
            // Apply new vote
            if (newVote === 1) upvotes++
            if (newVote === -1) downvotes++
            return { ...p, upvotes, downvotes }
        }))

        await voteOnPost(postId, newVote)
    }

    const handleSave = async (postId: string) => {
        const wasSaved = saved[postId]
        setSaved(prev => ({ ...prev, [postId]: !wasSaved }))
        await toggleSavePost(postId)
    }

    const handleCreatePost = async () => {
        if (!postCommunity || !postTitle.trim()) {
            setCreateError('Please select a community and enter a title')
            return
        }
        setIsSubmitting(true)
        setCreateError('')

        const { error } = await createPost({
            communityId: postCommunity,
            title: postTitle.trim(),
            content: postBody.trim(),
            type: postType as PostRow,
        })

        if (error) {
            setCreateError(error)
            setIsSubmitting(false)
            return
        }

        // Reset form and refresh feed
        setPostCommunity('')
        setPostTitle('')
        setPostBody('')
        setPostType('discussion')
        setShowCreatePost(false)
        setIsSubmitting(false)
        loadPosts()
    }

    return (
        <AppLayout currentPage="feed" userRole="founder">
            <div className="flex gap-6 p-4 md:p-6 max-w-7xl mx-auto">
                {/* Main Feed */}
                <div className="flex-1 min-w-0">
                    {/* Sort Tabs */}
                    <div className="flex gap-2 mb-6">
                        {sortTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase() as 'hot' | 'new' | 'top')}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.toLowerCase()
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Loading state */}
                    {isLoadingPosts && (
                        <div className="flex justify-center py-16">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                Loading posts...
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoadingPosts && posts.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-foreground font-medium mb-2">No posts yet</h3>
                            <p className="text-sm text-muted-foreground mb-6">Be the first to start a discussion!</p>
                            <Button
                                onClick={() => setShowCreatePost(true)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Create Post
                            </Button>
                        </div>
                    )}

                    {/* Post Cards */}
                    {!isLoadingPosts && (
                        <div className="space-y-4">
                            {posts.map((post: PostRow, index: number) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => router.push(`/app/feed/${post.id}`)}
                                    className="glass-card p-5 hover:border-white/10 transition-all group cursor-pointer"
                                >
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-3 text-sm">
                                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-xs font-medium text-muted-foreground border border-white/5">
                                            {post.communities?.name || 'General'}
                                        </span>
                                        <span className="text-foreground font-medium">{post.profiles?.full_name || 'Anonymous'}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[post.profiles?.role] || roleColors.founder}`}>
                                            {post.profiles?.role?.replace('_', ' ') || 'Member'}
                                        </span>
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-muted-foreground text-xs">{timeAgo(post.created_at)}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
                                        {post.title}
                                    </h2>

                                    {/* Preview */}
                                    {post.content && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.content}</p>
                                    )}

                                    {/* Image preview */}
                                    {post.image_url && (
                                        <div className="w-full h-48 rounded-xl bg-white/3 border border-white/5 mb-4 flex items-center justify-center overflow-hidden">
                                            <Image className="w-8 h-8 text-muted-foreground/30" />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <motion.button
                                                whileTap={{ scale: 1.2 }}
                                                onClick={(e) => { e.stopPropagation(); handleVote(post.id, 1) }}
                                                className={`p-1.5 rounded-lg transition-colors ${(votes[post.id] || 0) === 1 ? 'text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                                            >
                                                <ArrowBigUp className="w-5 h-5" />
                                            </motion.button>
                                            <motion.span
                                                key={post.upvotes - post.downvotes}
                                                initial={{ y: -5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="text-sm font-semibold text-foreground min-w-[2ch] text-center"
                                            >
                                                {post.upvotes - post.downvotes}
                                            </motion.span>
                                            <motion.button
                                                whileTap={{ scale: 1.2 }}
                                                onClick={(e) => { e.stopPropagation(); handleVote(post.id, -1) }}
                                                className={`p-1.5 rounded-lg transition-colors ${(votes[post.id] || 0) === -1 ? 'text-red-400 bg-red-500/10' : 'text-muted-foreground hover:text-red-400 hover:bg-red-500/10'}`}
                                            >
                                                <ArrowBigDown className="w-5 h-5" />
                                            </motion.button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
                                                <MessageCircle className="w-4 h-4" /> {post.comment_count || 0}
                                            </button>
                                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <motion.button
                                                whileTap={{ scale: 1.2 }}
                                                onClick={(e) => { e.stopPropagation(); handleSave(post.id) }}
                                                className={`transition-colors ${saved[post.id] ? 'text-amber-400' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <Bookmark className="w-4 h-4" fill={saved[post.id] ? 'currentColor' : 'none'} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar — Desktop Only */}
                <div className="hidden lg:block w-80 space-y-4 flex-shrink-0">
                    {/* Trending Startups */}
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" /> Trending Startups
                        </h3>
                        {trendingStartups.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No startups yet. Be the first to onboard!</p>
                        ) : (
                            <div className="space-y-3">
                                {trendingStartups.map((s: PostRow, i: number) => (
                                    <div key={s.id} className="flex items-center gap-3 group cursor-pointer">
                                        <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground group-hover:text-emerald-400 transition-colors">{s.startup_name}</p>
                                            <span className="text-xs text-muted-foreground">{s.sectors?.[0] || 'Startup'}</span>
                                        </div>
                                        {s.health_score && (
                                            <span className="text-xs text-emerald-400 font-medium">
                                                {s.health_score}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Suggested Connections */}
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-cyan-400" /> Suggested Connections
                        </h3>
                        <p className="text-xs text-muted-foreground">Connect with founders and investors in your sector. Coming soon!</p>
                    </div>

                    {/* Go Premium */}
                    <div className="rounded-2xl p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 to-cyan-600/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-sm font-semibold text-foreground">Go Pro</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">See who viewed your profile, get AI matching, and more.</p>
                        <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm">
                            Upgrade Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreatePost(true)}
                className="fixed bottom-20 md:bottom-8 right-6 w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg z-40"
                style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
            >
                <Plus className="w-6 h-6" />
            </motion.button>

            {/* Create Post Modal */}
            <AnimatePresence>
                {showCreatePost && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreatePost(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-surface border border-white/10 rounded-2xl z-50 flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                                <h2 className="text-lg font-semibold text-foreground">Create Post</h2>
                                <button onClick={() => setShowCreatePost(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                {/* Community Selector */}
                                <select
                                    value={postCommunity}
                                    onChange={e => setPostCommunity(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#111]">Choose a community</option>
                                    {communities.map(c => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
                                </select>

                                {/* Post Type */}
                                <div className="flex flex-wrap gap-2">
                                    {postTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setPostType(t)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${postType === t
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                                : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            {postTypeLabels[t]}
                                        </button>
                                    ))}
                                </div>

                                {/* Title */}
                                <input
                                    value={postTitle}
                                    onChange={e => setPostTitle(e.target.value)}
                                    placeholder="Give your post a title"
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all"
                                />

                                {/* Editor Toolbar */}
                                <div className="flex items-center gap-1 px-1">
                                    {[Bold, Italic, Link2, List, Image].map((Icon, i) => (
                                        <button key={i} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>

                                {/* Body */}
                                <textarea
                                    value={postBody}
                                    onChange={e => setPostBody(e.target.value)}
                                    placeholder="Write your post content here..."
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all resize-none text-sm leading-relaxed"
                                />

                                {/* Error */}
                                {createError && (
                                    <p className="text-sm text-red-400">{createError}</p>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                                <button onClick={() => setShowCreatePost(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Cancel
                                </button>
                                <Button
                                    onClick={handleCreatePost}
                                    disabled={isSubmitting || !postTitle.trim() || !postCommunity}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 disabled:opacity-50"
                                >
                                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Posting...</> : 'Post'}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AppLayout>
    )
}
