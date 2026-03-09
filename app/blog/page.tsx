'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBlogPosts } from '@/app/actions/premium'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

const categories = ['All', 'Fundraising', 'Growth', 'Product', 'AI/ML', 'Legal', 'Culture']

export default function BlogPage() {
    const [posts, setPosts] = useState<DataRow[]>([])
    const [activeCategory, setActiveCategory] = useState('All')
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(async () => {
        setIsLoading(true)
        const tag = activeCategory === 'All' ? undefined : activeCategory
        const result = await fetchBlogPosts(tag)
        setPosts(result.posts)
        setIsLoading(false)
    }, [activeCategory])

    useEffect(() => { load() }, [load])

    const featured = posts[0]
    const rest = posts.slice(1)

    function formatDate(dateStr: string | null): string {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2"><Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" /><span className="text-sm font-bold text-foreground tracking-tight">instart</span></Link>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.03em' }}>The Instart Blog</h1>
                    <p className="text-muted-foreground">Insights, strategies, and stories from India&apos;s startup ecosystem.</p>
                </motion.div>

                <div className="flex gap-2 mb-10 overflow-x-auto pb-2 justify-center">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-emerald-400" /></div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">No blog posts yet</p>
                        <p className="text-sm text-muted-foreground">Check back soon for stories from India&apos;s startup ecosystem.</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featured && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Link href={`/blog/${featured.slug}`} className="block glass-card p-6 md:p-8 mb-10 group hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        {featured.category && <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{featured.category}</span>}
                                        <span className="text-xs text-muted-foreground">Featured</span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors leading-snug">{featured.title}</h2>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{featured.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {featured.author?.full_name || 'Instart Team'}</span>
                                        <span>{formatDate(featured.published_at)}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* Posts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {rest.map((post: DataRow, i: number) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                                    <Link href={`/blog/${post.slug}`} className="block glass-card p-5 h-full group hover:border-white/10 transition-all">
                                        {post.category && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/5 mb-3 inline-block">{post.category}</span>}
                                        <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">{post.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                            <span>{post.author?.full_name || 'Instart Team'}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(post.published_at)}</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
