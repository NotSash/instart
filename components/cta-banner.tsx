"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTABanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-[#050505] to-cyan-500/10" />

      {/* Decorative shapes - smaller on mobile */}
      <div className="absolute top-10 md:top-20 left-5 md:left-20 w-16 md:w-32 h-16 md:h-32 rounded-full glass opacity-20 md:opacity-30 animate-float" />
      <div className="absolute bottom-10 md:bottom-20 right-5 md:right-20 w-12 md:w-24 h-12 md:h-24 rounded-xl md:rounded-2xl glass opacity-15 md:opacity-20 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/4 w-10 md:w-16 h-10 md:h-16 rounded-full glass opacity-15 md:opacity-20 animate-float hidden sm:block" style={{ animationDelay: "4s" }} />
      <div className="absolute bottom-1/3 right-1/3 w-12 md:w-20 h-12 md:h-20 rounded-lg md:rounded-xl glass opacity-10 md:opacity-15 animate-float hidden sm:block" style={{ animationDelay: "3s" }} />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6" style={{ letterSpacing: "-0.03em" }}>
          Ready to transform how you raise or invest?
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
          Join 500+ Indian startups and 1,200+ investors already on the platform.
          Start your journey today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
          <Button
            asChild
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 md:px-8 h-12 md:h-14 rounded-full text-sm md:text-base transition-all hover:scale-[1.03] active:scale-[0.97] glow-emerald-sm w-full sm:w-auto"
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            asChild
            variant="outline"
            className="border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/15 text-white font-medium px-6 md:px-8 h-12 md:h-14 rounded-full text-sm md:text-base transition-all hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto"
          >
            <Link href="/demo">
              <CalendarDays className="mr-2 w-4 md:w-5 h-4 md:h-5" />
              Book a Demo
            </Link>
          </Button>
        </div>

        <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
          No credit card required. 14-day free trial.
        </p>
      </motion.div>
    </section>
  )
}
