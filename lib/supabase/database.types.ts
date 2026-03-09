// ═══════════════════════════════════════════════════════════════
// SUPABASE DATABASE TYPES
// Format matches supabase gen types typescript output exactly.
// ═══════════════════════════════════════════════════════════════

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    avatar_url: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    bio: string | null
                    city: string | null
                    phone: string | null
                    linkedin_url: string | null
                    website_url: string | null
                    is_premium: boolean
                    is_verified: boolean
                    is_onboarded: boolean
                    is_banned: boolean
                    preferred_language: string
                    last_seen_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    role: Database["public"]["Enums"]["user_role"]
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    phone?: string | null
                    linkedin_url?: string | null
                    website_url?: string | null
                    is_premium?: boolean
                    is_verified?: boolean
                    is_onboarded?: boolean
                    is_banned?: boolean
                    preferred_language?: string
                    last_seen_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    avatar_url?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    bio?: string | null
                    city?: string | null
                    phone?: string | null
                    linkedin_url?: string | null
                    website_url?: string | null
                    is_premium?: boolean
                    is_verified?: boolean
                    is_onboarded?: boolean
                    is_banned?: boolean
                    preferred_language?: string
                    last_seen_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            founder_profiles: {
                Row: {
                    id: string
                    user_id: string
                    startup_name: string
                    one_liner: string | null
                    pitch: string | null
                    sectors: string[]
                    stage: Database["public"]["Enums"]["startup_stage"] | null
                    website_url: string | null
                    logo_url: string | null
                    cover_image_url: string | null
                    monthly_revenue: number | null
                    total_users: number | null
                    monthly_growth_rate: number | null
                    runway_months: number | null
                    team_size: number | null
                    is_raising: boolean
                    raising_amount: number | null
                    raising_round_type: Database["public"]["Enums"]["funding_round_type"] | null
                    total_raised: number | null
                    pitch_deck_url: string | null
                    video_pitch_url: string | null
                    health_score: number | null
                    looking_for: string[]
                    additional_info: string | null
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    startup_name: string
                    one_liner?: string | null
                    pitch?: string | null
                    sectors?: string[]
                    stage?: Database["public"]["Enums"]["startup_stage"] | null
                    website_url?: string | null
                    logo_url?: string | null
                    cover_image_url?: string | null
                    monthly_revenue?: number | null
                    total_users?: number | null
                    monthly_growth_rate?: number | null
                    runway_months?: number | null
                    team_size?: number | null
                    is_raising?: boolean
                    raising_amount?: number | null
                    raising_round_type?: Database["public"]["Enums"]["funding_round_type"] | null
                    total_raised?: number | null
                    pitch_deck_url?: string | null
                    video_pitch_url?: string | null
                    health_score?: number | null
                    looking_for?: string[]
                    additional_info?: string | null
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    startup_name?: string
                    one_liner?: string | null
                    pitch?: string | null
                    sectors?: string[]
                    stage?: Database["public"]["Enums"]["startup_stage"] | null
                    website_url?: string | null
                    logo_url?: string | null
                    cover_image_url?: string | null
                    monthly_revenue?: number | null
                    total_users?: number | null
                    monthly_growth_rate?: number | null
                    runway_months?: number | null
                    team_size?: number | null
                    is_raising?: boolean
                    raising_amount?: number | null
                    raising_round_type?: Database["public"]["Enums"]["funding_round_type"] | null
                    total_raised?: number | null
                    pitch_deck_url?: string | null
                    video_pitch_url?: string | null
                    health_score?: number | null
                    looking_for?: string[]
                    additional_info?: string | null
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            investor_profiles: {
                Row: {
                    id: string
                    user_id: string
                    professional_title: string | null
                    sectors_of_interest: string[]
                    preferred_stages: string[]
                    min_check_size: number | null
                    max_check_size: number | null
                    total_investments: number
                    investment_thesis: string | null
                    is_actively_investing: boolean
                    open_to_syndicate: boolean
                    open_to_mentoring: boolean
                    verified_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    professional_title?: string | null
                    sectors_of_interest?: string[]
                    preferred_stages?: string[]
                    min_check_size?: number | null
                    max_check_size?: number | null
                    total_investments?: number
                    investment_thesis?: string | null
                    is_actively_investing?: boolean
                    open_to_syndicate?: boolean
                    open_to_mentoring?: boolean
                    verified_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    professional_title?: string | null
                    sectors_of_interest?: string[]
                    preferred_stages?: string[]
                    min_check_size?: number | null
                    max_check_size?: number | null
                    total_investments?: number
                    investment_thesis?: string | null
                    is_actively_investing?: boolean
                    open_to_syndicate?: boolean
                    open_to_mentoring?: boolean
                    verified_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            cofounder_profiles: {
                Row: {
                    id: string
                    user_id: string
                    current_status: string | null
                    skills: string[]
                    looking_for_skills: string[]
                    commitment: Database["public"]["Enums"]["commitment_level"] | null
                    has_idea: boolean
                    idea_description: string | null
                    preferred_sectors: string[]
                    preferred_cities: string[]
                    remote_ok: boolean
                    equity_expectation: string | null
                    experience_description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    current_status?: string | null
                    skills?: string[]
                    looking_for_skills?: string[]
                    commitment?: Database["public"]["Enums"]["commitment_level"] | null
                    has_idea?: boolean
                    idea_description?: string | null
                    preferred_sectors?: string[]
                    preferred_cities?: string[]
                    remote_ok?: boolean
                    equity_expectation?: string | null
                    experience_description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    current_status?: string | null
                    skills?: string[]
                    looking_for_skills?: string[]
                    commitment?: Database["public"]["Enums"]["commitment_level"] | null
                    has_idea?: boolean
                    idea_description?: string | null
                    preferred_sectors?: string[]
                    preferred_cities?: string[]
                    remote_ok?: boolean
                    equity_expectation?: string | null
                    experience_description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            team_members: {
                Row: {
                    id: string
                    founder_profile_id: string
                    name: string
                    role: string
                    bio: string | null
                    avatar_url: string | null
                    linkedin_url: string | null
                    joined_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    founder_profile_id: string
                    name: string
                    role: string
                    bio?: string | null
                    avatar_url?: string | null
                    linkedin_url?: string | null
                    joined_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    founder_profile_id?: string
                    name?: string
                    role?: string
                    bio?: string | null
                    avatar_url?: string | null
                    linkedin_url?: string | null
                    joined_at?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            funding_rounds: {
                Row: {
                    id: string
                    founder_profile_id: string
                    round_type: Database["public"]["Enums"]["funding_round_type"]
                    amount: number
                    date: string
                    investors: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    founder_profile_id: string
                    round_type: Database["public"]["Enums"]["funding_round_type"]
                    amount: number
                    date: string
                    investors?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    founder_profile_id?: string
                    round_type?: Database["public"]["Enums"]["funding_round_type"]
                    amount?: number
                    date?: string
                    investors?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            portfolio_investments: {
                Row: {
                    id: string
                    investor_profile_id: string
                    startup_name: string
                    year: number
                    outcome: Database["public"]["Enums"]["investment_outcome"]
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    investor_profile_id: string
                    startup_name: string
                    year: number
                    outcome?: Database["public"]["Enums"]["investment_outcome"]
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    investor_profile_id?: string
                    startup_name?: string
                    year?: number
                    outcome?: Database["public"]["Enums"]["investment_outcome"]
                    notes?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            communities: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon_url: string | null
                    category: string | null
                    rules: string | null
                    member_count: number
                    is_default: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon_url?: string | null
                    category?: string | null
                    rules?: string | null
                    member_count?: number
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon_url?: string | null
                    category?: string | null
                    rules?: string | null
                    member_count?: number
                    is_default?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            community_members: {
                Row: {
                    id: string
                    community_id: string
                    user_id: string
                    role: string
                    joined_at: string
                }
                Insert: {
                    id?: string
                    community_id: string
                    user_id: string
                    role?: string
                    joined_at?: string
                }
                Update: {
                    id?: string
                    community_id?: string
                    user_id?: string
                    role?: string
                    joined_at?: string
                }
                Relationships: []
            }
            posts: {
                Row: {
                    id: string
                    author_id: string
                    community_id: string
                    type: Database["public"]["Enums"]["post_type"]
                    title: string
                    content: string | null
                    image_url: string | null
                    upvotes: number
                    downvotes: number
                    comment_count: number
                    is_pinned: boolean
                    is_removed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    author_id: string
                    community_id: string
                    type?: Database["public"]["Enums"]["post_type"]
                    title: string
                    content?: string | null
                    image_url?: string | null
                    upvotes?: number
                    downvotes?: number
                    comment_count?: number
                    is_pinned?: boolean
                    is_removed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    author_id?: string
                    community_id?: string
                    type?: Database["public"]["Enums"]["post_type"]
                    title?: string
                    content?: string | null
                    image_url?: string | null
                    upvotes?: number
                    downvotes?: number
                    comment_count?: number
                    is_pinned?: boolean
                    is_removed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            post_votes: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                    vote: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                    vote: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                    vote?: number
                    created_at?: string
                }
                Relationships: []
            }
            comments: {
                Row: {
                    id: string
                    post_id: string
                    author_id: string
                    parent_comment_id: string | null
                    content: string
                    upvotes: number
                    downvotes: number
                    is_removed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    author_id: string
                    parent_comment_id?: string | null
                    content: string
                    upvotes?: number
                    downvotes?: number
                    is_removed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    author_id?: string
                    parent_comment_id?: string | null
                    content?: string
                    upvotes?: number
                    downvotes?: number
                    is_removed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            comment_votes: {
                Row: {
                    id: string
                    comment_id: string
                    user_id: string
                    vote: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    comment_id: string
                    user_id: string
                    vote: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    comment_id?: string
                    user_id?: string
                    vote?: number
                    created_at?: string
                }
                Relationships: []
            }
            saved_posts: {
                Row: {
                    id: string
                    user_id: string
                    post_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    post_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    post_id?: string
                    created_at?: string
                }
                Relationships: []
            }
            connections: {
                Row: {
                    id: string
                    requester_id: string
                    receiver_id: string
                    status: Database["public"]["Enums"]["connection_status"]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    requester_id: string
                    receiver_id: string
                    status?: Database["public"]["Enums"]["connection_status"]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    requester_id?: string
                    receiver_id?: string
                    status?: Database["public"]["Enums"]["connection_status"]
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            conversations: {
                Row: {
                    id: string
                    participant_one: string
                    participant_two: string
                    last_message_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    participant_one: string
                    participant_two: string
                    last_message_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    participant_one?: string
                    participant_two?: string
                    last_message_at?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            messages: {
                Row: {
                    id: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    sender_id?: string
                    content?: string
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: Database["public"]["Enums"]["notification_type"]
                    title: string
                    message: string | null
                    link: string | null
                    actor_id: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: Database["public"]["Enums"]["notification_type"]
                    title: string
                    message?: string | null
                    link?: string | null
                    actor_id?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: Database["public"]["Enums"]["notification_type"]
                    title?: string
                    message?: string | null
                    link?: string | null
                    actor_id?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            profile_views: {
                Row: {
                    id: string
                    viewed_profile_id: string
                    viewer_id: string
                    viewed_at: string
                }
                Insert: {
                    id?: string
                    viewed_profile_id: string
                    viewer_id: string
                    viewed_at?: string
                }
                Update: {
                    id?: string
                    viewed_profile_id?: string
                    viewer_id?: string
                    viewed_at?: string
                }
                Relationships: []
            }
            match_scores: {
                Row: {
                    id: string
                    founder_id: string
                    investor_id: string
                    score: number
                    factors: Json | null
                    calculated_at: string
                }
                Insert: {
                    id?: string
                    founder_id: string
                    investor_id: string
                    score: number
                    factors?: Json | null
                    calculated_at?: string
                }
                Update: {
                    id?: string
                    founder_id?: string
                    investor_id?: string
                    score?: number
                    factors?: Json | null
                    calculated_at?: string
                }
                Relationships: []
            }
            deal_rooms: {
                Row: {
                    id: string
                    name: string
                    startup_id: string
                    investor_id: string
                    founder_id: string
                    status: Database["public"]["Enums"]["deal_status"]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    startup_id: string
                    investor_id: string
                    founder_id: string
                    status?: Database["public"]["Enums"]["deal_status"]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    startup_id?: string
                    investor_id?: string
                    founder_id?: string
                    status?: Database["public"]["Enums"]["deal_status"]
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            deal_room_documents: {
                Row: {
                    id: string
                    deal_room_id: string
                    uploaded_by: string
                    file_name: string
                    file_url: string
                    file_type: string | null
                    folder: string
                    view_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    deal_room_id: string
                    uploaded_by: string
                    file_name: string
                    file_url: string
                    file_type?: string | null
                    folder?: string
                    view_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    deal_room_id?: string
                    uploaded_by?: string
                    file_name?: string
                    file_url?: string
                    file_type?: string | null
                    folder?: string
                    view_count?: number
                    created_at?: string
                }
                Relationships: []
            }
            deal_room_notes: {
                Row: {
                    id: string
                    deal_room_id: string
                    author_id: string
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    deal_room_id: string
                    author_id: string
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    deal_room_id?: string
                    author_id?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            deal_room_activity: {
                Row: {
                    id: string
                    deal_room_id: string
                    actor_id: string
                    action: string
                    details: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    deal_room_id: string
                    actor_id: string
                    action: string
                    details?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    deal_room_id?: string
                    actor_id?: string
                    action?: string
                    details?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    plan: Database["public"]["Enums"]["subscription_plan"]
                    status: Database["public"]["Enums"]["subscription_status"]
                    razorpay_subscription_id: string | null
                    razorpay_customer_id: string | null
                    current_period_start: string | null
                    current_period_end: string | null
                    cancel_at_period_end: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    plan?: Database["public"]["Enums"]["subscription_plan"]
                    status?: Database["public"]["Enums"]["subscription_status"]
                    razorpay_subscription_id?: string | null
                    razorpay_customer_id?: string | null
                    current_period_start?: string | null
                    current_period_end?: string | null
                    cancel_at_period_end?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    plan?: Database["public"]["Enums"]["subscription_plan"]
                    status?: Database["public"]["Enums"]["subscription_status"]
                    razorpay_subscription_id?: string | null
                    razorpay_customer_id?: string | null
                    current_period_start?: string | null
                    current_period_end?: string | null
                    cancel_at_period_end?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            payments: {
                Row: {
                    id: string
                    user_id: string
                    subscription_id: string | null
                    razorpay_payment_id: string | null
                    amount: number
                    currency: string
                    status: string
                    receipt_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    subscription_id?: string | null
                    razorpay_payment_id?: string | null
                    amount: number
                    currency?: string
                    status: string
                    receipt_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    subscription_id?: string | null
                    razorpay_payment_id?: string | null
                    amount?: number
                    currency?: string
                    status?: string
                    receipt_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            reports: {
                Row: {
                    id: string
                    reporter_id: string
                    reported_user_id: string | null
                    reported_post_id: string | null
                    reported_comment_id: string | null
                    reason: Database["public"]["Enums"]["report_reason"]
                    description: string | null
                    status: Database["public"]["Enums"]["moderation_status"]
                    reviewed_by: string | null
                    reviewed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    reporter_id: string
                    reported_user_id?: string | null
                    reported_post_id?: string | null
                    reported_comment_id?: string | null
                    reason: Database["public"]["Enums"]["report_reason"]
                    description?: string | null
                    status?: Database["public"]["Enums"]["moderation_status"]
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    reporter_id?: string
                    reported_user_id?: string | null
                    reported_post_id?: string | null
                    reported_comment_id?: string | null
                    reason?: Database["public"]["Enums"]["report_reason"]
                    description?: string | null
                    status?: Database["public"]["Enums"]["moderation_status"]
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            blog_posts: {
                Row: {
                    id: string
                    author_id: string
                    title: string
                    slug: string
                    content: string
                    excerpt: string | null
                    cover_image_url: string | null
                    category: string | null
                    is_published: boolean
                    published_at: string | null
                    reading_time_minutes: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    author_id: string
                    title: string
                    slug: string
                    content: string
                    excerpt?: string | null
                    cover_image_url?: string | null
                    category?: string | null
                    is_published?: boolean
                    published_at?: string | null
                    reading_time_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    author_id?: string
                    title?: string
                    slug?: string
                    content?: string
                    excerpt?: string | null
                    cover_image_url?: string | null
                    category?: string | null
                    is_published?: boolean
                    published_at?: string | null
                    reading_time_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            syndicates: {
                Row: {
                    id: string
                    lead_investor_id: string
                    startup_id: string | null
                    name: string
                    description: string | null
                    target_amount: number
                    current_amount: number
                    min_commitment: number
                    is_open: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    lead_investor_id: string
                    startup_id?: string | null
                    name: string
                    description?: string | null
                    target_amount: number
                    current_amount?: number
                    min_commitment: number
                    is_open?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    lead_investor_id?: string
                    startup_id?: string | null
                    name?: string
                    description?: string | null
                    target_amount?: number
                    current_amount?: number
                    min_commitment?: number
                    is_open?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            syndicate_members: {
                Row: {
                    id: string
                    syndicate_id: string
                    investor_id: string
                    committed_amount: number
                    joined_at: string
                }
                Insert: {
                    id?: string
                    syndicate_id: string
                    investor_id: string
                    committed_amount: number
                    joined_at?: string
                }
                Update: {
                    id?: string
                    syndicate_id?: string
                    investor_id?: string
                    committed_amount?: number
                    joined_at?: string
                }
                Relationships: []
            }
            legal_templates: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    content: string
                    category: string
                    is_premium: boolean
                    download_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    content: string
                    category: string
                    is_premium?: boolean
                    download_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    content?: string
                    category?: string
                    is_premium?: boolean
                    download_count?: number
                    created_at?: string
                }
                Relationships: []
            }
            notification_preferences: {
                Row: {
                    id: string
                    user_id: string
                    email_enabled: boolean
                    email_weekly_digest: boolean
                    email_connections: boolean
                    email_messages: boolean
                    email_post_activity: boolean
                    email_profile_views: boolean
                    push_enabled: boolean
                    push_connections: boolean
                    push_messages: boolean
                    push_post_activity: boolean
                    whatsapp_enabled: boolean
                    whatsapp_phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    email_enabled?: boolean
                    email_weekly_digest?: boolean
                    email_connections?: boolean
                    email_messages?: boolean
                    email_post_activity?: boolean
                    email_profile_views?: boolean
                    push_enabled?: boolean
                    push_connections?: boolean
                    push_messages?: boolean
                    push_post_activity?: boolean
                    whatsapp_enabled?: boolean
                    whatsapp_phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    email_enabled?: boolean
                    email_weekly_digest?: boolean
                    email_connections?: boolean
                    email_messages?: boolean
                    email_post_activity?: boolean
                    email_profile_views?: boolean
                    push_enabled?: boolean
                    push_connections?: boolean
                    push_messages?: boolean
                    push_post_activity?: boolean
                    whatsapp_enabled?: boolean
                    whatsapp_phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            startup_updates: {
                Row: {
                    id: string
                    founder_profile_id: string
                    title: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    founder_profile_id: string
                    title: string
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    founder_profile_id?: string
                    title?: string
                    content?: string
                    created_at?: string
                }
                Relationships: []
            }
            newsletter_subscribers: {
                Row: {
                    id: string
                    email: string
                    subscribed_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    subscribed_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    subscribed_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: "founder" | "investor" | "cofounder_seeker" | "browser" | "admin"
            startup_stage: "idea" | "mvp" | "early_traction" | "growth" | "scale"
            funding_round_type: "pre_seed" | "seed" | "series_a" | "series_b" | "series_c_plus" | "convertible_note" | "safe"
            deal_status: "introduced" | "in_discussion" | "due_diligence" | "term_sheet" | "closed" | "passed"
            connection_status: "pending" | "accepted" | "rejected"
            notification_type: "connection_request" | "connection_accepted" | "new_message" | "post_upvoted" | "post_commented" | "comment_replied" | "profile_viewed" | "new_investor_in_sector" | "deal_room_invite" | "deal_room_update" | "system"
            post_type: "discussion" | "show_and_tell" | "ask" | "hiring"
            subscription_plan: "free" | "pro" | "enterprise"
            subscription_status: "active" | "cancelled" | "expired" | "past_due"
            report_reason: "spam" | "harassment" | "misinformation" | "inappropriate" | "other"
            moderation_status: "pending" | "approved" | "rejected"
            investment_outcome: "active" | "exited" | "acquired" | "shut_down"
            commitment_level: "full_time" | "part_time" | "weekends" | "flexible"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// ───────── CONVENIENCE TYPE ALIASES ─────────

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
