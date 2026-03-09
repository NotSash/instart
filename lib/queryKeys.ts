// ═══════════════════════════════════════════════════════════════
// TANSTACK QUERY KEY FACTORY
// Organized by domain for consistent cache invalidation.
// ═══════════════════════════════════════════════════════════════

export const queryKeys = {
    // ─── Auth ───
    auth: {
        session: ['auth', 'session'] as const,
        profile: ['auth', 'profile'] as const,
    },

    // ─── Posts / Feed ───
    posts: {
        all: ['posts'] as const,
        list: (sort: string, page: number) => ['posts', 'list', sort, page] as const,
        detail: (id: string) => ['posts', 'detail', id] as const,
        comments: (postId: string) => ['posts', 'comments', postId] as const,
        saved: ['posts', 'saved'] as const,
    },

    // ─── Profiles ───
    profiles: {
        all: ['profiles'] as const,
        startup: (id: string) => ['profiles', 'startup', id] as const,
        investor: (id: string) => ['profiles', 'investor', id] as const,
        cofounder: (id: string) => ['profiles', 'cofounder', id] as const,
        me: () => ['profiles', 'me'] as const,
        teamMembers: (fpId: string) => ['profiles', 'teamMembers', fpId] as const,
        fundingRounds: (fpId: string) => ['profiles', 'fundingRounds', fpId] as const,
        startupUpdates: (fpId: string) => ['profiles', 'startupUpdates', fpId] as const,
        viewers: () => ['profiles', 'viewers'] as const,
    },

    // ─── Explore ───
    explore: {
        startups: (filters: Record<string, unknown>) => ['explore', 'startups', filters] as const,
        investors: (filters: Record<string, unknown>) => ['explore', 'investors', filters] as const,
        cofounders: (filters: Record<string, unknown>) => ['explore', 'cofounders', filters] as const,
        globalSearch: (query: string) => ['explore', 'search', query] as const,
    },

    // ─── Connections ───
    connections: {
        all: ['connections'] as const,
        pending: ['connections', 'pending'] as const,
        status: (userId: string) => ['connections', 'status', userId] as const,
    },

    // ─── Messages ───
    messages: {
        conversations: () => ['messages', 'conversations'] as const,
        messages: (conversationId: string) => ['messages', 'chat', conversationId] as const,
        unreadCount: () => ['messages', 'unreadCount'] as const,
    },

    // ─── Communities ───
    communities: {
        all: ['communities'] as const,
        list: (category?: string) => ['communities', 'list', category] as const,
        detail: (slug: string) => ['communities', 'detail', slug] as const,
        posts: (communityId: string, sort: string) => ['communities', 'posts', communityId, sort] as const,
    },

    // ─── Notifications ───
    notifications: {
        all: ['notifications'] as const,
        list: (filter?: string) => ['notifications', 'list', filter] as const,
        unreadCount: () => ['notifications', 'unreadCount'] as const,
    },

    // ─── Blog ───
    blog: {
        all: ['blog'] as const,
        list: (category?: string) => ['blog', 'list', category] as const,
        detail: (slug: string) => ['blog', 'detail', slug] as const,
    },

    // ─── Deal Rooms ───
    dealRooms: {
        all: ['dealRooms'] as const,
        detail: (id: string) => ['dealRooms', 'detail', id] as const,
        documents: (id: string) => ['dealRooms', 'documents', id] as const,
        notes: (id: string) => ['dealRooms', 'notes', id] as const,
        activity: (id: string) => ['dealRooms', 'activity', id] as const,
    },

    // ─── Subscriptions & Payments ───
    subscriptions: {
        current: () => ['subscriptions', 'current'] as const,
        paymentHistory: () => ['subscriptions', 'payments'] as const,
    },

    // ─── AI ───
    ai: {
        matches: () => ['ai', 'matches'] as const,
        pitchAnalysis: (id: string) => ['ai', 'pitch', id] as const,
        healthScore: (id: string) => ['ai', 'healthScore', id] as const,
        governmentSchemes: () => ['ai', 'schemes'] as const,
    },

    // ─── Admin ───
    admin: {
        stats: () => ['admin', 'stats'] as const,
        users: (filters: Record<string, unknown>) => ['admin', 'users', filters] as const,
        reports: () => ['admin', 'reports'] as const,
        verifications: () => ['admin', 'verifications'] as const,
    },

    // ─── Syndicates ───
    syndicates: {
        all: ['syndicates'] as const,
        detail: (id: string) => ['syndicates', 'detail', id] as const,
        mine: () => ['syndicates', 'mine'] as const,
    },

    // ─── Legal Templates ───
    legalTemplates: {
        list: (category?: string) => ['legal', 'list', category] as const,
        detail: (id: string) => ['legal', 'detail', id] as const,
    },

    // ─── Landing ───
    landing: {
        stats: () => ['landing', 'stats'] as const,
    },
} as const
