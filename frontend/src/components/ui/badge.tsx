import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // D&D specific variants
        class: "border-transparent bg-dnd-600 text-white",
        level: "border-transparent bg-magic-600 text-white font-mono",
        proficiency: "border-transparent bg-green-600 text-white",
        expertise: "border-transparent bg-yellow-600 text-black font-bold",
        // Ability score badges
        strength: "border-transparent bg-strength text-white",
        dexterity: "border-transparent bg-dexterity text-white", 
        constitution: "border-transparent bg-constitution text-white",
        intelligence: "border-transparent bg-intelligence text-white",
        wisdom: "border-transparent bg-wisdom text-white",
        charisma: "border-transparent bg-charisma text-white",
        // School of magic badges
        abjuration: "border-transparent bg-blue-600 text-white",
        conjuration: "border-transparent bg-yellow-600 text-black",
        divination: "border-transparent bg-cyan-600 text-white",
        enchantment: "border-transparent bg-pink-600 text-white",
        evocation: "border-transparent bg-red-600 text-white",
        illusion: "border-transparent bg-purple-600 text-white",
        necromancy: "border-transparent bg-gray-800 text-white",
        transmutation: "border-transparent bg-green-600 text-white",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.25 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }