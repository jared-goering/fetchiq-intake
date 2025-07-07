"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface MarketScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function MarketScreen({ formState, updateFormState, onNext, onPrevious }: MarketScreenProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormState({ [name]: value })
  }

  const handleCurrencyChange = (value: string) => {
    updateFormState({ currency: value })
  }

  const handleRaisingChange = (value: string) => {
    updateFormState({ raising: value })
  }

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  ]

  const isFormValid = () => {
    return formState.competition?.trim() && 
           formState.traction?.trim() && 
           formState.keyCustomers?.trim() &&
           formState.raising
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Market</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="competition" data-required>
            Competition and how are you better? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="competition"
            name="competition"
            value={formState.competition}
            onChange={handleInputChange}
            placeholder="Describe your main competitors and how you differentiate"
            rows={4}
            className={cn(!formState.competition?.trim() && "border-red-300")}
          />
        </div>

        <div>
          <Label htmlFor="traction" data-required>
            Traction (investment, users, revenue, etc.) you've had? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="traction"
            name="traction"
            value={formState.traction}
            onChange={handleInputChange}
            placeholder="Describe your current traction (users, revenue, growth, etc.)"
            rows={4}
            className={cn(!formState.traction?.trim() && "border-red-300")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valuation">Valuation</Label>
            <Input
              id="valuation"
              name="valuation"
              value={formState.valuation}
              onChange={handleInputChange}
              placeholder="Enter your valuation"
              type="number"
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={formState.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="keyCustomers" data-required>
            Key customers/users? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="keyCustomers"
            name="keyCustomers"
            value={formState.keyCustomers}
            onChange={handleInputChange}
            placeholder="Describe your key customers or user base"
            rows={3}
            className={cn(!formState.keyCustomers?.trim() && "border-red-300")}
          />
        </div>

        <div>
          <Label data-required>Raising (yes/no) <span className="text-red-500">*</span></Label>
          <RadioGroup value={formState.raising} onValueChange={handleRaisingChange} className="flex gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="raising-yes" />
              <Label htmlFor="raising-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="raising-no" />
              <Label htmlFor="raising-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formState.raising === "yes" && (
          <div>
            <Label htmlFor="amountRaising">Amount Raising</Label>
            <Input
              id="amountRaising"
              name="amountRaising"
              value={formState.amountRaising}
              onChange={handleInputChange}
              placeholder="Enter amount you're raising"
              type="text"
            />
          </div>
        )}
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
