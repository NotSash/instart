'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// ═══════════════════════════════════════════════════════════════
// STARTUP PROFILE
// ═══════════════════════════════════════════════════════════════

export function useStartupProfile(userId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.profiles.startup(userId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('founder_profiles')
                .select('*, profiles!founder_profiles_user_id_fkey(*)')
                .eq('user_id', userId)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!userId,
    })
}

// ═══════════════════════════════════════════════════════════════
// INVESTOR PROFILE
// ═══════════════════════════════════════════════════════════════

export function useInvestorProfile(userId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.profiles.investor(userId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('investor_profiles')
                .select('*, profiles!investor_profiles_user_id_fkey(*)')
                .eq('user_id', userId)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!userId,
    })
}

// ═══════════════════════════════════════════════════════════════
// MY PROFILE
// ═══════════════════════════════════════════════════════════════

export function useMyProfile() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.profiles.me(),
        queryFn: async () => {
            if (!user) return null

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (!profile) return null

            // Get role-specific profile
            let roleProfile = null
            if (profile.role === 'founder') {
                const { data } = await supabase.from('founder_profiles').select('*').eq('user_id', user.id).maybeSingle()
                roleProfile = data
            } else if (profile.role === 'investor') {
                const { data } = await supabase.from('investor_profiles').select('*').eq('user_id', user.id).maybeSingle()
                roleProfile = data
            } else if (profile.role === 'cofounder_seeker') {
                const { data } = await supabase.from('cofounder_profiles').select('*').eq('user_id', user.id).maybeSingle()
                roleProfile = data
            }

            return { ...profile, roleProfile }
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// UPDATE PROFILE
// ═══════════════════════════════════════════════════════════════

export function useUpdateProfile() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (updates: Record<string, unknown>) => {
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profiles.me() })
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile })
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// TEAM MEMBERS
// ═══════════════════════════════════════════════════════════════

export function useTeamMembers(founderProfileId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.profiles.teamMembers(founderProfileId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .eq('founder_profile_id', founderProfileId)
                .order('created_at', { ascending: true })

            if (error) throw error
            return data ?? []
        },
        enabled: !!founderProfileId,
    })
}

// ═══════════════════════════════════════════════════════════════
// FUNDING ROUNDS
// ═══════════════════════════════════════════════════════════════

export function useFundingRounds(founderProfileId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.profiles.fundingRounds(founderProfileId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('funding_rounds')
                .select('*')
                .eq('founder_profile_id', founderProfileId)
                .order('date', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!founderProfileId,
    })
}

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO INVESTMENTS
// ═══════════════════════════════════════════════════════════════

export function usePortfolioInvestments(investorProfileId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['profiles', 'portfolio', investorProfileId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('portfolio_investments')
                .select('*')
                .eq('investor_profile_id', investorProfileId)
                .order('year', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!investorProfileId,
    })
}

// ═══════════════════════════════════════════════════════════════
// STARTUP UPDATES
// ═══════════════════════════════════════════════════════════════

export function useStartupUpdates(founderProfileId: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.profiles.startupUpdates(founderProfileId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('startup_updates')
                .select('*')
                .eq('founder_profile_id', founderProfileId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        enabled: !!founderProfileId,
    })
}

// ═══════════════════════════════════════════════════════════════
// PROFILE VIEWERS
// ═══════════════════════════════════════════════════════════════

export function useProfileViewers() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useQuery({
        queryKey: queryKeys.profiles.viewers(),
        queryFn: async () => {
            if (!user) return []

            const { data, error } = await supabase
                .from('profile_views')
                .select('*, viewer:profiles!profile_views_viewer_id_fkey(*)')
                .eq('viewed_profile_id', user.id)
                .order('viewed_at', { ascending: false })
                .limit(50)

            if (error) throw error
            return data ?? []
        },
        enabled: !!user,
    })
}

// ═══════════════════════════════════════════════════════════════
// RECORD PROFILE VIEW
// ═══════════════════════════════════════════════════════════════

export function useRecordProfileView() {
    const supabase = createClient()
    const user = useAuthStore(s => s.user)

    return useMutation({
        mutationFn: async (viewedProfileId: string) => {
            if (!user || user.id === viewedProfileId) return

            await supabase
                .from('profile_views')
                .upsert(
                    { viewed_profile_id: viewedProfileId, viewer_id: user.id, viewed_at: new Date().toISOString() },
                    { onConflict: 'viewed_profile_id,viewer_id' }
                )
        },
    })
}
