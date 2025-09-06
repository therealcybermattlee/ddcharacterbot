import React, { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui'
import { cn } from '../../utils/cn'

interface WizardStepProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  errors?: string[]
  isValid?: boolean
  showValidation?: boolean
}

export function WizardStep({ 
  title, 
  description, 
  children, 
  className,
  errors = [],
  isValid = true,
  showValidation = false
}: WizardStepProps) {
  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {title}
                {showValidation && (
                  <div className="flex items-center">
                    {isValid ? (
                      <div className="flex items-center text-green-600">
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
                      </div>
                    ) : errors.length > 0 ? (
                      <div className="flex items-center text-red-600">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardTitle>
              {description && (
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>

          {/* Show validation errors */}
          {errors.length > 0 && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-start gap-2">
                <svg 
                  className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-destructive mb-1">
                    Please fix the following issues:
                  </h4>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-xs mt-1">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

// Compact version for smaller screens
export function CompactWizardStep({ 
  title, 
  description, 
  children, 
  className,
  errors = [],
  isValid = true,
  showValidation = false
}: WizardStepProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            {title}
            {showValidation && (
              <div className="flex items-center">
                {isValid ? (
                  <div className="w-5 h-5 text-green-600">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : errors.length > 0 ? (
                  <div className="w-5 h-5 text-red-600">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                ) : null}
              </div>
            )}
          </h2>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}

        {/* Compact error display */}
        {errors.length > 0 && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
            <div className="text-destructive font-medium mb-1">Issues to fix:</div>
            <ul className="text-destructive/80 space-y-0.5">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Step container with animation support
export function AnimatedWizardStep({ 
  children, 
  className,
  isActive = true
}: { 
  children: ReactNode
  className?: string
  isActive?: boolean
}) {
  return (
    <div 
      className={cn(
        "transition-all duration-300 ease-out",
        {
          "opacity-100 translate-x-0": isActive,
          "opacity-0 translate-x-4 pointer-events-none absolute": !isActive
        },
        className
      )}
    >
      {children}
    </div>
  )
}