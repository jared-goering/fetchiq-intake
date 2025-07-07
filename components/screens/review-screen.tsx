"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Pencil, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface ReviewScreenProps {
  formState: any
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
  setCurrentScreen: (screen: number) => void
}

export function ReviewScreen({ formState, onPrevious, onSubmit, isSubmitting, setCurrentScreen }: ReviewScreenProps) {
  // Check if all required fields are filled
  const isFormValid = () => {
    // Basic validation - check if required fields have values
    return (
      formState.companyName &&
      formState.address &&
      formState.city &&
      formState.state &&
      formState.country &&
      formState.team.length > 0 &&
      formState.team[0].firstName &&
      formState.team[0].lastName &&
      formState.team[0].role &&
      formState.team[0].email &&
      formState.team[0].bio &&
      formState.operatingName &&
      formState.foundedDate &&
      formState.stage &&
      formState.problem &&
      formState.strengths &&
      formState.competition &&
      formState.traction &&
      formState.keyCustomers &&
      formState.raising &&
      formState.pmf &&
      formState.biz &&
      formState.vision &&
      formState.industryFit &&
      formState.industryFitAlt &&
      formState.productDescription &&
      formState.salesRevenueRange &&
      formState.tradeShows &&
      formState.currentAssets
    )
  }

  const navigateToScreen = (screen: number) => {
    setCurrentScreen(screen)
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Snapshot</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(1)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Company Name:</div>
            <div>{formState.companyName}</div>
            <div className="font-medium">Address:</div>
            <div>{formState.address}</div>
            <div className="font-medium">Location:</div>
            <div>
              {formState.city}, {formState.state}, {formState.country}
            </div>
            <div className="font-medium">Website:</div>
            <div>{formState.website}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Team</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(2)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-4">
            {formState.team.map((member: any, index: number) => (
              <div key={index} className="text-sm">
                <div className="font-medium">
                  {member.firstName} {member.lastName}
                </div>
                <div>{member.role}</div>
                <div className="text-muted-foreground">{member.email}</div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Basics</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(3)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Operating Name:</div>
            <div>{formState.operatingName}</div>
            <div className="font-medium">Legal Name:</div>
            <div>{formState.legalName || "N/A"}</div>
            <div className="font-medium">Founded Date:</div>
            <div>{formState.foundedDate ? format(new Date(formState.foundedDate), "PPP") : "N/A"}</div>
            <div className="font-medium">Stage:</div>
            <div>{formState.stage}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Problem</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(4)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Product Tags:</div>
            <div className="flex flex-wrap gap-1">
              {formState.productTags.map((tag: string, index: number) => (
                <span key={index} className="bg-muted px-2 py-1 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="font-medium mt-2">Problem Statement:</div>
            <div>{formState.problem}</div>
            <div className="font-medium mt-2">Strengths:</div>
            <div>{formState.strengths}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Market</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(5)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Competition:</div>
            <div>{formState.competition}</div>
            <div className="font-medium mt-2">Traction:</div>
            <div>{formState.traction}</div>
            <div className="font-medium mt-2">Key Customers / Users:</div>
            <div>{formState.keyCustomers}</div>
            <div className="font-medium mt-2">Raising:</div>
            <div>{formState.raising === "yes" ? "Yes" : formState.raising === "no" ? "No" : "Not yet"}</div>
            {formState.raising === "yes" && (
              <>
                <div className="font-medium mt-2">Amount Raising:</div>
                <div>{formState.amountRaising || "N/A"}</div>
              </>
            )}
            <div className="font-medium mt-2">Valuation:</div>
            <div>{formState.valuation ? `${formState.valuation} ${formState.currency}` : "N/A"}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Founder Narrative</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(6)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Product / Market-Fit:</div>
            <div>{formState.pmf}</div>
            <div className="font-medium mt-2">Business Model & Revenue:</div>
            <div>{formState.biz}</div>
            <div className="font-medium mt-2">Industry Vision:</div>
            <div>{formState.vision}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Industry Fit</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(7)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">Industry Fit:</div>
            <div>{formState.industryFit}</div>
            <div className="font-medium mt-2">Alternative Industry Fit:</div>
            <div>{formState.industryFitAlt}</div>
            <div className="font-medium mt-2">Product Description:</div>
            <div>{formState.productDescription}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Financials</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateToScreen(8)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Sales Revenue Range (2024):</div>
            <div>{formState.salesRevenueRange}</div>
            <div className="font-medium">Trade Shows:</div>
            <div>{formState.tradeShows === "yes" ? "Yes" : formState.tradeShows === "no" ? "No" : "Not yet"}</div>
            <div className="font-medium">Current Greatest Asset:</div>
            <div>{formState.currentAssets || "N/A"}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={!isFormValid() || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
