'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/app-layout'
import {
    Search, Send, ArrowLeft, Loader2, MessageSquare,
    CheckCheck, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    fetchConversations, fetchMessages, sendMessage,
    markMessagesAsRead, getCurrentUserId
} from '@/app/actions/messages'

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return ''
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function messageTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = any

export default function MessagingPage() {
    const [conversations, setConversations] = useState<DataRow[]>([])
    const [activeConvId, setActiveConvId] = useState<string | null>(null)
    const [messages, setMessages] = useState<DataRow[]>([])
    const [messageText, setMessageText] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [showMobileChat, setShowMobileChat] = useState(false)
    const [isLoadingConvs, setIsLoadingConvs] = useState(true)
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load conversations
    useEffect(() => {
        async function load() {
            setIsLoadingConvs(true)
            const [convResult, userId] = await Promise.all([
                fetchConversations(),
                getCurrentUserId(),
            ])
            setConversations(convResult.conversations)
            setCurrentUserId(userId)
            setIsLoadingConvs(false)
        }
        load()
    }, [])

    // Load messages when conversation changes
    const loadMessages = useCallback(async (convId: string) => {
        setIsLoadingMsgs(true)
        const { messages: msgs } = await fetchMessages(convId)
        setMessages(msgs)
        setIsLoadingMsgs(false)
        markMessagesAsRead(convId)
        // Scroll to bottom
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }, [])

    useEffect(() => {
        if (activeConvId) loadMessages(activeConvId)
    }, [activeConvId, loadMessages])

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!activeConvId) return
        const interval = setInterval(() => {
            loadMessages(activeConvId)
        }, 5000)
        return () => clearInterval(interval)
    }, [activeConvId, loadMessages])

    const handleSend = async () => {
        if (!messageText.trim() || !activeConvId || isSending) return
        setIsSending(true)
        const content = messageText.trim()
        setMessageText('')

        // Optimistic add
        const optimistic = {
            id: `temp-${Date.now()}`,
            conversation_id: activeConvId,
            sender_id: currentUserId,
            content,
            is_read: false,
            created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, optimistic])
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

        await sendMessage(activeConvId, content)
        setIsSending(false)
        // Refresh
        loadMessages(activeConvId)
    }

    const activeConv = conversations.find((c: DataRow) => c.id === activeConvId)

    const filteredConvs = searchQuery
        ? conversations.filter((c: DataRow) => c.other_participant?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        : conversations

    return (
        <AppLayout currentPage="messages">
            <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
                {/* Conversations List */}
                <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 border-r border-white/5 flex-col flex-shrink-0`}>
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-lg font-semibold text-foreground mb-3">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..."
                                className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {isLoadingConvs ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                            </div>
                        ) : filteredConvs.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery ? 'No conversations found' : 'No conversations yet. Visit a profile and click Message to start!'}
                                </p>
                            </div>
                        ) : (
                            filteredConvs.map((conv: DataRow) => (
                                <button key={conv.id}
                                    onClick={() => { setActiveConvId(conv.id); setShowMobileChat(true) }}
                                    className={`w-full flex items-start gap-3 p-4 text-left transition-all ${activeConvId === conv.id ? 'bg-white/5' : 'hover:bg-white/3'}`}>
                                    <div className="relative flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                            {conv.other_participant?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground truncate">{conv.other_participant?.full_name || 'User'}</span>
                                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{timeAgo(conv.last_message?.created_at || conv.created_at)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground capitalize">{conv.other_participant?.role?.replaceAll('_', ' ') || ''}</p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message?.content || 'No messages yet'}</p>
                                    </div>
                                    {conv.unread_count > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
                    {activeConv ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-white/5">
                                <button onClick={() => setShowMobileChat(false)} className="md:hidden text-muted-foreground"><ArrowLeft className="w-5 h-5" /></button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-foreground border border-white/10">
                                    {activeConv.other_participant?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{activeConv.other_participant?.full_name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{activeConv.other_participant?.role?.replaceAll('_', ' ') || ''}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                                {isLoadingMsgs ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-muted-foreground">No messages yet. Say hello! 👋</p>
                                    </div>
                                ) : (
                                    messages.map((msg: DataRow, i: number) => {
                                        const isMe = msg.sender_id === currentUserId
                                        return (
                                            <motion.div key={msg.id}
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] md:max-w-[65%] px-4 py-2.5 rounded-2xl ${isMe
                                                    ? 'bg-emerald-600 text-white rounded-br-md'
                                                    : 'bg-white/5 text-foreground border border-white/5 rounded-bl-md'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <span className={`text-xs ${isMe ? 'text-white/60' : 'text-muted-foreground'}`}>{messageTime(msg.created_at)}</span>
                                                        {isMe && (
                                                            msg.is_read ? <CheckCheck className="w-3.5 h-3.5 text-white/60" /> : <Check className="w-3.5 h-3.5 text-white/60" />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="px-4 md:px-6 py-3 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        placeholder="Type a message..."
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                                        className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={!messageText.trim() || isSending}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl w-10 h-10 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                            <MessageSquare className="w-12 h-12 text-muted-foreground/20" />
                            <p className="text-muted-foreground">Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
