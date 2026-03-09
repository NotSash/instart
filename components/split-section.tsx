"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const founderBenefits = [
  "Access to 1,200+ verified investors",
  "AI-optimized investor matching",
  "Pitch deck feedback & scoring",
  "Secure deal room for due diligence",
  "Real-time investor engagement tracking",
]

const investorBenefits = [
  "Curated deal flow from 500+ startups",
  "Advanced filtering by sector & stage",
  "Automated portfolio tracking",
  "Direct founder communication",
  "Exclusive co-investment opportunities",
]

export function SplitSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-0">
          {/* For Founders */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative p-6 md:p-8 lg:p-12 lg:pr-16"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl md:rounded-3xl lg:rounded-r-none" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 md:mb-6">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] md:text-xs text-emerald-400 font-medium uppercase tracking-wider">
                  For Founders
                </span>
              </div>

              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-3 md:mb-4" style={{ letterSpacing: "-0.02em" }}>
                Raise smarter, faster
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                Skip the cold outreach. Get warm intros to investors who are actively looking for startups like yours.
              </p>

              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {founderBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5 md:gap-3">
                    <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 md:w-3 h-2.5 md:h-3 text-emerald-400" />
                    </div>
                    <span className="text-sm md:text-base text-foreground/90">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 md:px-6 h-11 md:h-12 rounded-full transition-all hover:scale-[1.03] active:scale-[0.97] text-sm md:text-base"
              >
                <Link href="/signup">
                  Start Raising
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* For Investors */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative p-6 md:p-8 lg:p-12 lg:pl-16"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-2xl md:rounded-3xl lg:rounded-l-none" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4 md:mb-6">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-cyan-400" />
                <span className="text-[10px] md:text-xs text-cyan-400 font-medium uppercase tracking-wider">
                  For Investors
                </span>
              </div>

              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-3 md:mb-4" style={{ letterSpacing: "-0.02em" }}>
                Discover India&apos;s best deals
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                Stop sifting through noise. Get curated access to vetted startups matched to your investment thesis.
              </p>

              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {investorBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5 md:gap-3">
                    <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 md:w-3 h-2.5 md:h-3 text-cyan-400" />
                    </div>
                    <span className="text-sm md:text-base text-foreground/90">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 md:px-6 h-11 md:h-12 rounded-full transition-all hover:scale-[1.03] active:scale-[0.97] text-sm md:text-base"
              >
                <Link href="/signup">
                  Start Investing
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
