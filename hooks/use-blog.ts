'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'

// ═══════════════════════════════════════════════════════════════
// BLOG POSTS LIST
// ═══════════════════════════════════════════════════════════════

export function useBlogPosts(category?: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.blog.list(category),
        queryFn: async () => {
            let query = supabase
                .from('blog_posts')
                .select('*, profiles!blog_posts_author_id_fkey(full_name, avatar_url)')
                .eq('is_published', true)
                .order('published_at', { ascending: false })

            if (category && category !== 'All') {
                query = query.eq('category', category)
            }

            const { data, error } = await query
            if (error) throw error
            return data ?? []
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// BLOG POST DETAIL
// ═══════════════════════════════════════════════════════════════

export function useBlogPost(slug: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.blog.detail(slug),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*, profiles!blog_posts_author_id_fkey(full_name, avatar_url)')
                .eq('slug', slug)
                .eq('is_published', true)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!slug,
    })
}
