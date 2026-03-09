import { createAdminClient } from '@/lib/supabase/admin'
import type { NotificationType } from '@/lib/supabase/database.types'

interface CreateNotificationParams {
    userId: string
    type: NotificationType
    title: string
    message?: string
    link?: string
    actorId?: string
}

/**
 * Create a notification for a user.
 * Called from server actions / API routes whenever a notifiable event occurs.
 * Uses admin client to bypass RLS.
 */
export async function createNotification(params: CreateNotificationParams) {
    const supabase = createAdminClient()

    const { error } = await supabase.from('notifications').insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message ?? null,
        link: params.link ?? null,
        actor_id: params.actorId ?? null,
    })

    if (error) {
        console.error('Failed to create notification:', error.message)
    }

    return { error }
}
