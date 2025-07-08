"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface SnapshotScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function SnapshotScreen({ formState, updateFormState, onNext, onPrevious }: SnapshotScreenProps) {
  // State for address autocomplete
  const [addressQuery, setAddressQuery] = useState(formState.address || "")
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [addressFocused, setAddressFocused] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const listRef = useRef<HTMLUListElement | null>(null)

  const MAPBOX_BASE =
    "https://api.mapbox.com/geocoding/v5/mapbox.places";

  // Autofill company name with operating name from basics screen
  useEffect(() => {
    if (formState.operatingName && !formState.companyName) {
      updateFormState({ companyName: formState.operatingName })
    }
  }, [formState.operatingName, formState.companyName, updateFormState])

  // Fetch address suggestions with debounce – only when field is focused
  useEffect(() => {
    if (!addressFocused || addressQuery.trim().length < 3) {
      setAddressSuggestions([])
      return
    }

    const timeout = setTimeout(() => {
      fetch(
        `${MAPBOX_BASE}/${encodeURIComponent(addressQuery)}.json?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
          // Restrict to full street addresses only
          types: "address",
          // Limit to United States and Canada
          country: "us,ca",
          autocomplete: "true",
          limit: "10",
        })
      )
        .then((res) => res.json())
        .then(({ features }) => {
          // Extra safety: ensure results are only US / CA
          const filtered = (features || []).filter((f: any) => {
            const countryCtx = (f.context || []).find((ctx: any) => typeof ctx.id === "string" && ctx.id.startsWith("country"))
            return countryCtx && ["United States", "Canada"].includes(countryCtx.text)
          })
          setAddressSuggestions(filtered)
        })
        .catch(() => setAddressSuggestions([]))
    }, 400)

    return () => clearTimeout(timeout)
  }, [addressQuery, addressFocused])

  const isFormValid = () => {
    return formState.companyName?.trim() && 
           formState.address?.trim() && 
           formState.city?.trim() && 
           formState.state?.trim() && 
           formState.country?.trim() && 
           formState.website?.trim()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "address") {
      setAddressQuery(value)
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      updateFormState({
        [parent]: {
          ...formState[parent],
          [child]: value,
        },
      })
    } else {
      updateFormState({ [name]: value })
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const handleAddressSelect = (item: any) => {
    // Mapbox feature parsing
    const context: any[] = item.context || []

    const findTextMulti = (prefixes: string[]) => {
      for (const p of prefixes) {
        const ctx = context.find((c) => typeof c.id === "string" && c.id.startsWith(p))
        if (ctx) return ctx.text
      }
      return ""
    }

    const city = findTextMulti(["place", "locality", "district", "neighborhood"]) || ""
    const state = findTextMulti(["region", "province", "state"]) || ""
    const country = findTextMulti(["country"]) || ""

    // Build a street address line (house number + street name if present)
    let streetLine = item.text || item.place_name
    if (item.address) {
      streetLine = `${item.address} ${item.text}`
    }

    updateFormState({
      address: streetLine,
      city,
      state,
      country,
    })

    setAddressQuery(streetLine)
    setAddressSuggestions([])
    setFocusedIndex(-1)
  }

  // Keyboard navigation for suggestions
  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!addressSuggestions.length) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedIndex((prev) => (prev + 1) % addressSuggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedIndex((prev) => (prev - 1 + addressSuggestions.length) % addressSuggestions.length)
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0) {
        e.preventDefault()
        handleAddressSelect(addressSuggestions[focusedIndex])
      }
    } else if (e.key === "Escape") {
      setAddressSuggestions([])
    }
  }

  // Ensure focused suggestion is visible
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[focusedIndex] as HTMLElement | undefined
      el?.scrollIntoView({ block: "nearest" })
    }
  }, [focusedIndex])

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName" data-required>
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formState.companyName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('companyName')}
                placeholder="Your company name"
                className={cn(touched.companyName && !formState.companyName?.trim() && "border-red-300")}
              />
            </div>

            <div>
              <Label htmlFor="city" data-required>
                City <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="city" 
                name="city" 
                value={formState.city} 
                onChange={handleInputChange} 
                onBlur={() => handleBlur('city')}
                placeholder="City" 
                className={cn(touched.city && !formState.city?.trim() && "border-red-300")}
              />
            </div>

            <div>
              <Label htmlFor="website" data-required>
                Website <span className="text-red-500">*</span>
              </Label>
              <Input
                id="website"
                name="website"
                value={formState.website}
                onChange={handleInputChange}
                onBlur={() => handleBlur('website')}
                placeholder="https://example.com"
                className={cn(touched.website && !formState.website?.trim() && "border-red-300")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address" data-required>
                Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  value={addressQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleAddressKeyDown}
                  onFocus={() => setAddressFocused(true)}
                  onBlur={() => {
                    setAddressFocused(false)
                    handleBlur('address')
                    setTimeout(() => setAddressSuggestions([]), 100)
                  }}
                  placeholder="Street address"
                  className={cn(touched.address && !formState.address?.trim() && "border-red-300")}
                  autoComplete="off"
                />

                {addressSuggestions.length > 0 && (
                  <ul
                    ref={listRef}
                    className="absolute left-0 right-0 mt-1 rounded-md border bg-white shadow-lg max-h-64 overflow-y-auto z-50 text-sm"
                  >
                    {addressSuggestions.map((suggestion, idx) => (
                      <li
                        key={suggestion.id}
                        onMouseDown={(e) => {
                          // Prevent blur on input
                          e.preventDefault()
                        }}
                        onClick={() => handleAddressSelect(suggestion)}
                        className={cn(
                          "px-3 py-2 cursor-pointer",
                          idx === focusedIndex ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {suggestion.place_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="state" data-required>
                State <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="state" 
                name="state" 
                value={formState.state} 
                onChange={handleInputChange} 
                onBlur={() => handleBlur('state')}
                placeholder="State" 
                className={cn(touched.state && !formState.state?.trim() && "border-red-300")}
              />
            </div>

            <div>
              <Label htmlFor="country" data-required>
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                name="country"
                value={formState.country}
                onChange={handleInputChange}
                onBlur={() => handleBlur('country')}
                placeholder="Country"
                className={cn(touched.country && !formState.country?.trim() && "border-red-300")}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socials.x">X (Twitter)</Label>
              <Input
                id="socials.x"
                name="socials.x"
                value={formState.socials.x}
                onChange={handleInputChange}
                placeholder="https://x.com/username"
              />
            </div>

            <div>
              <Label htmlFor="socials.linkedin">LinkedIn</Label>
              <Input
                id="socials.linkedin"
                name="socials.linkedin"
                value={formState.socials.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/name"
              />
            </div>

            <div>
              <Label htmlFor="socials.instagram">Instagram</Label>
              <Input
                id="socials.instagram"
                name="socials.instagram"
                value={formState.socials.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div>
              <Label htmlFor="socials.tiktok">TikTok</Label>
              <Input
                id="socials.tiktok"
                name="socials.tiktok"
                value={formState.socials.tiktok}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@username"
              />
            </div>

            <div>
              <Label htmlFor="socials.facebook">Facebook</Label>
              <Input
                id="socials.facebook"
                name="socials.facebook"
                value={formState.socials.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/pagename"
              />
            </div>
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
