'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from './ui/button'

interface OnboardingWrapperProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  children: React.ReactNode
  canGoBack?: boolean
  submitLabel?: string
  onSubmit?: () => void
}

export function OnboardingWrapper({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  children,
  canGoBack = true,
  submitLabel = 'Continue',
  onSubmit,
}: OnboardingWrapperProps) {
  const isLastStep = currentStep === totalSteps
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-sm font-semibold text-foreground hover:text-emerald-400 transition-colors">
          Instart
        </Link>
        <div className="text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-white/5 px-4 md:px-6 py-4 flex items-center justify-between gap-4 md:gap-6">
        <div>
          {canGoBack && currentStep > 1 && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="hidden sm:inline-flex"
          >
            Back
          </Button>
          <Button
            onClick={isLastStep && onSubmit ? onSubmit : onNext}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6"
          >
            {isLastStep ? submitLabel : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
