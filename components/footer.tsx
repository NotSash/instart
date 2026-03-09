"use client"

import Link from "next/link"
import { Twitter, Linkedin, Instagram, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  { icon: Twitter, href: "https://x.com/instartindia", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/instart", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/instart.in", label: "Instagram" },
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
                  key={index}
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
                  <li key={linkIndex}>
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
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
