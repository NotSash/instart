import { UserRoleProvider } from '@/components/user-role-provider'

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserRoleProvider>
            {children}
        </UserRoleProvider>
    )
}
