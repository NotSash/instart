'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users, FileText, Shield, Flag, CheckCircle, XCircle,
    Globe, TrendingUp, Loader2, BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { fetchAdminStats, fetchUsersAdmin, fetchPendingReports, toggleUserVerification, resolveReport } from '@/app/actions/admin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState<DataRow>(null)
    const [users, setUsers] = useState<DataRow[]>([])
    const [reports, setReports] = useState<DataRow[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setIsLoading(true)
            const [statsData, usersData, reportsData] = await Promise.all([
                fetchAdminStats(),
                fetchUsersAdmin(),
                fetchPendingReports(),
            ])
            setStats(statsData)
            setUsers(usersData.users)
            setReports(reportsData.reports)
            setIsLoading(false)
        }
        load()
    }, [])

    const handleVerify = async (userId: string, current: boolean) => {
        setUsers(prev => prev.map((u: DataRow) => u.id === userId ? { ...u, is_verified: !current } : u))
        await toggleUserVerification(userId, !current)
    }

    const handleResolve = async (reportId: string, status: string) => {
        setReports(prev => prev.filter((r: DataRow) => r.id !== reportId))
        await resolveReport(reportId, status)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            </div>
        )
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'reports', label: 'Reports', icon: Flag, badge: reports.length },
    ]

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Header */}
            <div className="border-b border-white/5 bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
                    <Link href="/app/feed" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Instart" width={28} height={28} className="rounded" />
                        <span className="font-bold text-foreground">Admin Panel</span>
                    </Link>
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                                <tab.icon className="w-4 h-4" /> {tab.label}
                                {tab.badge ? <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">{tab.badge}</span> : null}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {/* Overview */}
                {activeTab === 'overview' && stats && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-emerald-400' },
                                { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-cyan-400' },
                                { label: 'Communities', value: stats.totalCommunities, icon: Globe, color: 'text-purple-400' },
                                { label: 'Pending Reports', value: stats.pendingReports, icon: Flag, color: stats.pendingReports > 0 ? 'text-red-400' : 'text-emerald-400' },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card p-5">
                                    <div className="flex items-center gap-2 mb-2"><stat.icon className={`w-4 h-4 ${stat.color}`} /><span className="text-xs text-muted-foreground">{stat.label}</span></div>
                                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Users by Role</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(stats.roles || {}).map(([role, count]) => (
                                    <div key={role} className="text-center p-4 rounded-xl bg-white/[0.02]">
                                        <p className="text-2xl font-bold text-foreground">{count as number}</p>
                                        <p className="text-xs text-muted-foreground capitalize mt-1">{role.replaceAll('_', ' ')}s</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                        {users.map((user: DataRow, i: number) => (
                            <motion.div key={user.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10 flex-shrink-0">
                                    {user.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-foreground">{user.full_name || 'Unknown'}</p>
                                        {user.is_verified && <BadgeCheck className="w-4 h-4 text-emerald-400" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{user.email} · <span className="capitalize">{user.role}</span></p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${user.is_onboarded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        {user.is_onboarded ? 'Onboarded' : 'Pending'}
                                    </span>
                                    <Button size="sm" variant="outline" className="border-white/10 text-xs h-7"
                                        onClick={() => handleVerify(user.id, user.is_verified)}>
                                        {user.is_verified ? <><XCircle className="w-3 h-3 mr-1" /> Unverify</> : <><CheckCircle className="w-3 h-3 mr-1" /> Verify</>}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Reports */}
                {activeTab === 'reports' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {reports.length === 0 ? (
                            <div className="text-center py-16">
                                <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-foreground font-medium mb-2">No pending reports</p>
                                <p className="text-sm text-muted-foreground">All clear! The community is behaving well.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reports.map((report: DataRow) => (
                                    <div key={report.id} className="glass-card p-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground capitalize">{report.reason?.replaceAll('_', ' ')}</p>
                                                {report.description && <p className="text-sm text-muted-foreground mt-1">{report.description}</p>}
                                                <p className="text-xs text-muted-foreground mt-2">Reported by: {report.reporter?.full_name || report.reporter?.email || 'Unknown'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="border-emerald-500/20 text-emerald-400 text-xs h-7"
                                                    onClick={() => handleResolve(report.id, 'resolved')}>
                                                    Resolve
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-red-500/20 text-red-400 text-xs h-7"
                                                    onClick={() => handleResolve(report.id, 'dismissed')}>
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
