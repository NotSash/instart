'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// FETCH NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
export async function fetchNotifications(filter?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { notifications: [], error: 'Not authenticated' }

    let query = supabase
        .from('notifications')
        .select(`
            *,
            actor:actor_id ( id, full_name, avatar_url, role )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    if (filter && filter !== 'All') {
        const typeMap: Record<string, string[]> = {
            'Connections': ['connection_request', 'connection_accepted'],
            'Messages': ['new_message'],
            'Mentions': ['post_mention', 'comment_mention'],
            'Activity': ['post_upvote', 'comment_reply', 'profile_view', 'match_found'],
        }
        const types = typeMap[filter]
        if (types) {
            query = query.in('type', types)
        }
    }

    const { data, error } = await query

    if (error) return { notifications: [], error: error.message }
    return { notifications: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// MARK NOTIFICATION AS READ
// ═══════════════════════════════════════════════════════════════
export async function markNotificationRead(notificationId: string) {
    const supabase = await createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId)
}

// ═══════════════════════════════════════════════════════════════
// MARK ALL NOTIFICATIONS AS READ
// ═══════════════════════════════════════════════════════════════
export async function markAllNotificationsRead() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
}

// ═══════════════════════════════════════════════════════════════
// GET UNREAD NOTIFICATION COUNT
// ═══════════════════════════════════════════════════════════════
export async function getUnreadCount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { count: 0 }

    const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

    if (error) return { count: 0 }
    return { count: count || 0 }
}
