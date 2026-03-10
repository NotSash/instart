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
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-xs md:text-sm text-emerald-400 font-semibold tracking-widest uppercase mb-3 md:mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 max-w-xl md:max-w-3xl mx-auto" style={{ letterSpacing: "-0.03em" }}>
            From idea to funded in <span className="text-gradient">three steps</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our streamlined process makes fundraising and investing effortless.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative"
        >
          {/* Connecting line (desktop) */}
          <div className="absolute top-20 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="glass-card p-8 md:p-10 h-full hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-300 card-hover">
                {/* Icon container */}
                <div className="w-14 md:w-20 h-14 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/25 flex items-center justify-center mb-6 md:mb-8 group-hover:from-emerald-500/30 group-hover:to-emerald-500/10 group-hover:border-emerald-500/50 transition-all duration-300">
                  <step.icon className="w-6 md:w-8 h-6 md:h-8 text-emerald-400" />
                </div>

                {/* Step number */}
                <div className="text-xs md:text-sm text-emerald-400 font-semibold tracking-widest uppercase mb-3 md:mb-4">
                  Step {step.step}
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
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
