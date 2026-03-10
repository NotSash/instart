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
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-xs md:text-sm text-emerald-400 font-semibold tracking-widest uppercase mb-4 md:mb-5">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 max-w-3xl mx-auto" style={{ letterSpacing: "-0.03em" }}>
            Loved by founders & investors <span className="text-gradient">across India</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands who are already building the future of Indian startups
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card p-7 md:p-10 relative group hover:border-emerald-500/40 hover:bg-emerald-500/6 transition-all duration-400 card-hover"
            >
              {/* Quote icon */}
              <Quote
                className={`absolute top-6 md:top-8 right-6 md:right-8 w-8 md:w-10 h-8 md:h-10 opacity-15 ${testimonial.color === "emerald" ? "text-emerald-400" : "text-cyan-400"
                  }`}
              />

              {/* Stars */}
              <div className="flex gap-1 md:gap-1.5 mb-5 md:mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 md:w-5 h-4 md:h-5 fill-emerald-400 text-emerald-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm md:text-base text-foreground italic mb-7 md:mb-10 leading-relaxed font-medium">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={`w-11 md:w-13 h-11 md:h-13 rounded-full flex items-center justify-center text-base md:text-lg font-bold ${testimonial.color === "emerald"
                    ? "bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                    : "bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 border border-cyan-500/25 text-cyan-300"
                    }`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm md:text-base text-foreground font-semibold">{testimonial.name}</p>
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
