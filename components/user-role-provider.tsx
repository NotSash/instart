'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

type UserRole = 'founder' | 'investor' | 'cofounder_seeker' | 'browser' | 'admin'

interface UserRoleContextValue {
    role: UserRole
    isLoading: boolean
}

const UserRoleContext = createContext<UserRoleContextValue>({
    role: 'founder',
    isLoading: true,
})

export function useUserRole() {
    return useContext(UserRoleContext)
}

export function UserRoleProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>('founder')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchRole() {
            try {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single()
                    if (profile?.role) {
                        setRole(profile.role as UserRole)
                    }
                }
            } catch {
                // Fallback to default role
            } finally {
                setIsLoading(false)
            }
        }
        fetchRole()
    }, [])

    return (
        <UserRoleContext.Provider value={{ role, isLoading }}>
            {children}
        </UserRoleContext.Provider>
    )
}
