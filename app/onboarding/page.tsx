'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Rocket, TrendingUp, Users, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Role = 'founder' | 'investor' | 'cofounder' | 'browser' | null

const roles = [
  {
    id: 'founder' as Role,
    icon: Rocket,
    title: 'I\'m a Founder',
    description: 'I\'m building a startup and want to raise capital or connect with investors.',
    color: 'emerald',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'investor' as Role,
    icon: TrendingUp,
    title: 'I\'m an Investor',
    description: 'I want to discover promising startups and invest in the next big thing.',
    color: 'cyan',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/20',
  },
  {
    id: 'cofounder' as Role,
    icon: Users,
    title: 'I\'m Looking for a Co-founder',
    description: 'I want to find the perfect co-founder to build something great together.',
    color: 'purple',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/20',
  },
  {
    id: 'browser' as Role,
    icon: Eye,
    title: 'Just Browsing',
    description: 'I want to explore startups, read forums, and stay updated on the ecosystem.',
    color: 'amber',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/20',
  },
]

export default function OnboardingRoleSelection() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleContinue = () => {
    if (!selectedRole) return
    setIsNavigating(true)
    router.push(`/onboarding/${selectedRole}`)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <Image src="/logo.png" alt="Instart Logo" width={36} height={36} className="rounded-lg group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-bold text-foreground tracking-tight">instart</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
            Welcome! Tell us about yourself
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your role to personalize your experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 mb-8">
          {roles.map((role, index) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-5 ${isSelected
                    ? `${role.borderColor} ${role.bgColor} shadow-lg ${role.glowColor}`
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? `${role.bgColor} ${role.iconColor}` : 'bg-white/5 text-muted-foreground'
                  }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-lg">{role.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{role.description}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${role.color === 'emerald' ? 'bg-emerald-500' : role.color === 'cyan' ? 'bg-cyan-500' : role.color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'
                      }`}
                  >
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isNavigating}
            className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isNavigating ? 'Loading...' : 'Continue'}
            {!isNavigating && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
