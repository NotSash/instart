'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    ArrowLeft, ArrowBigUp, ArrowBigDown, MessageCircle, Bookmark,
    Send, Loader2, Clock, BookmarkCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchSinglePost, addComment } from '@/app/actions/premium'
import { voteOnPost, toggleSavePost } from '@/app/actions/posts'

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

export default function PostDetailPage() {
    const params = useParams()
    const postId = params.id as string
    const [post, setPost] = useState<DataRow>(null)
    const [comments, setComments] = useState<DataRow[]>([])
    const [userVote, setUserVote] = useState<string | null>(null)
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [commentText, setCommentText] = useState('')
    const [isSending, setIsSending] = useState(false)
    const commentInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchSinglePost(postId)
            setPost(result.post)
            setComments(result.comments)
            setUserVote(result.userVote)
            setIsSaved(result.isSaved)
            setIsLoading(false)
        }
        load()
    }, [postId])

    const handleVote = async (vote: 'up' | 'down') => {
        if (!post) return
        const newVote = userVote === vote ? null : vote
        const upDelta = (newVote === 'up' ? 1 : 0) - (userVote === 'up' ? 1 : 0)
        const downDelta = (newVote === 'down' ? 1 : 0) - (userVote === 'down' ? 1 : 0)
        setPost((p: DataRow) => ({ ...p, upvotes: p.upvotes + upDelta, downvotes: p.downvotes + downDelta }))
        setUserVote(newVote)
        await voteOnPost(postId, vote)
    }

    const handleToggleSave = async () => {
        setIsSaved(!isSaved)
        await toggleSavePost(postId)
    }

    const handleAddComment = async () => {
        if (!commentText.trim() || isSending) return
        setIsSending(true)
        const { comment } = await addComment(postId, commentText.trim())
        if (comment) {
            setComments(prev => [...prev, comment])
            setPost((p: DataRow) => ({ ...p, comment_count: p.comment_count + 1 }))
        }
        setCommentText('')
        setIsSending(false)
    }

    if (isLoading) {
        return (
            <AppLayout currentPage="feed" userRole="founder">
                <div className="flex justify-center items-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
            </AppLayout>
        )
    }

    if (!post) {
        return (
            <AppLayout currentPage="feed" userRole="founder">
                <div className="text-center py-20">
                    <p className="text-foreground font-medium mb-4">Post not found</p>
                    <Link href="/app/feed"><Button variant="outline">← Back to Feed</Button></Link>
                </div>
            </AppLayout>
        )
    }

    const score = post.upvotes - post.downvotes

    return (
        <AppLayout currentPage="feed" userRole="founder">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
                <Link href="/app/feed" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Feed
                </Link>

                {/* Post */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
                    <div className="flex gap-4">
                        {/* Vote */}
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                            <button onClick={() => handleVote('up')} className={`p-1 rounded-lg transition-colors ${userVote === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground'}`}>
                                <ArrowBigUp className="w-6 h-6" />
                            </button>
                            <span className={`text-sm font-semibold ${score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{score}</span>
                            <button onClick={() => handleVote('down')} className={`p-1 rounded-lg transition-colors ${userVote === 'down' ? 'text-red-400 bg-red-500/10' : 'text-muted-foreground hover:text-foreground'}`}>
                                <ArrowBigDown className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {post.community && (
                                <Link href={`/app/communities/${post.community.slug || post.community.id}`} className="text-xs text-emerald-400 hover:underline mb-1 inline-block">
                                    {post.community.icon} {post.community.name}
                                </Link>
                            )}
                            <h1 className="text-xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.01em' }}>{post.title}</h1>
                            {post.body && <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap mb-4">{post.body}</p>}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>by {post.author?.full_name || 'User'}</span>
                                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
                                <button onClick={() => commentInputRef.current?.focus()} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                                    <MessageCircle className="w-3 h-3" /> {post.comment_count} comments
                                </button>
                                <button onClick={handleToggleSave} className={`flex items-center gap-0.5 transition-colors ${isSaved ? 'text-amber-400' : 'hover:text-foreground'}`}>
                                    {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Comment Input */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <input
                            ref={commentInputRef}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment() } }}
                            placeholder="Add a comment..."
                            className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                        <Button onClick={handleAddComment} disabled={!commentText.trim() || isSending} size="icon" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl w-10 h-10 disabled:opacity-50">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Comments */}
                <div className="space-y-3">
                    {comments.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
                        </div>
                    ) : (
                        comments.map((comment: DataRow, i: number) => (
                            <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="flex gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-foreground border border-white/10 flex-shrink-0">
                                    {comment.author?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-foreground">{comment.author?.full_name || 'User'}</span>
                                        <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
