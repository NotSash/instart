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
import { submitCofounderOnboarding } from '@/app/actions/onboarding'

const TOTAL_STEPS = 5

const skills = [
    'Frontend Dev', 'Backend Dev', 'Full Stack', 'Mobile Dev', 'AI/ML',
    'Data Science', 'Product Management', 'UI/UX Design', 'Marketing',
    'Sales', 'Finance', 'Operations', 'Legal', 'Domain Expert'
]

const skillColors: Record<string, string> = {
    'Frontend Dev': 'cyan', 'Backend Dev': 'cyan', 'Full Stack': 'cyan',
    'Mobile Dev': 'cyan', 'AI/ML': 'cyan', 'Data Science': 'cyan',
    'Product Management': 'emerald', 'Marketing': 'emerald', 'Sales': 'emerald',
    'Finance': 'emerald', 'Operations': 'emerald', 'Legal': 'emerald',
    'UI/UX Design': 'purple', 'Domain Expert': 'purple',
}

const commitmentLevels = ['Full-time', 'Part-time', 'Weekends Only', 'Flexible']

const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'SaaS', 'D2C',
    'CleanTech', 'AI/ML', 'Logistics', 'Social Impact', 'Gaming', 'Other'
]

const equityOptions = ['Equal split', 'Negotiable', 'Willing to vest', 'Open to discussion']

const statuses = ['Working Professional', 'Student', 'Full-time Entrepreneur', 'Freelancer', 'Between Jobs']

const indianCities = [
    'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh',
    'Indore', 'Coimbatore', 'Goa', 'Other'
]

function getPillColor(skill: string, selected: boolean) {
    const color = skillColors[skill] || 'emerald'
    if (!selected) return 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground'
    switch (color) {
        case 'cyan': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
        case 'purple': return 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
        default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
    }
}

