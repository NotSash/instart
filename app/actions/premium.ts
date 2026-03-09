'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// FETCH USER'S DEAL ROOMS
// ═══════════════════════════════════════════════════════════════
export async function fetchDealRooms() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { deals: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('deal_rooms')
        .select(`
            *,
            founder:founder_id ( id, full_name, avatar_url, role ),
            investor:investor_id ( id, full_name, avatar_url, role )
        `)
        .or(`founder_id.eq.${user.id},investor_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })

    if (error) return { deals: [], error: error.message }

    // Enrich with document count
    const enriched = await Promise.all((data || []).map(async (deal) => {
        const { count } = await supabase
            .from('deal_room_documents')
            .select('id', { count: 'exact', head: true })
            .eq('deal_room_id', deal.id)
        return { ...deal, doc_count: count || 0 }
    }))

    return { deals: enriched, error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH BLOG POSTS
// ═══════════════════════════════════════════════════════════════
export async function fetchBlogPosts(tag?: string) {
    const supabase = await createClient()

    let query = supabase
        .from('blog_posts')
        .select(`
            id, title, slug, excerpt, cover_image_url, category, published_at,
            author:author_id ( id, full_name, avatar_url )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(20)

    if (tag) {
        query = query.eq('category', tag)
    }

    const { data, error } = await query
    if (error) return { posts: [], error: error.message }
    return { posts: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH SINGLE BLOG POST
// ═══════════════════════════════════════════════════════════════
export async function fetchBlogPost(slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            author:author_id ( id, full_name, avatar_url, role )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error) return { post: null, error: error.message }

    return { post: data, error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH COMMUNITY DETAIL
// ═══════════════════════════════════════════════════════════════
export async function fetchCommunityDetail(idOrSlug: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Try slug first, then id
    let communityQuery = supabase.from('communities').select('*').eq('slug', idOrSlug).maybeSingle()
    let { data: community } = await communityQuery
    if (!community) {
        const result = await supabase.from('communities').select('*').eq('id', idOrSlug).single()
        community = result.data
    }
    if (!community) return { community: null, posts: [], isMember: false, error: 'Community not found' }

    // Check membership
    let isMember = false
    if (user) {
        const { data: membership } = await supabase
            .from('community_members')
            .select('id')
            .eq('community_id', community.id)
            .eq('user_id', user.id)
            .maybeSingle()
        isMember = !!membership
    }

    // Fetch community posts
    const { data: posts } = await supabase
        .from('posts')
        .select(`
            *,
            author:author_id ( id, full_name, avatar_url, role )
        `)
        .eq('community_id', community.id)
        .order('created_at', { ascending: false })
        .limit(30)

    return { community, posts: posts || [], isMember, error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH SINGLE POST (for feed/[id])
// ═══════════════════════════════════════════════════════════════
export async function fetchSinglePost(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:author_id ( id, full_name, avatar_url, role ),
            community:community_id ( id, name, slug, icon_url )
        `)
        .eq('id', postId)
        .single()

    if (error) return { post: null, comments: [], userVote: null, isSaved: false, error: error.message }

    // Fetch comments
    const { data: comments } = await supabase
        .from('comments')
        .select(`
            *,
            author:author_id ( id, full_name, avatar_url, role )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    // Check user's vote and save status
    let userVote = null
    let isSaved = false
    if (user) {
        const { data: vote } = await supabase
            .from('post_votes')
            .select('vote')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .maybeSingle()
        userVote = vote?.vote || null

        const { data: saved } = await supabase
            .from('saved_posts')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .maybeSingle()
        isSaved = !!saved
    }

    return { post, comments: comments || [], userVote, isSaved, error: null }
}

// ═══════════════════════════════════════════════════════════════
// ADD COMMENT
// ═══════════════════════════════════════════════════════════════
export async function addComment(postId: string, content: string, parentId?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { comment: null, error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            author_id: user.id,
            content: content.trim(),
            parent_comment_id: parentId || null,
        })
        .select(`
            *,
            author:author_id ( id, full_name, avatar_url, role )
        `)
        .single()

    if (error) return { comment: null, error: error.message }

    // Update comment count
    const { data: post } = await supabase.from('posts').select('comment_count').eq('id', postId).single()
    if (post) {
        await supabase.from('posts').update({ comment_count: post.comment_count + 1 }).eq('id', postId)
    }

    return { comment: data, error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH STARTUPS FOR COMPARE (fetches founder_profiles)
// ═══════════════════════════════════════════════════════════════
export async function fetchStartupsForCompare(search?: string) {
    const supabase = await createClient()

    let query = supabase
        .from('founder_profiles')
        .select(`
            id, user_id, startup_name, sectors, stage, team_size, total_raised,
            health_score,
            profile:user_id ( id, full_name, city, is_verified )
        `)
        .order('health_score', { ascending: false, nullsFirst: false })
        .limit(20)

    if (search) {
        query = query.ilike('startup_name', `%${search}%`)
    }

    const { data, error } = await query
    if (error) return { startups: [], error: error.message }
    return { startups: data || [], error: null }
}
