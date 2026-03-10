import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { RAZORPAY_WEBHOOK_SECRET } from '@/lib/env'
import crypto from 'crypto'

function getSubscriptionId(event: Record<string, unknown>): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (event as any).payload?.subscription?.entity?.id
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSubscriptionEntity(event: Record<string, unknown>): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (event as any).payload?.subscription?.entity
}

function toISO(timestamp: number | undefined, fallback: string): string {
    if (!timestamp) return fallback
    try {
        return new Date(timestamp * 1000).toISOString()
    } catch {
        return fallback
    }
}

async function handleSubscriptionActivated(supabase: ReturnType<typeof createAdminClient>, subscriptionId: string, event: Record<string, unknown>) {
    const { data: sub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_subscription_id', subscriptionId)
        .maybeSingle()

    if (fetchError) { console.error('Fetch subscription error:', fetchError.message); return }
    if (!sub) return

    const entity = getSubscriptionEntity(event)
    const now = new Date().toISOString()
    const periodStart = toISO(entity?.current_start, now)
    const periodEnd = toISO(entity?.current_end, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())

    const { error: subError } = await supabase.from('subscriptions').update({
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
    }).eq('razorpay_subscription_id', subscriptionId)

    if (subError) { console.error('Update subscription error:', subError.message); return }

    const { error: profileError } = await supabase.from('profiles').update({ is_premium: true }).eq('id', sub.user_id)
    if (profileError) {
        console.error('Update profile error:', profileError.message)
        // Rollback subscription status on profile update failure
        await supabase.from('subscriptions').update({ status: 'past_due' }).eq('razorpay_subscription_id', subscriptionId)
    }
}

async function handleSubscriptionEnded(supabase: ReturnType<typeof createAdminClient>, subscriptionId: string, status: 'cancelled' | 'expired') {
    const { data: sub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_subscription_id', subscriptionId)
        .maybeSingle()

    if (fetchError) { console.error('Fetch subscription error:', fetchError.message); return }
    if (!sub) return

    const { error: subError } = await supabase.from('subscriptions').update({
        status,
        cancel_at_period_end: true,
    }).eq('razorpay_subscription_id', subscriptionId)

    if (subError) { console.error('Update subscription error:', subError.message); return }

    // Only revoke premium immediately on expiration; cancelled users keep access until period end
    if (status === 'expired') {
        const { error: profileError } = await supabase.from('profiles').update({ is_premium: false }).eq('id', sub.user_id)
        if (profileError) console.error('Update profile error:', profileError.message)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const signature = request.headers.get('x-razorpay-signature')

        if (RAZORPAY_WEBHOOK_SECRET && signature) {
            const expectedSignature = crypto
                .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
                .update(body)
                .digest('hex')

            if (signature !== expectedSignature) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
            }
        }

        const event = JSON.parse(body)
        const supabase = createAdminClient()
        const subscriptionId = getSubscriptionId(event)

        if (subscriptionId) {
            switch (event.event) {
                case 'subscription.activated':
                case 'subscription.charged':
                    await handleSubscriptionActivated(supabase, subscriptionId, event)
                    break
                case 'subscription.cancelled':
                    await handleSubscriptionEnded(supabase, subscriptionId, 'cancelled')
                    break
                case 'subscription.expired':
                    await handleSubscriptionEnded(supabase, subscriptionId, 'expired')
                    break
            }
        }

        return NextResponse.json({ received: true })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Webhook processing failed'
        console.error('Webhook error:', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
