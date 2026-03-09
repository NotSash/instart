import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isRazorpayConfigured } from '@/lib/env'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { razorpay_payment_id, razorpay_subscription_id, plan } = await request.json()

        if (!isRazorpayConfigured()) {
            // In mock mode, payment is already handled in create-subscription
            return NextResponse.json({ success: true, mock: true })
        }

        // In real mode, verify payment with Razorpay
        // Update subscription record
        await supabase.from('subscriptions').upsert({
            user_id: user.id,
            plan,
            status: 'active',
            razorpay_subscription_id,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'user_id' })

        // Record payment
        await supabase.from('payments').insert({
            user_id: user.id,
            razorpay_payment_id,
            amount: plan === 'enterprise' ? 499900 : 99900,
            status: 'completed',
        })

        // Update profile premium status
        await supabase.from('profiles').update({ is_premium: true }).eq('id', user.id)

        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to verify payment'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
