// ═══════════════════════════════════════════════════════════════
// AUTO-GENERATED TYPES FROM SUPABASE SCHEMA
// These types match the database migration exactly.
// ═══════════════════════════════════════════════════════════════

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// ───────── ENUMS ─────────
export type UserRole = 'founder' | 'investor' | 'cofounder_seeker' | 'browser' | 'admin'
export type StartupStage = 'idea' | 'mvp' | 'early_traction' | 'growth' | 'scale'
export type FundingRoundType = 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c_plus' | 'convertible_note' | 'safe'
export type DealStatus = 'introduced' | 'in_discussion' | 'due_diligence' | 'term_sheet' | 'closed' | 'passed'
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected'
export type NotificationType = 'connection_request' | 'connection_accepted' | 'new_message' | 'post_upvoted' | 'post_commented' | 'comment_replied' | 'profile_viewed' | 'new_investor_in_sector' | 'deal_room_invite' | 'deal_room_update' | 'system'
export type PostType = 'discussion' | 'show_and_tell' | 'ask' | 'hiring'
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatusType = 'active' | 'cancelled' | 'expired' | 'past_due'
export type ReportReason = 'spam' | 'harassment' | 'misinformation' | 'inappropriate' | 'other'
export type ModerationStatus = 'pending' | 'approved' | 'rejected'
export type InvestmentOutcome = 'active' | 'exited' | 'acquired' | 'shut_down'
export type CommitmentLevel = 'full_time' | 'part_time' | 'weekends' | 'flexible'

// ───────── TABLE ROW TYPES ─────────

