"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamCard } from "@/components/team-card"

interface TeamScreenProps {
  formState: any
  updateFormState: (updates: any) => void
  onNext: () => void
  onPrevious: () => void
}

const isTeamValid = (team: any[]) => {
  return team.every((member) =>
    member.firstName?.trim() &&
    member.lastName?.trim() &&
    member.role?.trim() &&
    member.email?.trim() &&
    member.phone?.trim() &&
    member.bio?.trim() &&
    member.skillsMarkets?.trim()
  )
}

export function TeamScreen({ formState, updateFormState, onNext, onPrevious }: TeamScreenProps) {
  const addTeamMember = () => {
    updateFormState({
      team: [
        ...formState.team,
        {
          firstName: "",
          lastName: "",
          role: "",
          linkedin: "",
          email: "",
          phone: "",
          bio: "",
          skillsMarkets: "",
        },
      ],
    })
  }

  const updateTeamMember = (index: number, updates: any) => {
    const updatedTeam = [...formState.team]
    updatedTeam[index] = { ...updatedTeam[index], ...updates }
    updateFormState({ team: updatedTeam })
  }

  const removeTeamMember = (index: number) => {
    if (formState.team.length <= 1) return // Keep at least one team member

    const updatedTeam = formState.team.filter((_: any, i: number) => i !== index)
    updateFormState({ team: updatedTeam })
  }

  return (
    <Card className="bg-[#F9FAFB] rounded-2xl">
      <CardHeader>
        <CardTitle>Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {formState.team.map((member: any, index: number) => (
          <TeamCard
            key={index}
            member={member}
            index={index}
            updateMember={(updates) => updateTeamMember(index, updates)}
            removeMember={() => removeTeamMember(index)}
            showRemoveButton={formState.team.length > 1}
          />
        ))}

        <Button variant="outline" onClick={addTeamMember}>
          Add team-mate
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isTeamValid(formState.team)}>Next</Button>
      </CardFooter>
    </Card>
  )
}
