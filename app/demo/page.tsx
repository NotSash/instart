"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Compass,
  Users,
  MessageSquare,
  Handshake,
  User,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Star,
  ChevronRight,
  BarChart2,
  Eye,
  Bookmark,
  Filter,
  Plus,
  X,
  CheckCircle2,
  Clock,
  CircleDollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// ─── Static demo data ────────────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Feed", active: false, href: "#" },
  { icon: Compass, label: "Explore", active: false, href: "#" },
  { icon: Users, label: "Communities", active: false, href: "#" },
  { icon: MessageSquare, label: "Messages", active: false, href: "#", badge: 3 },
  { icon: Handshake, label: "Co-founders", active: false, href: "#" },
  { icon: User, label: "My Profile", active: false, href: "#" },
  { icon: Bell, label: "Notifications", active: false, href: "#", badge: 7 },
]

const stats = [
  { label: "Profile Views", value: "1,284", change: "+18%", up: true, icon: Eye, color: "emerald" },
  { label: "Investor Matches", value: "47", change: "+6", up: true, icon: Zap, color: "cyan" },
  { label: "Saved by Investors", value: "23", change: "+4", up: true, icon: Bookmark, color: "emerald" },
  { label: "Funding Target", value: "₹2Cr", change: "₹80L raised", up: true, icon: CircleDollarSign, color: "cyan" },
]

const matchedInvestors = [
  { name: "Rajan Mehta", role: "Angel Investor", focus: "FinTech, SaaS", score: 94, avatar: "RM" },
  { name: "Priya Kapoor", role: "Partner, Elevation Capital", focus: "EdTech, AI/ML", score: 88, avatar: "PK" },
  { name: "Arjun Singhania", role: "Micro VC", focus: "AgriTech, CleanTech", score: 81, avatar: "AS" },
  { name: "Neha Joshi", role: "Family Office", focus: "D2C, HealthTech", score: 76, avatar: "NJ" },
]

const activity = [
  { icon: Eye, text: "Elevation Capital viewed your profile", time: "2h ago", color: "cyan" },
  { icon: Star, text: "New investor match: Rajan Mehta (94% fit)", time: "5h ago", color: "emerald" },
  { icon: MessageSquare, text: "Priya Kapoor sent you a message", time: "1d ago", color: "emerald" },
  { icon: CheckCircle2, text: "Your startup is featured in Today's Hot Picks", time: "1d ago", color: "cyan" },
  { icon: Users, text: "3 investors saved your startup this week", time: "2d ago", color: "emerald" },
]

const feedPosts = [
  {
    community: "Fundraising",
    communityColor: "emerald",
    author: "Vikram Nair",
    role: "Founder",
    roleColor: "emerald",
    time: "3h ago",
    title: "We just closed our seed round at ₹4Cr valuation — here's what worked",
    preview: "After 6 months of pitching and 80+ investor meetings, we finally closed. Here are the 5 things that made the difference for us as a first-time founder in tier-2 India...",
    votes: 247,
    comments: 43,
    userVote: 1,
  },
  {
    community: "FinTech",
    communityColor: "cyan",
    author: "Aisha Sharma",
    role: "Investor",
    roleColor: "cyan",
    time: "6h ago",
    title: "What I look for in a FinTech pitch deck in 2025 (detailed breakdown)",
    preview: "I've reviewed over 200 FinTech decks this year. Here's exactly what separates the ones that get funding from the ones that don't — and it's not what you think...",
    votes: 189,
    comments: 31,
    userVote: 0,
  },
  {
    community: "Hiring",
    communityColor: "emerald",
    author: "Rohan Das",
    role: "Founder",
    roleColor: "emerald",
    time: "9h ago",
    title: "Looking for a technical co-founder for our B2B SaaS — ₹15L salary + 5% equity",
    preview: "We're building AI-powered compliance tooling for Indian NBFCs. MVP is done, 3 paying customers, looking for a CTO-track co-founder to own the full tech stack...",
    votes: 94,
    comments: 22,
    userVote: 0,
  },
]

