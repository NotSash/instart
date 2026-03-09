'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'

type Profile = Tables<'profiles'>
import type { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    profile: Profile | null
    isLoading: boolean
    isAuthenticated: boolean
    isInitialized: boolean

    initialize: () => Promise<void>
    refreshProfile: () => Promise<void>
    logout: () => Promise<void>
    setUser: (user: User | null) => void
    setProfile: (profile: Profile | null) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isInitialized: false,

    initialize: async () => {
        const supabase = createClient()

        // Get current session
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            set({
                user,
                profile,
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            })
        } else {
            set({ user: null, profile: null, isAuthenticated: false, isLoading: false, isInitialized: true })
        }

        // Subscribe to auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                set({
                    user: session.user,
                    profile,
                    isAuthenticated: true,
                    isLoading: false,
                })
            } else if (event === 'SIGNED_OUT') {
                set({
                    user: null,
                    profile: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                set({ user: session.user })
            }
        })
    },

    refreshProfile: async () => {
        const { user } = get()
        if (!user) return

        const supabase = createClient()
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        set({ profile })
    },

    logout: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ user: null, profile: null, isAuthenticated: false })
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setProfile: (profile) => set({ profile }),
}))
