"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface ThankYouScreenProps {
  onRestart: () => void
}

export function ThankYouScreen({ onRestart }: ThankYouScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.8 }}
        className="text-green-500"
      >
        <CheckCircle2 className="h-20 w-20" />
      </motion.div>
      <h2 className="text-2xl font-semibold">Thank you for submitting!</h2>
      <p className="text-gray-600 max-w-md">
        We&rsquo;ve received your intake form and our team will review it shortly. We
        appreciate your time and effort!
      </p>
      <Button onClick={onRestart}>Start a New Submission</Button>
    </div>
  )
} 