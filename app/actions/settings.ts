'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ═══════════════════════════════════════════════════════════════
// FETCH SETTINGS (profile + notification prefs + subscription)
// ═══════════════════════════════════════════════════════════════
export async function fetchSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { profile: null, notifPrefs: null, subscription: null, error: 'Not authenticated' }

    const [profileResult, notifPrefsResult, subscriptionResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('notification_preferences').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ])

    return {
        profile: profileResult.data,
        notifPrefs: notifPrefsResult.data,
        subscription: subscriptionResult.data,
        error: null,
    }
}

// ═══════════════════════════════════════════════════════════════
// UPDATE SETTINGS
// ═══════════════════════════════════════════════════════════════

export async function updateProfileSettings(data: {
    full_name?: string
    bio?: string
    city?: string
    phone?: string
    linkedin_url?: string
    website_url?: string
    avatar_url?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION PREFERENCES
// ═══════════════════════════════════════════════════════════════

export async function updateNotificationPreferences(data: {
    email_enabled?: boolean
    email_weekly_digest?: boolean
    email_connections?: boolean
    email_messages?: boolean
    email_post_activity?: boolean
    email_profile_views?: boolean
    push_enabled?: boolean
    push_connections?: boolean
    push_messages?: boolean
    push_post_activity?: boolean
    whatsapp_enabled?: boolean
    whatsapp_phone?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('notification_preferences')
        .update(data)
        .eq('user_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// DELETE ACCOUNT
// ═══════════════════════════════════════════════════════════════

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const admin = createAdminClient()

    // Delete profile (cascades to all related data)
    await admin.from('profiles').delete().eq('id', user.id)

    // Delete the auth user
    await admin.auth.admin.deleteUser(user.id)

    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════════════════════════════

export async function changePassword(newPassword: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) return { error: error.message }
    return { success: true }
}

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER SUBSCRIBE
// ═══════════════════════════════════════════════════════════════

export async function subscribeToNewsletter(email: string) {
    const admin = createAdminClient()

    const { error } = await admin
        .from('newsletter_subscribers')
        .upsert({ email }, { onConflict: 'email' })

    if (error) return { error: error.message }
    return { success: true }
}
