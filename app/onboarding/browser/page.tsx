'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, Camera, MapPin, ChevronRight, Check, Sparkles,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitBrowserOnboarding } from '@/app/actions/onboarding'

const TOTAL_STEPS = 2

const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'SaaS', 'D2C',
    'CleanTech', 'AI/ML', 'Logistics', 'Social Impact', 'Gaming', 'Other'
]

const indianCities = [
    'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh',
    'Indore', 'Coimbatore', 'Goa', 'Other'
]

export default function BrowserOnboarding() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [validationError, setValidationError] = useState('')

    // Step 1
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
    const [city, setCity] = useState('')
    const [interests, setInterests] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const progress = (step / TOTAL_STEPS) * 100

    const goNext = () => {
        if (step === 1) {
            if (!city) { setValidationError('Please select your city'); return }
            if (interests.length === 0) { setValidationError('Please select at least one interest'); return }
        }
        setValidationError('')
        if (step < TOTAL_STEPS) { setDirection(1); setStep(step + 1) }
    }
    const goBack = () => { if (step > 1) { setValidationError(''); setDirection(-1); setStep(step - 1) } }
    const handleComplete = async () => {
        const result = await submitBrowserOnboarding({
            full_name: '',
            city: city,
            avatar_url: profilePhoto || '',
            interests: interests,
        })
        if (result.error) {
            setValidationError(result.error)
            return
        }
        router.push('/app/explore/startups')
    }

    const toggleInterest = (s: string) => {
        setInterests(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev)
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

    const inputClass = "w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col">
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
                <motion.div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </div>

            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" />
                    <span className="text-sm font-bold text-foreground tracking-tight">instart</span>
                </Link>
                <span className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step} custom={direction} variants={slideVariants}
                        initial="enter" animate="center" exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-xl"
                    >
                        {/* Step 1: Quick Setup */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Quick setup — just a few details</h1>
                                    <p className="text-muted-foreground">This helps us personalize your browsing experience.</p>
                                </div>

                                <div className="flex justify-center">
                                    <button onClick={() => fileInputRef.current?.click()} className="relative w-28 h-28 rounded-full border-2 border-dashed border-white/20 hover:border-amber-500/50 transition-colors flex items-center justify-center overflow-hidden group">
                                        {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (
                                            <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-amber-400 transition-colors">
                                                <Camera className="w-6 h-6" /><span className="text-xs">Upload photo</span>
                                            </div>
                                        )}
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </div>

                                <div>
                                    <label htmlFor="browserCity" className="block text-sm font-medium text-foreground mb-2"><MapPin className="w-4 h-4 inline mr-1" />City</label>
                                    <select id="browserCity" value={city} onChange={e => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                        <option value="" className="bg-[#111]">Select your city</option>
                                        {indianCities.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-foreground mb-3">What interests you? <span className="text-muted-foreground text-xs">(pick up to 5)</span></span>
                                    <div className="flex flex-wrap gap-2">
                                        {sectors.map(s => (
                                            <motion.button
                                                key={s}
                                                type="button"
                                                onClick={() => toggleInterest(s)}
                                                whileTap={{ scale: 0.95 }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${interests.includes(s)
                                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                                    : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground'
                                                    }`}
                                            >
                                                {interests.includes(s) && <Check className="w-3.5 h-3.5 inline mr-1" />}
                                                {s}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Finish */}
                        {step === 2 && (
                            <div className="text-center space-y-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }} className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}>
                                        <Check className="w-12 h-12 text-black" strokeWidth={3} />
                                    </motion.div>
                                </motion.div>

                                <div className="relative">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <motion.div key={i} className={`absolute w-2 h-2 rounded-full ${['bg-amber-500', 'bg-orange-500', 'bg-emerald-500', 'bg-cyan-500'][i % 4]}`}
                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200 - 50, opacity: 0, scale: 0 }}
                                            transition={{ duration: 1.5, delay: 0.3 + i * 0.05, ease: 'easeOut' }} style={{ left: '50%', top: '-40px' }}
                                        />
                                    ))}
                                </div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                                        You&apos;re all set! <Sparkles className="w-8 h-8 inline text-amber-400" />
                                    </h1>
                                    <p className="text-muted-foreground text-lg">Start exploring startups, read forums, and discover the ecosystem.</p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                    <Button onClick={handleComplete} className="h-14 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ boxShadow: '0 0 60px rgba(245,158,11,0.15)' }}>
                                        Explore Startups <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {step < 2 && (
                <div className="border-t border-white/5 px-4 md:px-8 py-4">
                    {validationError && (
                        <p className="text-sm text-red-400 text-center mb-3">{validationError}</p>
                    )}
                    <div className="flex items-center justify-between">
                        <div>{step > 1 && <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>}</div>
                        <Button onClick={goNext} className="bg-amber-600 hover:bg-amber-500 text-white px-8 h-11 rounded-xl font-medium">
                            Complete Setup<ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
