import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-blue-500",
        error: "border-red-500 focus:border-red-600 focus:ring-red-500",
        success: "border-green-500 focus:border-green-600 focus:ring-green-500",
        // D&D specific variants
        stat: "text-center font-mono text-lg font-bold border-2 border-gray-400 bg-gray-50",
        modifier: "text-center font-mono text-sm w-12 h-8 border-gray-300",
        dice: "text-center font-mono border-red-300 bg-red-50 focus:border-red-500",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4 text-base",
        xl: "h-14 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helper?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helper, ...props }, ref) => {
    const id = props.id || props.name

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          className={cn(inputVariants({ variant, size }), className)}
          ref={ref}
          id={id}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-sm text-gray-600 mt-1">
            {helper}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }