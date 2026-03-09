'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// FETCH STARTUPS (founder_profiles + profiles)
// ═══════════════════════════════════════════════════════════════
export async function fetchStartups(options?: {
    search?: string
    sectors?: string[]
    stages?: string[]
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()
    const { search, sectors, stages, limit = 12, offset = 0 } = options || {}

    let query = supabase
        .from('founder_profiles')
        .select(`
            *,
            profiles:user_id ( id, full_name, avatar_url, role, city, is_verified, is_premium )
        `)
        .range(offset, offset + limit - 1)
        .order('health_score', { ascending: false, nullsFirst: false })

    if (search) {
        query = query.or(`startup_name.ilike.%${search}%,one_liner.ilike.%${search}%`)
    }
    if (sectors && sectors.length > 0) {
        query = query.overlaps('sectors', sectors)
    }
    if (stages && stages.length > 0) {
        query = query.in('stage', stages)
    }

    const { data, error, count } = await query

    if (error) return { startups: [], error: error.message, total: 0 }
    return { startups: data || [], error: null, total: count || data?.length || 0 }
}

// ═══════════════════════════════════════════════════════════════
// FETCH INVESTORS (investor_profiles + profiles)
// ═══════════════════════════════════════════════════════════════
export async function fetchInvestors(options?: {
    search?: string
    sectors?: string[]
    stages?: string[]
    activeOnly?: boolean
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()
    const { search, sectors, stages, activeOnly, limit = 12, offset = 0 } = options || {}

    let query = supabase
        .from('investor_profiles')
        .select(`
            *,
            profiles:user_id ( id, full_name, avatar_url, role, city, is_verified, is_premium, bio )
        `)
        .range(offset, offset + limit - 1)
        .order('total_investments', { ascending: false })

    if (search) {
        query = query.or(`professional_title.ilike.%${search}%,investment_thesis.ilike.%${search}%`)
    }
    if (sectors && sectors.length > 0) {
        query = query.overlaps('sectors_of_interest', sectors)
    }
    if (stages && stages.length > 0) {
        query = query.overlaps('preferred_stages', stages)
    }
    if (activeOnly) {
        query = query.eq('is_actively_investing', true)
    }

    const { data, error } = await query

    if (error) return { investors: [], error: error.message }
    return { investors: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH COFOUNDERS (cofounder_profiles + profiles)
// ═══════════════════════════════════════════════════════════════
export async function fetchCofounders(options?: {
    search?: string
    skills?: string[]
    sectors?: string[]
    commitment?: string
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()
    const { search, skills, sectors, commitment, limit = 12, offset = 0 } = options || {}

    let query = supabase
        .from('cofounder_profiles')
        .select(`
            *,
            profiles:user_id ( id, full_name, avatar_url, role, city, is_verified, is_premium, bio )
        `)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

    if (search) {
        query = query.or(`current_status.ilike.%${search}%,experience_description.ilike.%${search}%`)
    }
    if (skills && skills.length > 0) {
        query = query.overlaps('skills', skills)
    }
    if (sectors && sectors.length > 0) {
        query = query.overlaps('preferred_sectors', sectors)
    }
    if (commitment) {
        query = query.eq('commitment', commitment)
    }

    const { data, error } = await query

    if (error) return { cofounders: [], error: error.message }
    return { cofounders: data || [], error: null }
}
