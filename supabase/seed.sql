-- ═══════════════════════════════════════════════════════════════
-- INSTART — SEED DATA FOR TESTING
-- Run this in the Supabase SQL Editor (it bypasses RLS)
-- Delete this file after testing
-- ═══════════════════════════════════════════════════════════════

-- ═════════════════════════════════════════════
-- 0. CLEANUP (Run every time to ensure fresh state)
-- ═════════════════════════════════════════════
DELETE FROM comments WHERE id::text LIKE 'cc000000%';
DELETE FROM post_votes WHERE post_id::text LIKE 'e1000000%';
DELETE FROM posts WHERE id::text LIKE 'e1000000%';
DELETE FROM community_members WHERE community_id::text LIKE 'd1000000%';
DELETE FROM communities WHERE id::text LIKE 'd1000000%';
DELETE FROM match_scores WHERE founder_id::text LIKE 'a1000000%';
DELETE FROM connections WHERE requester_id::text LIKE 'a1000000%' OR receiver_id::text LIKE 'a1000000%';
DELETE FROM portfolio_investments WHERE investor_profile_id::text LIKE 'b1000000%';
DELETE FROM cofounder_profiles WHERE id::text LIKE 'c1000000%';
DELETE FROM investor_profiles WHERE id::text LIKE 'b1000000%';
DELETE FROM founder_profiles WHERE id::text LIKE 'f1000000%';
DELETE FROM profiles WHERE id::text LIKE 'a1000000%';
DELETE FROM auth.users WHERE id::text LIKE 'a1000000%';


-- ─────────── FAKE AUTH USERS ───────────
-- We create entries in auth.users so that profiles can reference them.
-- These are NOT real logins — just placeholder UUIDs for test data.

INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'ravi.kumar@example.com',   '{"full_name":"Ravi Kumar"}'::jsonb,   now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000002', 'priya.sharma@example.com', '{"full_name":"Priya Sharma"}'::jsonb,  now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000003', 'arjun.patel@example.com',  '{"full_name":"Arjun Patel"}'::jsonb,   now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000004', 'neha.gupta@example.com',   '{"full_name":"Neha Gupta"}'::jsonb,    now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000005', 'vikram.singh@example.com', '{"full_name":"Vikram Singh"}'::jsonb,  now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000006', 'ananya.reddy@example.com', '{"full_name":"Ananya Reddy"}'::jsonb,  now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000007', 'karan.mehta@example.com',  '{"full_name":"Karan Mehta"}'::jsonb,   now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000008', 'deepika.nair@example.com', '{"full_name":"Deepika Nair"}'::jsonb,  now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;


-- ─────────── PROFILES (4 types) ───────────

-- 2 Founders
INSERT INTO profiles (id, email, full_name, role, bio, city, linkedin_url, is_onboarded, is_verified, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'ravi.kumar@example.com',   'Ravi Kumar',   'founder',
   'Serial entrepreneur building India''s next big fintech platform. Previously founded a logistics startup that was acquired in 2023.',
   'Bangalore', 'https://linkedin.com/in/ravikumar', true, true, now() - interval '60 days'),
  ('a1000000-0000-0000-0000-000000000002', 'priya.sharma@example.com', 'Priya Sharma', 'founder',
   'Building sustainable agriculture technology to help Indian farmers increase yields by 3x. IIT Delhi alumna.',
   'Delhi', 'https://linkedin.com/in/priyasharma', true, false, now() - interval '45 days')
ON CONFLICT (id) DO NOTHING;

-- 2 Investors
INSERT INTO profiles (id, email, full_name, role, bio, city, linkedin_url, is_onboarded, is_verified, is_premium, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000003', 'arjun.patel@example.com',  'Arjun Patel',  'investor',
   'Partner at Horizon Ventures. Invested in 30+ startups across fintech, healthtech, and SaaS. $50M+ deployed.',
   'Mumbai', 'https://linkedin.com/in/arjunpatel', true, true, true, now() - interval '90 days'),
  ('a1000000-0000-0000-0000-000000000004', 'neha.gupta@example.com',   'Neha Gupta',   'investor',
   'Angel investor and ex-Google engineer. Passionate about deep tech and AI startups in India.',
   'Hyderabad', 'https://linkedin.com/in/nehagupta', true, true, false, now() - interval '75 days')
ON CONFLICT (id) DO NOTHING;

