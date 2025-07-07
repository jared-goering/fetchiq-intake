"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface IndustryScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  generateIndustryContent: (state: any, specificKey?: string | null) => Promise<any>
  regenerateContent: (key: string) => Promise<void>
  acceptContent: (key: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function IndustryScreen({
  formState,
  updateFormState,
  generateIndustryContent,
  regenerateContent,
  acceptContent,
  onNext,
  onPrevious,
}: IndustryScreenProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    return formState.industryFit?.trim() && 
           formState.industryFitAlt?.trim() && 
           formState.productDescription?.trim()
  }

  // Generate content on first load if it doesn't exist
  useEffect(() => {
    const fetchContent = async () => {
      if (!formState.industryFit && !formState.industryFitAlt && !formState.productDescription) {
        setLoading({ industryFit: true, industryFitAlt: true, productDescription: true })
        const content = await generateIndustryContent(formState)
        if (Object.keys(content).length) updateFormState(content)
        setLoading({})
      }
    }
    fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRegenerate = async (key: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }))
    await regenerateContent(key)
    setLoading((prev) => ({ ...prev, [key]: false }))
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Industry Fit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="industryFit">
            How do you fit in the pet care/animal health industry as a whole? (auto-draft) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="industryFit"
            name="industryFit"
            value={formState.industryFit}
            onChange={handleInputChange}
            rows={4}
            className={!formState.industryFit?.trim() ? "border-red-500" : ""}
          />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => handleRegenerate("industryFit")} disabled={loading.industryFit}>
              {loading.industryFit ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="industryFitAlt">
            How do you fit in the pet care/animal health industry as a whole? (auto-draft) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="industryFitAlt"
            name="industryFitAlt"
            value={formState.industryFitAlt}
            onChange={handleInputChange}
            rows={4}
            className={!formState.industryFitAlt?.trim() ? "border-red-500" : ""}
          />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => handleRegenerate("industryFitAlt")} disabled={loading.industryFitAlt}>
              {loading.industryFitAlt ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="productDescription">
            How would you describe your company's product/service (auto-draft) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="productDescription"
            name="productDescription"
            value={formState.productDescription}
            onChange={handleInputChange}
            rows={4}
            className={!formState.productDescription?.trim() ? "border-red-500" : ""}
          />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => handleRegenerate("productDescription")} disabled={loading.productDescription}>
              {loading.productDescription ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
            </Button>
          </div>
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
