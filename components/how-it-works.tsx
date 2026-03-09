"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { UserPlus, Sparkles, Handshake } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up as a founder or investor. Share your story, metrics, and what you're looking for.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Get AI-Matched",
    description: "Our algorithm analyzes 50+ data points to connect you with the perfect matches.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Close Deals",
    description: "Use secure deal rooms, real-time messaging, and built-in tools to finalize investments.",
  },
]

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="how-it-works" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-xs md:text-sm text-emerald-400 font-medium tracking-wide uppercase mb-3 md:mb-4">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6" style={{ letterSpacing: "-0.03em" }}>
            From idea to funded in three steps
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Our streamlined process makes fundraising and investing effortless
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative"
        >
          {/* Connecting line (desktop) */}
          <div className="absolute top-24 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="glass-card p-6 md:p-8 h-full hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                {/* Icon */}
                <div className="w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                  <step.icon className="w-5 md:w-7 h-5 md:h-7 text-emerald-400" />
                </div>

                {/* Step number */}
                <div className="text-[10px] md:text-xs text-emerald-400 font-mono tracking-wider mb-2 md:mb-3">
                  STEP {step.step}
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