-- 2 Co-founder seekers
INSERT INTO profiles (id, email, full_name, role, bio, city, linkedin_url, is_onboarded, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000005', 'vikram.singh@example.com', 'Vikram Singh', 'cofounder_seeker',
   'Full-stack developer with 8 years experience at Amazon and Flipkart. Looking to co-found a B2B SaaS startup.',
   'Pune', 'https://linkedin.com/in/vikramsingh', true, now() - interval '30 days'),
  ('a1000000-0000-0000-0000-000000000006', 'ananya.reddy@example.com', 'Ananya Reddy', 'cofounder_seeker',
   'Product designer with experience at Swiggy and PhonePe. Want to build something in the consumer space.',
   'Bangalore', 'https://linkedin.com/in/ananyareddy', true, now() - interval '25 days')
ON CONFLICT (id) DO NOTHING;

-- 1 Admin
INSERT INTO profiles (id, email, full_name, role, bio, city, is_onboarded, is_verified, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000007', 'karan.mehta@example.com',  'Karan Mehta',  'admin',
   'Instart platform administrator.',
   'Mumbai', true, true, now() - interval '120 days')
ON CONFLICT (id) DO NOTHING;

-- 1 Extra founder for more data
INSERT INTO profiles (id, email, full_name, role, bio, city, linkedin_url, is_onboarded, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000008', 'deepika.nair@example.com', 'Deepika Nair', 'founder',
   'Edtech founder building AI-powered personalized learning for Tier 2 & 3 cities. Ex-McKinsey.',
   'Chennai', 'https://linkedin.com/in/deepikanair', true, now() - interval '35 days')
ON CONFLICT (id) DO NOTHING;


-- ─────────── FOUNDER PROFILES ───────────

INSERT INTO founder_profiles (id, user_id, startup_name, one_liner, pitch, sectors, stage, monthly_revenue, total_users, team_size, is_raising, raising_amount, raising_round_type, total_raised, looking_for, website_url) VALUES
  ('f1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'PayBridge',
   'Making cross-border payments instant for Indian SMBs',
   'PayBridge is building the rails for instant cross-border payments. Indian SMBs lose $4B annually to slow, expensive international transfers. We''ve built an API-first platform that reduces settlement time from 3 days to 30 seconds at 70% lower fees. Currently processing ₹2Cr monthly with 200+ merchants onboarded. Our team includes ex-Razorpay and ex-Stripe engineers.',
   ARRAY['Fintech', 'B2B', 'Payments'],
   'early_traction',
   2000000, 200, 8, true, 50000000, 'seed', 10000000,
   ARRAY['Technical Co-founder', 'Growth Lead'],
   'https://paybridge.io'),

  ('f1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000002',
   'KrishiAI',
   'AI-powered crop advisory for Indian farmers',
   'KrishiAI delivers real-time crop health monitoring and AI-powered advisory to Indian farmers via WhatsApp. We analyze satellite imagery, weather data, and soil conditions to predict crop diseases 2 weeks early. Currently active with 5,000 farmers across Maharashtra and Punjab. Our technology has improved yields by 40% in pilot farms and reduced pesticide costs by 60%.',
   ARRAY['AgriTech', 'AI/ML', 'Rural Tech'],
   'mvp',
   500000, 5000, 5, true, 30000000, 'pre_seed', 5000000,
   ARRAY['CTO', 'Agri Domain Expert'],
   'https://krishiai.in'),

  ('f1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000008',
   'LearnSpark',
   'Personalized AI tutor for Tier 2 & 3 students',
   'LearnSpark is an AI-powered personalized learning platform designed for students in Tier 2 and 3 cities. Our adaptive learning engine creates custom study paths based on each student''s learning style and pace. Available in 8 Indian languages. 15,000 students onboarded with 85% retention rate. Average test scores improved by 35%.',
   ARRAY['EdTech', 'AI/ML', 'Social Impact'],
   'early_traction',
   1500000, 15000, 6, true, 40000000, 'seed', 8000000,
   ARRAY['VP Sales', 'Content Lead'],
   'https://learnspark.edu.in')
ON CONFLICT (id) DO NOTHING;


-- ─────────── INVESTOR PROFILES ───────────

