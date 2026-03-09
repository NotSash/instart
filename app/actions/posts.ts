'use server'

import { createClient } from '@/lib/supabase/server'
import type { PostType } from '@/lib/supabase/database.types'

// ═══════════════════════════════════════════════════════════════
// FETCH POSTS (with author profile and community info)
// ═══════════════════════════════════════════════════════════════
export async function fetchPosts(options?: {
    sort?: 'hot' | 'new' | 'top'
    communityId?: string
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()
    const { sort = 'hot', communityId, limit = 20, offset = 0 } = options || {}

    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id ( id, full_name, avatar_url, role ),
            communities:community_id ( id, name, slug )
        `)
        .eq('is_removed', false)
        .range(offset, offset + limit - 1)

    if (communityId) {
        query = query.eq('community_id', communityId)
    }

    switch (sort) {
        case 'new':
            query = query.order('created_at', { ascending: false })
            break
        case 'top':
            query = query.order('upvotes', { ascending: false })
            break
        case 'hot':
        default:
            // Hot = upvotes - downvotes, most recent first within similar scores
            query = query.order('upvotes', { ascending: false }).order('created_at', { ascending: false })
            break
    }

    const { data, error } = await query

    if (error) return { posts: [], error: error.message }
    return { posts: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH SINGLE POST (for detail page)
// ═══════════════════════════════════════════════════════════════
export async function fetchPost(postId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id ( id, full_name, avatar_url, role ),
            communities:community_id ( id, name, slug )
        `)
        .eq('id', postId)
        .single()

    if (error) return { post: null, error: error.message }
    return { post: data, error: null }
}

// ═══════════════════════════════════════════════════════════════
// CREATE POST
// ═══════════════════════════════════════════════════════════════
export async function createPost(data: {
    communityId: string
    title: string
    content: string
    type: PostType
    imageUrl?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { post: null, error: 'Not authenticated' }

    const { data: post, error } = await supabase
        .from('posts')
        .insert({
            author_id: user.id,
            community_id: data.communityId,
            title: data.title,
            content: data.content || null,
            type: data.type,
            image_url: data.imageUrl || null,
        })
        .select()
        .single()

    if (error) return { post: null, error: error.message }
    return { post, error: null }
}

// ═══════════════════════════════════════════════════════════════
// VOTE ON POST (upvote = 1, downvote = -1, remove = 0)
// ═══════════════════════════════════════════════════════════════
export async function voteOnPost(postId: string, vote: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check for existing vote
    const { data: existingVote } = await supabase
        .from('post_votes')
        .select('id, vote')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

    if (vote === 0 && existingVote) {
        // Remove vote
        const oldVote = existingVote.vote
        await supabase.from('post_votes').delete().eq('id', existingVote.id)
        // Update the post counters
        if (oldVote === 1) {
            await supabase.rpc('decrement_upvotes', { post_id_input: postId }).catch(() => {
                // Fallback: manual update
                return supabase.from('posts').update({ upvotes: 0 }).eq('id', postId)
            })
        } else if (oldVote === -1) {
            await supabase.rpc('decrement_downvotes', { post_id_input: postId }).catch(() => {
                return supabase.from('posts').update({ downvotes: 0 }).eq('id', postId)
            })
        }
        return { error: null }
    }

    if (existingVote) {
        // Change vote direction
        const oldVote = existingVote.vote
        await supabase.from('post_votes').update({ vote }).eq('id', existingVote.id)

        // Update counters: undo old vote, apply new vote
        const updates: Record<string, number> = {}
        const { data: postData } = await supabase.from('posts').select('upvotes, downvotes').eq('id', postId).single()
        if (postData) {
            if (oldVote === 1) updates.upvotes = Math.max(0, postData.upvotes - 1)
            if (oldVote === -1) updates.downvotes = Math.max(0, postData.downvotes - 1)
            if (vote === 1) updates.upvotes = (updates.upvotes ?? postData.upvotes) + 1
            if (vote === -1) updates.downvotes = (updates.downvotes ?? postData.downvotes) + 1
            await supabase.from('posts').update(updates).eq('id', postId)
        }
    } else {
        // New vote
        await supabase.from('post_votes').insert({ post_id: postId, user_id: user.id, vote })
        const field = vote === 1 ? 'upvotes' : 'downvotes'
        const { data: postData } = await supabase.from('posts').select(field).eq('id', postId).single()
        if (postData) {
            await supabase.from('posts').update({ [field]: ((postData as Record<string, number>)[field] || 0) + 1 }).eq('id', postId)
        }
    }

    return { error: null }
}

// ═══════════════════════════════════════════════════════════════
// GET USER'S VOTES ON POSTS (batch fetch for feed)
// ═══════════════════════════════════════════════════════════════
export async function getUserVotes(postIds: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { votes: {}, error: null }

    const { data, error } = await supabase
        .from('post_votes')
        .select('post_id, vote')
        .eq('user_id', user.id)
        .in('post_id', postIds)

    if (error) return { votes: {}, error: error.message }

    const votesMap: Record<string, number> = {}
    data?.forEach(v => { votesMap[v.post_id] = v.vote })
    return { votes: votesMap, error: null }
}

// ═══════════════════════════════════════════════════════════════
// TOGGLE SAVE/UNSAVE POST
// ═══════════════════════════════════════════════════════════════
export async function toggleSavePost(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { saved: false, error: 'Not authenticated' }

    const { data: existing } = await supabase
        .from('saved_posts')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle()

    if (existing) {
        await supabase.from('saved_posts').delete().eq('id', existing.id)
        return { saved: false, error: null }
    } else {
        await supabase.from('saved_posts').insert({ user_id: user.id, post_id: postId })
        return { saved: true, error: null }
    }
}

// ═══════════════════════════════════════════════════════════════
// GET USER'S SAVED POSTS (batch fetch for feed)
// ═══════════════════════════════════════════════════════════════
export async function getUserSavedPosts(postIds: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { savedIds: [], error: null }

    const { data, error } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)

    if (error) return { savedIds: [], error: error.message }
    return { savedIds: data?.map(s => s.post_id) || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH COMMUNITIES (for post creation dropdown)
// ═══════════════════════════════════════════════════════════════
export async function fetchCommunities() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('communities')
        .select('id, name, slug, member_count')
        .order('member_count', { ascending: false })

    if (error) return { communities: [], error: error.message }
    return { communities: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH TRENDING STARTUPS (for sidebar widget)
// ═══════════════════════════════════════════════════════════════
export async function fetchTrendingStartups(limit = 5) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('founder_profiles')
        .select(`
            id, startup_name, sectors, health_score,
            profiles:user_id ( id, full_name, avatar_url )
        `)
        .order('health_score', { ascending: false, nullsFirst: false })
        .limit(limit)

    if (error) return { startups: [], error: error.message }
    return { startups: data || [], error: null }
}
