'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6"
                >
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                </motion.div>

                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                    Something went wrong
                </h2>
                <p className="text-muted-foreground mb-8">
                    An unexpected error occurred. Don&apos;t worry, our team has been notified and is working on it.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto">
                        <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 w-full sm:w-auto">
                            <Home className="w-4 h-4 mr-2" /> Go Home
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