const trendingStartups = [
  { rank: 1, name: "AgriChain", sector: "AgriTech", votes: 312 },
  { rank: 2, name: "MediQuick", sector: "HealthTech", votes: 281 },
  { rank: 3, name: "EduLeap", sector: "EdTech", votes: 245 },
  { rank: 4, name: "GreenGrid", sector: "CleanTech", votes: 198 },
  { rank: 5, name: "FinFlow", sector: "FinTech", votes: 174 },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4 xl:p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color === "emerald" ? "bg-emerald-500/10" : "bg-cyan-500/10"}`}>
          <Icon className={`w-4 h-4 ${stat.color === "emerald" ? "text-emerald-400" : "text-cyan-400"}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
      <div className="flex items-center gap-1 text-xs">
        {stat.up
          ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          : <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />}
        <span className={stat.up ? "text-emerald-400" : "text-red-400"}>{stat.change}</span>
        <span className="text-muted-foreground ml-1">this week</span>
      </div>
    </motion.div>
  )
}

function PostCard({ post, index }: { post: typeof feedPosts[0]; index: number }) {
  const [vote, setVote] = useState(post.userVote)
  const baseVotes = post.votes
  const displayVotes = baseVotes + vote

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4 xl:p-5 hover:border-white/10 transition-all cursor-pointer group"
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.communityColor === "emerald" ? "bg-emerald-500/10 text-emerald-400" : "bg-cyan-500/10 text-cyan-400"}`}>
          {post.community}
        </span>
        <span className="text-xs text-muted-foreground">{post.author}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${post.roleColor === "emerald" ? "bg-emerald-500/15 text-emerald-400" : "bg-cyan-500/15 text-cyan-400"}`}>
          {post.role}
        </span>
        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />{post.time}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm xl:text-base font-semibold text-foreground mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
        {post.title}
      </h3>

      {/* Preview */}
      <p className="text-xs xl:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {post.preview}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setVote(v => v === 1 ? 0 : 1) }}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${vote === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <span className={`text-xs font-semibold min-w-[2rem] text-center tabular-nums ${vote === 1 ? "text-emerald-400" : vote === -1 ? "text-red-400" : "text-foreground"}`}>
            {displayVotes}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setVote(v => v === -1 ? 0 : -1) }}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${vote === -1 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 hover:text-foreground transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />{post.comments}
          </span>
          <button className="hover:text-emerald-400 transition-colors">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("Hot")
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col">
      {/* Demo banner */}
      <div className="relative z-50 bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
          <span>You&apos;re viewing the <strong>Instart demo</strong> — explore the dashboard interactively.</span>
        </div>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 flex-shrink-0">
          <X className="w-3 h-3" /> Exit demo
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          className={`hidden md:flex flex-col border-r border-white/5 bg-[#080808] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex-shrink-0 ${sidebarCollapsed ? "w-16" : "w-60"}`}
          style={{ height: "calc(100vh - 36px)" }}
        >
          {/* Logo */}
          <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${sidebarCollapsed ? "justify-center px-0" : ""}`}>
            <Image src="/logo.png" alt="Instart Logo" width={28} height={28} className="rounded-lg flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-bold text-sm tracking-tight">instart</span>}
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative group hover:bg-white/5 text-muted-foreground hover:text-foreground ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {item.badge && !sidebarCollapsed && (
                    <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-black rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && sidebarCollapsed && (
                    <span className="absolute top-1.5 right-2 text-[8px] font-bold bg-emerald-500 text-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Premium card */}
          {!sidebarCollapsed && (
            <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-foreground">Go Pro</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">Unlock AI matching, deal rooms, and analytics.</p>
              <button className="w-full text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-1.5 rounded-lg transition-colors">
                Upgrade
              </button>
            </div>
          )}

          {/* User + collapse toggle */}
          <div className={`border-t border-white/5 p-3 flex items-center gap-2 ${sidebarCollapsed ? "justify-center flex-col gap-3" : ""}`}>
            {!sidebarCollapsed && (
              <>
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                  VN
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">Vikram Nair</div>
                  <div className="text-[10px] text-muted-foreground">Founder</div>
                </div>
              </>
            )}
            <button
              onClick={() => setSidebarCollapsed(v => !v)}
              className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
            </button>
          </div>
        </aside>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ height: "calc(100vh - 36px)" }}>
          {/* Top bar */}
          <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl flex-shrink-0">
            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-2">
              <Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded flex-shrink-0" />
              <span className="font-bold text-sm">instart</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search startups, investors, posts..."
                  className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Mobile search */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="md:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <button className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold cursor-pointer">
                VN
              </div>
            </div>
          </header>

          {/* Mobile search overlay */}
          {searchOpen && (
            <div className="md:hidden px-4 py-3 border-b border-white/5 bg-[#080808]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search startups, investors, posts..."
                  className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 xl:py-8">

              {/* Welcome + stats */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h1 className="text-xl xl:text-2xl font-bold text-foreground mb-0.5">
                  Good morning, <span className="text-emerald-400">Vikram</span> 👋
                </h1>
                <p className="text-sm text-muted-foreground">You have 7 new investor matches since yesterday.</p>
              </motion.div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
                {stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>

              {/* Feed + Right sidebar */}
              <div className="flex gap-6">
                {/* Feed column */}
                <div className="flex-1 min-w-0">
                  {/* AI Match Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="mb-5 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/8 to-emerald-500/10 border border-emerald-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">AI found 4 new investor matches for you</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Rajan Mehta (94% fit) just joined and matches your sector perfectly.</p>
                      </div>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold rounded-lg px-3 h-8 flex-shrink-0">
                        View Matches
                      </Button>
                    </div>
                  </motion.div>

                  {/* Investor matches */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" /> Top Investor Matches
                      </h2>
                      <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors">
                        See all <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedInvestors.map((inv, i) => (
                        <motion.div
                          key={inv.name}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 + i * 0.07 }}
                          className="glass-card p-3.5 flex items-center gap-3 hover:border-white/10 transition-all cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-foreground flex-shrink-0">
                            {inv.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-emerald-400 transition-colors">{inv.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{inv.role}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{inv.focus}</p>
                          </div>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`text-sm font-bold ${inv.score >= 90 ? "text-emerald-400" : inv.score >= 80 ? "text-cyan-400" : "text-yellow-400"}`}>
                              {inv.score}%
                            </div>
                            <div className="text-[9px] text-muted-foreground">match</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Feed */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-foreground">Community Feed</h2>
                      <div className="flex items-center gap-1">
                        {["Hot", "New", "Top"].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-xs px-3 py-1 rounded-full transition-all ${activeTab === tab ? "bg-emerald-500/15 text-emerald-400 font-medium" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            {tab}
                          </button>
                        ))}
                        <button className="ml-1 w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                          <Filter className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {feedPosts.map((post, i) => (
                        <PostCard key={post.title} post={post} index={i} />
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button className="text-xs text-muted-foreground hover:text-foreground border border-white/8 hover:border-white/15 px-4 py-2 rounded-full transition-all">
                        Load more posts
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right sidebar — desktop only */}
                <aside className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">
                  {/* Activity */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="glass-card p-4"
                  >
                    <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-emerald-400" /> Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {activity.map((item, i) => {
                        const Icon = item.icon
                        return (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color === "emerald" ? "bg-emerald-500/10" : "bg-cyan-500/10"}`}>
                              <Icon className={`w-3 h-3 ${item.color === "emerald" ? "text-emerald-400" : "text-cyan-400"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-foreground leading-snug">{item.text}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>

                  {/* Trending startups */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="glass-card p-4"
                  >
                    <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Trending Startups
                    </h3>
                    <div className="space-y-2.5">
                      {trendingStartups.map((s) => (
                        <div key={s.rank} className="flex items-center gap-2.5 group cursor-pointer">
                          <span className="text-xs font-bold text-muted-foreground w-4">{s.rank}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground group-hover:text-emerald-400 transition-colors truncate">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground">{s.sector}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <ArrowUpRight className="w-3 h-3 text-emerald-400" />{s.votes}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Premium card */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-500/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-foreground">Go Pro</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      See who viewed your profile, get AI matching priority, and unlock deal rooms.
                    </p>
                    <button className="w-full text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2 rounded-lg transition-colors">
                      Upgrade — ₹399/mo
                    </button>
                  </motion.div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 border-t border-white/5 bg-[#080808]/95 backdrop-blur-xl z-40">
        {[
          { icon: LayoutDashboard, label: "Feed" },
          { icon: Compass, label: "Explore" },
          { icon: Users, label: "Community" },
          { icon: MessageSquare, label: "Messages" },
          { icon: User, label: "Profile" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex flex-col items-center gap-0.5 py-1 px-3 text-muted-foreground">
            <Icon className="w-5 h-5" />
            <span className="text-[9px]">{label}</span>
          </button>
        ))}
      </nav>

      {/* FAB */}
      <button className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black flex items-center justify-center shadow-lg glow-emerald-sm transition-all hover:scale-110 active:scale-95 z-40">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  )
}
