import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterCreation } from '../../contexts/CharacterCreationContext'
import { ProgressIndicator, CompactProgressIndicator } from './ProgressIndicator'
import { WizardStep, AnimatedWizardStep } from './WizardStep'
import { WizardNavigation, CompactWizardNavigation } from './WizardNavigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button } from '../ui'
import { cn } from '../../utils/cn'
import { SparklesIcon } from '@heroicons/react/24/solid'

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
    setStepValidity,
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
          const createdCharacter = await submitCharacter()
          const characterId = createdCharacter?.id || 'unknown'

          if (onComplete) {
            onComplete(characterId)
          } else {
            navigate('/characters')
          }
        } catch (error) {
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

  // Memoize callbacks to prevent unnecessary re-renders and stale closures
  const handleStepDataChange = useCallback((data: any) => {
    if (currentStep) {
      updateStepData(currentStep.id, data)
    }
  }, [currentStep, updateStepData])

  const handleValidationChange = useCallback((isValid: boolean, errors?: string[]) => {
    if (currentStep) {
      setStepValidity(currentStep.id, isValid, errors)
    }
  }, [currentStep, setStepValidity])

  const isNextDisabled = isValidating || currentStepErrors.length > 0

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-dnd-50/30 via-background to-magic-50/20", className)}>
      {/* Fantasy Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dnd-700 via-dnd-600 to-magic-700 shadow-2xl">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        {/* Floating Sparkles */}
        <div className="absolute top-6 right-10 text-amber-300 opacity-60 animate-pulse">
          <SparklesIcon className="h-6 w-6" />
        </div>
        <div className="absolute top-8 left-20 text-amber-200 opacity-40 animate-pulse delay-75">
          <SparklesIcon className="h-4 w-4" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-purple-300 opacity-50 animate-pulse delay-150">
          <SparklesIcon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="font-dnd text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              {currentStep?.title}
            </h1>
            <p className="mt-2 text-amber-100 text-sm sm:text-base font-medium max-w-2xl mx-auto">
              {currentStep?.description}
            </p>
          </div>
        </div>
      </div>

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
                      onChange={handleStepDataChange}
                      onValidationChange={handleValidationChange}
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
                    onChange={handleStepDataChange}
                    onValidationChange={handleValidationChange}
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