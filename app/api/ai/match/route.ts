import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAIConfigured } from '@/lib/env'

// Mock AI matching — returns demo scores
function generateMockMatches(startupSectors: string[], investorCount: number) {
    const mockInvestors = Array.from({ length: Math.min(investorCount, 5) }, (_, i) => ({
        investor_id: `mock-investor-${i + 1}`,
        score: Math.floor(Math.random() * 30) + 70,
        factors: {
            sector_match: Math.floor(Math.random() * 100),
            stage_match: Math.floor(Math.random() * 100),
            check_size_match: Math.floor(Math.random() * 100),
            thesis_match: Math.floor(Math.random() * 100),
        },
    }))

    return mockInvestors
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Check premium
        const { data: profile } = await supabase.from('profiles').select('is_premium, role').eq('id', user.id).single()
        if (!profile?.is_premium) {
            return NextResponse.json({ error: 'Pro feature — please upgrade' }, { status: 403 })
        }

        if (!isAIConfigured()) {
            // Return mock results
            const { data: founder } = await supabase.from('founder_profiles').select('sectors').eq('user_id', user.id).maybeSingle()
            const { count } = await supabase.from('investor_profiles').select('*', { count: 'exact', head: true })

            return NextResponse.json({
                mock: true,
                matches: generateMockMatches(founder?.sectors ?? [], count ?? 5),
                message: 'AI matching is in demo mode — configure an API key for real results',
            })
        }

        // TODO: Real AI matching logic with OpenAI embeddings
        return NextResponse.json({ matches: [], message: 'AI matching coming soon' })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Match failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
