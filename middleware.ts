import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that don't require authentication
const PUBLIC_ROUTES = [
    '/',
    '/pricing',
    '/blog',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
    '/auth/callback',
]

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname)) return true
    if (pathname.startsWith('/blog/')) return true
    if (pathname.startsWith('/auth/')) return true
    if (pathname.startsWith('/api/')) return true
    if (pathname.startsWith('/_next/')) return true
    if (pathname.startsWith('/favicon')) return true
    if (pathname.includes('.')) return true
    return false
}

export async function middleware(request: NextRequest) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If Supabase isn't configured yet, pass through all requests
    if (!url || !anonKey || url.startsWith('your_') || anonKey.startsWith('your_')) {
        return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                supabaseResponse = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                )
            },
        },
    })

    const { pathname } = request.nextUrl

    // Allow public routes
    if (isPublicRoute(pathname)) {
        // Still refresh the session even on public routes
        const { data: { user } } = await supabase.auth.getUser()

        // If user is authenticated and tries to access marketing/auth pages, redirect to app
        if (user && (pathname === '/' || pathname === '/login' || pathname === '/signup')) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_onboarded')
                .eq('id', user.id)
                .single()

            if (profile?.is_onboarded) {
                return NextResponse.redirect(new URL('/app/feed', request.url))
            }
        }

        return supabaseResponse
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Redirect unauthenticated users to login
    if (!user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Check if user is onboarded (for app routes)
    if (pathname.startsWith('/app/') || pathname === '/app') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_onboarded, role, is_banned')
            .eq('id', user.id)
            .single()

        if (profile?.is_banned) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (profile && !profile.is_onboarded && !pathname.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    // Onboarding pages — allow if authenticated
    if (pathname.startsWith('/onboarding')) {
        return supabaseResponse
    }

    // Admin routes — check role
    if (pathname.startsWith('/admin')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/app/feed', request.url))
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
