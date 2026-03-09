  -- ═══════════════════════════════════════════════════════════════
  -- INSTART — COMPLETE DATABASE MIGRATION
  -- Run this in the Supabase SQL Editor
  -- ═══════════════════════════════════════════════════════════════

  -- ───────── ENUMS ─────────

  CREATE TYPE user_role AS ENUM ('founder', 'investor', 'cofounder_seeker', 'admin');
  CREATE TYPE startup_stage AS ENUM ('idea', 'mvp', 'early_traction', 'growth', 'scale');
  CREATE TYPE funding_round_type AS ENUM ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c_plus', 'convertible_note', 'safe');
  CREATE TYPE deal_status AS ENUM ('introduced', 'in_discussion', 'due_diligence', 'term_sheet', 'closed', 'passed');
  CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
  CREATE TYPE notification_type AS ENUM (
    'connection_request', 'connection_accepted', 'new_message',
    'post_upvoted', 'post_commented', 'comment_replied',
    'profile_viewed', 'new_investor_in_sector', 'deal_room_invite',
    'deal_room_update', 'system'
  );
  CREATE TYPE post_type AS ENUM ('discussion', 'show_and_tell', 'ask', 'hiring');
  CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'past_due');
  CREATE TYPE report_reason AS ENUM ('spam', 'harassment', 'misinformation', 'inappropriate', 'other');
  CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');
  CREATE TYPE investment_outcome AS ENUM ('active', 'exited', 'acquired', 'shut_down');
  CREATE TYPE commitment_level AS ENUM ('full_time', 'part_time', 'weekends', 'flexible');

  -- ───────── TABLES ─────────

  -- profiles
  CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    avatar_url text,
    role user_role NOT NULL,
    bio text,
    city text,
    phone text,
    linkedin_url text,
    website_url text,
    is_premium boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    is_onboarded boolean DEFAULT false,
    is_banned boolean DEFAULT false,
    preferred_language text DEFAULT 'en',
    last_seen_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- founder_profiles
  CREATE TABLE founder_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE UNIQUE NOT NULL,
    startup_name text NOT NULL,
    one_liner text,
    pitch text,
    sectors text[] DEFAULT '{}',
    stage startup_stage,
    website_url text,
    logo_url text,
    cover_image_url text,
    monthly_revenue bigint,
    total_users integer,
    monthly_growth_rate decimal,
    runway_months integer,
    team_size integer,
    is_raising boolean DEFAULT false,
    raising_amount bigint,
    raising_round_type funding_round_type,
    total_raised bigint,
    pitch_deck_url text,
    video_pitch_url text,
    health_score integer,
    looking_for text[] DEFAULT '{}',
    additional_info text,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- investor_profiles
  CREATE TABLE investor_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE UNIQUE NOT NULL,
    professional_title text,
    sectors_of_interest text[] DEFAULT '{}',
    preferred_stages text[] DEFAULT '{}',
    min_check_size bigint,
    max_check_size bigint,
    total_investments integer DEFAULT 0,
    investment_thesis text,
    is_actively_investing boolean DEFAULT true,
    open_to_syndicate boolean DEFAULT false,
    open_to_mentoring boolean DEFAULT false,
    verified_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- cofounder_profiles
  CREATE TABLE cofounder_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE UNIQUE NOT NULL,
    current_status text,
    skills text[] DEFAULT '{}',
    looking_for_skills text[] DEFAULT '{}',
    commitment commitment_level,
    has_idea boolean DEFAULT false,
    idea_description text,
    preferred_sectors text[] DEFAULT '{}',
    preferred_cities text[] DEFAULT '{}',
    remote_ok boolean DEFAULT true,
    equity_expectation text,
    experience_description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- team_members
  CREATE TABLE team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_profile_id uuid REFERENCES founder_profiles ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    bio text,
    avatar_url text,
    linkedin_url text,
    joined_at date,
    created_at timestamptz DEFAULT now()
  );

  -- funding_rounds
  CREATE TABLE funding_rounds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_profile_id uuid REFERENCES founder_profiles ON DELETE CASCADE NOT NULL,
    round_type funding_round_type NOT NULL,
    amount bigint NOT NULL,
    date date NOT NULL,
    investors text,
    notes text,
    created_at timestamptz DEFAULT now()
  );

  -- portfolio_investments
  CREATE TABLE portfolio_investments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_profile_id uuid REFERENCES investor_profiles ON DELETE CASCADE NOT NULL,
    startup_name text NOT NULL,
    year integer NOT NULL,
    outcome investment_outcome DEFAULT 'active',
    notes text,
    created_at timestamptz DEFAULT now()
  );

  -- communities
  CREATE TABLE communities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    icon_url text,
    category text,
    rules text,
    member_count integer DEFAULT 0,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- community_members
  CREATE TABLE community_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES communities ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    role text DEFAULT 'member',
    joined_at timestamptz DEFAULT now(),
    UNIQUE (community_id, user_id)
  );

  -- posts
  CREATE TABLE posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    community_id uuid REFERENCES communities ON DELETE CASCADE NOT NULL,
    type post_type DEFAULT 'discussion',
    title text NOT NULL,
    content text,
    image_url text,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    is_pinned boolean DEFAULT false,
    is_removed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- post_votes
  CREATE TABLE post_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    vote smallint NOT NULL CHECK (vote IN (1, -1)),
    created_at timestamptz DEFAULT now(),
    UNIQUE (post_id, user_id)
  );

  -- comments
  CREATE TABLE comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts ON DELETE CASCADE NOT NULL,
    author_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    parent_comment_id uuid REFERENCES comments ON DELETE CASCADE,
    content text NOT NULL,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    is_removed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- comment_votes
  CREATE TABLE comment_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id uuid REFERENCES comments ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    vote smallint NOT NULL CHECK (vote IN (1, -1)),
    created_at timestamptz DEFAULT now(),
    UNIQUE (comment_id, user_id)
  );

  -- saved_posts
  CREATE TABLE saved_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    post_id uuid REFERENCES posts ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, post_id)
  );

  -- connections
  CREATE TABLE connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    receiver_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    status connection_status DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (requester_id, receiver_id)
  );

  -- conversations
  CREATE TABLE conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_one uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    participant_two uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    last_message_at timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE (participant_one, participant_two)
  );

  -- messages
  CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );

  -- notifications
  CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title text NOT NULL,
    message text,
    link text,
    actor_id uuid REFERENCES profiles ON DELETE SET NULL,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );

  -- profile_views
  CREATE TABLE profile_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    viewed_profile_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    viewer_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    viewed_at timestamptz DEFAULT now(),
    viewed_date date DEFAULT CURRENT_DATE NOT NULL,
    UNIQUE (viewed_profile_id, viewer_id, viewed_date)
  );

  -- match_scores
  CREATE TABLE match_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    investor_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    score integer NOT NULL CHECK (score >= 0 AND score <= 100),
    factors jsonb,
    calculated_at timestamptz DEFAULT now(),
    UNIQUE (founder_id, investor_id)
  );

  -- deal_rooms
  CREATE TABLE deal_rooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    startup_id uuid REFERENCES founder_profiles ON DELETE CASCADE NOT NULL,
    investor_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    founder_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    status deal_status DEFAULT 'introduced',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- deal_room_documents
  CREATE TABLE deal_room_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_room_id uuid REFERENCES deal_rooms ON DELETE CASCADE NOT NULL,
    uploaded_by uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    folder text DEFAULT 'General',
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );

  -- deal_room_notes
  CREATE TABLE deal_room_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_room_id uuid REFERENCES deal_rooms ON DELETE CASCADE NOT NULL,
    author_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- deal_room_activity
  CREATE TABLE deal_room_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_room_id uuid REFERENCES deal_rooms ON DELETE CASCADE NOT NULL,
    actor_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    action text NOT NULL,
    details text,
    created_at timestamptz DEFAULT now()
  );

  -- subscriptions
  CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE UNIQUE NOT NULL,
    plan subscription_plan DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    razorpay_subscription_id text,
    razorpay_customer_id text,
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- payments
  CREATE TABLE payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    subscription_id uuid REFERENCES subscriptions ON DELETE SET NULL,
    razorpay_payment_id text,
    amount bigint NOT NULL,
    currency text DEFAULT 'INR',
    status text NOT NULL,
    receipt_url text,
    created_at timestamptz DEFAULT now()
  );

  -- reports
  CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    reported_user_id uuid REFERENCES profiles ON DELETE SET NULL,
    reported_post_id uuid REFERENCES posts ON DELETE SET NULL,
    reported_comment_id uuid REFERENCES comments ON DELETE SET NULL,
    reason report_reason NOT NULL,
    description text,
    status moderation_status DEFAULT 'pending',
    reviewed_by uuid REFERENCES profiles ON DELETE SET NULL,
    reviewed_at timestamptz,
    created_at timestamptz DEFAULT now()
  );

  -- blog_posts
  CREATE TABLE blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text NOT NULL,
    excerpt text,
    cover_image_url text,
    category text,
    is_published boolean DEFAULT false,
    published_at timestamptz,
    reading_time_minutes integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- syndicates
  CREATE TABLE syndicates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_investor_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    startup_id uuid REFERENCES founder_profiles ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    target_amount bigint NOT NULL,
    current_amount bigint DEFAULT 0,
    min_commitment bigint NOT NULL,
    is_open boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- syndicate_members
  CREATE TABLE syndicate_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    syndicate_id uuid REFERENCES syndicates ON DELETE CASCADE NOT NULL,
    investor_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
    committed_amount bigint NOT NULL,
    joined_at timestamptz DEFAULT now(),
    UNIQUE (syndicate_id, investor_id)
  );

  -- legal_templates
  CREATE TABLE legal_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    content text NOT NULL,
    category text NOT NULL,
    is_premium boolean DEFAULT false,
    download_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );

  -- notification_preferences
  CREATE TABLE notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles ON DELETE CASCADE UNIQUE NOT NULL,
    email_enabled boolean DEFAULT true,
    email_weekly_digest boolean DEFAULT true,
    email_connections boolean DEFAULT true,
    email_messages boolean DEFAULT true,
    email_post_activity boolean DEFAULT true,
    email_profile_views boolean DEFAULT true,
    push_enabled boolean DEFAULT true,
    push_connections boolean DEFAULT true,
    push_messages boolean DEFAULT true,
    push_post_activity boolean DEFAULT true,
    whatsapp_enabled boolean DEFAULT false,
    whatsapp_phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- startup_updates
  CREATE TABLE startup_updates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_profile_id uuid REFERENCES founder_profiles ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  -- newsletter_subscribers
  CREATE TABLE newsletter_subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    subscribed_at timestamptz DEFAULT now()
  );


  -- ───────── INDEXES ─────────

  -- Foreign key indexes
  CREATE INDEX idx_founder_profiles_user_id ON founder_profiles(user_id);
  CREATE INDEX idx_investor_profiles_user_id ON investor_profiles(user_id);
  CREATE INDEX idx_cofounder_profiles_user_id ON cofounder_profiles(user_id);
  CREATE INDEX idx_team_members_founder_profile_id ON team_members(founder_profile_id);
  CREATE INDEX idx_funding_rounds_founder_profile_id ON funding_rounds(founder_profile_id);
  CREATE INDEX idx_portfolio_investments_investor_profile_id ON portfolio_investments(investor_profile_id);
  CREATE INDEX idx_community_members_community_id ON community_members(community_id);
  CREATE INDEX idx_community_members_user_id ON community_members(user_id);
  CREATE INDEX idx_posts_author_id ON posts(author_id);
  CREATE INDEX idx_posts_community_id ON posts(community_id);
  CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
  CREATE INDEX idx_post_votes_post_id ON post_votes(post_id);
  CREATE INDEX idx_post_votes_user_id ON post_votes(user_id);
  CREATE INDEX idx_comments_post_id ON comments(post_id);
  CREATE INDEX idx_comments_author_id ON comments(author_id);
  CREATE INDEX idx_comment_votes_comment_id ON comment_votes(comment_id);
  CREATE INDEX idx_comment_votes_user_id ON comment_votes(user_id);
  CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
  CREATE INDEX idx_connections_requester_id ON connections(requester_id);
  CREATE INDEX idx_connections_receiver_id ON connections(receiver_id);
  CREATE INDEX idx_conversations_participant_one ON conversations(participant_one);
  CREATE INDEX idx_conversations_participant_two ON conversations(participant_two);
  CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
  CREATE INDEX idx_messages_created_at ON messages(created_at);
  CREATE INDEX idx_messages_sender_id ON messages(sender_id);
  CREATE INDEX idx_notifications_user_id ON notifications(user_id);
  CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
  CREATE INDEX idx_profile_views_viewed_profile_id ON profile_views(viewed_profile_id);
  CREATE INDEX idx_profile_views_viewer_id ON profile_views(viewer_id);
  CREATE INDEX idx_match_scores_founder_id ON match_scores(founder_id);
  CREATE INDEX idx_match_scores_investor_id ON match_scores(investor_id);
  CREATE INDEX idx_deal_rooms_startup_id ON deal_rooms(startup_id);
  CREATE INDEX idx_deal_rooms_investor_id ON deal_rooms(investor_id);
  CREATE INDEX idx_deal_rooms_founder_id ON deal_rooms(founder_id);
  CREATE INDEX idx_deal_room_documents_deal_room_id ON deal_room_documents(deal_room_id);
  CREATE INDEX idx_deal_room_notes_deal_room_id ON deal_room_notes(deal_room_id);
  CREATE INDEX idx_deal_room_activity_deal_room_id ON deal_room_activity(deal_room_id);
  CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
  CREATE INDEX idx_payments_user_id ON payments(user_id);
  CREATE INDEX idx_reports_status ON reports(status);
  CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
  CREATE INDEX idx_communities_slug ON communities(slug);
  CREATE INDEX idx_syndicates_lead_investor_id ON syndicates(lead_investor_id);
  CREATE INDEX idx_syndicate_members_syndicate_id ON syndicate_members(syndicate_id);
  CREATE INDEX idx_startup_updates_founder_profile_id ON startup_updates(founder_profile_id);

  -- Role and premium indexes
  CREATE INDEX idx_profiles_role ON profiles(role);
  CREATE INDEX idx_profiles_is_premium ON profiles(is_premium);

  -- GIN indexes for array containment
  CREATE INDEX idx_founder_profiles_sectors ON founder_profiles USING GIN (sectors);
  CREATE INDEX idx_investor_profiles_sectors ON investor_profiles USING GIN (sectors_of_interest);
  CREATE INDEX idx_cofounder_profiles_skills ON cofounder_profiles USING GIN (skills);
  CREATE INDEX idx_cofounder_profiles_looking_for_skills ON cofounder_profiles USING GIN (looking_for_skills);

  -- Full-text search on posts
  CREATE INDEX idx_posts_fts ON posts USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));


  -- ───────── ROW LEVEL SECURITY ─────────

  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cofounder_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
  ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
  ALTER TABLE portfolio_investments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
  ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
  ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
  ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
  ALTER TABLE match_scores ENABLE ROW LEVEL SECURITY;
  ALTER TABLE deal_rooms ENABLE ROW LEVEL SECURITY;
  ALTER TABLE deal_room_documents ENABLE ROW LEVEL SECURITY;
  ALTER TABLE deal_room_notes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE deal_room_activity ENABLE ROW LEVEL SECURITY;
  ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
  ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE syndicates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE syndicate_members ENABLE ROW LEVEL SECURITY;
  ALTER TABLE legal_templates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
  ALTER TABLE startup_updates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

  -- ─── profiles ───
  CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
  CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- ─── founder_profiles ───
  CREATE POLICY "founder_profiles_select" ON founder_profiles FOR SELECT USING (true);
  CREATE POLICY "founder_profiles_insert" ON founder_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "founder_profiles_update" ON founder_profiles FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "founder_profiles_delete" ON founder_profiles FOR DELETE USING (auth.uid() = user_id);

  -- ─── investor_profiles ───
  CREATE POLICY "investor_profiles_select" ON investor_profiles FOR SELECT USING (true);
  CREATE POLICY "investor_profiles_insert" ON investor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "investor_profiles_update" ON investor_profiles FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "investor_profiles_delete" ON investor_profiles FOR DELETE USING (auth.uid() = user_id);

  -- ─── cofounder_profiles ───
  CREATE POLICY "cofounder_profiles_select" ON cofounder_profiles FOR SELECT USING (true);
  CREATE POLICY "cofounder_profiles_insert" ON cofounder_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "cofounder_profiles_update" ON cofounder_profiles FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "cofounder_profiles_delete" ON cofounder_profiles FOR DELETE USING (auth.uid() = user_id);

  -- ─── team_members ───
  CREATE POLICY "team_members_select" ON team_members FOR SELECT USING (true);
  CREATE POLICY "team_members_insert" ON team_members FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "team_members_update" ON team_members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "team_members_delete" ON team_members FOR DELETE USING (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );

  -- ─── funding_rounds ───
  CREATE POLICY "funding_rounds_select" ON funding_rounds FOR SELECT USING (true);
  CREATE POLICY "funding_rounds_insert" ON funding_rounds FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "funding_rounds_update" ON funding_rounds FOR UPDATE USING (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "funding_rounds_delete" ON funding_rounds FOR DELETE USING (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );

  -- ─── portfolio_investments ───
  CREATE POLICY "portfolio_investments_select" ON portfolio_investments FOR SELECT USING (true);
  CREATE POLICY "portfolio_investments_insert" ON portfolio_investments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM investor_profiles WHERE id = investor_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "portfolio_investments_update" ON portfolio_investments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM investor_profiles WHERE id = investor_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "portfolio_investments_delete" ON portfolio_investments FOR DELETE USING (
    EXISTS (SELECT 1 FROM investor_profiles WHERE id = investor_profile_id AND user_id = auth.uid())
  );

  -- ─── communities ───
  CREATE POLICY "communities_select" ON communities FOR SELECT USING (true);
  CREATE POLICY "communities_insert_admin" ON communities FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
  CREATE POLICY "communities_update_admin" ON communities FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
  CREATE POLICY "communities_delete_admin" ON communities FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- ─── community_members ───
  CREATE POLICY "community_members_select" ON community_members FOR SELECT USING (true);
  CREATE POLICY "community_members_insert" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "community_members_delete" ON community_members FOR DELETE USING (auth.uid() = user_id);

  -- ─── posts ───
  CREATE POLICY "posts_select" ON posts FOR SELECT USING (is_removed = false);
  CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
  CREATE POLICY "posts_update_own" ON posts FOR UPDATE USING (auth.uid() = author_id);
  CREATE POLICY "posts_update_admin" ON posts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- ─── post_votes ───
  CREATE POLICY "post_votes_select" ON post_votes FOR SELECT USING (true);
  CREATE POLICY "post_votes_insert" ON post_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "post_votes_update" ON post_votes FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "post_votes_delete" ON post_votes FOR DELETE USING (auth.uid() = user_id);

  -- ─── comments ───
  CREATE POLICY "comments_select" ON comments FOR SELECT USING (is_removed = false);
  CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
  CREATE POLICY "comments_update" ON comments FOR UPDATE USING (auth.uid() = author_id);

  -- ─── comment_votes ───
  CREATE POLICY "comment_votes_select" ON comment_votes FOR SELECT USING (true);
  CREATE POLICY "comment_votes_insert" ON comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "comment_votes_update" ON comment_votes FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "comment_votes_delete" ON comment_votes FOR DELETE USING (auth.uid() = user_id);

  -- ─── saved_posts ───
  CREATE POLICY "saved_posts_select" ON saved_posts FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "saved_posts_insert" ON saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "saved_posts_delete" ON saved_posts FOR DELETE USING (auth.uid() = user_id);

  -- ─── connections ───
  CREATE POLICY "connections_select" ON connections FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = receiver_id
  );
  CREATE POLICY "connections_insert" ON connections FOR INSERT WITH CHECK (auth.uid() = requester_id);
  CREATE POLICY "connections_update" ON connections FOR UPDATE USING (auth.uid() = receiver_id);

  -- ─── conversations ───
  CREATE POLICY "conversations_select" ON conversations FOR SELECT USING (
    auth.uid() = participant_one OR auth.uid() = participant_two
  );
  CREATE POLICY "conversations_insert" ON conversations FOR INSERT WITH CHECK (
    auth.uid() = participant_one OR auth.uid() = participant_two
  );

  -- ─── messages ───
  CREATE POLICY "messages_select" ON messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
    )
  );
  CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
    )
  );

  -- ─── notifications ───
  CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (true);

  -- ─── profile_views ───
  CREATE POLICY "profile_views_select" ON profile_views FOR SELECT USING (auth.uid() = viewed_profile_id);
  CREATE POLICY "profile_views_insert" ON profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);

  -- ─── match_scores ───
  CREATE POLICY "match_scores_select" ON match_scores FOR SELECT USING (
    auth.uid() = founder_id OR auth.uid() = investor_id
  );
  CREATE POLICY "match_scores_insert" ON match_scores FOR INSERT WITH CHECK (true);
  CREATE POLICY "match_scores_update" ON match_scores FOR UPDATE USING (true);

  -- ─── deal_rooms ───
  CREATE POLICY "deal_rooms_select" ON deal_rooms FOR SELECT USING (
    auth.uid() = founder_id OR auth.uid() = investor_id
  );
  CREATE POLICY "deal_rooms_insert" ON deal_rooms FOR INSERT WITH CHECK (
    auth.uid() = founder_id OR auth.uid() = investor_id
  );
  CREATE POLICY "deal_rooms_update" ON deal_rooms FOR UPDATE USING (
    auth.uid() = founder_id OR auth.uid() = investor_id
  );

  -- ─── deal_room_documents ───
  CREATE POLICY "deal_room_documents_select" ON deal_room_documents FOR SELECT USING (
    EXISTS (SELECT 1 FROM deal_rooms WHERE id = deal_room_id AND (founder_id = auth.uid() OR investor_id = auth.uid()))
  );
  CREATE POLICY "deal_room_documents_insert" ON deal_room_documents FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM deal_rooms WHERE id = deal_room_id AND (founder_id = auth.uid() OR investor_id = auth.uid()))
  );

  -- ─── deal_room_notes ───
  CREATE POLICY "deal_room_notes_select" ON deal_room_notes FOR SELECT USING (
    EXISTS (SELECT 1 FROM deal_rooms WHERE id = deal_room_id AND (founder_id = auth.uid() OR investor_id = auth.uid()))
  );
  CREATE POLICY "deal_room_notes_insert" ON deal_room_notes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM deal_rooms WHERE id = deal_room_id AND (founder_id = auth.uid() OR investor_id = auth.uid()))
  );
  CREATE POLICY "deal_room_notes_update" ON deal_room_notes FOR UPDATE USING (auth.uid() = author_id);

  -- ─── deal_room_activity ───
  CREATE POLICY "deal_room_activity_select" ON deal_room_activity FOR SELECT USING (
    EXISTS (SELECT 1 FROM deal_rooms WHERE id = deal_room_id AND (founder_id = auth.uid() OR investor_id = auth.uid()))
  );
  CREATE POLICY "deal_room_activity_insert" ON deal_room_activity FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM deal_rooms WHERE id = deal_room_id AND (founder_id = auth.uid() OR investor_id = auth.uid()))
  );

  -- ─── subscriptions ───
  CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

  -- ─── payments ───
  CREATE POLICY "payments_select" ON payments FOR SELECT USING (auth.uid() = user_id);

  -- ─── reports ───
  CREATE POLICY "reports_insert" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
  CREATE POLICY "reports_select_admin" ON reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
  CREATE POLICY "reports_update_admin" ON reports FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- ─── blog_posts ───
  CREATE POLICY "blog_posts_select_published" ON blog_posts FOR SELECT USING (is_published = true);
  CREATE POLICY "blog_posts_select_admin" ON blog_posts FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
  CREATE POLICY "blog_posts_insert_admin" ON blog_posts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
  CREATE POLICY "blog_posts_update_admin" ON blog_posts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
  CREATE POLICY "blog_posts_delete_admin" ON blog_posts FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- ─── syndicates ───
  CREATE POLICY "syndicates_select" ON syndicates FOR SELECT USING (true);
  CREATE POLICY "syndicates_insert" ON syndicates FOR INSERT WITH CHECK (auth.uid() = lead_investor_id);
  CREATE POLICY "syndicates_update" ON syndicates FOR UPDATE USING (auth.uid() = lead_investor_id);

  -- ─── syndicate_members ───
  CREATE POLICY "syndicate_members_select" ON syndicate_members FOR SELECT USING (true);
  CREATE POLICY "syndicate_members_insert" ON syndicate_members FOR INSERT WITH CHECK (auth.uid() = investor_id);
  CREATE POLICY "syndicate_members_delete" ON syndicate_members FOR DELETE USING (
    auth.uid() = investor_id OR EXISTS (
      SELECT 1 FROM syndicates WHERE id = syndicate_id AND lead_investor_id = auth.uid()
    )
  );

  -- ─── legal_templates ───
  CREATE POLICY "legal_templates_select_free" ON legal_templates FOR SELECT USING (is_premium = false);
  CREATE POLICY "legal_templates_select_premium" ON legal_templates FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_premium = true)
  );
  CREATE POLICY "legal_templates_admin" ON legal_templates FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- ─── notification_preferences ───
  CREATE POLICY "notification_preferences_select" ON notification_preferences FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "notification_preferences_insert" ON notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "notification_preferences_update" ON notification_preferences FOR UPDATE USING (auth.uid() = user_id);

  -- ─── startup_updates ───
  CREATE POLICY "startup_updates_select" ON startup_updates FOR SELECT USING (true);
  CREATE POLICY "startup_updates_insert" ON startup_updates FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "startup_updates_update" ON startup_updates FOR UPDATE USING (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );
  CREATE POLICY "startup_updates_delete" ON startup_updates FOR DELETE USING (
    EXISTS (SELECT 1 FROM founder_profiles WHERE id = founder_profile_id AND user_id = auth.uid())
  );

  -- ─── newsletter_subscribers ───
  CREATE POLICY "newsletter_subscribers_insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
  CREATE POLICY "newsletter_subscribers_select_admin" ON newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


  -- ───────── FUNCTIONS & TRIGGERS ─────────

  -- 1. Handle new user signup → auto-create profile
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER SET search_path = public
  AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'founder')
    );
    RETURN NEW;
  END;
  $$;

  CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  -- 2. Auto-update updated_at
  CREATE OR REPLACE FUNCTION public.update_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$;

  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON founder_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON investor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_cofounder_profiles_updated_at BEFORE UPDATE ON cofounder_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_deal_rooms_updated_at BEFORE UPDATE ON deal_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_deal_room_notes_updated_at BEFORE UPDATE ON deal_room_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  CREATE TRIGGER update_syndicates_updated_at BEFORE UPDATE ON syndicates FOR EACH ROW EXECUTE FUNCTION update_updated_at();


  -- 3. Update post vote counts
  CREATE OR REPLACE FUNCTION public.update_post_vote_counts()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    target_post_id uuid;
  BEGIN
    IF TG_OP = 'DELETE' THEN
      target_post_id := OLD.post_id;
    ELSE
      target_post_id := NEW.post_id;
    END IF;

    UPDATE posts SET
      upvotes = COALESCE((SELECT COUNT(*) FROM post_votes WHERE post_id = target_post_id AND vote = 1), 0),
      downvotes = COALESCE((SELECT COUNT(*) FROM post_votes WHERE post_id = target_post_id AND vote = -1), 0)
    WHERE id = target_post_id;

    RETURN COALESCE(NEW, OLD);
  END;
  $$;

  CREATE TRIGGER on_post_vote_change
    AFTER INSERT OR UPDATE OR DELETE ON post_votes
    FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();


  -- 4. Update comment vote counts
  CREATE OR REPLACE FUNCTION public.update_comment_vote_counts()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    target_comment_id uuid;
  BEGIN
    IF TG_OP = 'DELETE' THEN
      target_comment_id := OLD.comment_id;
    ELSE
      target_comment_id := NEW.comment_id;
    END IF;

    UPDATE comments SET
      upvotes = COALESCE((SELECT COUNT(*) FROM comment_votes WHERE comment_id = target_comment_id AND vote = 1), 0),
      downvotes = COALESCE((SELECT COUNT(*) FROM comment_votes WHERE comment_id = target_comment_id AND vote = -1), 0)
    WHERE id = target_comment_id;

    RETURN COALESCE(NEW, OLD);
  END;
  $$;

  CREATE TRIGGER on_comment_vote_change
    AFTER INSERT OR UPDATE OR DELETE ON comment_votes
    FOR EACH ROW EXECUTE FUNCTION update_comment_vote_counts();


  -- 5. Update community member count
  CREATE OR REPLACE FUNCTION public.update_community_member_count()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    target_community_id uuid;
  BEGIN
    IF TG_OP = 'DELETE' THEN
      target_community_id := OLD.community_id;
    ELSE
      target_community_id := NEW.community_id;
    END IF;

    UPDATE communities SET
      member_count = (SELECT COUNT(*) FROM community_members WHERE community_id = target_community_id)
    WHERE id = target_community_id;

    RETURN COALESCE(NEW, OLD);
  END;
  $$;

  CREATE TRIGGER on_community_member_change
    AFTER INSERT OR DELETE ON community_members
    FOR EACH ROW EXECUTE FUNCTION update_community_member_count();


  -- 6. Update post comment count
  CREATE OR REPLACE FUNCTION public.update_post_comment_count()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    target_post_id uuid;
  BEGIN
    IF TG_OP = 'DELETE' THEN
      target_post_id := OLD.post_id;
    ELSE
      target_post_id := NEW.post_id;
    END IF;

    UPDATE posts SET
      comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = target_post_id AND is_removed = false)
    WHERE id = target_post_id;

    RETURN COALESCE(NEW, OLD);
  END;
  $$;

  CREATE TRIGGER on_comment_change
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();


  -- 7. Update conversation last_message_at
  CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    UPDATE conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
    RETURN NEW;
  END;
  $$;

  CREATE TRIGGER on_new_message
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();


  -- ───────── SEED DATA ─────────

  -- Default communities
  INSERT INTO communities (name, slug, description, category, is_default) VALUES
    ('General', 'general', 'A place for all founders and investors to connect.', 'General', true),
    ('FinTech India', 'fintech-india', 'All things financial technology — payments, banking, lending, insurance, and investing.', 'Sectors', false),
    ('HealthTech India', 'healthtech-india', 'Healthcare technology, telemedicine, medtech, and health-focused startups.', 'Sectors', false),
    ('EdTech India', 'edtech-india', 'Education technology, online learning, and skill development.', 'Sectors', false),
    ('SaaS Founders', 'saas-founders', 'For SaaS founders building B2B and B2C software products.', 'Sectors', false),
    ('AgriTech India', 'agritech-india', 'Agriculture technology, farm-to-fork innovation, and rural tech.', 'Sectors', false),
    ('AI & ML', 'ai-ml', 'Artificial intelligence, machine learning, and deep tech startups.', 'Sectors', false),
    ('First-Time Founders', 'first-time-founders', 'Support and advice for first-time founders navigating the startup journey.', 'Roles', false),
    ('Angel Investors Network', 'angel-investors', 'A community for angel investors to share deals and insights.', 'Roles', false),
    ('Hiring & Talent', 'hiring-talent', 'Post job openings, find talent, and discuss hiring best practices for startups.', 'Topics', false),
    ('Legal & Compliance', 'legal-compliance', 'Navigate the Indian startup legal landscape — incorporation, ESOP, compliance, and more.', 'Topics', false),
    ('Fundraising', 'fundraising', 'Share and learn fundraising strategies, pitch deck tips, and investor insights.', 'Topics', false);

  -- Seed legal templates
  INSERT INTO legal_templates (title, description, content, category, is_premium) VALUES
    ('Non-Disclosure Agreement (NDA)', 'Standard NDA template for protecting confidential information shared between parties.', 'NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement is entered into as of [Date]...\n\n[Template content would go here — this is a placeholder for the full legal document]', 'NDA', false),
    ('SAFE Agreement (India)', 'Simple Agreement for Future Equity adapted for Indian startups and regulatory requirements.', 'SIMPLE AGREEMENT FOR FUTURE EQUITY\n\n[Template content for SAFE adapted for Indian regulations]', 'SAFE', true),
    ('Term Sheet Template', 'Standard term sheet template for early-stage equity investment rounds in India.', 'TERM SHEET\n\nSeries [A/Seed] Preferred Stock Financing\n\n[Template content for term sheet]', 'Term Sheet', true),
    ('Shareholders Agreement', 'Comprehensive shareholders agreement template for Indian private limited companies.', 'SHAREHOLDERS AGREEMENT\n\n[Template content for SHA]', 'SHA', true),
    ('Employee Stock Option Plan (ESOP)', 'ESOP template compliant with Indian Companies Act 2013 for startup equity compensation.', 'EMPLOYEE STOCK OPTION PLAN\n\n[Template content for ESOP]', 'Employment', true),
    ('Founder Agreement', 'Agreement between co-founders covering equity split, roles, vesting, and IP assignment.', 'FOUNDER AGREEMENT\n\n[Template content for founder agreement]', 'Other', false);

  -- Seed blog posts (using a placeholder author_id that will need to be updated after admin creation)
  -- These will be inserted via server-side seed script since they need a valid author_id
