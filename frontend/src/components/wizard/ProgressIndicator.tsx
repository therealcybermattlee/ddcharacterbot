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
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted"></div>
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
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
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    {
                      // Completed step
                      "bg-primary border-primary text-primary-foreground": isCompleted,
                      
                      // Active step
                      "bg-background border-primary text-primary ring-4 ring-primary/20": isActive,
                      
                      // Future step
                      "bg-muted border-muted-foreground/20 text-muted-foreground": !isCompleted && !isActive,
                      
                      // Clickable styles
                      "cursor-pointer hover:border-primary/60": isClickable,
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
                <div className="mt-2 text-center max-w-24">
                  <div 
                    className={cn(
                      "text-xs font-medium leading-tight",
                      {
                        "text-primary": isActive,
                        "text-foreground": isCompleted,
                        "text-foreground/60": !isCompleted && !isActive
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

      {/* Current step info */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          {steps[currentStep]?.title}
        </h2>
        <p className="text-sm text-foreground/70 mt-1">
          {steps[currentStep]?.description}
        </p>
      </div>

      {/* Progress percentage */}
      <div className="mt-4 text-center">
        <div className="text-xs text-foreground/60 font-medium">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="w-full bg-muted rounded-full h-1 mt-2">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-foreground/60 font-medium mt-1">
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