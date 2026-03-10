'use server'

import { createClient } from '@/lib/supabase/server'
import type { Enums } from '@/lib/supabase/database.types'

type PostType = Enums<'post_type'>

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

async function adjustPostCounter(supabase: Awaited<ReturnType<typeof createClient>>, postId: string, field: 'upvotes' | 'downvotes', delta: number) {
    const { data: p } = await supabase.from('posts').select(field).eq('id', postId).single()
    if (!p) return
    const current = (p as Record<string, number>)[field] || 0
    await supabase.from('posts').update({ [field]: Math.max(0, current + delta) }).eq('id', postId)
}

async function removeExistingVote(supabase: Awaited<ReturnType<typeof createClient>>, postId: string, existingVote: { id: string; vote: number }) {
    await supabase.from('post_votes').delete().eq('id', existingVote.id)
    const field = existingVote.vote === 1 ? 'upvotes' : 'downvotes' as const
    await adjustPostCounter(supabase, postId, field, -1)
}

async function changeExistingVote(supabase: Awaited<ReturnType<typeof createClient>>, postId: string, existingVote: { id: string; vote: number }, newVote: number) {
    await supabase.from('post_votes').update({ vote: newVote }).eq('id', existingVote.id)
    const oldField = existingVote.vote === 1 ? 'upvotes' : 'downvotes' as const
    const newField = newVote === 1 ? 'upvotes' : 'downvotes' as const
    await adjustPostCounter(supabase, postId, oldField, -1)
    await adjustPostCounter(supabase, postId, newField, 1)
}

async function createNewVote(supabase: Awaited<ReturnType<typeof createClient>>, postId: string, userId: string, vote: number) {
    await supabase.from('post_votes').insert({ post_id: postId, user_id: userId, vote })
    const field = vote === 1 ? 'upvotes' : 'downvotes' as const
    await adjustPostCounter(supabase, postId, field, 1)
}

export async function voteOnPost(postId: string, vote: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: existingVote } = await supabase
        .from('post_votes')
        .select('id, vote')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

    if (vote === 0 && existingVote) {
        await removeExistingVote(supabase, postId, existingVote)
    } else if (existingVote) {
        await changeExistingVote(supabase, postId, existingVote, vote)
    } else {
        await createNewVote(supabase, postId, user.id, vote)
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
