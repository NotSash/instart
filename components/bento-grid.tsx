"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { 
  Brain, 
  Shield, 
  Rss, 
  FileSearch, 
  MessageCircle, 
  MapPin, 
  Users 
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our algorithm analyzes 50+ data points including industry, stage, ticket size, and founder-investor fit to surface your perfect matches.",
    size: "large",
    color: "emerald",
  },
  {
    icon: Shield,
    title: "Secure Deal Rooms",
    description: "Encrypted virtual spaces for due diligence. Share documents, track views, and manage access with enterprise-grade security.",
    size: "tall",
    color: "cyan",
  },
  {
    icon: Rss,
    title: "Smart Feed",
    description: "A personalized feed of startup updates, investor activity, and market trends.",
    size: "medium",
    color: "emerald",
  },
  {
    icon: FileSearch,
    title: "Pitch Analyzer",
    description: "AI-powered feedback on your pitch deck with scoring and improvement suggestions.",
    size: "medium",
    color: "cyan",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Messaging",
    description: "Direct communication with read receipts, scheduling, and video calls.",
    size: "medium",
    color: "emerald",
  },
  {
    icon: MapPin,
    title: "India-First",
    description: "Built for the Indian ecosystem with local payment rails and compliance.",
    size: "small",
    color: "cyan",
  },
  {
    icon: Users,
    title: "Community",
    description: "Exclusive events, AMAs, and networking opportunities.",
    size: "small",
    color: "emerald",
  },
]

export function BentoGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
    <section id="features" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-emerald-500/5 blur-[100px] md:blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-xs md:text-sm text-emerald-400 font-medium tracking-wide uppercase mb-3 md:mb-4">
            Features
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6" style={{ letterSpacing: "-0.03em" }}>
            Everything you need to raise or invest
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Powerful tools designed specifically for the Indian startup ecosystem
          </p>
        </motion.div>

        {/* Bento Grid - Single column on mobile, complex layout on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:auto-rows-[200px]"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isEmerald = feature.color === "emerald"
            
            // Mobile: all cards are equal height, desktop: use size classes
            let gridClass = ""
            if (feature.size === "large") gridClass = "md:col-span-2 md:row-span-2"
            else if (feature.size === "tall") gridClass = "lg:row-span-2"

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`glass-card p-5 md:p-6 flex flex-col group hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 ${gridClass}`}
                style={{
                  boxShadow: `0 0 60px ${isEmerald ? 'rgba(16,185,129,0.05)' : 'rgba(6,182,212,0.05)'}`,
                }}
              >
                {/* Icon */}
                <div
                  className={`w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all ${
                    isEmerald
                      ? "bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20"
                      : "bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20"
                  }`}
                >
                  <Icon className={`w-4 md:w-5 h-4 md:h-5 ${isEmerald ? "text-emerald-400" : "text-cyan-400"}`} />
                </div>

                {/* Content */}
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Large card extra content - hidden on mobile for cleaner look */}
                {feature.size === "large" && (
                  <div className="mt-4 md:mt-6 flex-1 hidden md:flex items-end">
                    <div className="w-full h-32 rounded-xl bg-white/5 flex items-center justify-center relative overflow-hidden">
                      {/* Circular progress mockup */}
                      <svg className="w-24 h-24" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgba(16,185,129,0.6)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="200"
                          strokeDashoffset="50"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute text-lg font-bold text-emerald-400">94%</div>
                    </div>
                  </div>
                )}

                {/* Tall card extra content - hidden on mobile */}
                {feature.size === "tall" && (
                  <div className="mt-4 flex-1 hidden lg:flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <div className="w-8 h-8 rounded bg-white/10" />
                        <div className="flex-1">
                          <div className="h-2 w-20 rounded bg-white/10 mb-1" />
                          <div className="h-2 w-12 rounded bg-white/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
