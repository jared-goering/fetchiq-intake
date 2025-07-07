"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { ChangeEvent } from "react"

interface TeamCardProps {
  member: {
    firstName: string
    lastName: string
    role: string
    linkedin: string
    email: string
    phone: string
    bio: string
    skillsMarkets: string
  }
  index: number
  updateMember: (updates: any) => void
  removeMember: () => void
  showRemoveButton: boolean
}

export function TeamCard({ member, index, updateMember, removeMember, showRemoveButton }: TeamCardProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateMember({ [name]: value })
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  return (
    <Card className="relative">
      {showRemoveButton && (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={removeMember}>
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`firstName-${index}`} data-required>
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`firstName-${index}`}
              name="firstName"
              value={member.firstName}
              onChange={handleInputChange}
              onBlur={() => handleBlur('firstName')}
              placeholder="First Name"
              className={cn(touched.firstName && !member.firstName?.trim() && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor={`lastName-${index}`} data-required>
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`lastName-${index}`}
              name="lastName"
              value={member.lastName}
              onChange={handleInputChange}
              onBlur={() => handleBlur('lastName')}
              placeholder="Last Name"
              className={cn(touched.lastName && !member.lastName?.trim() && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor={`role-${index}`} data-required>
              Role <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`role-${index}`}
              name="role"
              value={member.role}
              onChange={handleInputChange}
              onBlur={() => handleBlur('role')}
              placeholder="CEO, CTO, etc."
              className={cn(touched.role && !member.role?.trim() && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor={`linkedin-${index}`}>LinkedIn</Label>
            <Input
              id={`linkedin-${index}`}
              name="linkedin"
              value={member.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <Label htmlFor={`email-${index}`} data-required>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`email-${index}`}
              name="email"
              value={member.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              placeholder="email@example.com"
              type="email"
              className={cn(touched.email && !member.email?.trim() && "border-red-300")}
            />
          </div>

          <div>
            <Label htmlFor={`phone-${index}`} data-required>
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`phone-${index}`}
              name="phone"
              value={member.phone}
              onChange={handleInputChange}
              onBlur={() => handleBlur('phone')}
              placeholder="+1 (555) 123-4567"
              type="tel"
              className={cn(touched.phone && !member.phone?.trim() && "border-red-300")}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor={`bio-${index}`} data-required>
            Bio <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id={`bio-${index}`}
            name="bio"
            value={member.bio}
            onChange={handleInputChange}
            onBlur={() => handleBlur('bio')}
            placeholder="Brief professional biography"
            rows={3}
            className={cn(touched.bio && !member.bio?.trim() && "border-red-300")}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor={`skillsMarkets-${index}`} data-required>
            Skills & Markets <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id={`skillsMarkets-${index}`}
            name="skillsMarkets"
            value={member.skillsMarkets}
            onChange={handleInputChange}
            onBlur={() => handleBlur('skillsMarkets')}
            placeholder="Key skills and market expertise"
            rows={2}
            className={cn(touched.skillsMarkets && !member.skillsMarkets?.trim() && "border-red-300")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
