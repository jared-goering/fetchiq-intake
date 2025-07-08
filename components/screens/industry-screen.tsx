"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, HelpCircle } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface IndustryScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  generateIndustryContent: (state: any, specificKey?: string | null) => Promise<any>
  regenerateContent: (key: string, context?: string | null) => Promise<void>
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
  const [dialogOpenKey, setDialogOpenKey] = useState<string | null>(null)
  const [contextText, setContextText] = useState("")
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    return formState.industryFit?.trim() && 
           formState.productDescription?.trim()
  }

  // Generate content on first load if it doesn't exist
  useEffect(() => {
    const fetchContent = async () => {
      if (!formState.industryFit && !formState.productDescription) {
        setLoading({ industryFit: true, productDescription: true })
        const content = await generateIndustryContent(formState)
        if (Object.keys(content).length) updateFormState(content)
        setLoading({})
      }
    }
    fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRegenerate = async (key: string) => {
    setDialogOpenKey(key)
    setContextText("")
  }

  const runRegeneration = async () => {
    if (!dialogOpenKey) return
    setLoading((prev) => ({ ...prev, [dialogOpenKey]: true }))
    await regenerateContent(dialogOpenKey, contextText.trim() || null)
    setLoading((prev) => ({ ...prev, [dialogOpenKey]: false }))
    setDialogOpenKey(null)
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Industry Fit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

      {/* Regenerate Context Dialog */}
      <Dialog open={dialogOpenKey !== null} onOpenChange={(open) => !open && setDialogOpenKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide context for regeneration</DialogTitle>
          </DialogHeader>
          <Textarea
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            placeholder="Add any specific guidance or details you want the AI to consider..."
            rows={4}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpenKey(null)}>Cancel</Button>
            <Button onClick={runRegeneration}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="industryFit">
              How do you fit in the pet care/animal health industry as a whole? (auto-draft) <span className="text-red-500">*</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  This paragraph was auto-generated from your earlier responses. Please review and adjust so it best represents your positioning.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="industryFit"
            name="industryFit"
            value={formState.industryFit}
            onChange={handleInputChange}
            onBlur={() => handleBlur('industryFit')}
            rows={4}
            className={cn(touched.industryFit && !formState.industryFit?.trim() && "border-red-500")}
          />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => handleRegenerate("industryFit")} disabled={loading.industryFit}>
              {loading.industryFit ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="productDescription">
              Product / Service description (auto-draft) <span className="text-red-500">*</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  Generated automatically. Edit to ensure it captures the essence of your offering.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="productDescription"
            name="productDescription"
            value={formState.productDescription}
            onChange={handleInputChange}
            onBlur={() => handleBlur('productDescription')}
            rows={4}
            className={cn(touched.productDescription && !formState.productDescription?.trim() && "border-red-500")}
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
