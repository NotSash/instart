'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/database.types'

// ═══════════════════════════════════════════════════════════════
// FETCH ADMIN STATS
// ═══════════════════════════════════════════════════════════════
export async function fetchAdminStats() {
    const admin = createAdminClient()

    const [usersResult, postsResult, communitiesResult, reportsResult] = await Promise.all([
        admin.from('profiles').select('id', { count: 'exact', head: true }),
        admin.from('posts').select('id', { count: 'exact', head: true }),
        admin.from('communities').select('id', { count: 'exact', head: true }),
        admin.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    // Roles breakdown
    const { data: roleBreakdown } = await admin.from('profiles').select('role')
    const roles: Record<string, number> = {}
    roleBreakdown?.forEach((p: { role: string }) => { roles[p.role] = (roles[p.role] || 0) + 1 })

    return {
        totalUsers: usersResult.count || 0,
        totalPosts: postsResult.count || 0,
        totalCommunities: communitiesResult.count || 0,
        pendingReports: reportsResult.count || 0,
        roles,
    }
}

// ═══════════════════════════════════════════════════════════════
// FETCH USERS LIST (admin)
// ═══════════════════════════════════════════════════════════════
export async function fetchUsersAdmin(page = 0, limit = 20) {
    const admin = createAdminClient()

    const from = page * limit
    const { data, error, count } = await admin
        .from('profiles')
        .select('id, email, full_name, role, avatar_url, is_verified, is_onboarded, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + limit - 1)

    return { users: data || [], total: count || 0, error: error?.message || null }
}

// ═══════════════════════════════════════════════════════════════
// TOGGLE USER VERIFICATION
// ═══════════════════════════════════════════════════════════════
export async function toggleUserVerification(userId: string, verified: boolean) {
    const admin = createAdminClient()
    const { error } = await admin.from('profiles').update({ is_verified: verified }).eq('id', userId)
    return { error: error?.message || null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH PENDING REPORTS
// ═══════════════════════════════════════════════════════════════
export async function fetchPendingReports() {
    const admin = createAdminClient()

    const { data, error } = await admin
        .from('reports')
        .select(`
            *,
            reporter:reporter_id ( id, full_name, email )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(50)

    return { reports: data || [], error: error?.message || null }
}

// ═══════════════════════════════════════════════════════════════
// RESOLVE REPORT
// ═══════════════════════════════════════════════════════════════
export async function resolveReport(reportId: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const admin = createAdminClient()
    const { error } = await admin
        .from('reports')
        .update({ status: status as 'pending' | 'approved' | 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
        .eq('id', reportId)

    return { error: error?.message || null }
}

// ═══════════════════════════════════════════════════════════════
// CREATE NOTIFICATION UTILITY (used by other actions)
// ═══════════════════════════════════════════════════════════════
export async function createNotification(userId: string, type: string, title: string, body?: string, link?: string) {
    const admin = createAdminClient()
    const { error } = await admin.from('notifications').insert({
        user_id: userId,
        type: type as Database["public"]["Enums"]["notification_type"],
        title,
        message: body || null,
        link: link || null,
    })
    return { error: error?.message || null }
}
