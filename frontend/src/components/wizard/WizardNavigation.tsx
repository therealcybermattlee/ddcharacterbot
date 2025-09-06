import React from 'react'
import { Button } from '../ui'
import { cn } from '../../utils/cn'
import { WizardNavigation as WizardNavigationType } from '../../types/wizard'

interface WizardNavigationProps {
  navigation: WizardNavigationType
  onNext?: () => Promise<void> | void
  onPrevious?: () => void
  onCancel?: () => void
  isNextDisabled?: boolean
  isSubmitting?: boolean
  nextLabel?: string
  previousLabel?: string
  cancelLabel?: string
  showCancel?: boolean
  className?: string
}

export function WizardNavigation({
  navigation,
  onNext,
  onPrevious,
  onCancel,
  isNextDisabled = false,
  isSubmitting = false,
  nextLabel,
  previousLabel = "Previous",
  cancelLabel = "Cancel",
  showCancel = true,
  className
}: WizardNavigationProps) {
  const { currentStep, totalSteps, canGoNext, canGoPrevious } = navigation

  // Determine next button label
  const getNextLabel = () => {
    if (nextLabel) return nextLabel
    if (currentStep === totalSteps - 1) return isSubmitting ? "Creating..." : "Create Character"
    return "Next"
  }

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    } else {
      navigation.nextStep()
    }
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      navigation.previousStep()
    }
  }

  return (
    <div className={cn("flex items-center justify-between pt-6 border-t", className)}>
      {/* Left side - Cancel and Previous */}
      <div className="flex items-center gap-3">
        {showCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground"
          >
            {cancelLabel}
          </Button>
        )}
        
        {canGoPrevious && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            {previousLabel}
          </Button>
        )}
      </div>

      {/* Right side - Next/Submit */}
      <div className="flex items-center gap-3">
        {canGoNext && (
          <Button
            onClick={handleNext}
            disabled={isNextDisabled || isSubmitting}
            className={cn(
              "flex items-center gap-2",
              currentStep === totalSteps - 1 && "bg-green-600 hover:bg-green-700"
            )}
          >
            {isSubmitting && (
              <svg 
                className="w-4 h-4 animate-spin" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {getNextLabel()}
            {!isSubmitting && currentStep < totalSteps - 1 && (
              <svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// Compact navigation for mobile
export function CompactWizardNavigation({
  navigation,
  onNext,
  onPrevious,
  isNextDisabled = false,
  isSubmitting = false,
  nextLabel,
  previousLabel = "Back",
  className
}: Omit<WizardNavigationProps, 'onCancel' | 'showCancel' | 'cancelLabel'>) {
  const { currentStep, totalSteps, canGoNext, canGoPrevious } = navigation

  const getNextLabel = () => {
    if (nextLabel) return nextLabel
    if (currentStep === totalSteps - 1) return isSubmitting ? "Creating..." : "Create"
    return "Next"
  }

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    } else {
      navigation.nextStep()
    }
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      navigation.previousStep()
    }
  }

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      {canGoPrevious ? (
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isSubmitting}
          size="sm"
          className="flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {previousLabel}
        </Button>
      ) : (
        <div></div>
      )}

      {canGoNext && (
        <Button
          onClick={handleNext}
          disabled={isNextDisabled || isSubmitting}
          size="sm"
          className={cn(
            "flex items-center gap-1",
            currentStep === totalSteps - 1 && "bg-green-600 hover:bg-green-700"
          )}
        >
          {isSubmitting && (
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {getNextLabel()}
          {!isSubmitting && currentStep < totalSteps - 1 && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      )}
    </div>
  )
}

// Navigation with keyboard shortcuts
export function KeyboardWizardNavigation(props: WizardNavigationProps) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            if (props.navigation.canGoPrevious && !props.isSubmitting) {
              if (props.onPrevious) {
                props.onPrevious()
              } else {
                props.navigation.previousStep()
              }
            }
            break
          case 'ArrowRight':
            event.preventDefault()
            if (props.navigation.canGoNext && !props.isNextDisabled && !props.isSubmitting) {
              if (props.onNext) {
                props.onNext()
              } else {
                props.navigation.nextStep()
              }
            }
            break
          case 'Enter':
            event.preventDefault()
            if (props.navigation.canGoNext && !props.isNextDisabled && !props.isSubmitting) {
              if (props.onNext) {
                props.onNext()
              } else {
                props.navigation.nextStep()
              }
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [props])

  return <WizardNavigation {...props} />
}