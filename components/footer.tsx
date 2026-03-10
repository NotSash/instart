"use client"

import Link from "next/link"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

function XSvg({ className }: Readonly<{ className?: string }>) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
}
function LinkedinSvg({ className }: Readonly<{ className?: string }>) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
}
function InstagramSvg({ className }: Readonly<{ className?: string }>) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" /></svg>
}

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "For Founders", href: "/signup" },
      { label: "For Investors", href: "/signup" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/privacy" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/blog" },
      { label: "Case Studies", href: "/blog" },
      { label: "API Docs", href: "/blog" },
      { label: "Help Center", href: "/blog" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Careers", href: "mailto:careers@instart.in" },
      { label: "Press", href: "mailto:press@instart.in" },
      { label: "Contact", href: "mailto:hello@instart.in" },
      { label: "Partners", href: "mailto:partners@instart.in" },
    ],
  },
}

const socialLinks = [
  { icon: XSvg, href: "https://x.com/instartindia", label: "Twitter" },
  { icon: LinkedinSvg, href: "https://linkedin.com/company/instart", label: "LinkedIn" },
  { icon: InstagramSvg, href: "https://instagram.com/instart.in", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand column - full width on mobile */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-0.5 group mb-4 md:mb-6">
              <span className="text-xl font-bold text-foreground tracking-tight">
                instart
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            </Link>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-xs leading-relaxed">
              The premium platform connecting India&apos;s most ambitious founders with visionary investors.
            </p>
            <div className="flex gap-3 md:gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns - 2 columns on mobile, 3 on desktop */}
          {Object.values(footerLinks).map((section, index) => (
            <div key={index} className="col-span-1">
              <h4 className="text-xs md:text-sm font-semibold text-foreground mb-3 md:mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-6 md:py-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="mb-2 md:mb-0">
              <h4 className="text-foreground font-medium mb-0.5 md:mb-1 text-sm md:text-base">
                Stay in the loop
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Get the latest updates on Indian startup ecosystem
              </p>
            </div>
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 h-11 md:h-12 px-4 rounded-full bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <Button className="h-11 md:h-12 px-4 md:px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Send className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Subscribe</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 md:py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <p className="text-center md:text-left">
            © 2026 Instart Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span className="flex items-center gap-2">
              Made with <span className="text-red-400">♥</span> in India
            </span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>{' '}
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
