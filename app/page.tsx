import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { SocialProof } from "@/components/social-proof"
import { HowItWorks } from "@/components/how-it-works"
import { BentoGrid } from "@/components/bento-grid"
import { SplitSection } from "@/components/split-section"
import { TrendingStartups } from "@/components/trending-startups"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { CTABanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Global noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"/>
        </svg>
      </div>

      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <BentoGrid />
      <SplitSection />
      <TrendingStartups />
      <Testimonials />
      <Pricing />
      <CTABanner />
      <Footer />
    </main>
  )
}
