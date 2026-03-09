"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

// ═══════════════════════════════════════════════════════════════
// OTP VERIFICATION COMPONENT
// ═══════════════════════════════════════════════════════════════
function OtpVerificationScreen({
  email,
  onBack,
  onSuccess,
}: {
  email: string
  onBack: () => void
  onSuccess: () => void
}) {
  const [otp, setOtp] = useState<string[]>(Array(8).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const startCooldown = useCallback(() => {
    setResendCooldown(30)
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8)
    if (pastedData.length === 8) {
      setOtp(pastedData.split(''))
      inputRefs.current[7]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 8) {
      setError('Please enter all 8 digits')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      })

      if (verifyError) {
        setError(verifyError.message === 'Token has expired or is invalid'
          ? 'Invalid or expired code. Please try again.'
          : verifyError.message)
        setIsVerifying(false)
        return
      }

      onSuccess()
    } catch {
      setError('Verification failed. Please try again.')
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    try {
      const supabase = createClient()
      await supabase.auth.signInWithOtp({ email })
      startCooldown()
      setError('')
    } catch {
      setError('Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-8"
        >
          <ShieldCheck className="w-10 h-10 text-black" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
          2-Step Verification
        </h1>
        <p className="text-muted-foreground mb-2">
          We&apos;ve sent an 8-digit code to
        </p>
        <p className="text-emerald-400 font-medium mb-8">{email}</p>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              autoFocus={index === 0}
              className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-xl bg-white/5 border transition-all focus:outline-none focus:ring-2 ${error
                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                : digit
                  ? 'border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-emerald-400'
                  : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-foreground'
                }`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 mb-4">
            {error}
          </motion.p>
        )}

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length !== 8}
          className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
        >
          {isVerifying ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</>
          ) : (
            'Verify & Sign In'
          )}
        </Button>

        {/* Resend & Back */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-medium transition-colors cursor-pointer ${resendCooldown > 0 ? 'text-muted-foreground/50' : 'text-emerald-400 hover:text-emerald-300'
                }`}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </p>
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ← Back to login
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setIsLoading(true)
    setErrorMessage("")

    try {
      const supabase = createClient()

      // Step 1: Verify password credentials
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        setIsLoading(false)
        return
      }

      // Step 2: Password correct — sign out immediately and send OTP for 2FA
      await supabase.auth.signOut()

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (otpError) {
        setErrorMessage(otpError.message)
        setIsLoading(false)
        return
      }

      // Step 3: Show OTP verification screen
      setShowOtp(true)
      setIsLoading(false)
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // ─── OTP 2FA Screen ───
  if (showOtp) {
    return (
      <OtpVerificationScreen
        email={email}
        onBack={() => { setShowOtp(false); setErrorMessage('') }}
        onSuccess={() => router.push('/app/feed')}
      />
    )
  }

  // ─── Login Form ───
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/6 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="Instart Logo" width={32} height={32} className="rounded-lg group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-foreground tracking-tight">
              instart
            </span>
          </Link>

          {/* Quote */}
          <div className="max-w-md">
            <blockquote className="text-3xl xl:text-4xl font-medium text-foreground leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
              &ldquo;Every unicorn started with a single connection.&rdquo;
            </blockquote>
            <p className="text-muted-foreground">
              — 500+ startups funded on Instart
            </p>
          </div>

          {/* Credibility */}
          <p className="text-sm text-muted-foreground">
            Trusted by founders from IIT, IIM, BITS, ISB
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile background glow */}
        <div className="absolute inset-0 lg:hidden overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <motion.div variants={itemVariants} className="lg:hidden mb-8 text-center flex flex-col items-center">
            <Link href="/" className="inline-flex items-center gap-2 group mb-2">
              <Image src="/logo.png" alt="Instart Logo" width={36} height={36} className="rounded-lg" />
              <span className="text-2xl font-bold text-foreground tracking-tight">
                instart
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Where unicorns meet their investors
            </p>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: "-0.02em" }}>
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue building the future
            </p>
          </motion.div>

          {/* Google OAuth */}
          <motion.div variants={itemVariants}>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white text-foreground font-medium transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset will be available soon. Please contact support@instart.in for help.')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Remember me */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </motion.div>

            {/* Error message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 glow-emerald-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer links */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Legal */}
          <motion.p variants={itemVariants} className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
