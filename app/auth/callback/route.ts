import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app/feed'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if user is onboarded
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('is_onboarded, role')
                    .eq('id', user.id)
                    .single()

                const profile = data as { is_onboarded: boolean, role: string } | null

                if (profile && !profile.is_onboarded) {
                    // Redirect to role selection page for new OAuth users
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Auth code exchange failed
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
