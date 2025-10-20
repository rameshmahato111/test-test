import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  showNavigation?: boolean
  onPrev?: () => void
  onNext?: () => void
}

export function SectionHeader({ title, showNavigation = true, onPrev, onNext }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {showNavigation && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 bg-transparent"
            aria-label="Previous"
            onClick={onPrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 bg-transparent"
            aria-label="Next"
            onClick={onNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
