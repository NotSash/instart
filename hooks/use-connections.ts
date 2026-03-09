'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// CONNECTIONS
// ═══════════════════════════════════════════════════════════════

export function useConnections() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.connections.all,
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('connections')
                .select(`
          *,
          requester:profiles!connections_requester_id_fkey(*),
          receiver:profiles!connections_receiver_id_fkey(*)
        `)
                .eq('status', 'accepted')
                .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)

            if (error) throw error
            return data ?? []
        },
        enabled: !!user,
    })
}

export function usePendingConnections() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.connections.pending,
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('connections')
                .select(`
          *,
          requester:profiles!connections_requester_id_fkey(*)
        `)
                .eq('receiver_id', user.id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!user,
    })
}

export function useConnectionStatus(targetUserId: string) {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.connections.status(targetUserId),
        queryFn: async (): Promise<'none' | 'pending_sent' | 'pending_received' | 'connected'> => {
            if (!user) return 'none'

            // Check if connection exists in either direction
            const { data } = await supabase
                .from('connections')
                .select('*')
                .or(`and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
                .maybeSingle()

            if (!data) return 'none'
            if (data.status === 'accepted') return 'connected'
            if (data.status === 'pending' && data.requester_id === user.id) return 'pending_sent'
            if (data.status === 'pending' && data.receiver_id === user.id) return 'pending_received'
            return 'none'
        },
        enabled: !!user && !!targetUserId,
    })
}

export function useSendConnectionRequest() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (receiverId: string) => {
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('connections')
                .insert({ requester_id: user.id, receiver_id: receiverId })

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.connections.all })
        },
    })
}

export function useRespondToConnection() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ connectionId, status }: { connectionId: string; status: 'accepted' | 'rejected' }) => {
            const { error } = await supabase
                .from('connections')
                .update({ status })
                .eq('id', connectionId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.connections.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.connections.pending })
        },
    })
}
