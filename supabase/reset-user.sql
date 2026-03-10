-- ═══════════════════════════════════════════════════════════════
-- RESET A USER ACCOUNT FOR RE-TESTING ONBOARDING
-- ═══════════════════════════════════════════════════════════════
--
-- HOW TO USE:
-- 1. Replace 'YOUR_EMAIL@gmail.com' below with the Google account email
-- 2. Paste this entire script into the Supabase SQL Editor
-- 3. Click Run
-- 4. The user can now sign in again and will be taken through onboarding fresh
--
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  target_email TEXT := 'YOUR_EMAIL@gmail.com';  -- ← CHANGE THIS
  target_user_id UUID;
BEGIN
  -- Find the user's profile ID
  SELECT id INTO target_user_id FROM profiles WHERE email = target_email;

  IF target_user_id IS NULL THEN
    RAISE NOTICE 'No user found with email: %', target_email;
    RETURN;
  END IF;

  RAISE NOTICE 'Resetting user: % (ID: %)', target_email, target_user_id;

  -- Delete role-specific profiles
  DELETE FROM founder_profiles WHERE user_id = target_user_id;
  DELETE FROM investor_profiles WHERE user_id = target_user_id;
  DELETE FROM cofounder_profiles WHERE user_id = target_user_id;

  -- Delete community memberships
  DELETE FROM community_members WHERE user_id = target_user_id;

  -- Delete notifications and preferences
  DELETE FROM notifications WHERE user_id = target_user_id;
  DELETE FROM notification_preferences WHERE user_id = target_user_id;

  -- Delete subscriptions
  DELETE FROM subscriptions WHERE user_id = target_user_id;

  -- Delete connections
  DELETE FROM connections WHERE requester_id = target_user_id OR receiver_id = target_user_id;

  -- Delete match scores
  DELETE FROM match_scores WHERE founder_id = target_user_id OR investor_id = target_user_id;

  -- Delete posts, comments, and votes by this user
  DELETE FROM post_votes WHERE user_id = target_user_id;
  DELETE FROM comments WHERE author_id = target_user_id;
  DELETE FROM posts WHERE author_id = target_user_id;

  -- Reset profile to pre-onboarding state
  UPDATE profiles SET
    is_onboarded = false,
    bio = NULL,
    city = NULL,
    linkedin_url = NULL,
    avatar_url = NULL,
    role = 'founder'  -- Reset to default role (will be re-selected during onboarding)
  WHERE id = target_user_id;

  RAISE NOTICE 'Done! User % has been reset. They will see onboarding on next login.', target_email;
END $$;
