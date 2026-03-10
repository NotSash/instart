'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, Camera, MapPin, ChevronRight, Check, Sparkles,
    ArrowRight, Plus, Trash2, Linkedin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitInvestorOnboarding } from '@/app/actions/onboarding'

const TOTAL_STEPS = 6

const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'SaaS', 'D2C',
    'CleanTech', 'AI/ML', 'Logistics', 'Social Impact', 'Gaming', 'Other'
]

const stages = ['Idea', 'MVP', 'Early Traction', 'Growth', 'Scale']

const investmentCounts = ['0', '1-5', '6-15', '16-50', '50+']

const outcomes = ['Active', 'Exited', 'Acquired', 'Shut Down']

const indianCities = [
    'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh',
    'Indore', 'Coimbatore', 'Goa', 'Other'
]

interface PortfolioItem {
    name: string
    year: string
    outcome: string
}

export default function InvestorOnboarding() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [validationError, setValidationError] = useState('')

    // Step 1
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [city, setCity] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Step 2
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [selectedStages, setSelectedStages] = useState<string[]>([])

    // Step 3
    const [checkMin, setCheckMin] = useState('')
    const [checkMax, setCheckMax] = useState('')
    const [investmentCount, setInvestmentCount] = useState('')
    const [thesis, setThesis] = useState('')

    // Step 4
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])

    // Step 5
    const [prefs, setPrefs] = useState({
        weeklyDigest: true,
        aiMatched: true,
        coInvesting: true,
        mentoring: true,
    })

    const progress = (step / TOTAL_STEPS) * 100

    const goNext = () => {
        if (step === 1) {
            if (!title.trim()) { setValidationError('Please enter your professional title'); return }
            if (!city) { setValidationError('Please select your city'); return }
        }
        if (step === 2) {
            if (selectedSectors.length === 0) { setValidationError('Please select at least one sector'); return }
            if (selectedStages.length === 0) { setValidationError('Please select at least one preferred stage'); return }
        }
        if (step === 3) {
            if (!investmentCount) { setValidationError('Please select how many investments you\'ve made'); return }
        }
        setValidationError('')
        if (step < TOTAL_STEPS) { setDirection(1); setStep(step + 1) }
    }
    const goBack = () => { if (step > 1) { setValidationError(''); setDirection(-1); setStep(step - 1) } }
    const handleComplete = async () => {
        const result = await submitInvestorOnboarding({
            full_name: '',
            bio: '',
            city: city,
            linkedin_url: linkedin,
            avatar_url: profilePhoto || '',
            professional_title: title,
            sectors_of_interest: selectedSectors,
            preferred_stages: selectedStages,
            min_check_size: checkMin,
            max_check_size: checkMax,
            investment_thesis: thesis,
            is_actively_investing: true,
            open_to_syndicate: prefs.coInvesting,
            open_to_mentoring: prefs.mentoring,
        })
        if (result.error) {
            setValidationError(result.error)
            return
        }
        window.location.href = '/app/explore/startups'
    }

    const toggleSector = (s: string) => {
        setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev)
    }

    const toggleStage = (s: string) => {
        setSelectedStages(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (ev) => setProfilePhoto(ev.target?.result as string)
            reader.readAsDataURL(file)
        }
    }

    const addPortfolioItem = () => setPortfolio([...portfolio, { name: '', year: '', outcome: 'Active' }])
    const removePortfolioItem = (i: number) => setPortfolio(portfolio.filter((_, idx) => idx !== i))
    const updatePortfolioItem = (i: number, field: keyof PortfolioItem, value: string) => {
        const updated = [...portfolio]
        updated[i] = { ...updated[i], [field]: value }
        setPortfolio(updated)
    }

    const slideVariants = {
        enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
    }

    const inputClass = "w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"

    const prefItems = [
        { key: 'weeklyDigest' as const, label: 'Email me weekly deal flow digests', desc: 'Get curated startup opportunities in your inbox every Monday' },
        { key: 'aiMatched' as const, label: 'Show me AI-matched startups', desc: 'Our AI finds startups matching your investment thesis and preferences' },
        { key: 'coInvesting' as const, label: "I'm open to co-investing in syndicates", desc: 'Pool resources with other investors for larger rounds' },
        { key: 'mentoring' as const, label: "I'm interested in mentoring founders too", desc: 'Share your expertise beyond capital with promising founders' },
    ]

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col">
            {/* Progress */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
                <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image src="/logo.png" alt="Instart Logo" width={24} height={24} className="rounded" />
                    <span className="text-sm font-bold text-foreground tracking-tight">instart</span>
                </Link>
                <span className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
            </div>

            {/* Content */}
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
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Let&apos;s set up your investor profile</h1>
                                    <p className="text-muted-foreground">Help great founders find you.</p>
                                </div>

                                <div className="flex justify-center">
                                    <button onClick={() => fileInputRef.current?.click()} className="relative w-28 h-28 rounded-full border-2 border-dashed border-white/20 hover:border-emerald-500/50 transition-colors flex items-center justify-center overflow-hidden group">
                                        {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (
                                            <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-emerald-400 transition-colors">
                                                <Camera className="w-6 h-6" /><span className="text-xs">Upload photo</span>
                                            </div>
                                        )}
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Professional title / role</label>
                                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Angel Investor, Partner at XYZ Fund" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2"><MapPin className="w-4 h-4 inline mr-1" />City</label>
                                    <select value={city} onChange={e => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                        <option value="" className="bg-[#111]">Select your city</option>
                                        {indianCities.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2"><Linkedin className="w-4 h-4 inline mr-1" />LinkedIn <span className="text-xs text-muted-foreground">(optional)</span></label>
                                    <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className={inputClass} />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Investment Focus */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>What sectors do you invest in?</h1>
                                    <p className="text-muted-foreground">Select up to 5 sectors</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {sectors.map(s => (
                                        <motion.button key={s} type="button" onClick={() => toggleSector(s)} whileTap={{ scale: 0.95 }} className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${selectedSectors.includes(s) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground'}`}>
                                            {selectedSectors.includes(s) && <Check className="w-3.5 h-3.5 inline mr-1" />}{s}
                                        </motion.button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-4">What stages do you prefer?</label>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {stages.map((s, i) => (
                                            <motion.button key={s} type="button" onClick={() => toggleStage(s)} whileTap={{ scale: 0.95 }}
                                                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all min-w-[100px] ${selectedStages.includes(s) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/3 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedStages.includes(s) ? 'bg-emerald-500 text-black' : 'bg-white/10'}`}>{i + 1}</div>
                                                <span className="text-xs font-medium">{s}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Investment Details */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Tell us about your investment style</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">Typical check size range</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                                            <input value={checkMin} onChange={e => setCheckMin(e.target.value)} placeholder="5,00,000" className={`${inputClass} pl-7`} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Min</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                                            <input value={checkMax} onChange={e => setCheckMax(e.target.value)} placeholder="50,00,000" className={`${inputClass} pl-7`} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Max</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Investments made so far</label>
                                    <div className="flex flex-wrap gap-2">
                                        {investmentCounts.map(c => (
                                            <motion.button key={c} type="button" onClick={() => setInvestmentCount(c)} whileTap={{ scale: 0.95 }}
                                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${investmentCount === c ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'}`}>
                                                {c}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Investment thesis or philosophy</label>
                                    <textarea value={thesis} onChange={e => setThesis(e.target.value)} placeholder="What do you look for in founders and startups?" rows={4} className={`${inputClass} h-auto py-3 resize-none`} />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Portfolio */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>Show off your portfolio</h1>
                                    <p className="text-muted-foreground">Add your past investments — this is optional.</p>
                                </div>

                                {portfolio.map((item, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground">Investment {i + 1}</span>
                                            <button onClick={() => removePortfolioItem(i)} className="text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <input value={item.name} onChange={e => updatePortfolioItem(i, 'name', e.target.value)} placeholder="Startup name" className={inputClass} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input value={item.year} onChange={e => updatePortfolioItem(i, 'year', e.target.value)} placeholder="Year (e.g. 2023)" className={inputClass} />
                                            <select value={item.outcome} onChange={e => updatePortfolioItem(i, 'outcome', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                                {outcomes.map(o => <option key={o} value={o} className="bg-[#111]">{o}</option>)}
                                            </select>
                                        </div>
                                    </motion.div>
                                ))}

                                <Button type="button" variant="outline" onClick={addPortfolioItem} className="w-full h-12 rounded-xl border-dashed border-white/20 hover:border-emerald-500/30 text-muted-foreground hover:text-emerald-400">
                                    <Plus className="w-4 h-4 mr-2" /> Add an investment
                                </Button>

                                <button onClick={goNext} className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors underline">
                                    Skip this step
                                </button>
                            </div>
                        )}

                        {/* Step 5: Preferences */}
                        {step === 5 && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>How do you want to discover startups?</h1>
                                </div>
                                <div className="space-y-4">
                                    {prefItems.map(item => (
                                        <div key={item.key} className="glass-card p-4 flex items-start gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">{item.label}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                                                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${prefs[item.key] ? 'bg-emerald-500' : 'bg-white/10'}`}
                                            >
                                                <motion.div
                                                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                                                    animate={{ left: prefs[item.key] ? 22 : 2 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 6: Finish */}
                        {step === 6 && (
                            <div className="text-center space-y-8">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }} className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}>
                                        <Check className="w-12 h-12 text-black" strokeWidth={3} />
                                    </motion.div>
                                </motion.div>

                                <div className="relative">
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div key={i} className={`absolute w-2 h-2 rounded-full ${['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500'][i % 4]}`}
                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                            animate={{ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200 - 50, opacity: 0, scale: 0 }}
                                            transition={{ duration: 1.5, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
                                            style={{ left: '50%', top: '-40px' }}
                                        />
                                    ))}
                                </div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                                        Your investor profile is live! <Sparkles className="w-8 h-8 inline text-amber-400" />
                                    </h1>
                                    <p className="text-muted-foreground text-lg">Let&apos;s find your next big deal.</p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="space-y-4">
                                    <Button onClick={handleComplete} className="h-14 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] glow-emerald">
                                        Explore Startups <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            {step < 6 && (
                <div className="border-t border-white/5 px-4 md:px-8 py-4">
                    {validationError && (
                        <p className="text-sm text-red-400 text-center mb-3">{validationError}</p>
                    )}
                    <div className="flex items-center justify-between">
                        <div>{step > 1 && <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>}</div>
                        <Button onClick={goNext} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-11 rounded-xl font-medium">
                            {step === 5 ? 'Complete Setup' : 'Continue'}<ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
