"use client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SmartSuggestProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  isLoading?: boolean
}

export function SmartSuggest({ suggestions, onSelect, isLoading = false }: SmartSuggestProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Generating suggestions...</span>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mt-2">
      <p className="text-sm text-muted-foreground mb-2">Smart suggestions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onSelect(suggestion)}
            data-suggest={suggestion}
          >
            {suggestion.length > 50 ? `${suggestion.substring(0, 50)}...` : suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
