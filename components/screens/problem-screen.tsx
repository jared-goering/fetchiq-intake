"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SmartSuggest } from "@/components/smart-suggest"
import { MultiSelect } from "@/components/multi-select"
import { cn } from "@/lib/utils"

interface ProblemScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  productTags: string[]
  onNext: () => void
  onPrevious: () => void
}

const countWords = (text: string) => {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export function ProblemScreen({ formState, updateFormState, productTags, onNext, onPrevious }: ProblemScreenProps) {
  const [problemSuggestions, setProblemSuggestions] = useState<string[]>([])
  const [strengthSuggestions, setStrengthSuggestions] = useState<string[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  const handleTagsChange = (selectedTags: string[]) => {
    updateFormState({ productTags: selectedTags })
  }

  const generateSuggestions = async () => {
    if (formState.productTags.length === 0) return

    setIsGeneratingSuggestions(true)

    try {
      const res = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: formState.productTags }),
      })

      if (!res.ok) throw new Error("OpenAI generation failed")

      const data = await res.json()
      setProblemSuggestions(data.problems || [])
      setStrengthSuggestions(data.strengths || [])
    } catch (error) {
      console.error("Failed to generate suggestions", error)
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  // Generate suggestions when tags change
  useEffect(() => {
    if (formState.productTags.length > 0) {
      generateSuggestions()
    }
  }, [formState.productTags])

  const applySuggestion = (field: string, suggestion: string) => {
    updateFormState({ [field]: suggestion })
  }

  const isFormValid = () => {
    return formState.productTags?.length > 0 && 
           formState.problem?.trim() && 
           formState.strengths?.trim()
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Problem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="productTags" data-required>
            Product Tags <span className="text-red-500">*</span>
          </Label>
          <MultiSelect
            options={productTags.map((tag) => ({ label: tag, value: tag }))}
            selected={formState.productTags}
            onChange={handleTagsChange}
            placeholder="Select product tags"
            className={cn(formState.productTags?.length === 0 && "border-red-300")}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="problem" data-required>
              What problem are you solving? <span className="text-red-500">*</span>
            </Label>
            <span className="text-xs text-gray-500">{countWords(formState.problem)}/100 words</span>
          </div>
          <Textarea
            id="problem"
            name="problem"
            value={formState.problem}
            onChange={handleInputChange}
            placeholder="Describe the problem your startup is solving"
            rows={4}
            className={cn(!formState.problem?.trim() && "border-red-300")}
          />

          <SmartSuggest
            suggestions={problemSuggestions}
            onSelect={(suggestion) => applySuggestion("problem", suggestion)}
            isLoading={isGeneratingSuggestions}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="strengths" data-required>
              What are your strengths? <span className="text-red-500">*</span>
            </Label>
            <span className="text-xs text-gray-500">{countWords(formState.strengths)}/100 words</span>
          </div>
          <Textarea
            id="strengths"
            name="strengths"
            value={formState.strengths}
            onChange={handleInputChange}
            placeholder="Describe your startup's key strengths"
            rows={4}
            className={cn(!formState.strengths?.trim() && "border-red-300")}
          />

          <SmartSuggest
            suggestions={strengthSuggestions}
            onSelect={(suggestion) => applySuggestion("strengths", suggestion)}
            isLoading={isGeneratingSuggestions}
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
