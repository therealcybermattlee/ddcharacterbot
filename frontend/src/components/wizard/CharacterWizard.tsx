import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterCreation } from '../../contexts/CharacterCreationContext'
import { ProgressIndicator, CompactProgressIndicator } from './ProgressIndicator'
import { WizardStep, AnimatedWizardStep } from './WizardStep'
import { WizardNavigation, CompactWizardNavigation } from './WizardNavigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button } from '../ui'
import { cn } from '../../utils/cn'

interface CharacterWizardProps {
  className?: string
  onComplete?: (characterId: string) => void
  onCancel?: () => void
}

export function CharacterWizard({ 
  className, 
  onComplete,
  onCancel
}: CharacterWizardProps) {
  const navigate = useNavigate()
  const {
    steps,
    navigation,
    currentStepData,
    updateStepData,
    validateStep,
    submitCharacter,
    isSubmitting,
    errors,
    clearProgress
  } = useCharacterCreation()

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [hasAttemptedNavigation, setHasAttemptedNavigation] = useState(false)

  const currentStep = steps[navigation.currentStep]
  const currentStepErrors = errors[currentStep?.id] || []

  // Only show errors after user has attempted to navigate
  const shouldShowErrors = hasAttemptedNavigation

  // Validate current step when data changes (but don't show errors until navigation attempted)
  useEffect(() => {
    if (currentStep) {
      const timer = setTimeout(async () => {
        setIsValidating(true)
        await validateStep(currentStep.id)
        setIsValidating(false)
      }, 300) // Debounce validation

      return () => clearTimeout(timer)
    }
  }, [currentStepData, currentStep?.id, validateStep])

  const handleNext = async () => {
    if (!currentStep) return

    // Mark that user has attempted navigation
    setHasAttemptedNavigation(true)

    setIsValidating(true)
    const isValid = await validateStep(currentStep.id)
    setIsValidating(false)

    if (isValid) {
      if (navigation.currentStep === steps.length - 1) {
        // Last step - submit character
        try {
          await submitCharacter()
          if (onComplete) {
            onComplete('new-character-id') // This would come from the API response
          } else {
            navigate('/characters')
          }
        } catch (error) {
          console.error('Failed to create character:', error)
          setValidationErrors(['Failed to create character. Please try again.'])
        }
      } else {
        // Move to next step
        navigation.nextStep()
        setValidationErrors([])
        // Reset navigation attempt flag for new step
        setHasAttemptedNavigation(false)
      }
    } else {
      setValidationErrors(currentStepErrors)
    }
  }

  const handlePrevious = () => {
    navigation.previousStep()
    setValidationErrors([])
    // Reset navigation attempt flag for new step
    setHasAttemptedNavigation(false)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      setShowCancelDialog(true)
    }
  }

  const handleConfirmCancel = () => {
    clearProgress()
    setShowCancelDialog(false)
    navigate('/characters')
  }

  const handleStepClick = async (stepIndex: number) => {
    // Only allow jumping to previous steps or the next step if current is valid
    if (stepIndex <= navigation.currentStep) {
      navigation.goToStep(stepIndex)
      setValidationErrors([])
      // Reset navigation attempt flag for new step
      setHasAttemptedNavigation(false)
    } else if (stepIndex === navigation.currentStep + 1) {
      // Mark that user has attempted navigation
      setHasAttemptedNavigation(true)
      // Allow jumping to next step if current step is valid
      const isValid = await validateStep(currentStep.id)
      if (isValid) {
        navigation.goToStep(stepIndex)
        setValidationErrors([])
        // Reset navigation attempt flag for new step
        setHasAttemptedNavigation(false)
      }
    }
  }

  const isNextDisabled = isValidating || currentStepErrors.length > 0

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-6xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <ProgressIndicator
                steps={steps}
                currentStep={navigation.currentStep}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Step Content */}
            <div className="relative">
              <AnimatedWizardStep isActive={true}>
                <WizardStep
                  title={currentStep?.title || 'Loading...'}
                  description={currentStep?.description}
                  errors={shouldShowErrors ? currentStepErrors : []}
                  isValid={currentStep?.isValid}
                  showValidation={true}
                >
                  {currentStep && (
                    <currentStep.component
                      data={currentStepData}
                      onChange={(data: any) => updateStepData(currentStep.id, data)}
                      onValidationChange={(_isValid: boolean, _errors?: string[]) => {
                        // This could be used for real-time validation feedback
                      }}
                      onNext={handleNext}
                    />
                  )}
                </WizardStep>
              </AnimatedWizardStep>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <WizardNavigation
                navigation={navigation}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onCancel={handleCancel}
                isNextDisabled={isNextDisabled}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="max-w-md mx-auto">
            {/* Compact Progress */}
            <div className="mb-6">
              <CompactProgressIndicator
                steps={steps}
                currentStep={navigation.currentStep}
              />
            </div>

            {/* Step Content */}
            <div className="mb-6">
              <WizardStep
                title={currentStep?.title || 'Loading...'}
                description={currentStep?.description}
                errors={shouldShowErrors ? currentStepErrors : []}
                isValid={currentStep?.isValid}
                showValidation={true}
                className="p-4"
              >
                {currentStep && (
                  <currentStep.component
                    data={currentStepData}
                    onChange={(data: any) => updateStepData(currentStep.id, data)}
                    onValidationChange={(_isValid: boolean, _errors?: string[]) => {
                      // This could be used for real-time validation feedback
                    }}
                    onNext={handleNext}
                  />
                )}
              </WizardStep>
            </div>

            {/* Compact Navigation */}
            <div className="sticky bottom-0 bg-background border-t p-4 -mx-4">
              <CompactWizardNavigation
                navigation={navigation}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isNextDisabled={isNextDisabled}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Global validation errors */}
        {validationErrors.length > 0 && (
          <div className="fixed bottom-4 right-4 max-w-md">
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <h4 className="text-sm font-medium text-destructive mb-2">
                Validation Errors
              </h4>
              <ul className="text-sm text-destructive/80 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Character Creation?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel creating this character? 
              Your progress will be lost and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
            >
              Continue Editing
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmCancel}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Standalone wizard with provider
export function StandaloneCharacterWizard(props: CharacterWizardProps) {
  // This would be wrapped with the provider at a higher level
  return <CharacterWizard {...props} />
}

// Wizard with auto-save indicator
export function CharacterWizardWithAutoSave(props: CharacterWizardProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { currentStepData } = useCharacterCreation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLastSaved(new Date())
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentStepData])

  return (
    <div className="relative">
      <CharacterWizard {...props} />
      
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="fixed top-4 right-4 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          Auto-saved {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}