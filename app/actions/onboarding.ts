'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Enums } from '@/lib/supabase/database.types'

type StartupStage = Enums<'startup_stage'>
type FundingRoundType = Enums<'funding_round_type'>
type CommitmentLevel = Enums<'commitment_level'>

// ─── Helper to parse numeric strings (can be currency amounts) ───
function parseAmount(val: string | undefined): number | null {
    if (!val || val === '') return null
    const cleaned = val.replaceAll(/[^0-9.]/g, '')
    const num = Number.parseFloat(cleaned)
    return Number.isNaN(num) ? null : Math.round(num * 100) // convert to paisa
}

function parseNum(val: string | undefined): number | null {
    if (!val || val === '') return null
    const num = Number.parseFloat(val.replaceAll(/[^0-9.]/g, ''))
    return Number.isNaN(num) ? null : num
}

function parseIntSafe(val: string | undefined): number | null {
    if (!val || val === '') return null
    const num = Number.parseInt(val, 10)
    return Number.isNaN(num) ? null : num
}

// ═══════════════════════════════════════════════════════════════
// FOUNDER ONBOARDING SUBMIT
// ═══════════════════════════════════════════════════════════════
export async function submitFounderOnboarding(data: {
    full_name: string
    bio: string
    city: string
    linkedin_url: string
    avatar_url: string
    startup_name: string
    one_liner: string
    sectors: string[]
    website_url: string
    stage: string
    monthly_revenue: string
    total_users: string
    monthly_growth_rate: string
    team_size: string
    is_raising: boolean
    raising_amount: string
    raising_round_type: string
    total_raised: string
    looking_for: string[]
    pitch: string
    pitch_deck_url: string
    video_pitch_url: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // 1. Update profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            bio: data.bio || null,
            city: data.city || null,
            linkedin_url: data.linkedin_url || null,
            avatar_url: data.avatar_url || null,
            is_onboarded: true,
        })
        .eq('id', user.id)

    if (profileError) return { error: profileError.message }

    // 2. Insert founder_profile
    const { error: founderError } = await supabase
        .from('founder_profiles')
        .insert({
            user_id: user.id,
            startup_name: data.startup_name,
            one_liner: data.one_liner || null,
            pitch: data.pitch || null,
            sectors: data.sectors,
            stage: (data.stage || null) as StartupStage | null,
            website_url: data.website_url || null,
            monthly_revenue: parseAmount(data.monthly_revenue),
            total_users: parseIntSafe(data.total_users),
            monthly_growth_rate: parseNum(data.monthly_growth_rate),
            team_size: parseIntSafe(data.team_size),
            is_raising: data.is_raising,
            raising_amount: parseAmount(data.raising_amount),
            raising_round_type: (data.raising_round_type || null) as FundingRoundType | null,
            total_raised: parseAmount(data.total_raised),
            pitch_deck_url: data.pitch_deck_url || null,
            video_pitch_url: data.video_pitch_url || null,
            looking_for: data.looking_for,
        })

    if (founderError) return { error: founderError.message }

    // 3. Auto-join default communities
    const admin = createAdminClient()
    const { data: defaultCommunities } = await admin
        .from('communities')
        .select('id')
        .eq('is_default', true)

    if (defaultCommunities) {
        await admin.from('community_members').insert(
            defaultCommunities.map(c => ({ community_id: c.id, user_id: user.id }))
        )
    }

    // 4. Create default notification preferences
    await admin.from('notification_preferences').insert({ user_id: user.id })

    // 5. Create free subscription
    await admin.from('subscriptions').insert({ user_id: user.id, plan: 'free', status: 'active' })

    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// INVESTOR ONBOARDING SUBMIT
