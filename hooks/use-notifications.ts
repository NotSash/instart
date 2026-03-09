'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS LIST
// ═══════════════════════════════════════════════════════════════

export function useNotifications(filter?: string) {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.notifications.list(filter),
        queryFn: async () => {
            if (!user) return []

            let query = supabase
                .from('notifications')
                .select('*, actor:profiles!notifications_actor_id_fkey(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50)

            if (filter && filter !== 'all') {
                const typeMap: Record<string, string[]> = {
                    connections: ['connection_request', 'connection_accepted'],
                    messages: ['new_message'],
                    mentions: ['post_commented', 'comment_replied'],
                    activity: ['post_upvoted', 'profile_viewed', 'deal_room_invite', 'deal_room_update'],
                }
                if (typeMap[filter]) {
                    query = query.in('type', typeMap[filter] as Database["public"]["Enums"]["notification_type"][])
                }
            }

            const { data, error } = await query
            if (error) throw error
            return data ?? []
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// UNREAD COUNT
// ═══════════════════════════════════════════════════════════════

export function useUnreadNotificationCount() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)
    const queryClient = useQueryClient()

    // Real-time subscription
    useEffect(() => {
        if (!user) return

        const channel = supabase
            .channel('notification-count')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() })
                    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, supabase, queryClient])

    return useQuery({
        queryKey: queryKeys.notifications.unreadCount(),
        queryFn: async () => {
            if (!user) return 0

            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false)

            if (error) throw error
            return count ?? 0
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// MARK READ
// ═══════════════════════════════════════════════════════════════

export function useMarkNotificationRead() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (notificationId: string) => {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() })
        },
    })
}

export function useMarkAllNotificationsRead() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() })
        },
    })
}
