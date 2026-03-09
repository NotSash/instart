'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// CONVERSATIONS
// ═══════════════════════════════════════════════════════════════

export function useConversations() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.messages.conversations(),
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('conversations')
                .select(`
          *,
          participant_one_profile:profiles!conversations_participant_one_fkey(*),
          participant_two_profile:profiles!conversations_participant_two_fkey(*)
        `)
                .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
                .order('last_message_at', { ascending: false, nullsFirst: false })

            if (error) throw error

            // For each conversation, get last message and unread count
            const conversations = await Promise.all(
                (data ?? []).map(async (conv) => {
                    const otherProfile = conv.participant_one === user.id
                        ? conv.participant_two_profile
                        : conv.participant_one_profile

                    const { data: lastMsg } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('conversation_id', conv.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle()

                    const { count } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('conversation_id', conv.id)
                        .eq('is_read', false)
                        .neq('sender_id', user.id)

                    return {
                        ...conv,
                        other_participant: otherProfile,
                        last_message: lastMsg,
                        unread_count: count ?? 0,
                    }
                })
            )

            return conversations
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════════

export function useMessages(conversationId: string) {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)
    const queryClient = useQueryClient()

    // Mark as read on mount
    useEffect(() => {
        if (!conversationId || !user) return

        supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id)
            .eq('is_read', false)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() })
            })
    }, [conversationId, user, supabase, queryClient])

    // Real-time subscription
    useEffect(() => {
        if (!conversationId) return

        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.messages.messages(conversationId) })
                    queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() })
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [conversationId, supabase, queryClient])

    return useQuery({
        queryKey: queryKeys.messages.messages(conversationId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*, profiles!messages_sender_id_fkey(*)')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })

            if (error) throw error
            return data ?? []
        },
        enabled: !!conversationId,
    })
}

// ═══════════════════════════════════════════════════════════════
// SEND MESSAGE
// ═══════════════════════════════════════════════════════════════

export function useSendMessage() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)
    const profile = useAuthStore(s => s.profile)

    return useMutation({
        mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
            if (!user) throw new Error('Not authenticated')

            // Free tier limit: 10 messages/month
            if (!profile?.is_premium) {
                const startOfMonth = new Date()
                startOfMonth.setDate(1)
                startOfMonth.setHours(0, 0, 0, 0)

                const { count } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('sender_id', user.id)
                    .gte('created_at', startOfMonth.toISOString())

                if ((count ?? 0) >= 10) {
                    throw new Error('Free tier limit: 10 messages per month. Upgrade to Premium for unlimited messaging.')
                }
            }

            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content,
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.messages.messages(variables.conversationId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() })
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// CREATE CONVERSATION
// ═══════════════════════════════════════════════════════════════

export function useCreateConversation() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (otherUserId: string) => {
            if (!user) throw new Error('Not authenticated')

            // Check if conversation already exists
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .or(
                    `and(participant_one.eq.${user.id},participant_two.eq.${otherUserId}),and(participant_one.eq.${otherUserId},participant_two.eq.${user.id})`
                )
                .maybeSingle()

            if (existing) return existing.id

            // Create new
            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    participant_one: user.id,
                    participant_two: otherUserId,
                })
                .select('id')
                .single()

            if (error) throw error
            return data.id
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// UNREAD COUNT (for nav badge)
// ═══════════════════════════════════════════════════════════════

export function useUnreadMessageCount() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)
    const queryClient = useQueryClient()

    // Subscribe to real-time for any new message targeting us
    useEffect(() => {
        if (!user) return

        const channel = supabase
            .channel('unread-messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    if (payload.new && (payload.new as { sender_id: string }).sender_id !== user.id) {
                        queryClient.invalidateQueries({ queryKey: queryKeys.messages.unreadCount() })
                    }
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user, supabase, queryClient])

    return useQuery({
        queryKey: queryKeys.messages.unreadCount(),
        queryFn: async () => {
            if (!user) return 0

            // Get all conversations for this user
            const { data: convs } = await supabase
                .from('conversations')
                .select('id')
                .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)

            if (!convs?.length) return 0

            const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .in('conversation_id', convs.map(c => c.id))
                .eq('is_read', false)
                .neq('sender_id', user.id)

            return count ?? 0
        },
        enabled: !!user,
    })
}