// ═══════════════════════════════════════════════════════════════
export async function submitInvestorOnboarding(data: {
    full_name: string
    bio: string
    city: string
    linkedin_url: string
    avatar_url: string
    professional_title: string
    sectors_of_interest: string[]
    preferred_stages: string[]
    min_check_size: string
    max_check_size: string
    investment_thesis: string
    is_actively_investing: boolean
    open_to_syndicate: boolean
    open_to_mentoring: boolean
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            bio: data.bio || null,
            city: data.city || null,
            linkedin_url: data.linkedin_url || null,
            avatar_url: data.avatar_url || null,
            is_onboarded: true,
        })
        .eq('id', user.id)

    if (profileError) return { error: profileError.message }

    const { error: investorError } = await supabase
        .from('investor_profiles')
        .insert({
            user_id: user.id,
            professional_title: data.professional_title || null,
            sectors_of_interest: data.sectors_of_interest,
            preferred_stages: data.preferred_stages,
            min_check_size: parseAmount(data.min_check_size),
            max_check_size: parseAmount(data.max_check_size),
            investment_thesis: data.investment_thesis || null,
            is_actively_investing: data.is_actively_investing,
            open_to_syndicate: data.open_to_syndicate,
            open_to_mentoring: data.open_to_mentoring,
        })

    if (investorError) return { error: investorError.message }

    // Auto-join defaults
    const admin = createAdminClient()
    const { data: defaultCommunities } = await admin.from('communities').select('id').eq('is_default', true)
    if (defaultCommunities) {
        await admin.from('community_members').insert(defaultCommunities.map(c => ({ community_id: c.id, user_id: user.id })))
    }
    await admin.from('notification_preferences').insert({ user_id: user.id })
    await admin.from('subscriptions').insert({ user_id: user.id, plan: 'free', status: 'active' })

    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// COFOUNDER ONBOARDING SUBMIT
// ═══════════════════════════════════════════════════════════════
export async function submitCofounderOnboarding(data: {
    full_name: string
    bio: string
    city: string
    linkedin_url: string
    avatar_url: string
    current_status: string
    skills: string[]
    looking_for_skills: string[]
    commitment: string
    has_idea: boolean
    idea_description: string
    preferred_sectors: string[]
    preferred_cities: string[]
    remote_ok: boolean
    equity_expectation: string
    experience_description: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            bio: data.bio || null,
            city: data.city || null,
            linkedin_url: data.linkedin_url || null,
            avatar_url: data.avatar_url || null,
            is_onboarded: true,
        })
        .eq('id', user.id)

    if (profileError) return { error: profileError.message }

    const { error: cofounderError } = await supabase
        .from('cofounder_profiles')
        .insert({
            user_id: user.id,
            current_status: data.current_status || null,
            skills: data.skills,
            looking_for_skills: data.looking_for_skills,
            commitment: (data.commitment || null) as CommitmentLevel | null,
            has_idea: data.has_idea,
            idea_description: data.idea_description || null,
            preferred_sectors: data.preferred_sectors,
            preferred_cities: data.preferred_cities,
            remote_ok: data.remote_ok,
            equity_expectation: data.equity_expectation || null,
            experience_description: data.experience_description || null,
        })

    if (cofounderError) return { error: cofounderError.message }

    const admin = createAdminClient()
    const { data: defaultCommunities } = await admin.from('communities').select('id').eq('is_default', true)
    if (defaultCommunities) {
        await admin.from('community_members').insert(defaultCommunities.map(c => ({ community_id: c.id, user_id: user.id })))
    }
    await admin.from('notification_preferences').insert({ user_id: user.id })
    await admin.from('subscriptions').insert({ user_id: user.id, plan: 'free', status: 'active' })

    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// BROWSER (JUST BROWSING) ONBOARDING SUBMIT
// ═══════════════════════════════════════════════════════════════
export async function submitBrowserOnboarding(data: {
    full_name: string
    city: string
    avatar_url: string
    interests: string[]
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            city: data.city || null,
            avatar_url: data.avatar_url || null,
            role: 'browser' as any,
            is_onboarded: true,
        })
        .eq('id', user.id)

    if (profileError) return { error: profileError.message }

    // Auto-join default communities
    const admin = createAdminClient()
    const { data: defaultCommunities } = await admin.from('communities').select('id').eq('is_default', true)
    if (defaultCommunities) {
        await admin.from('community_members').insert(defaultCommunities.map(c => ({ community_id: c.id, user_id: user.id })))
    }
    await admin.from('notification_preferences').insert({ user_id: user.id })
    await admin.from('subscriptions').insert({ user_id: user.id, plan: 'free', status: 'active' })

    return { success: true }
}
