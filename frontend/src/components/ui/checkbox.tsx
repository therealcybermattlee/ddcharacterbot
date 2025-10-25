import * as React from "react"
import { CheckIcon } from "@heroicons/react/24/solid"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const checkboxVariants = cva(
  "peer h-5 w-5 shrink-0 rounded border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors",
  {
    variants: {
      variant: {
        default: "border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        dnd: "border-dnd-300 data-[state=checked]:bg-dnd-600 data-[state=checked]:border-dnd-700",
        magic: "border-magic-300 data-[state=checked]:bg-magic-600 data-[state=checked]:border-magic-700",
        success: "border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant, label, error, checked, ...props }, ref) => {
    const id = props.id || props.name

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              className={cn(checkboxVariants({ variant }), className)}
              ref={ref}
              id={id}
              checked={checked}
              {...props}
            />
            {checked && (
              <CheckIcon className="absolute inset-0 h-5 w-5 text-white pointer-events-none p-0.5" />
            )}
          </div>
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
