"use client"

import { Check } from "lucide-react"

interface VerticalProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: Array<{
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export function VerticalProgressBar({ currentStep, totalSteps, steps }: VerticalProgressBarProps) {
  return (
    <div className="flex flex-col space-y-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isUpcoming = stepNumber > currentStep

        return (
          <div key={stepNumber} className="flex items-start space-x-4">
            {/* Step Icon */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-pink-500 border-pink-500"
                    : isCurrent
                    ? "bg-pink-500 border-pink-500"
                    : "bg-pink-500 border-pink-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-base font-semibold text-white">
                    {stepNumber}
                  </span>
                )}
              </div>
              
              {/* Dotted Connection Line - Only show if not the last step */}
              {stepNumber < totalSteps && (
                <div
                  className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 transition-all duration-300`}
                  style={{ 
                    borderStyle: 'dashed',
                    borderWidth: '1px',
                    borderColor: isCompleted ? '#ec4899' : '#ec4899',
                    background: 'transparent',
                    height: '32px' // Adjusted to properly connect circles
                  }}
                />
              )}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 pt-1">
              <h4 className={`text-lg font-bold mb-1 ${
                isCompleted ? "text-gray-900" : isCurrent ? "text-gray-900" : "text-gray-500"
              }`}>
                {step.title}
              </h4>
              <p className={`text-sm ${
                isCompleted ? "text-gray-600" : isCurrent ? "text-gray-600" : "text-gray-400"
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