INSERT INTO investor_profiles (id, user_id, professional_title, sectors_of_interest, preferred_stages, min_check_size, max_check_size, total_investments, investment_thesis, is_actively_investing, open_to_mentoring) VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000003',
   'Partner, Horizon Ventures',
   ARRAY['Fintech', 'SaaS', 'HealthTech', 'AI/ML'],
   ARRAY['seed', 'series_a'],
   5000000, 50000000, 32,
   'We back bold founders solving India-specific problems with global potential. Looking for startups with strong unit economics, clear moats, and teams with deep domain expertise. Prefer B2B models with recurring revenue.',
   true, true),

  ('b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000004',
   'Angel Investor & Advisor',
   ARRAY['AI/ML', 'Deep Tech', 'Developer Tools', 'Climate Tech'],
   ARRAY['pre_seed', 'seed'],
   1000000, 10000000, 15,
   'I invest in technical founders building category-defining products. Especially interested in AI infrastructure, developer experience, and climate solutions. I bring hands-on technical mentorship from my 12 years at Google.',
   true, true)
ON CONFLICT (id) DO NOTHING;


-- ─────────── CO-FOUNDER PROFILES ───────────

INSERT INTO cofounder_profiles (id, user_id, current_status, skills, looking_for_skills, commitment, has_idea, idea_description, preferred_sectors, remote_ok, equity_expectation, experience_description) VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000005',
   'Actively looking for a co-founder',
   ARRAY['Full-stack Development', 'System Design', 'AWS', 'Node.js', 'React', 'PostgreSQL'],
   ARRAY['Sales', 'Business Development', 'Marketing'],
   'full_time', true,
   'Building an AI-powered contract management platform for Indian enterprises. The legal tech market in India is growing at 25% CAGR and most solutions are either too expensive or not localized.',
   ARRAY['SaaS', 'LegalTech', 'AI/ML'],
   true, '40-50%',
   '8 years of software engineering at Amazon (AWS team) and Flipkart. Built and scaled backend systems handling 1M+ requests/sec. Led a team of 12 engineers.'),

  ('c1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000006',
   'Open to the right opportunity',
   ARRAY['Product Design', 'UX Research', 'Figma', 'Design Systems', 'User Testing'],
   ARRAY['Engineering', 'Backend Development', 'AI/ML'],
   'full_time', false, NULL,
   ARRAY['Consumer Tech', 'HealthTech', 'Social Impact'],
   true, '30-40%',
   '6 years as a product designer. Led design at Swiggy for their merchant app (50K+ merchants). Previously at PhonePe designing the investment vertical. Strong user research background.')
ON CONFLICT (id) DO NOTHING;


-- ─────────── PORTFOLIO INVESTMENTS ───────────

INSERT INTO portfolio_investments (investor_profile_id, startup_name, year, outcome, notes) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'QuickReach (logistics)', 2022, 'acquired', 'Acquired by Delhivery for ₹80Cr'),
  ('b1000000-0000-0000-0000-000000000001', 'MedVault (healthtech)', 2023, 'active', 'Series A stage, growing 20% MoM'),
  ('b1000000-0000-0000-0000-000000000001', 'CloudKitchen Pro', 2021, 'exited', '5x return in 2 years'),
  ('b1000000-0000-0000-0000-000000000002', 'CodeBridge (devtools)', 2023, 'active', 'Strong developer adoption, 10K MAU'),
  ('b1000000-0000-0000-0000-000000000002', 'GreenCharge (climate)', 2024, 'active', 'Pre-seed, building EV charging infra');


-- ─────────── COMMUNITIES ───────────

INSERT INTO communities (id, name, slug, description, category, member_count, is_default) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'General Discussion', 'general',
   'The main hub for all discussions — introductions, questions, advice, and everything startup.',
   'General', 8, true),
  ('d1000000-0000-0000-0000-000000000002', 'Fundraising & Investors', 'fundraising',
   'Tips, strategies, and discussions about raising capital in India. Share your fundraising journey.',
   'Finance', 6, true),
  ('d1000000-0000-0000-0000-000000000003', 'Product & Tech', 'product-tech',
   'Discuss product development, tech stacks, architecture decisions, and engineering best practices.',
   'Technology', 5, false),
  ('d1000000-0000-0000-0000-000000000004', 'Hiring & Talent', 'hiring',
   'Post job openings, find co-founders, and discuss hiring strategies for early-stage startups.',
   'Careers', 4, false),
  ('d1000000-0000-0000-0000-000000000005', 'Show & Tell', 'show-and-tell',
   'Launch your product, share milestones, and get feedback from the community.',
   'Showcase', 5, false)
