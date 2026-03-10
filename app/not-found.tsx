'use client'

import { motion } from 'framer-motion'
import { Home, Compass } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                {/* Animated 404 */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                    className="mb-8"
                >
                    <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ letterSpacing: '-0.05em' }}>
                        404
                    </h1>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                        Page not found
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto">
                            <Home className="w-4 h-4 mr-2" /> Go Home
                        </Button>
                    </Link>
                    <Link href="/app/explore/startups">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 w-full sm:w-auto">
                            <Compass className="w-4 h-4 mr-2" /> Explore Startups
                        </Button>
                    </Link>
                </motion.div>

                {/* Decorative floating dots */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500/30"
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                        style={{
                            left: `${15 + i * 14}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    )
}