export interface Profile {
    id: string
    email: string
    full_name: string
    avatar_url: string | null
    role: UserRole
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

export interface FounderProfile {
    id: string
    user_id: string
    startup_name: string
    one_liner: string | null
    pitch: string | null
    sectors: string[]
    stage: StartupStage | null
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
    raising_round_type: FundingRoundType | null
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

export interface InvestorProfile {
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

export interface CofounderProfile {
    id: string
    user_id: string
    current_status: string | null
    skills: string[]
    looking_for_skills: string[]
    commitment: CommitmentLevel | null
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

export interface TeamMember {
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

export interface FundingRound {
    id: string
    founder_profile_id: string
    round_type: FundingRoundType
    amount: number
    date: string
    investors: string | null
    notes: string | null
    created_at: string
}

export interface PortfolioInvestment {
    id: string
    investor_profile_id: string
    startup_name: string
    year: number
    outcome: InvestmentOutcome
    notes: string | null
    created_at: string
}

export interface Community {
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

export interface CommunityMember {
    id: string
    community_id: string
    user_id: string
    role: string
    joined_at: string
}

export interface Post {
    id: string
    author_id: string
    community_id: string
    type: PostType
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

export interface PostVote {
    id: string
    post_id: string
    user_id: string
    vote: number
    created_at: string
}

export interface Comment {
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

export interface CommentVote {
    id: string
    comment_id: string
    user_id: string
    vote: number
    created_at: string
}

export interface SavedPost {
    id: string
    user_id: string
    post_id: string
    created_at: string
}

export interface Connection {
    id: string
    requester_id: string
    receiver_id: string
    status: ConnectionStatus
    created_at: string
    updated_at: string
}

export interface Conversation {
    id: string
    participant_one: string
    participant_two: string
    last_message_at: string | null
    created_at: string
}

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
}

export interface Notification {
    id: string
    user_id: string
    type: NotificationType
    title: string
    message: string | null
    link: string | null
    actor_id: string | null
    is_read: boolean
    created_at: string
}

export interface ProfileView {
    id: string
    viewed_profile_id: string
    viewer_id: string
    viewed_at: string
}

export interface MatchScore {
    id: string
    founder_id: string
    investor_id: string
    score: number
    factors: Json | null
    calculated_at: string
}

export interface DealRoom {
    id: string
    name: string
    startup_id: string
    investor_id: string
    founder_id: string
    status: DealStatus
    created_at: string
    updated_at: string
}

export interface DealRoomDocument {
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

export interface DealRoomNote {
    id: string
    deal_room_id: string
    author_id: string
    content: string
    created_at: string
    updated_at: string
}

export interface DealRoomActivity {
    id: string
    deal_room_id: string
    actor_id: string
    action: string
    details: string | null
    created_at: string
}

export interface Subscription {
    id: string
    user_id: string
    plan: SubscriptionPlan
    status: SubscriptionStatusType
    razorpay_subscription_id: string | null
    razorpay_customer_id: string | null
    current_period_start: string | null
    current_period_end: string | null
    cancel_at_period_end: boolean
    created_at: string
    updated_at: string
}

export interface Payment {
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

export interface Report {
    id: string
    reporter_id: string
    reported_user_id: string | null
    reported_post_id: string | null
    reported_comment_id: string | null
    reason: ReportReason
    description: string | null
    status: ModerationStatus
    reviewed_by: string | null
    reviewed_at: string | null
    created_at: string
}

export interface BlogPost {
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

export interface Syndicate {
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

export interface SyndicateMember {
    id: string
    syndicate_id: string
    investor_id: string
    committed_amount: number
    joined_at: string
}

export interface LegalTemplate {
    id: string
    title: string
    description: string | null
    content: string
    category: string
    is_premium: boolean
    download_count: number
    created_at: string
}

export interface NotificationPreferences {
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

export interface StartupUpdate {
    id: string
    founder_profile_id: string
    title: string
    content: string
    created_at: string
}

export interface NewsletterSubscriber {
    id: string
    email: string
    subscribed_at: string
}

// ───────── DATABASE TYPE (for Supabase client generic) ─────────

export interface Database {
    public: {
        Tables: {
            profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'id' | 'email' | 'full_name' | 'role'>; Update: Partial<Profile>; Relationships: [] }
            founder_profiles: { Row: FounderProfile; Insert: Partial<FounderProfile> & Pick<FounderProfile, 'user_id' | 'startup_name'>; Update: Partial<FounderProfile>; Relationships: [] }
            investor_profiles: { Row: InvestorProfile; Insert: Partial<InvestorProfile> & Pick<InvestorProfile, 'user_id'>; Update: Partial<InvestorProfile>; Relationships: [] }
            cofounder_profiles: { Row: CofounderProfile; Insert: Partial<CofounderProfile> & Pick<CofounderProfile, 'user_id'>; Update: Partial<CofounderProfile>; Relationships: [] }
            team_members: { Row: TeamMember; Insert: Partial<TeamMember> & Pick<TeamMember, 'founder_profile_id' | 'name' | 'role'>; Update: Partial<TeamMember>; Relationships: [] }
            funding_rounds: { Row: FundingRound; Insert: Partial<FundingRound> & Pick<FundingRound, 'founder_profile_id' | 'round_type' | 'amount' | 'date'>; Update: Partial<FundingRound>; Relationships: [] }
            portfolio_investments: { Row: PortfolioInvestment; Insert: Partial<PortfolioInvestment> & Pick<PortfolioInvestment, 'investor_profile_id' | 'startup_name' | 'year'>; Update: Partial<PortfolioInvestment>; Relationships: [] }
            communities: { Row: Community; Insert: Partial<Community> & Pick<Community, 'name' | 'slug'>; Update: Partial<Community>; Relationships: [] }
            community_members: { Row: CommunityMember; Insert: Partial<CommunityMember> & Pick<CommunityMember, 'community_id' | 'user_id'>; Update: Partial<CommunityMember>; Relationships: [] }
            posts: { Row: Post; Insert: Partial<Post> & Pick<Post, 'author_id' | 'community_id' | 'title'>; Update: Partial<Post>; Relationships: [] }
            post_votes: { Row: PostVote; Insert: Partial<PostVote> & Pick<PostVote, 'post_id' | 'user_id' | 'vote'>; Update: Partial<PostVote>; Relationships: [] }
            comments: { Row: Comment; Insert: Partial<Comment> & Pick<Comment, 'post_id' | 'author_id' | 'content'>; Update: Partial<Comment>; Relationships: [] }
            comment_votes: { Row: CommentVote; Insert: Partial<CommentVote> & Pick<CommentVote, 'comment_id' | 'user_id' | 'vote'>; Update: Partial<CommentVote>; Relationships: [] }
            saved_posts: { Row: SavedPost; Insert: Partial<SavedPost> & Pick<SavedPost, 'user_id' | 'post_id'>; Update: Partial<SavedPost>; Relationships: [] }
            connections: { Row: Connection; Insert: Partial<Connection> & Pick<Connection, 'requester_id' | 'receiver_id'>; Update: Partial<Connection>; Relationships: [] }
            conversations: { Row: Conversation; Insert: Partial<Conversation> & Pick<Conversation, 'participant_one' | 'participant_two'>; Update: Partial<Conversation>; Relationships: [] }
            messages: { Row: Message; Insert: Partial<Message> & Pick<Message, 'conversation_id' | 'sender_id' | 'content'>; Update: Partial<Message>; Relationships: [] }
            notifications: { Row: Notification; Insert: Partial<Notification> & Pick<Notification, 'user_id' | 'type' | 'title'>; Update: Partial<Notification>; Relationships: [] }
            profile_views: { Row: ProfileView; Insert: Partial<ProfileView> & Pick<ProfileView, 'viewed_profile_id' | 'viewer_id'>; Update: Partial<ProfileView>; Relationships: [] }
            match_scores: { Row: MatchScore; Insert: Partial<MatchScore> & Pick<MatchScore, 'founder_id' | 'investor_id' | 'score'>; Update: Partial<MatchScore>; Relationships: [] }
            deal_rooms: { Row: DealRoom; Insert: Partial<DealRoom> & Pick<DealRoom, 'name' | 'startup_id' | 'investor_id' | 'founder_id'>; Update: Partial<DealRoom>; Relationships: [] }
            deal_room_documents: { Row: DealRoomDocument; Insert: Partial<DealRoomDocument> & Pick<DealRoomDocument, 'deal_room_id' | 'uploaded_by' | 'file_name' | 'file_url'>; Update: Partial<DealRoomDocument>; Relationships: [] }
            deal_room_notes: { Row: DealRoomNote; Insert: Partial<DealRoomNote> & Pick<DealRoomNote, 'deal_room_id' | 'author_id' | 'content'>; Update: Partial<DealRoomNote>; Relationships: [] }
            deal_room_activity: { Row: DealRoomActivity; Insert: Partial<DealRoomActivity> & Pick<DealRoomActivity, 'deal_room_id' | 'actor_id' | 'action'>; Update: Partial<DealRoomActivity>; Relationships: [] }
            subscriptions: { Row: Subscription; Insert: Partial<Subscription> & Pick<Subscription, 'user_id'>; Update: Partial<Subscription>; Relationships: [] }
            payments: { Row: Payment; Insert: Partial<Payment> & Pick<Payment, 'user_id' | 'amount' | 'status'>; Update: Partial<Payment>; Relationships: [] }
            reports: { Row: Report; Insert: Partial<Report> & Pick<Report, 'reporter_id' | 'reason'>; Update: Partial<Report>; Relationships: [] }
            blog_posts: { Row: BlogPost; Insert: Partial<BlogPost> & Pick<BlogPost, 'author_id' | 'title' | 'slug' | 'content'>; Update: Partial<BlogPost>; Relationships: [] }
            syndicates: { Row: Syndicate; Insert: Partial<Syndicate> & Pick<Syndicate, 'lead_investor_id' | 'name' | 'target_amount' | 'min_commitment'>; Update: Partial<Syndicate>; Relationships: [] }
            syndicate_members: { Row: SyndicateMember; Insert: Partial<SyndicateMember> & Pick<SyndicateMember, 'syndicate_id' | 'investor_id' | 'committed_amount'>; Update: Partial<SyndicateMember>; Relationships: [] }
            legal_templates: { Row: LegalTemplate; Insert: Partial<LegalTemplate> & Pick<LegalTemplate, 'title' | 'content' | 'category'>; Update: Partial<LegalTemplate>; Relationships: [] }
            notification_preferences: { Row: NotificationPreferences; Insert: Partial<NotificationPreferences> & Pick<NotificationPreferences, 'user_id'>; Update: Partial<NotificationPreferences>; Relationships: [] }
            startup_updates: { Row: StartupUpdate; Insert: Partial<StartupUpdate> & Pick<StartupUpdate, 'founder_profile_id' | 'title' | 'content'>; Update: Partial<StartupUpdate>; Relationships: [] }
            newsletter_subscribers: { Row: NewsletterSubscriber; Insert: Partial<NewsletterSubscriber> & Pick<NewsletterSubscriber, 'email'>; Update: Partial<NewsletterSubscriber>; Relationships: [] }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: UserRole
            startup_stage: StartupStage
            funding_round_type: FundingRoundType
            deal_status: DealStatus
            connection_status: ConnectionStatus
            notification_type: NotificationType
            post_type: PostType
            subscription_plan: SubscriptionPlan
            subscription_status: SubscriptionStatusType
            report_reason: ReportReason
            moderation_status: ModerationStatus
            investment_outcome: InvestmentOutcome
            commitment_level: CommitmentLevel
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// ───────── JOINED TYPES (for queries with relations) ─────────

export interface PostWithAuthor extends Post {
    profiles: Profile
    communities: Community
    user_vote?: PostVote | null
}

export interface CommentWithAuthor extends Comment {
    profiles: Profile
    user_vote?: CommentVote | null
    replies?: CommentWithAuthor[]
}

export interface FounderProfileWithProfile extends FounderProfile {
    profiles: Profile
}

export interface InvestorProfileWithProfile extends InvestorProfile {
    profiles: Profile
}

export interface CofounderProfileWithProfile extends CofounderProfile {
    profiles: Profile
}

export interface ConversationWithParticipant extends Conversation {
    other_participant: Profile
    last_message?: Message | null
    unread_count: number
}

export interface NotificationWithActor extends Notification {
    actor?: Profile | null
}
