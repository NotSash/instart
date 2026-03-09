'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// FETCH ALL COMMUNITIES (with user's membership status)
// ═══════════════════════════════════════════════════════════════
export async function fetchAllCommunities(search?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
        .from('communities')
        .select('*')
        .order('member_count', { ascending: false })

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    const { data: communities, error } = await query
    if (error) return { communities: [], joinedIds: [], error: error.message }

    // Get user's memberships
    let joinedIds: string[] = []
    if (user) {
        const { data: memberships } = await supabase
            .from('community_members')
            .select('community_id')
            .eq('user_id', user.id)

        joinedIds = memberships?.map(m => m.community_id) || []
    }

    return { communities: communities || [], joinedIds, error: null }
}

// ═══════════════════════════════════════════════════════════════
// JOIN / LEAVE COMMUNITY
// ═══════════════════════════════════════════════════════════════
export async function toggleCommunityMembership(communityId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { joined: false, error: 'Not authenticated' }

    const { data: existing } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', communityId)
        .eq('user_id', user.id)
        .maybeSingle()

    if (existing) {
        await supabase.from('community_members').delete().eq('id', existing.id)
        // Decrement member count
        const { data: comm } = await supabase.from('communities').select('member_count').eq('id', communityId).single()
        if (comm) await supabase.from('communities').update({ member_count: Math.max(0, comm.member_count - 1) }).eq('id', communityId)
        return { joined: false, error: null }
    } else {
        await supabase.from('community_members').insert({ community_id: communityId, user_id: user.id })
        // Increment member count
        const { data: comm } = await supabase.from('communities').select('member_count').eq('id', communityId).single()
        if (comm) await supabase.from('communities').update({ member_count: comm.member_count + 1 }).eq('id', communityId)
        return { joined: true, error: null }
    }
}
