import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { RAZORPAY_WEBHOOK_SECRET } from '@/lib/env'
import crypto from 'crypto'

function getSubscriptionId(event: Record<string, unknown>): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (event as any).payload?.subscription?.entity?.id
}

async function handleSubscriptionActivated(supabase: ReturnType<typeof createAdminClient>, subscriptionId: string) {
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_subscription_id', subscriptionId)
        .maybeSingle()

    if (!sub) return

    await supabase.from('subscriptions').update({
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }).eq('razorpay_subscription_id', subscriptionId)

    await supabase.from('profiles').update({ is_premium: true }).eq('id', sub.user_id)
}

async function handleSubscriptionEnded(supabase: ReturnType<typeof createAdminClient>, subscriptionId: string, status: 'cancelled' | 'expired') {
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_subscription_id', subscriptionId)
        .maybeSingle()

    if (!sub) return

    await supabase.from('subscriptions').update({
        status,
        cancel_at_period_end: true,
    }).eq('razorpay_subscription_id', subscriptionId)

    await supabase.from('profiles').update({ is_premium: false }).eq('id', sub.user_id)
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
                    await handleSubscriptionActivated(supabase, subscriptionId)
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
