"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface BasicsScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function BasicsScreen({ formState, updateFormState, onNext, onPrevious }: BasicsScreenProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [date, setDate] = useState<Date | undefined>(
    formState.foundedDate ? new Date(formState.foundedDate) : undefined,
  )
  const [dateInputValue, setDateInputValue] = useState<string>(
    formState.foundedDate ? format(new Date(formState.foundedDate), "yyyy-MM-dd") : ""
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateInputValue(value)
    
    if (value) {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
        updateFormState({ foundedDate: parsedDate.toISOString() })
      }
    } else {
      setDate(undefined)
      updateFormState({ foundedDate: "" })
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      setDateInputValue(formattedDate)
      updateFormState({ foundedDate: selectedDate.toISOString() })
    }
    setTouched(prev => ({ ...prev, foundedDate: true }))
  }

  const handleStageSelect = (stage: string) => {
    updateFormState({ stage })
    setTouched(prev => ({ ...prev, stage: true }))
  }

  const isFormValid = () => {
    return formState.operatingName?.trim() && 
           formState.foundedDate && 
           formState.stage
  }

  const stageDefinitions = {
    Idea: "You have a concept but haven't built anything yet.",
    "Pre-Launch": "You're building your product but haven't launched to the public.",
    Launched: "Your product is live and available to customers.",
    Growth: "Your product has traction and you're focused on scaling.",
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Basics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="operatingName" data-required>
            Operating Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="operatingName"
            name="operatingName"
            value={formState.operatingName}
            onChange={handleInputChange}
            onBlur={() => handleBlur('operatingName')}
            placeholder="Your company's operating name"
            className={cn(touched.operatingName && !formState.operatingName?.trim() && "border-red-300")}
          />
        </div>

        <div>
          <Label htmlFor="legalName">Legal Name</Label>
          <Input
            id="legalName"
            name="legalName"
            value={formState.legalName}
            onChange={handleInputChange}
            placeholder="Your company's legal name (if different)"
          />
        </div>

        <div>
          <Label htmlFor="foundedDate" data-required>
            Founded Date <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="foundedDate"
              name="foundedDate"
              type="date"
              value={dateInputValue}
              onChange={handleDateInputChange}
              onBlur={() => handleBlur('foundedDate')}
              className={cn(
                "flex-1",
                touched.foundedDate && !formState.foundedDate && "border-red-300",
              )}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-3",
                    touched.foundedDate && !formState.foundedDate && "border-red-300",
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Label htmlFor="stage" data-required>
              Stage <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Stage definitions</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Stage Definitions</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(stageDefinitions).map(([stage, definition]) => (
                      <li key={stage}>
                        <strong>{stage}:</strong> {definition}
                      </li>
                    ))}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(stageDefinitions).map((stage) => (
              <Button
                key={stage}
                variant={formState.stage === stage ? "default" : "outline"}
                onClick={() => handleStageSelect(stage)}
                className="flex-1"
              >
                {stage}
              </Button>
            ))}
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
