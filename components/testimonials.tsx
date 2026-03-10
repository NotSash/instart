"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Instart connected us with the perfect lead investor in just 3 weeks. The AI matching is scary accurate.",
    name: "Priya Sharma",
    role: "Founder, FinStack",
    avatar: "P",
    color: "emerald",
  },
  {
    quote: "As an angel investor, the deal flow quality here is unmatched. Every startup is vetted and the data is transparent.",
    name: "Rajesh Iyer",
    role: "Angel Investor",
    avatar: "R",
    color: "cyan",
  },
  {
    quote: "The secure deal rooms saved us hours of back-and-forth emails. Due diligence has never been smoother.",
    name: "Ananya Desai",
    role: "Partner, Vertex Ventures",
    avatar: "A",
    color: "emerald",
  },
  {
    quote: "We raised our seed round 40% faster than our previous company. Instart is a game-changer for Indian founders.",
    name: "Vikram Patel",
    role: "Co-founder, AgriChain",
    avatar: "V",
    color: "cyan",
  },
  {
    quote: "The pitch analyzer helped us refine our deck before every meeting. Our conversion rate doubled.",
    name: "Sneha Reddy",
    role: "CEO, HealthPulse",
    avatar: "S",
    color: "emerald",
  },
  {
    quote: "Finally, a platform built for the Indian ecosystem. The UPI integration and GST compliance features are brilliant.",
    name: "Arjun Mehta",
    role: "GP, Blume Ventures",
    avatar: "A",
    color: "cyan",
  },
]

export function Testimonials() {
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
    <section id="testimonials" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-emerald-500/5 blur-[100px] md:blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-cyan-500/5 blur-[80px] md:blur-[120px]" />

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
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6" style={{ letterSpacing: "-0.03em" }}>
            Loved by founders & investors across India
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Join thousands who are already building the future of Indian startups
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card p-5 md:p-8 relative group hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote
                className={`absolute top-4 md:top-6 right-4 md:right-6 w-8 md:w-10 h-8 md:h-10 opacity-10 ${testimonial.color === "emerald" ? "text-emerald-400" : "text-cyan-400"
                  }`}
              />

              {/* Stars */}
              <div className="flex gap-0.5 md:gap-1 mb-4 md:mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 md:w-4 h-3.5 md:h-4 fill-emerald-400 text-emerald-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm md:text-base text-foreground/90 italic mb-6 md:mb-8 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={`w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-bold ${testimonial.color === "emerald"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-cyan-500/20 text-cyan-400"
                    }`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm md:text-base text-foreground font-medium">{testimonial.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
