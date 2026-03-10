"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    description: "For early-stage founders exploring the ecosystem",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    features: [
      { text: "Basic startup profile", included: true },
      { text: "5 investor views/month", included: true },
      { text: "Community access", included: true },
      { text: "AI matching", included: false },
      { text: "Deal rooms", included: false },
      { text: "Pitch analyzer", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    description: "For founders serious about raising their next round",
    monthlyPrice: 399,
    yearlyPrice: 333,
    popular: true,
    features: [
      { text: "Enhanced startup profile", included: true },
      { text: "Unlimited investor views", included: true },
      { text: "Community access", included: true },
      { text: "AI-powered matching", included: true },
      { text: "3 secure deal rooms", included: true },
      { text: "Pitch analyzer (5/month)", included: true },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
  },
  {
    name: "Enterprise",
    description: "For funds and accelerators managing portfolios",
    monthlyPrice: null,
    yearlyPrice: null,
    popular: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited deal rooms", included: true },
      { text: "Portfolio dashboard", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated success manager", included: true },
      { text: "API access", included: true },
      { text: "24/7 priority support", included: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
]

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true)
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

  // Render plans directly in their original order


  return (
    <section id="pricing" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-emerald-500/5 blur-[100px] md:blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-xs md:text-sm text-emerald-400 font-medium tracking-wide uppercase mb-3 md:mb-4">
            Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6" style={{ letterSpacing: "-0.03em" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            Choose the plan that fits your fundraising journey
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-2 md:gap-4 p-1 md:p-1.5 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${isYearly
                ? "text-muted-foreground hover:text-foreground"
                : "bg-emerald-500 text-black"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1 md:gap-2 ${isYearly
                ? "bg-emerald-500 text-black"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Yearly<span className={`ml-1 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${isYearly ? "bg-black/20 text-black" : "bg-emerald-500/20 text-emerald-400"}`}>Save 16%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards - Mobile: sorted by mobileOrder, Desktop: original order */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start max-w-md md:max-w-none mx-auto"
        >
          {/* Cards map */}
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative rounded-2xl md:rounded-3xl p-6 md:p-8 ${plan.popular
                ? "glass border-emerald-500/30 glow-emerald md:scale-105 z-10"
                : "glass-card"
                }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-emerald-500 text-black text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 md:mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 md:gap-2">
                  {plan.monthlyPrice === null ? (
                    <span className="text-3xl md:text-4xl font-bold text-foreground">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl md:text-4xl font-bold text-foreground">
                        ₹{isYearly ? plan.yearlyPrice?.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-sm">/month</span>
                    </>
                  )}
                </div>
                {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && isYearly && (
                  <p className="text-xs md:text-sm text-emerald-400 mt-2">
                    Billed annually (save ₹{((plan.monthlyPrice - (plan.yearlyPrice ?? 0)) * 12).toLocaleString()}/year)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={feature.text} className="flex items-start gap-2 md:gap-3">
                    {feature.included ? (
                      <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 md:w-3 h-2.5 md:h-3 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-4 md:w-5 h-4 md:h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-2.5 md:w-3 h-2.5 md:h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={`text-sm ${feature.included ? "text-foreground/90" : "text-muted-foreground"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={() => {
                  if (plan.name === 'Enterprise') {
                    globalThis.location.href = 'mailto:sales@instart.in?subject=Enterprise Plan Inquiry'
                  } else if (plan.name === 'Pro') {
                    globalThis.location.href = '/signup?plan=pro'
                  } else {
                    globalThis.location.href = '/signup'
                  }
                }}
                className={`w-full h-11 md:h-12 rounded-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base ${plan.popular
                  ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-foreground"
                  }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 w-3.5 md:w-4 h-3.5 md:h-4" />
              </Button>
            </motion.div>
          ))
          }
        </motion.div >
      </div >
    </section >
  )
}
