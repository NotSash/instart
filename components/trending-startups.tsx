"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

const startups = [
  {
    name: "FinStack",
    pitch: "API infrastructure for embedded finance",
    sector: "Fintech",
    stage: "Series A",
    score: 92,
    logo: "F",
    color: "emerald",
  },
  {
    name: "AgriChain",
    pitch: "Farm-to-fork supply chain platform",
    sector: "AgriTech",
    stage: "Seed",
    score: 88,
    logo: "A",
    color: "cyan",
  },
  {
    name: "HealthPulse",
    pitch: "AI diagnostics for rural clinics",
    sector: "HealthTech",
    stage: "Pre-Seed",
    score: 85,
    logo: "H",
    color: "emerald",
  },
  {
    name: "EduVerse",
    pitch: "Vernacular learning for Bharat",
    sector: "EdTech",
    stage: "Series A",
    score: 90,
    logo: "E",
    color: "cyan",
  },
  {
    name: "CleanGrid",
    pitch: "Smart grid solutions for solar",
    sector: "CleanTech",
    stage: "Seed",
    score: 87,
    logo: "C",
    color: "emerald",
  },
]

export function TrendingStartups() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8 md:mb-12"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground" style={{ letterSpacing: "-0.02em" }}>
              Trending on Instart
            </h2>
          </div>
          <Link
            href="/signup"
            className="hidden md:flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all startups
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Scrollable cards */}
        <div className="relative">
          {/* Fade right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {startups.map((startup, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
              >
                <div className="glass-card p-5 md:p-6 h-full hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 group">
                  {/* Header */}
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <div
                      className={`w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-base md:text-lg font-bold ${startup.color === "emerald"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-cyan-500/20 text-cyan-400"
                        }`}
                    >
                      {startup.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground">
                        {startup.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                        {startup.pitch}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                    <span className="px-2 py-0.5 md:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-muted-foreground">
                      {startup.sector}
                    </span>
                    <span
                      className={`px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs ${startup.color === "emerald"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}
                    >
                      {startup.stage}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <TrendingUp className="w-3.5 md:w-4 h-3.5 md:h-4 text-emerald-400" />
                      <span className="text-xs md:text-sm text-muted-foreground">
                        Health Score
                      </span>
                    </div>
                    <span className="text-base md:text-lg font-bold text-emerald-400">
                      {startup.score}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
            >
              <Link href="/signup" className="glass-card p-5 md:p-6 h-full flex flex-col items-center justify-center text-center border-dashed border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-emerald-500/20 transition-all">
                  <ArrowRight className="w-5 md:w-6 h-5 md:h-6 text-emerald-400" />
                </div>
                <p className="text-sm md:text-base text-foreground font-medium mb-1 md:mb-2">
                  See 500+ more startups
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Sign up to unlock full access
                </p>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile link */}
        <Link
          href="/signup"
          className="flex md:hidden items-center justify-center gap-2 mt-6 md:mt-8 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all startups
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
