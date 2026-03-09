// ═══════════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLE HELPERS
// ═══════════════════════════════════════════════════════════════

function isPlaceholder(value: string | undefined): boolean {
    if (!value) return true
    return value.startsWith('your_') || value === '' || value === 'undefined'
}

// ─── Supabase ───
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// ─── App ───
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ─── AI ───
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ''
export const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY ?? ''

// ─── Resend ───
export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ''

// ─── Razorpay ───
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? ''
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? ''
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

// ─── WhatsApp ───
export const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY ?? ''
export const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? ''

// ─── Helpers ───
export function isSupabaseConfigured(): boolean {
    return !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SUPABASE_ANON_KEY)
}

export function isAIConfigured(): boolean {
    return !isPlaceholder(OPENAI_API_KEY) || !isPlaceholder(GOOGLE_GEMINI_API_KEY)
}

export function isResendConfigured(): boolean {
    return !isPlaceholder(RESEND_API_KEY)
}

export function isRazorpayConfigured(): boolean {
    return !isPlaceholder(RAZORPAY_KEY_ID) && !isPlaceholder(RAZORPAY_KEY_SECRET)
}

export function isWhatsAppConfigured(): boolean {
    return !isPlaceholder(WHATSAPP_API_KEY) && !isPlaceholder(WHATSAPP_PHONE_NUMBER_ID)
}
