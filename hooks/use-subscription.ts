'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// CURRENT SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════

export function useSubscription() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.subscriptions.current(),
        queryFn: async () => {
            if (!user) return null

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle()

            if (error) throw error
            return data
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM GATE CHECK
// ═══════════════════════════════════════════════════════════════

export function usePremiumGate() {
    const profile = useAuthStore(s => s.profile)
    const subscription = useSubscription()

    const isPremium = profile?.is_premium || (subscription.data?.plan === 'pro' || subscription.data?.plan === 'enterprise')

    return {
        isPremium,
        plan: subscription.data?.plan ?? 'free',
        isLoading: subscription.isLoading,
    }
}

// ═══════════════════════════════════════════════════════════════
// PAYMENT HISTORY
// ═══════════════════════════════════════════════════════════════

export function usePaymentHistory() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.subscriptions.paymentHistory(),
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!user,
    })
}
