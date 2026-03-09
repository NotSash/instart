'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'



// ═══════════════════════════════════════════════════════════════
// FEED POSTS (infinite scroll)
// ═══════════════════════════════════════════════════════════════

const PAGE_SIZE = 20

export function useFeedPosts(sort: 'hot' | 'new' | 'top' = 'hot') {
    const supabase = createClient()

    return useInfiniteQuery({
        queryKey: ['posts', 'feed', sort],
        queryFn: async ({ pageParam = 0 }) => {
            let query = supabase
                .from('posts')
                .select(`
          *,
          profiles!posts_author_id_fkey(*),
          communities(*)
        `)
                .eq('is_removed', false)
                .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)

            if (sort === 'new') {
                query = query.order('created_at', { ascending: false })
            } else if (sort === 'top') {
                query = query.order('upvotes', { ascending: false })
            } else {
                // "hot" — order by a combination (recent + votes)
                query = query.order('created_at', { ascending: false })
            }

            const { data, error } = await query
            if (error) throw error
            return data ?? []
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined
            return allPages.length
        },
        initialPageParam: 0,
    })
}

// ═══════════════════════════════════════════════════════════════
// CREATE POST
// ═══════════════════════════════════════════════════════════════

export function useCreatePost() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (input: {
            title: string
            content?: string
            community_id: string
            type?: string
            image_url?: string
        }) => {
            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
                .from('posts')
                .insert({
                    author_id: user.id,
                    community_id: input.community_id,
                    title: input.title,
                    content: input.content ?? null,
                    type: (input.type ?? 'discussion') as 'discussion' | 'show_and_tell' | 'ask' | 'hiring',
                    image_url: input.image_url ?? null,
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// VOTE POST (with optimistic update)
// ═══════════════════════════════════════════════════════════════

export function useVotePost() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async ({ postId, vote }: { postId: string; vote: 1 | -1 }) => {
            if (!user) throw new Error('Not authenticated')

            // Check existing vote
            const { data: existing } = await supabase
                .from('post_votes')
                .select()
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (existing) {
                if (existing.vote === vote) {
                    // Toggle off — delete
                    await supabase.from('post_votes').delete().eq('id', existing.id)
                    return { action: 'removed' }
                } else {
                    // Change vote
                    await supabase.from('post_votes').update({ vote }).eq('id', existing.id)
                    return { action: 'changed' }
                }
            } else {
                // New vote
                await supabase.from('post_votes').insert({
                    post_id: postId,
                    user_id: user.id,
                    vote,
                })
                return { action: 'added' }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// SAVE POST
// ═══════════════════════════════════════════════════════════════

export function useSavePost() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async ({ postId, isSaved }: { postId: string; isSaved: boolean }) => {
            if (!user) throw new Error('Not authenticated')

            if (isSaved) {
                await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', postId)
            } else {
                await supabase.from('saved_posts').insert({ user_id: user.id, post_id: postId })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.saved })
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// POST DETAIL
// ═══════════════════════════════════════════════════════════════

export function usePostDetail(postId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.posts.detail(postId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles!posts_author_id_fkey(*),
          communities(*)
        `)
                .eq('id', postId)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!postId,
    })
}

// ═══════════════════════════════════════════════════════════════
// COMMENTS
// ═══════════════════════════════════════════════════════════════

export function useComments(postId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.posts.comments(postId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('comments')
                .select(`
          *,
          profiles!comments_author_id_fkey(*)
        `)
                .eq('post_id', postId)
                .eq('is_removed', false)
                .order('created_at', { ascending: true })

            if (error) throw error

            // Build tree structure
            const commentMap = new Map<string, (typeof data)[0] & { replies: typeof data }>()
            const roots: ((typeof data)[0] & { replies: typeof data })[] = []

            data?.forEach(c => {
                const node = { ...c, replies: [] as typeof data }
                commentMap.set(c.id, node)
            })

            data?.forEach(c => {
                const node = commentMap.get(c.id)!
                if (c.parent_comment_id && commentMap.has(c.parent_comment_id)) {
                    commentMap.get(c.parent_comment_id)!.replies.push(node)
                } else {
                    roots.push(node)
                }
            })

            return roots
        },
        enabled: !!postId,
    })
}

export function useCreateComment() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (input: {
            postId: string
            content: string
            parentCommentId?: string
        }) => {
            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: input.postId,
                    author_id: user.id,
                    content: input.content,
                    parent_comment_id: input.parentCommentId ?? null,
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(variables.postId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(variables.postId) })
        },
    })
}

export function useVoteComment() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async ({ commentId, postId, vote }: { commentId: string; postId: string; vote: 1 | -1 }) => {
            if (!user) throw new Error('Not authenticated')

            const { data: existing } = await supabase
                .from('comment_votes')
                .select()
                .eq('comment_id', commentId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (existing) {
                if (existing.vote === vote) {
                    await supabase.from('comment_votes').delete().eq('id', existing.id)
                } else {
                    await supabase.from('comment_votes').update({ vote }).eq('id', existing.id)
                }
            } else {
                await supabase.from('comment_votes').insert({ comment_id: commentId, user_id: user.id, vote })
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(variables.postId) })
        },
    })
}
