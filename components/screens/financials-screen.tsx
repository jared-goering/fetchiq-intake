"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface FinancialsScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function FinancialsScreen({ formState, updateFormState, onNext, onPrevious }: FinancialsScreenProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const handleTradeShowsChange = (value: string) => {
    updateFormState({ tradeShows: value })
    setTouched(prev => ({ ...prev, tradeShows: true }))
  }

  const revenueRanges = [
    "Pre-revenue",
    "Under $1M",
    "$1-$5M", 
    "$5-$15M",
    "$15M+"
  ]

  const handleRevenueRangeChange = (value: number[]) => {
    updateFormState({ salesRevenueRange: revenueRanges[value[0]] })
    setTouched(prev => ({ ...prev, salesRevenueRange: true }))
  }

  const getCurrentSliderValue = () => {
    const index = revenueRanges.indexOf(formState.salesRevenueRange)
    return index >= 0 ? [index] : [0]
  }

  const isFormValid = () => {
    return formState.salesRevenueRange && 
           formState.tradeShows &&
           formState.currentAssets?.trim()
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Financials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="salesRevenueRange" data-required>
            Sales Revenue range (2024) <span className="text-red-500">*</span>
          </Label>
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-2 px-1">
              {revenueRanges.map((range, index) => (
                <span key={index} className="text-xs">{range}</span>
              ))}
            </div>
            <Slider
              value={getCurrentSliderValue()}
              onValueChange={handleRevenueRangeChange}
              max={4}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          {formState.salesRevenueRange && (
            <div className="text-center mt-2 text-sm font-medium">
              Selected: {formState.salesRevenueRange}
            </div>
          )}
        </div>

        <div>
          <Label>Do you exhibit at trade shows? <span className="text-red-500">*</span></Label>
          <RadioGroup value={formState.tradeShows} onValueChange={handleTradeShowsChange} className="flex gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="tradeShows-yes" />
              <Label htmlFor="tradeShows-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="tradeShows-no" />
              <Label htmlFor="tradeShows-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-yet" id="tradeShows-not-yet" />
              <Label htmlFor="tradeShows-not-yet">Not yet</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="currentAssets">Current Greatest Asset <span className="text-red-500">*</span></Label>
          <Textarea
            id="currentAssets"
            name="currentAssets"
            value={formState.currentAssets}
            onChange={handleInputChange}
            onBlur={() => handleBlur('currentAssets')}
            placeholder="Describe your current assets"
            rows={4}
            className={cn(touched.currentAssets && !formState.currentAssets?.trim() && "border-red-500")}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()}>Next</Button>
      </CardFooter>
    </Card>
  )
}
