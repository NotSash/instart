'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// SEND CONNECTION REQUEST
// ═══════════════════════════════════════════════════════════════
export async function sendConnectionRequest(receiverId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Check if already connected
    const { data: existing } = await supabase
        .from('connections')
        .select('id, status')
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .maybeSingle()

    if (existing) return { error: existing.status === 'accepted' ? 'Already connected' : 'Request already sent' }

    const { error } = await supabase.from('connections').insert({
        requester_id: user.id,
        receiver_id: receiverId,
    })

    return { error: error?.message || null }
}

// ═══════════════════════════════════════════════════════════════
// ACCEPT / REJECT CONNECTION REQUEST
// ═══════════════════════════════════════════════════════════════
export async function respondToConnection(connectionId: string, accept: boolean) {
    const supabase = await createClient()

    const status = accept ? 'accepted' : 'rejected'
    const { error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', connectionId)

    return { error: error?.message || null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH PROFILE VIEWERS
// ═══════════════════════════════════════════════════════════════
export async function fetchProfileViewers() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { viewers: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('profile_views')
        .select(`
            id,
            viewed_at,
            viewer:viewer_id ( id, full_name, avatar_url, role, city )
        `)
        .eq('viewed_profile_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(50)

    if (error) return { viewers: [], error: error.message }
    return { viewers: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH CONNECTION STATUS BETWEEN CURRENT USER AND TARGET
// ═══════════════════════════════════════════════════════════════
export async function getConnectionStatus(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { status: null, connectionId: null }

    const { data } = await supabase
        .from('connections')
        .select('id, status, requester_id')
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .maybeSingle()

    if (!data) return { status: null, connectionId: null }
    return {
        status: data.status,
        connectionId: data.id,
        isReceiver: data.requester_id !== user.id,
    }
}
