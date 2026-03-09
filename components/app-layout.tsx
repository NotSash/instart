'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Home, Compass, Users, MessageSquare, Handshake, User, Bell,
  ChevronLeft, ChevronRight, Search, Settings, LogOut, Menu, X
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { createClient } from '@/lib/supabase/client'
import { getUnreadCount } from '@/app/actions/notifications'

interface AppLayoutProps {
  children: React.ReactNode
  currentPage: 'feed' | 'explore' | 'communities' | 'messages' | 'cofounders' | 'profile' | 'notifications' | 'settings' | 'viewers' | 'dealroom' | 'compare' | (string & {})
  userRole: 'founder' | 'investor' | 'cofounder'
}

const navItems = [
  { icon: Home, label: 'Feed', page: 'feed', href: '/app/feed' },
  { icon: Compass, label: 'Explore', page: 'explore', href: '/app/explore/startups' },
  { icon: Users, label: 'Communities', page: 'communities', href: '/app/communities' },
  { icon: MessageSquare, label: 'Messages', page: 'messages', href: '/app/messages' },
  { icon: Handshake, label: 'Co-founders', page: 'cofounders', href: '/app/explore/cofounders' },
  { icon: User, label: 'Profile', page: 'profile', href: '/app/settings' },
]

export function AppLayout({ children, currentPage, userRole }: AppLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')

  // Load user info + unread notification count
  useEffect(() => {
    async function loadUserContext() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()
          if (profile) {
            setUserName(profile.full_name || user.email?.split('@')[0] || 'User')
            setUserAvatar(profile.avatar_url || '')
          }
        }
        const count = await getUnreadCount()
        setUnreadCount(count)
      } catch {
        // silently fail on non-critical context load
      }
    }
    loadUserContext()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: 240 }}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col bg-surface border-r border-white/5 sticky top-0 h-screen"
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-white/5 px-4">
          <Link href="/app/feed" className="flex items-center gap-2 font-bold text-lg text-foreground truncate">
            <Image src="/logo.png" alt="Instart Logo" width={32} height={32} className="rounded-lg flex-shrink-0" />
            {sidebarOpen && <span>instart</span>}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {navItems.map(({ icon: Icon, label, page, href }) => (
            <motion.div key={page}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group ${currentPage === page
                  ? 'bg-surface-elevated text-emerald-400'
                  : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                  }`}
              >
                {currentPage === page && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r"
                    transition={{ type: 'spring', bounce: 0.2 }}
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0 ml-1" />
                {sidebarOpen && <span className="flex-1 text-sm">{label}</span>}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Premium CTA */}
        <div className="p-3 border-t border-white/5">
          <motion.div
            className="bg-gradient-to-br from-emerald-600/30 to-cyan-600/20 rounded-lg p-3 border border-emerald-500/20"
            whileHover={{ scale: 1.02 }}
          >
            {sidebarOpen && (
              <>
                <p className="text-xs font-semibold text-white mb-2">Go Premium</p>
                <Link href="/pricing">
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                    Upgrade
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* User Footer */}
        <div className="border-t border-white/5 p-3 flex items-center gap-3">
          {userAvatar ? (
            <Image src={userAvatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-foreground">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{userRole}</p>
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            {profileMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-36 bg-surface-elevated rounded-lg border border-white/10 shadow-xl z-50">
                <Link href="/app/settings" className="block px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-foreground">
                  Settings
                </Link>
                <Link href="/app/profile-viewers" className="block px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-foreground">
                  Profile Viewers
                </Link>
                <hr className="border-white/5" />
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-red-400">
                  <LogOut className="w-3.5 h-3.5 inline mr-2" />Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full border-t border-white/5 p-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-white/5 bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md ml-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups, investors, posts..."
                  className="pl-10 bg-white/5 border-white/10 focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/app/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-emerald-600 text-white text-[10px] font-bold rounded-full px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/app/settings" className="block">
                {userAvatar ? (
                  <Image src={userAvatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-xs font-bold text-foreground">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-surface border-b border-white/5 z-30 py-2 px-4 space-y-1"
          >
            {navItems.map(({ icon: Icon, label, page, href }) => (
              <Link key={page} href={href} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${currentPage === page ? 'bg-surface-elevated text-emerald-400' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="w-5 h-5" /> {label}
              </Link>
            ))}
          </motion.div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-white/5 z-50"
      >
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map(({ icon: Icon, label, page, href }) => (
            <Link
              key={page}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 relative group transition-colors ${currentPage === page ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {currentPage === page && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute top-0 w-1.5 h-1.5 bg-emerald-500 rounded-full"
                />
              )}
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
