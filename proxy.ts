import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that don't require authentication
const PUBLIC_ROUTES = new Set([
    '/',
    '/pricing',
    '/blog',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
    '/auth/callback',
])

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.has(pathname)) return true
    if (pathname.startsWith('/blog/')) return true
    if (pathname.startsWith('/auth/')) return true
    if (pathname.startsWith('/api/')) return true
    if (pathname.startsWith('/_next/')) return true
    if (pathname.startsWith('/favicon')) return true
    if (pathname.includes('.')) return true
    return false
}

function createSupabaseClient(request: NextRequest, url: string, anonKey: string) {
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

    return { supabase, getResponse: () => supabaseResponse }
}

async function handlePublicRoute(supabase: ReturnType<typeof createServerClient>, pathname: string, requestUrl: string, getResponse: () => NextResponse) {
    const needsUserCheck = pathname === '/' || pathname === '/login' || pathname === '/signup'

    if (needsUserCheck) {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_onboarded')
                .eq('id', user.id)
                .single()

            if (profile?.is_onboarded) {
                return NextResponse.redirect(new URL('/app/feed', requestUrl))
            }
        }
    }

    return getResponse()
}


export async function proxy(request: NextRequest) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey || url.startsWith('your_') || anonKey.startsWith('your_')) {
        return NextResponse.next()
    }

    const { supabase, getResponse } = createSupabaseClient(request, url, anonKey)
    const { pathname } = request.nextUrl

    if (isPublicRoute(pathname)) {
        return handlePublicRoute(supabase, pathname, request.url, getResponse)
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (pathname.startsWith('/app/') || pathname === '/app') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_onboarded, role, is_banned')
            .eq('id', user.id)
            .single()

        if (profile?.is_banned) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        if (profile && !profile.is_onboarded) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    if (pathname.startsWith('/onboarding')) {
        return getResponse()
    }

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

    return getResponse()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
