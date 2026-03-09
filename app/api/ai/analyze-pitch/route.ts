import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAIConfigured } from '@/lib/env'

function generateMockAnalysis() {
    return {
        overall_score: Math.floor(Math.random() * 20) + 70,
        strengths: [
            'Clear problem statement and market opportunity',
            'Strong founding team with relevant experience',
            'Solid traction metrics showing product-market fit',
        ],
        improvements: [
            'Financial projections could be more detailed',
            'Competitive analysis section needs strengthening',
            'Include more customer testimonials and case studies',
        ],
        suggestions: [
            'Add a slide showing your competitive moat',
            'Include a detailed go-to-market strategy',
            'Show unit economics and path to profitability',
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

        const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
        if (!profile?.is_premium) {
            return NextResponse.json({ error: 'Pro feature — please upgrade' }, { status: 403 })
        }

        if (!isAIConfigured()) {
            return NextResponse.json({
                mock: true,
                analysis: generateMockAnalysis(),
                message: 'AI analysis is in demo mode — configure an API key for real analysis',
            })
        }

        // TODO: Real AI pitch analysis with OpenAI
        return NextResponse.json({ analysis: generateMockAnalysis() })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Analysis failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
