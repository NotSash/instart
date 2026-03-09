"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

function AnimatedCounter({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { value: 500, suffix: "+", label: "Active Startups" },
  { value: 200, suffix: "Cr+", prefix: "₹", label: "Funds Raised" },
  { value: 1200, suffix: "+", label: "Investors" },
]

export function Hero() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-emerald-500/10 blur-[100px] md:blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-cyan-500/8 blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full glass border-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-default">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs md:text-sm text-muted-foreground">
              Trusted by <span className="text-emerald-400 font-medium">500+</span> Indian startups
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 max-w-5xl mx-auto text-balance"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
        >
          Where India&apos;s Next{" "}
          <span className="text-gradient">Unicorns</span>{" "}
          Meet Their Investors
        </motion.h1>

        {/* Subheadline */}
        <motion.p variants={itemVariants} className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
          The premium platform connecting ambitious founders with visionary investors.
          AI-powered matching, secure deal rooms, and real-time insights.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-4 px-4">
          <Button
            asChild
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 md:px-8 h-12 md:h-14 rounded-full text-sm md:text-base transition-all hover:scale-[1.03] active:scale-[0.97] glow-emerald-sm w-full sm:w-auto"
          >
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            asChild
            variant="outline"
            className="border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white font-medium px-6 md:px-8 h-12 md:h-14 rounded-full text-sm md:text-base transition-all hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto"
          >
            <Link href="/demo">Watch Demo</Link>
          </Button>
        </motion.div>

        {/* Helper text */}
        <motion.p variants={itemVariants} className="text-xs md:text-sm text-muted-foreground mb-12 md:mb-16">
          No credit card required. Setup in 2 minutes.
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-12 md:mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-0.5 md:mb-1">
                {stat.prefix}
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Browser mockup — links to /demo */}
        <motion.div variants={itemVariants} className="relative max-w-5xl mx-auto">
          <Link href="/demo" className="block group">
            <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden glow-emerald group-hover:border-emerald-500/20 transition-colors">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 border-b border-white/5">
                <div className="flex gap-1 md:gap-1.5">
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-500/60" />
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-2 md:px-4 py-0.5 md:py-1 rounded-full bg-white/5 text-[10px] md:text-xs text-muted-foreground group-hover:text-emerald-400 transition-colors">
                    app.instart.com/dashboard — click to explore
                  </div>
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="aspect-[16/10] md:aspect-[16/9] bg-gradient-to-br from-[#0a0a0f] to-[#050505] p-4 md:p-6 lg:p-10">
                <div className="grid grid-cols-12 gap-2 md:gap-4 h-full">
                  {/* Sidebar mock */}
                  <div className="col-span-2 hidden md:block">
                    <div className="space-y-2 md:space-y-3">
                      <div className="h-6 md:h-8 rounded-lg bg-emerald-500/20" />
                      <div className="h-5 md:h-6 rounded-lg bg-white/5" />
                      <div className="h-5 md:h-6 rounded-lg bg-white/5" />
                      <div className="h-5 md:h-6 rounded-lg bg-white/5" />
                      <div className="h-5 md:h-6 rounded-lg bg-white/5" />
                    </div>
                  </div>
                  {/* Main content mock */}
                  <div className="col-span-12 md:col-span-10 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <div className="h-16 md:h-24 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-4">
                        <div className="h-2 md:h-3 w-10 md:w-16 rounded bg-emerald-500/30 mb-1 md:mb-2" />
                        <div className="h-4 md:h-6 w-14 md:w-24 rounded bg-white/10" />
                      </div>
                      <div className="h-16 md:h-24 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-4">
                        <div className="h-2 md:h-3 w-10 md:w-16 rounded bg-cyan-500/30 mb-1 md:mb-2" />
                        <div className="h-4 md:h-6 w-14 md:w-24 rounded bg-white/10" />
                      </div>
                      <div className="h-16 md:h-24 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-4">
                        <div className="h-2 md:h-3 w-10 md:w-16 rounded bg-emerald-500/30 mb-1 md:mb-2" />
                        <div className="h-4 md:h-6 w-14 md:w-24 rounded bg-white/10" />
                      </div>
                    </div>
                    <div className="h-28 md:h-48 rounded-lg md:rounded-xl bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
