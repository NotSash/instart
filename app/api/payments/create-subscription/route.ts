import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isRazorpayConfigured, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/lib/env'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { plan } = await request.json()

        // Mock mode if Razorpay not configured
        if (!isRazorpayConfigured()) {
            // Directly upgrade the user in mock mode
            await supabase.from('subscriptions').upsert({
                user_id: user.id,
                plan,
                status: 'active',
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }, { onConflict: 'user_id' })

            await supabase.from('profiles').update({ is_premium: plan !== 'free' }).eq('id', user.id)

            return NextResponse.json({
                mock: true,
                message: 'Subscription activated in mock mode (Razorpay not configured)',
                subscription_id: `mock_sub_${Date.now()}`,
            })
        }

        // Real Razorpay subscription creation
        const Razorpay = (await import('razorpay')).default
        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
        })

        const planPrices: Record<string, number> = {
            pro: 39900,       // ₹399/month in paisa
            enterprise: 499900, // ₹4,999/month in paisa
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: plan, // Use plan ID from Razorpay dashboard
            total_count: 12,
            customer_notify: 1,
            notes: { user_id: user.id, plan },
        })

        return NextResponse.json({
            subscription_id: subscription.id,
            key_id: RAZORPAY_KEY_ID,
            amount: planPrices[plan] || 99900,
            currency: 'INR',
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create subscription'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
