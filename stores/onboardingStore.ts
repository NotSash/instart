'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FounderData {
    // Step 1 — Basic Info
    full_name: string
    bio: string
    city: string
    linkedin_url: string
    avatar_url: string
    // Step 2 — Startup Details
    startup_name: string
    one_liner: string
    sectors: string[]
    website_url: string
    // Step 3 — Stage & Metrics
    stage: string
    monthly_revenue: string
    total_users: string
    monthly_growth_rate: string
    team_size: string
    // Step 4 — Funding
    is_raising: boolean
    raising_amount: string
    raising_round_type: string
    total_raised: string
    looking_for: string[]
    // Step 5 — Pitch
    pitch: string
    pitch_deck_url: string
    video_pitch_url: string
}

interface InvestorData {
    full_name: string
    bio: string
    city: string
    linkedin_url: string
    avatar_url: string
    professional_title: string
    sectors_of_interest: string[]
    preferred_stages: string[]
    min_check_size: string
    max_check_size: string
    investment_thesis: string
    is_actively_investing: boolean
    open_to_syndicate: boolean
    open_to_mentoring: boolean
}

interface CofounderData {
    full_name: string
    bio: string
    city: string
    linkedin_url: string
    avatar_url: string
    current_status: string
    skills: string[]
    looking_for_skills: string[]
    commitment: string
    has_idea: boolean
    idea_description: string
    preferred_sectors: string[]
    preferred_cities: string[]
    remote_ok: boolean
    equity_expectation: string
    experience_description: string
}

interface OnboardingState {
    currentStep: number
    founderData: FounderData
    investorData: InvestorData
    cofounderData: CofounderData

    setStep: (step: number) => void
    updateFounderData: (data: Partial<FounderData>) => void
    updateInvestorData: (data: Partial<InvestorData>) => void
    updateCofounderData: (data: Partial<CofounderData>) => void
    reset: () => void
}

const defaultFounderData: FounderData = {
    full_name: '', bio: '', city: '', linkedin_url: '', avatar_url: '',
    startup_name: '', one_liner: '', sectors: [], website_url: '',
    stage: '', monthly_revenue: '', total_users: '', monthly_growth_rate: '', team_size: '',
    is_raising: false, raising_amount: '', raising_round_type: '', total_raised: '', looking_for: [],
    pitch: '', pitch_deck_url: '', video_pitch_url: '',
}

const defaultInvestorData: InvestorData = {
    full_name: '', bio: '', city: '', linkedin_url: '', avatar_url: '',
    professional_title: '', sectors_of_interest: [], preferred_stages: [],
    min_check_size: '', max_check_size: '', investment_thesis: '',
    is_actively_investing: true, open_to_syndicate: false, open_to_mentoring: false,
}

const defaultCofounderData: CofounderData = {
    full_name: '', bio: '', city: '', linkedin_url: '', avatar_url: '',
    current_status: '', skills: [], looking_for_skills: [],
    commitment: '', has_idea: false, idea_description: '',
    preferred_sectors: [], preferred_cities: [], remote_ok: true,
    equity_expectation: '', experience_description: '',
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            currentStep: 0,
            founderData: defaultFounderData,
            investorData: defaultInvestorData,
            cofounderData: defaultCofounderData,

            setStep: (step) => set({ currentStep: step }),
            updateFounderData: (data) => set((s) => ({ founderData: { ...s.founderData, ...data } })),
            updateInvestorData: (data) => set((s) => ({ investorData: { ...s.investorData, ...data } })),
            updateCofounderData: (data) => set((s) => ({ cofounderData: { ...s.cofounderData, ...data } })),
            reset: () => set({
                currentStep: 0,
                founderData: defaultFounderData,
                investorData: defaultInvestorData,
                cofounderData: defaultCofounderData,
            }),
        }),
        { name: 'instart-onboarding' }
    )
)
