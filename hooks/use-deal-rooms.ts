'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// DEAL ROOMS LIST
// ═══════════════════════════════════════════════════════════════

export function useDealRooms() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.dealRooms.all,
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('deal_rooms')
                .select(`
          *,
          startup:founder_profiles!deal_rooms_startup_id_fkey(startup_name, logo_url, sectors),
          investor_profile:profiles!deal_rooms_investor_id_fkey(full_name, avatar_url),
          founder_profile:profiles!deal_rooms_founder_id_fkey(full_name, avatar_url)
        `)
                .or(`founder_id.eq.${user.id},investor_id.eq.${user.id}`)
                .order('updated_at', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// DEAL ROOM DETAIL
// ═══════════════════════════════════════════════════════════════

export function useDealRoomDetail(dealRoomId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.dealRooms.detail(dealRoomId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deal_rooms')
                .select(`
          *,
          startup:founder_profiles!deal_rooms_startup_id_fkey(*),
          investor_profile:profiles!deal_rooms_investor_id_fkey(*),
          founder_profile:profiles!deal_rooms_founder_id_fkey(*)
        `)
                .eq('id', dealRoomId)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!dealRoomId,
    })
}

// ═══════════════════════════════════════════════════════════════
// DEAL ROOM DOCUMENTS
// ═══════════════════════════════════════════════════════════════

export function useDealRoomDocuments(dealRoomId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.dealRooms.documents(dealRoomId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deal_room_documents')
                .select('*, uploader:profiles!deal_room_documents_uploaded_by_fkey(full_name)')
                .eq('deal_room_id', dealRoomId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!dealRoomId,
    })
}

// ═══════════════════════════════════════════════════════════════
// DEAL ROOM ACTIVITY
// ═══════════════════════════════════════════════════════════════

export function useDealRoomActivity(dealRoomId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.dealRooms.activity(dealRoomId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('deal_room_activity')
                .select('*, actor:profiles!deal_room_activity_actor_id_fkey(full_name, avatar_url)')
                .eq('deal_room_id', dealRoomId)
                .order('created_at', { ascending: false })
                .limit(20)

            if (error) throw error
            return data ?? []
        },
        enabled: !!dealRoomId,
    })
}

// ═══════════════════════════════════════════════════════════════
// UPDATE DEAL ROOM STATUS
// ═══════════════════════════════════════════════════════════════

export function useUpdateDealRoomStatus() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ dealRoomId, status }: { dealRoomId: string; status: string }) => {
            const { error } = await supabase
                .from('deal_rooms')
                .update({ status: status as 'introduced' | 'in_discussion' | 'due_diligence' | 'term_sheet' | 'closed' | 'passed' })
                .eq('id', dealRoomId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dealRooms.all })
        },
    })
}
