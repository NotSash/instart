"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlanType {
  name: string
  description: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  popular: boolean
  features: { text: string; included: boolean }[]
  cta: string
  ctaVariant: 'default' | 'outline'
}

const plans: PlanType[] = [
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
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-xs md:text-sm text-emerald-400 font-semibold tracking-widest uppercase mb-4 md:mb-5">
            Pricing Plans
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 max-w-3xl mx-auto" style={{ letterSpacing: "-0.03em" }}>
            Simple, <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
            Choose the plan that fits your fundraising journey. No hidden fees, cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-full bg-white/8 border border-white/15 backdrop-blur-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${isYearly
                ? "text-muted-foreground hover:text-foreground"
                : "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 flex items-center gap-2 ${isYearly
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Yearly
              <span className={`text-xs md:text-sm font-bold px-2.5 md:px-3 py-1 rounded-full transition-all ${isYearly ? "bg-black/20 text-black" : "bg-emerald-500/20 text-emerald-400"}`}>
                Save 16%
              </span>
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
              className={`relative rounded-3xl overflow-hidden p-8 md:p-10 transition-all duration-300 ${plan.popular
                ? "glass-accent border-2 border-emerald-500/40 md:scale-[1.05] z-10 card-hover"
                : "glass-card card-hover"
                }`}
            >
              {/* Glow effect for popular */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
              )}

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-emerald-500 text-black text-xs md:text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8 md:mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">
                  {plan.name}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                  {plan.description}
                </p>

                {/* Price */}
                {(() => {
                  const price = plan.monthlyPrice === null ? null : (isYearly ? (plan.yearlyPrice ?? plan.monthlyPrice) : plan.monthlyPrice)
                  return (
                    <div className="flex items-baseline gap-2 md:gap-3 mb-1">
                      {price === null ? (
                        <span className="text-4xl md:text-5xl font-bold text-foreground">Custom</span>
                      ) : (
                        <>
                          <span className="text-4xl md:text-5xl font-bold text-foreground">
                            ₹{price.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-base md:text-lg">/month</span>
                        </>
                      )}
                    </div>
                  )
                })()}
                {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && isYearly && (
                  <p className="text-xs md:text-sm text-emerald-400/90 font-medium">
                    Billed annually — save ₹{((plan.monthlyPrice - (plan.yearlyPrice ?? 0)) * 12).toLocaleString()}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {plan.features.map((feature, featureIndex) => (
                  <li key={feature.text} className="flex items-center gap-3 md:gap-4">
                    {feature.included ? (
                      <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-300" />
                      </div>
                    ) : (
                      <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 md:w-3.5 h-3 md:h-3.5 text-muted-foreground/60" />
                      </div>
                    )}
                    <span className={`text-sm md:text-base ${feature.included ? "text-foreground/90 font-medium" : "text-muted-foreground"}`}>
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
                className={`w-full h-12 md:h-14 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 text-sm md:text-base group ${plan.popular
                  ? "bg-emerald-500 hover:bg-emerald-600 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  : "bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-foreground backdrop-blur-sm"
                  }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5 transition-transform group-hover:translate-x-1 duration-300" />
              </Button>
            </motion.div>
          ))
          }
        </motion.div >
      </div >
    </section >
  )
}
