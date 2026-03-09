import { z } from 'zod'

// ─── Founder Onboarding ───
export const founderStep1Schema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().optional(),
    city: z.string().optional(),
    linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const founderStep2Schema = z.object({
    startup_name: z.string().min(1, 'Startup name is required'),
    one_liner: z.string().max(150, 'Keep it under 150 characters').optional(),
    sectors: z.array(z.string()).min(1, 'Select at least one sector'),
    website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const founderStep3Schema = z.object({
    stage: z.string().min(1, 'Select your startup stage'),
    monthly_revenue: z.string().optional(),
    total_users: z.string().optional(),
    monthly_growth_rate: z.string().optional(),
    team_size: z.string().optional(),
})

export const founderStep4Schema = z.object({
    is_raising: z.boolean(),
    raising_amount: z.string().optional(),
    raising_round_type: z.string().optional(),
    total_raised: z.string().optional(),
    looking_for: z.array(z.string()).optional(),
})

export const founderStep5Schema = z.object({
    pitch: z.string().optional(),
    pitch_deck_url: z.string().optional(),
    video_pitch_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// ─── Investor Onboarding ───
export const investorStep1Schema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    professional_title: z.string().optional(),
    bio: z.string().optional(),
    city: z.string().optional(),
    linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const investorStep2Schema = z.object({
    sectors_of_interest: z.array(z.string()).min(1, 'Select at least one sector'),
    preferred_stages: z.array(z.string()).min(1, 'Select at least one stage'),
})

export const investorStep3Schema = z.object({
    min_check_size: z.string().optional(),
    max_check_size: z.string().optional(),
    investment_thesis: z.string().optional(),
})

export const investorStep4Schema = z.object({
    is_actively_investing: z.boolean(),
    open_to_syndicate: z.boolean(),
    open_to_mentoring: z.boolean(),
})

// ─── Co-founder Onboarding ───
export const cofounderStep1Schema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    current_status: z.string().optional(),
    bio: z.string().optional(),
    city: z.string().optional(),
    linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const cofounderStep2Schema = z.object({
    skills: z.array(z.string()).min(1, 'Select at least one skill'),
    looking_for_skills: z.array(z.string()).min(1, 'Select at least one skill you\'re looking for'),
    commitment: z.string().min(1, 'Select your commitment level'),
})

export const cofounderStep3Schema = z.object({
    has_idea: z.boolean(),
    idea_description: z.string().optional(),
    preferred_sectors: z.array(z.string()).optional(),
    preferred_cities: z.array(z.string()).optional(),
    remote_ok: z.boolean(),
    equity_expectation: z.string().optional(),
    experience_description: z.string().optional(),
})
