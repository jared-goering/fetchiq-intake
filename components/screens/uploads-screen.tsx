"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2, Upload, Video, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadsScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  generateNarratives: (state: any, specificKey?: string | null) => Promise<any>
  regenerateNarrative: (key: string) => Promise<void>
  acceptNarrative: (key: string) => void
  onNext: () => void
  onPrevious: () => void
}

export function UploadsScreen({
  formState,
  updateFormState,
  generateNarratives,
  regenerateNarrative,
  acceptNarrative,
  onNext,
  onPrevious,
}: UploadsScreenProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  // Handle video file selection – store file name / URL (could be uploaded elsewhere)
  const handleVideoChange = (key: "productVideo" | "bizVideo", file: File | undefined) => {
    if (!file) return
    // For now, we just store the local object URL; in real impl, upload to storage
    const url = URL.createObjectURL(file)
    updateFormState({ [key]: url })
  }

  // Generate narratives on first load if they don't exist
  useEffect(() => {
    const fetchDrafts = async () => {
      if (!formState.pmf && !formState.biz && !formState.vision) {
        // show spinners for all three sections while we fetch first drafts
        setLoading({ pmf: true, biz: true, vision: true })
        const narratives = await generateNarratives(formState)
        if (narratives && Object.keys(narratives).length) {
          updateFormState(narratives)
        }
        setLoading({})
      }
    }
    // fire-and-forget
    fetchDrafts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isNextDisabled = !formState.pmf?.trim() || !formState.biz?.trim() || !formState.vision?.trim()

  // Helper to regenerate a single narrative with loading feedback
  const handleRegenerate = async (key: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }))
    await regenerateNarrative(key)
    setLoading((prev) => ({ ...prev, [key]: false }))
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Founder Narrative</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="pmf" data-required>
              1. Product / Market-Fit (auto-draft) <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="pmf" 
              name="pmf" 
              value={formState.pmf} 
              onChange={handleInputChange} 
              rows={5}
              className={cn(!formState.pmf?.trim() && "border-red-300")}
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => handleRegenerate("pmf")} disabled={loading.pmf}>
                {loading.pmf ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="biz" data-required>
              2. Business Model & Revenue (auto-draft) <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="biz" 
              name="biz" 
              value={formState.biz} 
              onChange={handleInputChange} 
              rows={5}
              className={cn(!formState.biz?.trim() && "border-red-300")}
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => handleRegenerate("biz")} disabled={loading.biz}>
                {loading.biz ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="vision" data-required>
              3. Industry Vision (auto-draft) <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="vision" 
              name="vision" 
              value={formState.vision} 
              onChange={handleInputChange} 
              rows={5}
              className={cn(!formState.vision?.trim() && "border-red-300")}
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => handleRegenerate("vision")} disabled={loading.vision}>
                {loading.vision ? <Loader2 className="h-4 w-4 animate-spin" /> : "⟳ Regenerate"}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Optional Video Uploads
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload short videos (2 minutes or less) of your founders describing key aspects of your startup.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <Label htmlFor="productVideo" className="block text-base font-medium mb-2">
                Product / Market Fit Video
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Have a founder explain your product/market fit in 2 minutes or less
              </p>
              
              <div className="flex items-center justify-center">
                <label
                  htmlFor="productVideo"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {formState.productVideo ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-8 w-8 mr-2" />
                      <span>Video uploaded successfully</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500 hover:text-gray-700">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">Choose video file</span>
                      <span className="text-xs">MP4, MOV, AVI (max 2 min)</span>
                    </div>
                  )}
                </label>
              </div>
              
              <Input
                id="productVideo"
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange("productVideo", e.target.files?.[0])}
                className="hidden"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <Label htmlFor="bizVideo" className="block text-base font-medium mb-2">
                Business Model & Revenue Video
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Have a founder describe your business model and approach to revenue in 2 minutes or less
              </p>
              
              <div className="flex items-center justify-center">
                <label
                  htmlFor="bizVideo"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {formState.bizVideo ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-8 w-8 mr-2" />
                      <span>Video uploaded successfully</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500 hover:text-gray-700">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">Choose video file</span>
                      <span className="text-xs">MP4, MOV, AVI (max 2 min)</span>
                    </div>
                  )}
                </label>
              </div>
              
              <Input
                id="bizVideo"
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange("bizVideo", e.target.files?.[0])}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