export default function CofounderOnboarding() {
    useRouter()
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [validationError, setValidationError] = useState('')

    // Step 1
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
    const [status, setStatus] = useState('')
    const [city, setCity] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Step 2
    const [mySkills, setMySkills] = useState<string[]>([])
    const [experience, setExperience] = useState('')

    // Step 3
    const [wantedSkills, setWantedSkills] = useState<string[]>([])
    const [commitment, setCommitment] = useState('')
    const [hasIdea, setHasIdea] = useState<boolean | null>(null)
    const [ideaDescription, setIdeaDescription] = useState('')

    // Step 4
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [remoteOk, setRemoteOk] = useState(false)
    const [equityPref, setEquityPref] = useState('')

    const progress = (step / TOTAL_STEPS) * 100

    const validateStep = (): string | null => {
        const validators: Record<number, () => string | null> = {
            1: () => (!status ? 'Please select your current status' : !city ? 'Please select your city' : null),
            2: () => (mySkills.length === 0 ? 'Please select at least one skill' : !experience.trim() ? 'Please describe your experience' : null),
            3: () => {
                if (wantedSkills.length === 0) return 'Please select at least one skill you\'re looking for'
                if (!commitment) return 'Please select your commitment level'
                if (hasIdea === null) return 'Please indicate if you have a startup idea'
                if (hasIdea && !ideaDescription.trim()) return 'Please describe your idea'
                return null
            },
            4: () => (selectedSectors.length === 0 ? 'Please select at least one sector' : !equityPref ? 'Please select your equity preference' : null)
        }
        return validators[step]?.() || null
    }

    const goNext = () => {
        const error = validateStep()
        if (error) { setValidationError(error); return }
        setValidationError('')
        if (step < TOTAL_STEPS) { setDirection(1); setStep(step + 1) }
    }
    const goBack = () => { if (step > 1) { setValidationError(''); setDirection(-1); setStep(step - 1) } }
    const handleComplete = async () => {
        const result = await submitCofounderOnboarding({
            full_name: '',
            bio: '',
            city: city,
            linkedin_url: linkedin,
            avatar_url: profilePhoto || '',
            current_status: status,
            skills: mySkills,
            looking_for_skills: wantedSkills,
            commitment: commitment,
            has_idea: hasIdea || false,
            idea_description: ideaDescription,
            preferred_sectors: selectedSectors,
            preferred_cities: [city],
            remote_ok: remoteOk,
            equity_expectation: equityPref,
            experience_description: experience,
        })
        if (result.error) {
            setValidationError(result.error)
            return
        }
        globalThis.location.href = '/app/explore/cofounders'
    }

    const toggleSkill = (list: string[], setList: (v: string[]) => void, s: string) => {
        setList(list.includes(s) ? list.filter(x => x !== s) : [...list, s])
    }

    const toggleSector = (s: string) => {
        setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
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
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
                <motion.div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
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
                        {/* Step 1: Welcome */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Let&apos;s help you find your perfect co-founder</h1>
                                    <p className="text-muted-foreground">A great co-founder can change everything.</p>
                                </div>

                                <div className="flex justify-center">
                                    <button onClick={() => fileInputRef.current?.click()} className="relative w-28 h-28 rounded-full border-2 border-dashed border-white/20 hover:border-purple-500/50 transition-colors flex items-center justify-center overflow-hidden group">
                                        {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (
                                            <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-purple-400 transition-colors">
                                                <Camera className="w-6 h-6" /><span className="text-xs">Upload photo</span>
                                            </div>
                                        )}
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">Current role / status</label>
                                    <select id="status" value={status} onChange={e => setStatus(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                        <option value="" className="bg-[#111]">Select your status</option>
                                        {statuses.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="cofCity" className="block text-sm font-medium text-foreground mb-2"><MapPin className="w-4 h-4 inline mr-1" />City</label>
                                    <select id="cofCity" value={city} onChange={e => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                        <option value="" className="bg-[#111]">Select your city</option>
                                        {indianCities.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-2"><svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>LinkedIn</label>
                                    <input id="linkedin" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className={inputClass} />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Your Skills */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>What do you bring to the table?</h1>
                                    <p className="text-muted-foreground">Select all skills that apply</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {skills.map(s => (
                                        <motion.button key={s} type="button" onClick={() => toggleSkill(mySkills, setMySkills, s)} whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${getPillColor(s, mySkills.includes(s))}`}>
                                            {mySkills.includes(s) && <Check className="w-3.5 h-3.5 inline mr-1" />}{s}
                                        </motion.button>
                                    ))}
                                </div>
                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">Describe your experience</label>
                                    <textarea id="experience" value={experience} onChange={e => setExperience(e.target.value)} placeholder="What are you great at? What&apos;s your background?" rows={4} className={`${inputClass} h-auto py-3 resize-none`} />
                                </div>
                            </div>
                        )}

                        {/* Step 3: What You're Looking For */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>What kind of co-founder do you need?</h1>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {skills.map(s => (
                                        <motion.button key={s} type="button" onClick={() => toggleSkill(wantedSkills, setWantedSkills, s)} whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${getPillColor(s, wantedSkills.includes(s))}`}>
                                            {wantedSkills.includes(s) && <Check className="w-3.5 h-3.5 inline mr-1" />}{s}
                                        </motion.button>
                                    ))}
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-foreground mb-3">Commitment level</span>
                                    <div className="flex flex-wrap gap-2">
                                        {commitmentLevels.map(c => (
                                            <motion.button key={c} type="button" onClick={() => setCommitment(c)} whileTap={{ scale: 0.95 }}
                                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${commitment === c ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'}`}>
                                                {c}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-foreground mb-3">Do you have a startup idea already?</span>
                                    <div className="flex gap-3">
                                        {[true, false].map(val => (
                                            <motion.button key={String(val)} type="button" onClick={() => setHasIdea(val)} whileTap={{ scale: 0.95 }}
                                                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${hasIdea === val ? 'bg-purple-500/15 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'}`}>
                                                {val ? 'Yes' : 'No'}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                {hasIdea && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <textarea value={ideaDescription} onChange={e => setIdeaDescription(e.target.value)} placeholder="Briefly describe your idea..." rows={3} className={`${inputClass} h-auto py-3 resize-none`} />
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Preferences */}
                        {step === 4 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>A few more details</h1>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-foreground mb-3">Preferred sectors</span>
                                    <div className="flex flex-wrap gap-2">
                                        {sectors.map(s => (
                                            <motion.button key={s} type="button" onClick={() => toggleSector(s)} whileTap={{ scale: 0.95 }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSectors.includes(s) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'}`}>
                                                {s}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div className="glass-card p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Remote OK</p>
                                        <p className="text-xs text-muted-foreground">Open to co-founders from any location</p>
                                    </div>
                                    <button onClick={() => setRemoteOk(!remoteOk)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${remoteOk ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                        <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" animate={{ left: remoteOk ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                                    </button>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-foreground mb-3">Equity expectations</span>
                                    <div className="flex flex-wrap gap-2">
                                        {equityOptions.map(e => (
                                            <motion.button key={e} type="button" onClick={() => setEquityPref(e)} whileTap={{ scale: 0.95 }}
                                                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${equityPref === e ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'}`}>
                                                {e}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Finish */}
                        {step === 5 && (
                            <div className="text-center space-y-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }} className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}>
                                        <Check className="w-12 h-12 text-black" strokeWidth={3} />
                                    </motion.div>
                                </motion.div>

                                <div className="relative">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <motion.div key={i} className={`absolute w-2 h-2 rounded-full ${['bg-purple-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'][i % 4]}`}
                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200 - 50, opacity: 0, scale: 0 }}
                                            transition={{ duration: 1.5, delay: 0.3 + i * 0.05, ease: 'easeOut' }} style={{ left: '50%', top: '-40px' }}
                                        />
                                    ))}
                                </div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                                        You&apos;re ready to find your co-founder! <Sparkles className="w-8 h-8 inline text-amber-400" />
                                    </h1>
                                    <p className="text-muted-foreground text-lg">Your perfect match is out there. Let&apos;s find them.</p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                    <Button onClick={handleComplete} className="h-14 px-8 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ boxShadow: '0 0 60px rgba(168,85,247,0.15)' }}>
                                        Browse Co-founders <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {step < 5 && (
                <div className="border-t border-white/5 px-4 md:px-8 py-4">
                    {validationError && (
                        <p className="text-sm text-red-400 text-center mb-3">{validationError}</p>
                    )}
                    <div className="flex items-center justify-between">
                        <div>{step > 1 && <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>}</div>
                        <Button onClick={goNext} className="bg-purple-600 hover:bg-purple-500 text-white px-8 h-11 rounded-xl font-medium">
                            {step === 4 ? 'Complete Setup' : 'Continue'}<ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