ON CONFLICT DO NOTHING;


-- ─────────── COMMUNITY MEMBERS ───────────
-- Add all test users to the General community, and spread them across others

INSERT INTO community_members (community_id, user_id, role) VALUES
  -- General (all 8)
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'member'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'member'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'member'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'member'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'member'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'admin'),
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'member'),
  -- Fundraising
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'member'),
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'member'),
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'member'),
  ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000008', 'member'),
  -- Product & Tech
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', 'member'),
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000006', 'member'),
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000008', 'member'),
  -- Hiring & Talent
  ('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'member'),
  ('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', 'member'),
  ('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000006', 'member'),
  -- Show & Tell
  ('d1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('d1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'member'),
  ('d1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'member'),
  ('d1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000008', 'member')
ON CONFLICT (community_id, user_id) DO NOTHING;


-- ─────────── POSTS ───────────

INSERT INTO posts (id, author_id, community_id, type, title, content, upvotes, downvotes, comment_count, created_at) VALUES
  -- General Discussion
  ('e1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'discussion',
   'What metrics do seed-stage investors actually care about in 2025?',
   'I''ve been talking to a lot of investors lately and getting mixed signals. Some want to see ₹10L+ MRR before writing a seed check, others say they''ll back pre-revenue founders with strong conviction. For those who''ve recently raised: what metrics were most important in your pitch? Was it revenue, user growth, retention, or something else entirely?',
   12, 1, 3, now() - interval '5 days'),

  ('e1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'ask',
   'How do you evaluate a potential co-founder?',
   'I''m actively looking for a business co-founder for my B2B SaaS idea. I''ve met a few people but I''m unsure how to evaluate the fit beyond just skills. Those who''ve found co-founders: what was your process? Any red flags to watch out for? How long did you work together before making it official?',
   8, 0, 2, now() - interval '3 days'),

  -- Fundraising
  ('e1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'discussion',
   'Our pre-seed raise journey: ₹50L in 3 weeks — here''s what worked',
   'Just closed our pre-seed round of ₹50L from 2 angel investors. Here''s a transparent breakdown:\n\n1. We had a working MVP with 500 users\n2. Showed clear 30% WoW growth\n3. Had recommendation letters from 3 pilot farmers\n4. Created a 12-slide deck (happy to share the structure)\n5. Reached out to 15 investors, got meetings with 8, received 3 term sheets\n\nThe entire process took 3 weeks from first meeting to money in the bank. Happy to answer questions!',
   18, 0, 4, now() - interval '7 days'),

  ('e1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'discussion',
   'Investor perspective: why I pass on 90% of pitches',
   'After reviewing 500+ pitches this year, I wanted to share the most common reasons I pass:\n\n• **No clear moat** — "We''ll move faster" isn''t a moat\n• **TAM hand-waving** — "India has 1.4B people" doesn''t help\n• **Founder-market mismatch** — Why are YOU the right person?\n• **Unit economics ignored** — If you can''t explain your margins, it''s too early\n• **No customer obsession** — Tell me about your users, not your tech\n\nWhat I DO look for: founders who deeply understand 10 customers, not vaguely understand 10,000.',
   25, 2, 5, now() - interval '10 days'),

  -- Product & Tech
  ('e1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 'discussion',
   'Our tech stack for processing ₹2Cr/month in payments',
   'Sharing our current production setup at PayBridge:\n\n**Backend:** Node.js + TypeScript, PostgreSQL, Redis\n**Infra:** AWS (ECS Fargate), CloudFront, SQS for async processing\n**Payments:** Custom integrations with 3 banking partners via SWIFT + NEFT\n**Monitoring:** Datadog + PagerDuty\n**CI/CD:** GitHub Actions → ECR → ECS\n\nBiggest lesson: Don''t over-engineer early. We started with a monolith and it was the right call. Only now at ₹2Cr/month are we considering microservices for the settlement engine.\n\nAMA about our architecture!',
   15, 0, 3, now() - interval '4 days'),

  -- Show & Tell
  ('e1000000-0000-0000-0000-000000000006',
   'a1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000005', 'show_and_tell',
   '🚀 LearnSpark just hit 15,000 students — here''s our growth story',
   'Super excited to share that LearnSpark crossed 15,000 students this week!\n\nSome highlights:\n• Available in 8 Indian languages\n• 85% monthly retention (vs 30% industry average)\n• Average test scores improved by 35%\n• Zero paid marketing — all organic + referral\n\nThe breakthrough was our vernacular-first approach. When we launched in Hindi and Telugu before English, adoption exploded in Tier 2/3 cities. Our AI tutor adapts not just to learning speed but to regional context and examples.\n\nWould love feedback on our product and any introductions to edtech investors!',
   20, 0, 3, now() - interval '2 days'),

  -- Hiring & Talent
  ('e1000000-0000-0000-0000-000000000007',
   'a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004', 'hiring',
   '[Hiring] KrishiAI — Senior ML Engineer (Remote, ₹25-40 LPA)',
   'We''re looking for a Senior ML Engineer to join KrishiAI.\n\n**About us:** AI-powered crop advisory serving 5,000+ farmers\n\n**Role:**\n• Build and improve our crop disease detection models (currently 92% accuracy)\n• Work with satellite imagery and weather data pipelines\n• Deploy models at edge for low-connectivity areas\n\n**Requirements:**\n• 3+ years ML/DL experience\n• Experience with computer vision (PyTorch preferred)\n• Bonus: Agricultural domain knowledge\n\n**What we offer:**\n• ₹25-40 LPA + meaningful ESOPs\n• Fully remote\n• Impact: your code directly helps farmers\n\nDM me or comment if interested!',
   6, 0, 2, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;


-- ─────────── POST VOTES ───────────

INSERT INTO post_votes (post_id, user_id, vote) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 1),
  ('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 1),
  ('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 1),
  ('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 1),
  ('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 1),
  ('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', 1),
  ('e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 1),
  ('e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 1),
  ('e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', 1),
  ('e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 1),
  ('e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 1),
  ('e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 1)
ON CONFLICT (post_id, user_id) DO NOTHING;


-- ─────────── COMMENTS (with replies) ───────────

INSERT INTO comments (id, post_id, author_id, parent_comment_id, content, upvotes, created_at) VALUES
  -- Comments on "What metrics do seed-stage investors care about?"
  ('cc000000-0000-0000-0000-000000000001',
   'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', NULL,
   'Honest answer: at seed stage, I care most about founder-market fit and early signs of customer love. Revenue is a bonus, not a requirement. Show me 50 users who would be devastated if your product disappeared — that''s worth more than ₹10L MRR from users who don''t really care.',
   8, now() - interval '4 days'),

  ('cc000000-0000-0000-0000-000000000002',
   'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000001',
   'This is really helpful @Arjun. We have exactly that — 200 merchants who actively tell us they''d be lost without PayBridge. Would you be open to a quick chat about our seed round?',
   3, now() - interval '3 days 18 hours'),

  ('cc000000-0000-0000-0000-000000000003',
   'e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', NULL,
   'I''d add: retention and engagement graphs > absolute numbers. A startup with 100 users and 90% weekly retention is far more interesting than one with 10,000 users and 5% retention. Quality of usage signals product-market fit better than vanity metrics.',
   5, now() - interval '4 days 6 hours'),

  -- Comments on "How do you evaluate a co-founder?"
  ('cc000000-0000-0000-0000-000000000004',
   'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000006', NULL,
   'My experience: work on a small side project together for 2-4 weeks before committing. You''ll quickly see how they handle disagreements, deadlines, and ambiguity. The dating phase is crucial!',
   4, now() - interval '2 days'),

  ('cc000000-0000-0000-0000-000000000005',
   'e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000004',
   '100% agree with the trial period. We did this at my previous startup and it saved us from a bad co-founder match. Red flag: someone who only wants to talk strategy but never executes.',
   3, now() - interval '1 day 12 hours'),

  -- Comments on fundraising journey
  ('cc000000-0000-0000-0000-000000000006',
   'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', NULL,
   'Congrats Priya! 3 weeks is impressively fast. Would love to see the deck structure if you''re willing to share. We''re preparing for our seed round at PayBridge.',
   4, now() - interval '6 days'),

  ('cc000000-0000-0000-0000-000000000007',
   'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'cc000000-0000-0000-0000-000000000006',
   'Thanks Ravi! Happy to share — DM me and I''ll send it over. The key was keeping it to 12 slides max and leading with the problem, not the solution.',
   2, now() - interval '5 days 12 hours'),

  ('cc000000-0000-0000-0000-000000000008',
   'e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004', NULL,
   'Great transparency! The recommendation letters from pilot users is a smart touch that I don''t see enough founders do. Social proof from real users >>> fancy pitch decks.',
   6, now() - interval '6 days 6 hours'),

  -- Comments on investor perspective
  ('cc000000-0000-0000-0000-000000000009',
   'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', NULL,
   'The "deeply understand 10 customers" line really resonates. When I pitch KrishiAI, I literally name the farmers and tell their stories. Investors love that authenticity.',
   7, now() - interval '9 days'),

  ('cc000000-0000-0000-0000-000000000010',
   'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', NULL,
   'Hot take: "No clear moat" feedback is overused. Some of the biggest companies started without moats and built them through execution. Network effects and data moats come from scale, not day 1.',
   4, now() - interval '8 days'),

  ('cc000000-0000-0000-0000-000000000011',
   'e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'cc000000-0000-0000-0000-000000000010',
   'Fair point Vikram, but as an investor I need to believe you can build a moat before someone else copies you. "We''ll move faster" means your defensibility is just your to-do list being longer. Tell me WHY you''ll be hard to catch.',
   5, now() - interval '7 days 12 hours'),

  -- Comments on tech stack post
  ('cc000000-0000-0000-0000-000000000012',
   'e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', NULL,
   'Love the monolith-first approach. We made the mistake of going microservices at my previous company with 0 users, spent 6 months on infra instead of building features. You can always decompose later.',
   5, now() - interval '3 days'),

  ('cc000000-0000-0000-0000-000000000013',
   'e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000008', NULL,
   'Question: why ECS over Lambda for your workload? We''re using Lambda at LearnSpark and the cold starts are killing our user experience. Considering moving to ECS ourselves.',
   3, now() - interval '2 days 12 hours'),

  ('cc000000-0000-0000-0000-000000000014',
   'e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000013',
   'We started on Lambda but switched to ECS Fargate for exactly that reason. For a payments system, predictable latency is non-negotiable. ECS Fargate gives us the best of both — no servers to manage but consistent response times under 100ms.',
   4, now() - interval '2 days'),

  -- Comments on LearnSpark launch
  ('cc000000-0000-0000-0000-000000000015',
   'e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', NULL,
   'Incredible retention numbers, Deepika! 85% monthly is best-in-class for edtech. I''d love to learn more about your AI tutor approach. This could be a Horizon Ventures fit — let''s connect.',
   6, now() - interval '1 day 18 hours'),

  ('cc000000-0000-0000-0000-000000000016',
   'e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', NULL,
   'The vernacular-first approach is brilliant. We did the same at KrishiAI — Hindi and regional languages first, English as an afterthought. India is not an English-first market.',
   4, now() - interval '1 day 6 hours'),

  -- Comments on hiring post
  ('cc000000-0000-0000-0000-000000000017',
   'e1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000005', NULL,
   'Interested! I have decent PyTorch experience from side projects and the agricultural impact angle is very appealing. DMing you.',
   2, now() - interval '12 hours'),

  ('cc000000-0000-0000-0000-000000000018',
   'e1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000004', NULL,
   'Great JD! Tip for other founders: explicitly listing comp range like Priya did here massively increases quality applications. Transparency attracts the best talent.',
   3, now() - interval '6 hours')
ON CONFLICT (id) DO NOTHING;


-- ─────────── CONNECTIONS ───────────

INSERT INTO connections (requester_id, receiver_id, status, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'accepted', now() - interval '30 days'),
  ('a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'accepted', now() - interval '20 days'),
  ('a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'accepted', now() - interval '15 days'),
  ('a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005', 'accepted', now() - interval '10 days'),
  ('a1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'pending',  now() - interval '2 days'),
  ('a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'accepted', now() - interval '25 days')
ON CONFLICT (requester_id, receiver_id) DO NOTHING;


-- ─────────── MATCH SCORES ───────────

INSERT INTO match_scores (founder_id, investor_id, score, factors) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 92,
   '{"sector_match": 95, "stage_match": 90, "check_size_fit": 85, "thesis_alignment": 98}'::jsonb),
  ('a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 78,
   '{"sector_match": 70, "stage_match": 85, "check_size_fit": 80, "thesis_alignment": 75}'::jsonb),
  ('a1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', 85,
   '{"sector_match": 88, "stage_match": 82, "check_size_fit": 90, "thesis_alignment": 80}'::jsonb)
ON CONFLICT (founder_id, investor_id) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- END OF SEED SCRIPT
-- ═══════════════════════════════════════════════════════════════
