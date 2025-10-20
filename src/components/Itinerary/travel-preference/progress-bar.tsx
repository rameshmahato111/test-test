"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
  active: boolean
  completed: boolean
}

interface ProgressBarProps {
  steps: Step[]
  isMobile?: boolean
}

export function ProgressBar({ steps, isMobile = false }: ProgressBarProps) {
  if (isMobile) {
    return (
      <div className="lg:hidden px-4 sm:px-6 pt-6 pb-4 w-full">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Find your Itinerary</h1>
          <p className="text-sm sm:text-base text-gray-600">in 3 Simple steps</p>
        </div>

        {/* Indicator row (3 equal columns). We render two half-connectors so the line touches both points center-to-center. */}
        <div className="relative grid grid-cols-3 items-center w-full">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex items-center justify-center">
              <div
                className={cn(
                  "z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center",
                  step.completed ? "bg-pink-500 border-pink-500" : "bg-white border-pink-500",
                )}
              >
                {step.completed ? (
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                ) : step.active ? (
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-pink-500 bg-white" />
                ) : null}
              </div>
              {/* Right half from this circle to the next column boundary */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed",
                    step.completed ? "border-pink-500" : "border-pink-300",
                  )}
                />
              )}
              {/* Left half from previous column boundary to this circle */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute left-0 right-1/2 top-1/2 -translate-y-1/2 border-t-2 border-dashed",
                    steps[index - 1].completed ? "border-pink-500" : "border-pink-300",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Titles (3 equal columns under indicators) */}
        <div className="mt-3 grid grid-cols-3 gap-0 w-full">
          {steps.map((step) => (
            <div key={`label-${step.number}`} className="text-center">
              <div className="mx-auto max-w-[10rem] text-xs sm:text-sm font-medium text-gray-900 leading-tight">
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="hidden lg:block bg-white p-6 xl:p-8 2xl:p-12 w-full">
      <div className="w-full max-w-none">
        <div className="mb-8 xl:mb-10 2xl:mb-12">
          <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-2">Find your Itinerary</h1>
          <p className="text-gray-600 xl:text-lg 2xl:text-xl">in 3 Simple steps</p>
        </div>

        <div className="space-y-6 xl:space-y-7 2xl:space-y-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-start">
              <div className="flex flex-col items-center mr-4 xl:mr-6 2xl:mr-8">
                <div
                  className={cn(
                    "w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 rounded-full border-2 flex items-center justify-center",
                    step.completed ? "bg-pink-500 border-pink-500" : "bg-white border-pink-500",
                  )}
                >
                  {step.completed ? (
                    <Check className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" />
                  ) : step.active ? (
                    <div className="w-2.5 h-2.5 xl:w-3 xl:h-3 2xl:w-3.5 2xl:h-3.5 rounded-full border-2 border-pink-500 bg-white" />
                  ) : null}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    // slightly larger overlap so the dashed line visually meets circle borders
                    "w-px h-16 xl:h-18 2xl:h-20 -mt-[2px] -mb-[2px] border-l-2 border-dashed",
                    step.completed ? "border-pink-500" : "border-pink-300"
                  )} />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base xl:text-lg 2xl:text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm xl:text-base 2xl:text-lg leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
