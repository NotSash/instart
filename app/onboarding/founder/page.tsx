'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Camera, MapPin, Globe, ChevronRight,
  Check, Sparkles, ArrowRight, IndianRupee
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitFounderOnboarding } from '@/app/actions/onboarding'

const TOTAL_STEPS = 6

const sectors = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'SaaS', 'D2C',
  'CleanTech', 'AI/ML', 'Logistics', 'Social Impact', 'Gaming', 'Other'
]

const stages = ['Idea', 'MVP', 'Early Traction', 'Growth', 'Scale']

const roundTypes = ['Pre-seed', 'Seed', 'Series A', 'Series B+', 'Convertible Note', 'SAFE']

const investorTypes = [
  'Angel Investors', 'Venture Capital', 'Micro VCs', 'Strategic Investors',
  'Family Offices', 'Accelerators', 'Government Grants'
]

const indianCities = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh',
  'Indore', 'Coimbatore', 'Goa', 'Other'
]

export default function FounderOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)

  // Step 1
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 2
  const [startupName, setStartupName] = useState('')
  const [pitch, setPitch] = useState('')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [website, setWebsite] = useState('')

  // Step 3
  const [selectedStage, setSelectedStage] = useState('')
  const [revenue, setRevenue] = useState('')
  const [users, setUsers] = useState('')
  const [growthRate, setGrowthRate] = useState('')

  // Step 4
  const [isRaising, setIsRaising] = useState<boolean | null>(null)
  const [raiseAmount, setRaiseAmount] = useState('')
  const [roundType, setRoundType] = useState<string[]>([])
  const [hasRaisedBefore, setHasRaisedBefore] = useState<boolean | null>(null)
  const [previousRaise, setPreviousRaise] = useState('')

  // Step 5
  const [selectedInvestorTypes, setSelectedInvestorTypes] = useState<string[]>([])
  const [additionalInfo, setAdditionalInfo] = useState('')

  const progress = (step / TOTAL_STEPS) * 100

  const [validationError, setValidationError] = useState('')

  const goNext = () => {
    // Validate required fields for each step
    if (step === 1 && !city) {
      setValidationError('Please select your city')
      return
    }
    if (step === 2) {
      if (!startupName.trim()) { setValidationError('Please enter your startup name'); return }
      if (!pitch.trim()) { setValidationError('Please enter your one-line pitch'); return }
      if (selectedSectors.length === 0) { setValidationError('Please select at least one sector'); return }
    }
    if (step === 3 && !selectedStage) {
      setValidationError('Please select your startup stage')
      return
    }
    if (step === 4) {
      if (isRaising === null) { setValidationError('Please indicate if you are currently raising'); return }
      if (isRaising) {
        if (!raiseAmount.trim()) { setValidationError('Please enter how much you are looking to raise'); return }
        if (roundType.length === 0) { setValidationError('Please select the type of round'); return }
      }
      if (hasRaisedBefore === null) { setValidationError('Please indicate if you have raised before'); return }
      if (hasRaisedBefore && !previousRaise.trim()) { setValidationError('Please enter how much you have raised in total'); return }
    }
    if (step === 5 && selectedInvestorTypes.length === 0) {
      setValidationError('Please select at least one investor type')
      return
    }
    if (step < TOTAL_STEPS) {
      setDirection(1)
      setStep(step + 1)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setValidationError('')
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    const result = await submitFounderOnboarding({
      full_name: '',
      bio: bio,
      city: city,
      linkedin_url: '',
      avatar_url: profilePhoto || '',
      startup_name: startupName,
      one_liner: pitch,
      sectors: selectedSectors,
      website_url: website,
      stage: selectedStage,
      monthly_revenue: revenue,
      total_users: users,
      monthly_growth_rate: growthRate,
      team_size: '',
      is_raising: isRaising || false,
      raising_amount: raiseAmount,
      raising_round_type: roundType.join(', '),
      total_raised: previousRaise,
      looking_for: selectedInvestorTypes,
      pitch: additionalInfo,
      pitch_deck_url: '',
      video_pitch_url: '',
    })
    if (result.error) {
      setValidationError(result.error)
      return
    }
    window.location.href = '/app/feed'
  }

  const toggleSector = (s: string) => {
    setSelectedSectors(prev =>
      prev.includes(s)
        ? prev.filter(x => x !== s)
        : prev.length < 3 ? [...prev, s] : prev
    )
  }

  const toggleRoundType = (r: string) => {
    setRoundType(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    )
  }

  const toggleInvestorType = (t: string) => {
    setSelectedInvestorTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setProfilePhoto(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  const inputClass = "w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" />
          <span className="text-sm font-bold text-foreground tracking-tight">instart</span>
        </Link>
        <span className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl"
          >
            {/* Step 1: Welcome & Basic Info */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                    Let&apos;s set up your founder profile
                  </h1>
                  <p className="text-muted-foreground">This takes about 2 minutes and helps us match you with the right investors.</p>
                </div>

                {/* Photo Upload */}
                <div className="flex justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-28 h-28 rounded-full border-2 border-dashed border-white/20 hover:border-emerald-500/50 transition-colors flex items-center justify-center overflow-hidden group"
                  >
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-emerald-400 transition-colors">
                        <Camera className="w-6 h-6" />
                        <span className="text-xs">Upload photo</span>
                      </div>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your tagline</label>
                  <input
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Building the future of Indian agriculture"
                    className={inputClass}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />City
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-[#111]">Select your city</option>
                    {indianCities.map(c => (
                      <option key={c} value={c} className="bg-[#111]">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Startup Details */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                    Tell us about your startup
                  </h1>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Startup name</label>
                  <input value={startupName} onChange={e => setStartupName(e.target.value)} placeholder="Acme Technologies" className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">One-line pitch</label>
                  <div className="relative">
                    <input value={pitch} onChange={e => setPitch(e.target.value.slice(0, 120))} placeholder="We make X for Y using Z" className={inputClass} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{pitch.length}/120</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Sector / Industry <span className="text-muted-foreground text-xs">(pick up to 3)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map(s => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => toggleSector(s)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSectors.includes(s)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground'
                          }`}
                      >
                        {selectedSectors.includes(s) && <Check className="w-3.5 h-3.5 inline mr-1" />}
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />Website <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourstartup.com" className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 3: Stage & Metrics */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                    Where are you in your journey?
                  </h1>
                </div>

                {/* Stage Selector */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">Stage</label>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {stages.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => setSelectedStage(s)}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all min-w-[100px] ${selectedStage === s
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/3 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedStage === s ? 'bg-emerald-500 text-black' : 'bg-white/10'
                          }`}>
                          {i + 1}
                        </div>
                        <span className="text-xs font-medium">{s}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">Optional metrics — skip if not applicable</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Monthly Revenue</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                        <input value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="0" className={`${inputClass} pl-7`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Users / Customers</label>
                      <input value={users} onChange={e => setUsers(e.target.value)} placeholder="0" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">Monthly Growth</label>
                      <div className="relative">
                        <input value={growthRate} onChange={e => setGrowthRate(e.target.value)} placeholder="0" className={`${inputClass} pr-8`} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Funding */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                    What are your funding goals?
                  </h1>
                </div>

                {/* Currently Raising */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Are you currently raising?</label>
                  <div className="flex gap-3">
                    {[true, false].map(val => (
                      <motion.button
                        key={String(val)}
                        type="button"
                        onClick={() => setIsRaising(val)}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${isRaising === val
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                          }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {isRaising && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">How much are you looking to raise?</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                        <input value={raiseAmount} onChange={e => setRaiseAmount(e.target.value)} placeholder="50,00,000" className={`${inputClass} pl-7`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">What type of round?</label>
                      <div className="flex flex-wrap gap-2">
                        {roundTypes.map(r => (
                          <motion.button
                            key={r}
                            type="button"
                            onClick={() => toggleRoundType(r)}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${roundType.includes(r)
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                              : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
                              }`}
                          >
                            {r}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Raised Before */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Have you raised before?</label>
                  <div className="flex gap-3">
                    {[true, false].map(val => (
                      <motion.button
                        key={`prev-${String(val)}`}
                        type="button"
                        onClick={() => setHasRaisedBefore(val)}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${hasRaisedBefore === val
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                          }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {hasRaisedBefore && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-foreground mb-2">How much total?</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input value={previousRaise} onChange={e => setPreviousRaise(e.target.value)} placeholder="1,00,00,000" className={`${inputClass} pl-7`} />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 5: What You're Looking For */}
            {step === 5 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                    What kind of investors interest you?
                  </h1>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {investorTypes.map(t => (
                      <motion.button
                        key={t}
                        type="button"
                        onClick={() => toggleInvestorType(t)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${selectedInvestorTypes.includes(t)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground'
                          }`}
                      >
                        {selectedInvestorTypes.includes(t) && <Check className="w-3.5 h-3.5 inline mr-1" />}
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Anything else investors should know?</label>
                  <textarea
                    value={additionalInfo}
                    onChange={e => setAdditionalInfo(e.target.value)}
                    placeholder="What makes your startup special? What kind of support beyond money are you looking for?"
                    rows={4}
                    className={`${inputClass} h-auto py-3 resize-none`}
                  />
                </div>
              </div>
            )}

            {/* Step 6: Finish */}
            {step === 6 && (
              <div className="text-center space-y-8">
                {/* Animated Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
                  className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                  >
                    <Check className="w-12 h-12 text-black" strokeWidth={3} />
                  </motion.div>
                </motion.div>

                {/* Confetti particles */}
                <div className="relative">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full ${['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500'][i % 4]
                        }`}
                      initial={{
                        x: 0, y: 0, opacity: 1, scale: 1,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 300,
                        y: (Math.random() - 0.5) * 200 - 50,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.3 + i * 0.05,
                        ease: 'easeOut',
                      }}
                      style={{ left: '50%', top: '-40px' }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                    You&apos;re all set! <Sparkles className="w-8 h-8 inline text-amber-400" />
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Your profile is live. Let&apos;s find your perfect investor match.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-4"
                >
                  <Button
                    onClick={handleComplete}
                    className="h-14 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] glow-emerald"
                  >
                    Go to Feed <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <div className="flex items-center justify-center gap-6 text-sm">
                    <Link href="/app/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                      Edit my profile
                    </Link>
                    <Link href="/app/explore/startups" className="text-muted-foreground hover:text-foreground transition-colors">
                      Explore startups
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {step < 6 && (
        <div className="border-t border-white/5 px-4 md:px-8 py-4">
          {validationError && (
            <p className="text-sm text-red-400 text-center mb-3">{validationError}</p>
          )}
          <div className="flex items-center justify-between">
            <div>
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>
            <Button
              onClick={step === TOTAL_STEPS - 1 ? () => { goNext() } : goNext}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-11 rounded-xl font-medium"
            >
              {step === TOTAL_STEPS - 1 ? "Complete Setup" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
