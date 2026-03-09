'use server'

import { createClient } from '@/lib/supabase/server'

// ═══════════════════════════════════════════════════════════════
// FETCH CONVERSATIONS (with latest message & other participant)
// ═══════════════════════════════════════════════════════════════
export async function fetchConversations() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { conversations: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) return { conversations: [], error: error.message }
    if (!data || data.length === 0) return { conversations: [], error: null }

    // Resolve other participant profiles + latest messages
    const enriched = await Promise.all(data.map(async (conv) => {
        const otherUserId = conv.participant_one === user.id ? conv.participant_two : conv.participant_one

        const [profileResult, lastMsgResult, unreadResult] = await Promise.all([
            supabase.from('profiles').select('id, full_name, avatar_url, role, city').eq('id', otherUserId).single(),
            supabase.from('messages').select('content, created_at, sender_id').eq('conversation_id', conv.id).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('messages').select('id', { count: 'exact' }).eq('conversation_id', conv.id).eq('is_read', false).neq('sender_id', user.id),
        ])

        return {
            ...conv,
            other_participant: profileResult.data,
            last_message: lastMsgResult.data,
            unread_count: unreadResult.count || 0,
        }
    }))

    return { conversations: enriched, error: null }
}

// ═══════════════════════════════════════════════════════════════
// FETCH MESSAGES (for a conversation)
// ═══════════════════════════════════════════════════════════════
export async function fetchMessages(conversationId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) return { messages: [], error: error.message }
    return { messages: data || [], error: null }
}

// ═══════════════════════════════════════════════════════════════
// SEND MESSAGE
// ═══════════════════════════════════════════════════════════════
export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { message: null, error: 'Not authenticated' }

    const { data: message, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
        })
        .select()
        .single()

    if (error) return { message: null, error: error.message }

    // Update conversation's last_message_at
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

    return { message, error: null }
}

// ═══════════════════════════════════════════════════════════════
// MARK MESSAGES AS READ
// ═══════════════════════════════════════════════════════════════
export async function markMessagesAsRead(conversationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
}

// ═══════════════════════════════════════════════════════════════
// CREATE OR GET CONVERSATION (for "Message" button on profiles)
// ═══════════════════════════════════════════════════════════════
export async function getOrCreateConversation(otherUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { conversationId: null, error: 'Not authenticated' }

    // Check if conversation already exists
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_one.eq.${user.id},participant_two.eq.${otherUserId}),and(participant_one.eq.${otherUserId},participant_two.eq.${user.id})`)
        .maybeSingle()

    if (existing) return { conversationId: existing.id, error: null }

    // Create new conversation
    const { data: conv, error } = await supabase
        .from('conversations')
        .insert({
            participant_one: user.id,
            participant_two: otherUserId,
        })
        .select()
        .single()

    if (error) return { conversationId: null, error: error.message }
    return { conversationId: conv.id, error: null }
}

// ═══════════════════════════════════════════════════════════════
// GET CURRENT USER ID (helper for real-time checks)
// ═══════════════════════════════════════════════════════════════
export async function getCurrentUserId() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
}
