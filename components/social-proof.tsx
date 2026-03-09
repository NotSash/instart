"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const companies = [
  { name: "Razorpay", logo: "R" },
  { name: "Zerodha", logo: "Z" },
  { name: "CRED", logo: "C" },
  { name: "Meesho", logo: "M" },
  { name: "PhonePe", logo: "P" },
  { name: "Swiggy", logo: "S" },
  { name: "Ola", logo: "O" },
  { name: "Flipkart", logo: "F" },
]

export function SocialProof() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="relative py-20 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <p className="text-center text-sm text-muted-foreground mb-10 tracking-wide uppercase">
          Backed by founders from
        </p>

        {/* Marquee container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />

          {/* Scrolling content */}
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-3 mx-10 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300">
                  {company.logo}
                </div>
                <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
