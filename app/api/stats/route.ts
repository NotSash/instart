import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
    try {
        const supabase = createAdminClient()

        const [
            { count: founderCount },
            { count: investorCount },
            { count: connectionCount },
            { count: dealRoomCount },
        ] = await Promise.all([
            supabase.from('founder_profiles').select('*', { count: 'exact', head: true }),
            supabase.from('investor_profiles').select('*', { count: 'exact', head: true }),
            supabase.from('connections').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
            supabase.from('deal_rooms').select('*', { count: 'exact', head: true }),
        ])

        return NextResponse.json({
            startups: founderCount ?? 0,
            investors: investorCount ?? 0,
            connections: connectionCount ?? 0,
            deals: dealRoomCount ?? 0,
        })
    } catch {
        // Return reasonable defaults if DB not configured
        return NextResponse.json({
            startups: 0,
            investors: 0,
            connections: 0,
            deals: 0,
        })
    }
}
