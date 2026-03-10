'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    Bell, UserPlus, MessageSquare, TrendingUp, Heart,
    ArrowBigUp, CheckCheck, Settings, Loader2, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    fetchNotifications, markNotificationRead, markAllNotificationsRead
} from '@/app/actions/notifications'

const filterTabs = ['All', 'Connections', 'Messages', 'Mentions', 'Activity']

const notifIconMap: Record<string, { icon: typeof Bell; color: string }> = {
    connection_request: { icon: UserPlus, color: 'bg-emerald-500/15 text-emerald-400' },
    connection_accepted: { icon: UserPlus, color: 'bg-emerald-500/15 text-emerald-400' },
    new_message: { icon: MessageSquare, color: 'bg-cyan-500/15 text-cyan-400' },
    post_upvote: { icon: ArrowBigUp, color: 'bg-emerald-500/15 text-emerald-400' },
    comment_reply: { icon: MessageSquare, color: 'bg-cyan-500/15 text-cyan-400' },
    post_mention: { icon: Heart, color: 'bg-pink-500/15 text-pink-400' },
    comment_mention: { icon: Heart, color: 'bg-pink-500/15 text-pink-400' },
    profile_view: { icon: Eye, color: 'bg-purple-500/15 text-purple-400' },
    match_found: { icon: TrendingUp, color: 'bg-amber-500/15 text-amber-400' },
}

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('All')
    const [notifications, setNotifications] = useState<DataRow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(async () => {
        setIsLoading(true)
        const result = await fetchNotifications(activeTab)
        setNotifications(result.notifications)
        setIsLoading(false)
    }, [activeTab])

    useEffect(() => { load() }, [load])

    const unreadCount = notifications.filter((n: DataRow) => !n.is_read).length

    const handleMarkRead = async (id: string) => {
        setNotifications(prev => prev.map((n: DataRow) => n.id === id ? { ...n, is_read: true } : n))
        await markNotificationRead(id)
    }

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map((n: DataRow) => ({ ...n, is_read: true })))
        await markAllNotificationsRead()
    }

    return (
        <AppLayout currentPage="notifications">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>Notifications</h1>
                        {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} unread</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-sm text-muted-foreground hover:text-foreground">
                            <CheckCheck className="w-4 h-4 mr-1.5" /> Mark all read
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {filterTabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16">
                        <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">No notifications</p>
                        <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notif: DataRow, i: number) => {
                            const iconConfig = notifIconMap[notif.type] || { icon: Bell, color: 'bg-white/10 text-muted-foreground' }
                            const Icon = iconConfig.icon
                            const isConnectionRequest = notif.type === 'connection_request'

                            return (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    onClick={() => handleMarkRead(notif.id)}
                                    className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer ${notif.is_read ? 'hover:bg-white/3' : 'bg-white/5 border border-white/5'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconConfig.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm font-medium ${notif.is_read ? 'text-foreground/80' : 'text-foreground'}`}>{notif.title}</p>
                                                {notif.message && <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>}
                                                {notif.actor && <p className="text-xs text-muted-foreground mt-0.5">{notif.actor.full_name} · {notif.actor.role?.replaceAll('_', ' ')}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-xs text-muted-foreground">{timeAgo(notif.created_at)}</span>
                                                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            </div>
                                        </div>
                                        {isConnectionRequest && (
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7 px-3">Accept</Button>
                                                <Button size="sm" variant="outline" className="border-white/10 text-xs h-7 px-3">Decline</Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
