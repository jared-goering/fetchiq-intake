"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardContent className="pt-6">
        <h1 className="text-3xl font-bold mb-4">Let's map your opportunity</h1>
        <p className="text-gray-600">~3-4 minutes</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext}>Start</Button>
      </CardFooter>
    </Card>
  )
}
