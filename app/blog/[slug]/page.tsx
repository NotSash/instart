'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, Share2, Bookmark, Linkedin, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBlogPost } from '@/app/actions/premium'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function BlogPostPage() {
    const params = useParams()
    const slug = params.slug as string
    const [post, setPost] = useState<DataRow>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchBlogPost(slug)
            setPost(result.post)
            setIsLoading(false)
        }
        load()
    }, [slug])

    function formatDate(dateStr: string | null): string {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2"><Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" /><span className="text-sm font-bold text-foreground tracking-tight">instart</span></Link>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            </div>

            <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
                <Link href="/blog" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-emerald-400" /></div>
                ) : !post ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">Post not found</p>
                        <Link href="/blog" className="text-sm text-emerald-400 hover:underline">← Back to Blog</Link>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {post.category && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{post.category}</span>}
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>{post.title}</h1>

                        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                    {post.author?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'IT'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{post.author?.full_name || 'Instart Team'}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{post.author?.role?.replace('_', ' ') || 'Author'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{formatDate(post.published_at)}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.max(1, Math.ceil((post.content?.length || 0) / 1500))} min read</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert prose-sm max-w-none space-y-6">
                            {post.content ? (
                                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.content}</div>
                            ) : (
                                <p className="text-muted-foreground italic">This article has no content yet.</p>
                            )}
                        </div>

                        {/* Share */}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Share:</span>
                                <button
                                    onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: document.title, url: window.location.href })
                                        } else {
                                            navigator.clipboard.writeText(window.location.href)
                                        }
                                    }}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Bookmark className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                )}
            </article>
        </div>
    )
}
