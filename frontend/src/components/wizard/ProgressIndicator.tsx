import React from 'react'
import { cn } from '../../utils/cn'
import { WizardStep } from '../../types/wizard'

interface ProgressIndicatorProps {
  steps: WizardStep[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  className?: string
}

export function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
  className
}: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"></div>

        {/* Progress line - magical gradient */}
        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-dnd-600 via-magic-500 to-spell-500 rounded-full shadow-lg transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isClickable = onStepClick && (isCompleted || isActive)

            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                {/* Step circle */}
                <button
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-magic-400 focus:ring-offset-2",
                    {
                      // Completed step - magical gradient
                      "bg-gradient-to-br from-dnd-500 to-magic-600 border-magic-400 text-white shadow-magic-500/50": isCompleted,

                      // Active step - glowing effect
                      "bg-gradient-to-br from-white to-amber-50 border-dnd-500 text-dnd-700 ring-4 ring-dnd-400/30 shadow-xl scale-110": isActive,

                      // Future step
                      "bg-gray-100 border-gray-300 text-gray-400": !isCompleted && !isActive,

                      // Clickable styles
                      "cursor-pointer hover:scale-105 hover:shadow-xl": isClickable,
                      "cursor-default": !isClickable
                    }
                  )}
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                >
                  {isCompleted ? (
                    // Checkmark for completed steps
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  ) : (
                    // Step number for active/future steps
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Step label */}
                <div className="mt-3 text-center max-w-24">
                  <div
                    className={cn(
                      "text-xs font-semibold leading-tight",
                      {
                        "text-dnd-700 font-bold": isActive,
                        "text-dnd-600": isCompleted,
                        "text-gray-500": !isCompleted && !isActive
                      }
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress percentage with magical styling */}
      <div className="mt-8 text-center">
        <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-2 shadow-inner">
          <div
            className="bg-gradient-to-r from-dnd-500 via-magic-500 to-spell-500 h-2 rounded-full transition-all duration-500 ease-out shadow-md"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-dnd-600 font-bold mt-2">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </div>
      </div>
    </div>
  )
}

// Compact version for mobile/smaller spaces
export function CompactProgressIndicator({ 
  steps, 
  currentStep, 
  className 
}: Omit<ProgressIndicatorProps, 'onStepClick'>) {
  return (
    <div className={cn("w-full", className)}>
      {/* Step info */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            {steps[currentStep]?.title}
          </h3>
          <p className="text-xs text-foreground/60 font-medium">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        <div className="text-xs text-foreground/60 font-medium">
          {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}