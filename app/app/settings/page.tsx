'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    User, Bell, Shield, CreditCard, Palette,
    LogOut, Camera, Loader2, Save, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { fetchSettings, updateProfileSettings, updateNotificationPreferences, changePassword } from '@/app/actions/settings'

const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

function Toggle({ enabled, onChange }: Readonly<{ enabled: boolean; onChange: () => void }>) {
    return (
        <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
            <motion.div animate={{ x: enabled ? 20 : 2 }} className="w-5 h-5 rounded-full bg-white absolute top-0.5" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </button>
    )
}

export default function SettingsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('account')
    const [profile, setProfile] = useState<DataRow>(null)
    const [notifPrefs, setNotifPrefs] = useState<DataRow>(null)
    const [subscription, setSubscription] = useState<DataRow>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Form state
    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')
    const [city, setCity] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const result = await fetchSettings()
            setProfile(result.profile)
            setNotifPrefs(result.notifPrefs || {})
            setSubscription(result.subscription)

            if (result.profile) {
                setFullName(result.profile.full_name || '')
                setBio(result.profile.bio || '')
                setCity(result.profile.city || '')
                setLinkedin(result.profile.linkedin_url || '')
            }
            setIsLoading(false)
        }
        load()
    }, [])

    const handleSaveProfile = async () => {
        setIsSaving(true)
        await updateProfileSettings({
            full_name: fullName,
            bio,
            city,
            linkedin_url: linkedin,
        })
        setIsSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleToggleNotif = async (key: string) => {
        const newVal = !notifPrefs[key]
        setNotifPrefs((prev: DataRow) => ({ ...prev, [key]: newVal }))
        await updateNotificationPreferences({ [key]: newVal })
    }

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            setPasswordMsg('Password must be at least 6 characters')
            return
        }
        const { error } = await changePassword(newPassword)
        setPasswordMsg(error || 'Password updated successfully!')
        if (!error) setNewPassword('')
    }

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (isLoading) {
        return (
            <AppLayout currentPage="settings">
                <div className="flex justify-center items-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>
            </AppLayout>
        )
    }

    return (
        <AppLayout currentPage="settings">
            <div className="max-w-4xl mx-auto p-4 md:p-6">
                <h1 className="text-2xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>Settings</h1>

                <div className="flex gap-6">
                    {/* Sidebar Tabs */}
                    <div className="hidden md:block w-48 flex-shrink-0">
                        <div className="space-y-1">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id ? 'bg-white/5 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/3'}`}>
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                            <hr className="border-white/5 my-3" />
                            <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    <div className="glass-card p-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-5">Profile Information</h3>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-xl font-bold text-foreground border border-white/10">
                                                {fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                            </div>
                                            <div>
                                                <Button variant="outline" size="sm" className="border-white/10 text-sm"><Camera className="w-3.5 h-3.5 mr-1.5" /> Change Photo</Button>
                                                <p className="text-xs text-muted-foreground mt-1.5">{profile?.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="settingsFullName" className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                                                <input id="settingsFullName" value={fullName} onChange={e => setFullName(e.target.value)}
                                                    className="w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                            </div>
                                            <div>
                                                <label htmlFor="settingsBio" className="text-sm text-muted-foreground mb-1.5 block">Bio</label>
                                                <textarea id="settingsBio" value={bio} onChange={e => setBio(e.target.value)} rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-emerald-500/50 transition-all resize-none" />
                                            </div>
                                            <div>
                                                <label htmlFor="settingsCity" className="text-sm text-muted-foreground mb-1.5 block">City</label>
                                                <input id="settingsCity" value={city} onChange={e => setCity(e.target.value)}
                                                    className="w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                            </div>
                                            <div>
                                                <label htmlFor="settingsLinkedin" className="text-sm text-muted-foreground mb-1.5 block">LinkedIn URL</label>
                                                <input id="settingsLinkedin" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..."
                                                    className="w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                            </div>
                                        </div>

                                        <Button onClick={handleSaveProfile} disabled={isSaving} className="mt-5 bg-emerald-600 hover:bg-emerald-500 text-white">
                                            {saved ? <><Check className="w-4 h-4 mr-1.5" /> Saved!</> : isSaving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>}
                                        </Button>
                                    </div>

                                    <div className="glass-card p-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                                        <div className="flex gap-3">
                                            <label htmlFor="settingsPassword" className="sr-only">New Password</label>
                                            <input id="settingsPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 6 chars)"
                                                className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                            <Button onClick={handleChangePassword} variant="outline" className="border-white/10">Update</Button>
                                        </div>
                                        {passwordMsg && <p className={`text-sm mt-2 ${passwordMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{passwordMsg}</p>}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-5">Notification Preferences</h3>
                                    <div className="space-y-5">
                                        {[
                                            { key: 'email_enabled', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                            { key: 'email_weekly_digest', label: 'Weekly Digest', desc: 'Weekly summary of activity' },
                                            { key: 'email_connections', label: 'Connection Requests', desc: 'When someone sends a connection request' },
                                            { key: 'email_messages', label: 'New Messages', desc: 'When you receive a new message' },
                                            { key: 'email_post_activity', label: 'Post Activity', desc: 'Upvotes and comments on your posts' },
                                            { key: 'email_profile_views', label: 'Profile Views', desc: 'When someone views your profile' },
                                            { key: 'push_enabled', label: 'Push Notifications', desc: 'Browser push notifications' },
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                </div>
                                                <Toggle enabled={!!notifPrefs[item.key]} onChange={() => handleToggleNotif(item.key)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Settings</h3>
                                    <p className="text-sm text-muted-foreground">Privacy controls coming soon — you&apos;ll be able to manage profile visibility, data export, and more.</p>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Subscription</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription?.plan === 'pro' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-muted-foreground border border-white/10'}`}>
                                            {subscription?.plan === 'pro' ? '✨ Pro' : subscription?.plan === 'enterprise' ? '🏢 Enterprise' : 'Free Plan'}
                                        </span>
                                        {subscription?.status && <span className="text-xs text-muted-foreground capitalize">{subscription.status}</span>}
                                    </div>
                                    {(!subscription || subscription?.plan === 'free') && (
                                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => router.push('/pricing')}>
                                            Upgrade to Pro
                                        </Button>
                                    )}
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
                                    <p className="text-sm text-muted-foreground">Theme preferences coming soon. Currently using dark mode.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Mobile Sign Out */}
                        <div className="md:hidden mt-6">
                            <Button onClick={handleSignOut} variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
