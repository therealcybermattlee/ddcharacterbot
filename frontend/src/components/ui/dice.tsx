import * as React from "react"
import { Button } from "./button"
import { Badge } from "./badge"
import { cn } from "../../utils/cn"

interface DiceProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sides: 4 | 6 | 8 | 10 | 12 | 20 | 100
  count?: number
  modifier?: number
  label?: string
  showResult?: boolean
  onRoll?: (result: number, rolls: number[]) => void
}

const Dice = React.forwardRef<HTMLButtonElement, DiceProps>(
  ({ 
    sides, 
    count = 1, 
    modifier = 0, 
    label, 
    showResult = true,
    onRoll,
    className,
    ...props 
  }, ref) => {
    const [isRolling, setIsRolling] = React.useState(false)
    const [lastResult, setLastResult] = React.useState<number | null>(null)
    const [lastRolls, setLastRolls] = React.useState<number[]>([])

    const rollDice = () => {
      setIsRolling(true)
      
      // Simulate rolling animation
      setTimeout(() => {
        const rolls = Array.from({ length: count }, () => 
          Math.floor(Math.random() * sides) + 1
        )
        const sum = rolls.reduce((acc, roll) => acc + roll, 0)
        const total = sum + modifier
        
        setLastResult(total)
        setLastRolls(rolls)
        setIsRolling(false)
        
        onRoll?.(total, rolls)
      }, 300)
    }

    const getDiceColor = (sides: number) => {
      const colors = {
        4: 'dice-d4',
        6: 'dice-d6', 
        8: 'dice-d8',
        10: 'dice-d10',
        12: 'dice-d12',
        20: 'dice-d20',
        100: 'dice-d20'
      }
      return colors[sides as keyof typeof colors] || 'dice-d20'
    }

    const formatDiceNotation = () => {
      let notation = `${count}d${sides}`
      if (modifier > 0) notation += `+${modifier}`
      else if (modifier < 0) notation += modifier
      return notation
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          ref={ref}
          onClick={rollDice}
          disabled={isRolling}
          className={cn(
            "dice-button relative min-w-[60px] h-12",
            `bg-${getDiceColor(sides)} hover:bg-${getDiceColor(sides)}/90`,
            isRolling && "animate-dice-roll",
            className
          )}
          {...props}
        >
          {isRolling ? (
            <span className="animate-spin">🎲</span>
          ) : (
            <span className="font-mono font-bold">
              d{sides}
            </span>
          )}
        </Button>
        
        {label && (
          <span className="text-xs text-muted-foreground font-mono">
            {label}
          </span>
        )}
        
        <div className="text-xs text-muted-foreground font-mono">
          {formatDiceNotation()}
        </div>
        
        {showResult && lastResult !== null && (
          <div className="flex flex-col items-center gap-1">
            <Badge variant="default" className="font-mono font-bold text-sm">
              {lastResult}
            </Badge>
            {lastRolls.length > 1 && (
              <div className="text-xs text-muted-foreground">
                Rolls: {lastRolls.join(', ')}
                {modifier !== 0 && ` ${modifier > 0 ? '+' : ''}${modifier}`}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

Dice.displayName = "Dice"

// Common D&D dice presets
export const D4 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={4} {...props} />
export const D6 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={6} {...props} />
export const D8 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={8} {...props} />
export const D10 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={10} {...props} />
export const D12 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={12} {...props} />
export const D20 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={20} {...props} />
export const D100 = (props: Omit<DiceProps, 'sides'>) => <Dice sides={100} {...props} />

export { Dice }