'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/queryKeys'

// ═══════════════════════════════════════════════════════════════
// EXPLORE STARTUPS
// ═══════════════════════════════════════════════════════════════

interface StartupFilters {
    sectors?: string[]
    stage?: string
    is_raising?: boolean
    city?: string
    search?: string
    page?: number
}

const EXPLORE_PAGE_SIZE = 12

export function useExploreStartups(filters: StartupFilters = {}) {
    const supabase = createClient()
    const page = filters.page ?? 1

    return useQuery({
        queryKey: queryKeys.explore.startups(filters),
        queryFn: async () => {
            let query = supabase
                .from('founder_profiles')
                .select(`*, profiles!founder_profiles_user_id_fkey(*)`, { count: 'exact' })

            if (filters.sectors?.length) {
                query = query.overlaps('sectors', filters.sectors)
            }
            if (filters.stage) {
                query = query.eq('stage', filters.stage)
            }
            if (filters.is_raising !== undefined) {
                query = query.eq('is_raising', filters.is_raising)
            }
            if (filters.city) {
                query = query.eq('profiles.city', filters.city)
            }
            if (filters.search) {
                query = query.or(`startup_name.ilike.%${filters.search}%,one_liner.ilike.%${filters.search}%`)
            }

            const from = (page - 1) * EXPLORE_PAGE_SIZE
            const to = from + EXPLORE_PAGE_SIZE - 1

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to)

            if (error) throw error
            return {
                startups: data ?? [],
                total: count ?? 0,
                totalPages: Math.ceil((count ?? 0) / EXPLORE_PAGE_SIZE),
                page,
            }
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// EXPLORE INVESTORS
// ═══════════════════════════════════════════════════════════════

interface InvestorFilters {
    sectors?: string[]
    stages?: string[]
    is_verified?: boolean
    city?: string
    search?: string
    page?: number
}

export function useExploreInvestors(filters: InvestorFilters = {}) {
    const supabase = createClient()
    const page = filters.page ?? 1

    return useQuery({
        queryKey: queryKeys.explore.investors(filters),
        queryFn: async () => {
            let query = supabase
                .from('investor_profiles')
                .select(`*, profiles!investor_profiles_user_id_fkey(*)`, { count: 'exact' })

            if (filters.sectors?.length) {
                query = query.overlaps('sectors_of_interest', filters.sectors)
            }
            if (filters.stages?.length) {
                query = query.overlaps('preferred_stages', filters.stages)
            }
            if (filters.is_verified) {
                query = query.not('verified_at', 'is', null)
            }
            if (filters.search) {
                query = query.or(`profiles.full_name.ilike.%${filters.search}%,professional_title.ilike.%${filters.search}%`)
            }

            const from = (page - 1) * EXPLORE_PAGE_SIZE
            const to = from + EXPLORE_PAGE_SIZE - 1

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to)

            if (error) throw error
            return {
                investors: data ?? [],
                total: count ?? 0,
                totalPages: Math.ceil((count ?? 0) / EXPLORE_PAGE_SIZE),
                page,
            }
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// EXPLORE COFOUNDERS
// ═══════════════════════════════════════════════════════════════

interface CofounderFilters {
    skills?: string[]
    commitment?: string
    has_idea?: boolean
    remote_ok?: boolean
    search?: string
    page?: number
}

export function useExploreCoFounders(filters: CofounderFilters = {}) {
    const supabase = createClient()
    const page = filters.page ?? 1

    return useQuery({
        queryKey: queryKeys.explore.cofounders(filters),
        queryFn: async () => {
            let query = supabase
                .from('cofounder_profiles')
                .select(`*, profiles!cofounder_profiles_user_id_fkey(*)`, { count: 'exact' })

            if (filters.skills?.length) {
                query = query.overlaps('skills', filters.skills)
            }
            if (filters.commitment) {
                query = query.eq('commitment', filters.commitment)
            }
            if (filters.has_idea !== undefined) {
                query = query.eq('has_idea', filters.has_idea)
            }
            if (filters.remote_ok !== undefined) {
                query = query.eq('remote_ok', filters.remote_ok)
            }
            if (filters.search) {
                query = query.or(`profiles.full_name.ilike.%${filters.search}%,experience_description.ilike.%${filters.search}%`)
            }

            const from = (page - 1) * EXPLORE_PAGE_SIZE
            const to = from + EXPLORE_PAGE_SIZE - 1

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to)

            if (error) throw error
            return {
                cofounders: data ?? [],
                total: count ?? 0,
                totalPages: Math.ceil((count ?? 0) / EXPLORE_PAGE_SIZE),
                page,
            }
        },
    })
}

// ═══════════════════════════════════════════════════════════════
// GLOBAL SEARCH
// ═══════════════════════════════════════════════════════════════

export function useGlobalSearch(query: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: queryKeys.explore.globalSearch(query),
        queryFn: async () => {
            if (!query || query.length < 2) return { startups: [], investors: [], cofounders: [] }

            const [startupsRes, investorsRes, cofoundersRes] = await Promise.all([
                supabase.from('founder_profiles')
                    .select('id, startup_name, one_liner, sectors, stage, profiles!founder_profiles_user_id_fkey(full_name, avatar_url)')
                    .or(`startup_name.ilike.%${query}%,one_liner.ilike.%${query}%`)
                    .limit(5),
                supabase.from('investor_profiles')
                    .select('id, professional_title, sectors_of_interest, profiles!investor_profiles_user_id_fkey(full_name, avatar_url)')
                    .or(`professional_title.ilike.%${query}%`)
                    .limit(5),
                supabase.from('cofounder_profiles')
                    .select('id, skills, commitment, profiles!cofounder_profiles_user_id_fkey(full_name, avatar_url)')
                    .limit(5),
            ])

            return {
                startups: startupsRes.data ?? [],
                investors: investorsRes.data ?? [],
                cofounders: cofoundersRes.data ?? [],
            }
        },
        enabled: query.length >= 2,
    })
}
