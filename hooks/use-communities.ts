'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// LIST COMMUNITIES
// ═══════════════════════════════════════════════════════════════

export function useCommunities(category?: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.communities.list(category),
        queryFn: async () => {
            let query = supabase
                .from('communities')
                .select('*')
                .order('member_count', { ascending: false })

            if (category && category !== 'all') {
                query = query.eq('category', category)
            }

            const { data, error } = await query
            if (error) throw error
            return data ?? []
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// COMMUNITY DETAIL
// ═══════════════════════════════════════════════════════════════

export function useCommunityDetail(slug: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.communities.detail(slug),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!slug,
    })
}

// ═══════════════════════════════════════════════════════════════
// MY JOINED COMMUNITIES
// ═══════════════════════════════════════════════════════════════

export function useMyJoinedCommunities() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: ['communities', 'joined', user?.id],
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('community_members')
                .select('community_id, communities(*)')
                .eq('user_id', user.id)

            if (error) throw error
            return data?.map(d => d.communities).filter(Boolean) ?? []
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// JOIN / LEAVE COMMUNITY
// ═══════════════════════════════════════════════════════════════

export function useJoinCommunity() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (communityId: string) => {
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('community_members')
                .insert({ community_id: communityId, user_id: user.id })

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.communities.all })
            queryClient.invalidateQueries({ queryKey: ['communities', 'joined'] })
        },
    })
}

export function useLeaveCommunity() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (communityId: string) => {
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('community_members')
                .delete()
                .eq('community_id', communityId)
                .eq('user_id', user.id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.communities.all })
            queryClient.invalidateQueries({ queryKey: ['communities', 'joined'] })
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// COMMUNITY POSTS
// ═══════════════════════════════════════════════════════════════

export function useCommunityPosts(communityId: string, sort: 'hot' | 'new' | 'top' = 'hot') {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.communities.posts(communityId, sort),
        queryFn: async () => {
            let query = supabase
                .from('posts')
                .select(`*, profiles!posts_author_id_fkey(*)`)
                .eq('community_id', communityId)
                .eq('is_removed', false)

            if (sort === 'new') {
                query = query.order('created_at', { ascending: false })
            } else if (sort === 'top') {
                query = query.order('upvotes', { ascending: false })
            } else {
                query = query.order('created_at', { ascending: false })
            }

            const { data, error } = await query.limit(50)
            if (error) throw error
            return data ?? []
        },
        enabled: !!communityId,
    })
}

// ═══════════════════════════════════════════════════════════════
// CHECK MEMBERSHIP
// ═══════════════════════════════════════════════════════════════

export function useIsMember(communityId: string) {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: ['communities', 'membership', communityId, user?.id],
        queryFn: async () => {
            if (!user) return false

            const { data } = await supabase
                .from('community_members')
                .select('id')
                .eq('community_id', communityId)
                .eq('user_id', user.id)
                .maybeSingle()

            return !!data
        },
        enabled: !!user && !!communityId,
    })
}
