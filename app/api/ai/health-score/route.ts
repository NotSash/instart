import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAIConfigured } from '@/lib/env'

function generateMockHealthScore() {
    return {
        overall: Math.floor(Math.random() * 20) + 65,
        metrics: {
            team: Math.floor(Math.random() * 30) + 60,
            product: Math.floor(Math.random() * 30) + 55,
            market: Math.floor(Math.random() * 30) + 60,
            traction: Math.floor(Math.random() * 30) + 50,
            fundraising: Math.floor(Math.random() * 30) + 65,
        },
        recommendations: [
            'Focus on improving your monthly growth rate to 15%+',
            'Expand your team with a senior engineer',
            'Diversify your revenue channels',
        ],
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        if (!isAIConfigured()) {
            return NextResponse.json({
                mock: true,
                healthScore: generateMockHealthScore(),
                message: 'Health score is in demo mode',
            })
        }

        return NextResponse.json({ healthScore: generateMockHealthScore() })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Health score failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
