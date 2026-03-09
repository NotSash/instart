'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// FETCH FOUNDER/STARTUP PROFILE
// ═══════════════════════════════════════════════════════════════
export async function fetchFounderProfile(userId: string) {
    const supabase = await createClient()

    const [profileResult, founderResult, teamResult, fundingResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('founder_profiles').select('*').eq('user_id', userId).single(),
        supabase.from('team_members').select('*').eq('founder_profile_id', userId).order('created_at', { ascending: true }),
        supabase.from('funding_rounds').select('*').eq('founder_profile_id', userId).order('date', { ascending: false }),
    ])

    // If founder_profile query failed because it uses founder_profile_id, try user_id-based team query
    const founderProfileId = founderResult.data?.id
    let team = teamResult.data || []
    let funding = fundingResult.data || []

    if (founderProfileId) {
        const [teamRetry, fundingRetry] = await Promise.all([
            supabase.from('team_members').select('*').eq('founder_profile_id', founderProfileId).order('created_at', { ascending: true }),
            supabase.from('funding_rounds').select('*').eq('founder_profile_id', founderProfileId).order('date', { ascending: false }),
        ])
        team = teamRetry.data || team
        funding = fundingRetry.data || funding
    }

    return {
        profile: profileResult.data,
        founderProfile: founderResult.data,
        team,
        funding,
        error: profileResult.error?.message || founderResult.error?.message || null,
    }
}

// ═══════════════════════════════════════════════════════════════
// FETCH INVESTOR PROFILE
// ═══════════════════════════════════════════════════════════════
export async function fetchInvestorProfile(userId: string) {
    const supabase = await createClient()

    const [profileResult, investorResult, portfolioResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('investor_profiles').select('*').eq('user_id', userId).single(),
        supabase.from('portfolio_investments').select('*').order('year', { ascending: false }),
    ])

    // Filter portfolio by investor profile id
    const investorProfileId = investorResult.data?.id
    let portfolio = portfolioResult.data || []
    if (investorProfileId) {
        portfolio = portfolio.filter((p) => p.investor_profile_id === investorProfileId)
    }

    return {
        profile: profileResult.data,
        investorProfile: investorResult.data,
        portfolio,
        error: profileResult.error?.message || investorResult.error?.message || null,
    }
}

// ═══════════════════════════════════════════════════════════════
// FETCH CURRENT USER'S PROFILE (for /profile page)
// ═══════════════════════════════════════════════════════════════
export async function fetchCurrentUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { profile: null, roleProfile: null, error: 'Not authenticated' }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile) return { profile: null, roleProfile: null, error: 'Profile not found' }

    let roleProfile = null

    if (profile.role === 'founder') {
        const { data } = await supabase.from('founder_profiles').select('*').eq('user_id', user.id).single()
        roleProfile = data
    } else if (profile.role === 'investor') {
        const { data } = await supabase.from('investor_profiles').select('*').eq('user_id', user.id).single()
        roleProfile = data
    } else if (profile.role === 'cofounder_seeker') {
        const { data } = await supabase.from('cofounder_profiles').select('*').eq('user_id', user.id).single()
        roleProfile = data
    }

    return { profile, roleProfile, error: null }
}

// ═══════════════════════════════════════════════════════════════
// RECORD PROFILE VIEW
// ═══════════════════════════════════════════════════════════════
export async function recordProfileView(viewedProfileId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id === viewedProfileId) return

    // Only insert one view per visitor per day
    const today = new Date().toISOString().split('T')[0]
    const { data: existingView } = await supabase
        .from('profile_views')
        .select('id')
        .eq('viewed_profile_id', viewedProfileId)
        .eq('viewer_id', user.id)
        .gte('viewed_at', `${today}T00:00:00`)
        .maybeSingle()

    if (!existingView) {
        await supabase.from('profile_views').insert({
            viewed_profile_id: viewedProfileId,
            viewer_id: user.id,
        })
    }
}
