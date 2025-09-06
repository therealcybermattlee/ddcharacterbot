import { useState } from 'react'
import {
  Button,
  Input,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  D4,
  D6,
  D8,
  D10,
  D12,
  D20,
} from './ui'

export default function DesignSystemShowcase() {
  const [inputValue, setInputValue] = useState('')
  const [diceResults, setDiceResults] = useState<Record<string, number>>({})

  const handleDiceRoll = (diceType: string, result: number) => {
    setDiceResults(prev => ({ ...prev, [diceType]: result }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground font-dnd">
            D&D Character Manager Design System
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Showcasing our Radix UI + Tailwind CSS components with D&D theming
          </p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>Various button styles and D&D-themed variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="dnd">D&D Theme</Button>
              <Button variant="magic">Magic</Button>
              <Button variant="spell">Spell</Button>
              <Button variant="skill">Skill</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Components */}
        <Card>
          <CardHeader>
            <CardTitle>Input Components</CardTitle>
            <CardDescription>Form inputs with D&D-specific styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Character Name"
                placeholder="Enter character name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helper="This will be displayed on your character sheet"
              />
              <Input
                label="Level"
                type="number"
                placeholder="1"
                variant="stat"
                min="1"
                max="20"
              />
              <Input
                label="Hit Points"
                type="number"
                variant="stat"
                placeholder="10"
              />
              <Input
                label="Armor Class"
                type="number"
                variant="modifier"
                placeholder="10"
              />
            </div>
            <Input
              label="Required Field"
              placeholder="This field is required"
              required
              error="This field cannot be empty"
            />
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Components</CardTitle>
            <CardDescription>Status indicators, ability scores, and class badges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="class">Class</Badge>
              <Badge variant="level">Lv. 5</Badge>
              <Badge variant="proficiency">Proficient</Badge>
              <Badge variant="expertise">Expertise</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="strength">STR</Badge>
              <Badge variant="dexterity">DEX</Badge>
              <Badge variant="constitution">CON</Badge>
              <Badge variant="intelligence">INT</Badge>
              <Badge variant="wisdom">WIS</Badge>
              <Badge variant="charisma">CHA</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="evocation">Evocation</Badge>
              <Badge variant="enchantment">Enchantment</Badge>
              <Badge variant="necromancy">Necromancy</Badge>
              <Badge variant="abjuration">Abjuration</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="character">
            <CardHeader>
              <CardTitle className="font-dnd">Character Sheet</CardTitle>
              <CardDescription>Parchment-style character card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This card uses the character variant with a parchment-like background
                perfect for character information.
              </p>
            </CardContent>
          </Card>

          <Card variant="stat">
            <CardHeader>
              <CardTitle>Stat Block</CardTitle>
              <CardDescription>D&D-themed stat display</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-dnd-700">16</div>
                <div className="text-sm text-muted-foreground">Strength</div>
                <div className="text-lg font-mono">+3</div>
              </div>
            </CardContent>
          </Card>

          <Card variant="spell">
            <CardHeader>
              <CardTitle>Spell Card</CardTitle>
              <CardDescription>Magic-themed spell information</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="evocation" className="mb-2">Evocation</Badge>
              <p className="text-sm">
                Fireball - 3rd level spell with explosive damage in a 20-foot radius.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dice Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dice Components</CardTitle>
            <CardDescription>Interactive D&D dice with roll results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <D4 
                label="Damage" 
                modifier={2} 
                onRoll={(result) => handleDiceRoll('d4', result)}
              />
              <D6 
                label="Sneak Attack" 
                count={2} 
                onRoll={(result) => handleDiceRoll('d6', result)}
              />
              <D8 
                label="Hit Die" 
                onRoll={(result) => handleDiceRoll('d8', result)}
              />
              <D10 
                label="Damage" 
                onRoll={(result) => handleDiceRoll('d10', result)}
              />
              <D12 
                label="Greataxe" 
                modifier={4} 
                onRoll={(result) => handleDiceRoll('d12', result)}
              />
              <D20 
                label="Attack Roll" 
                modifier={5} 
                onRoll={(result) => handleDiceRoll('d20', result)}
              />
            </div>
            {Object.keys(diceResults).length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Recent Rolls:</h4>
                <div className="space-y-1">
                  {Object.entries(diceResults).map(([dice, result]) => (
                    <div key={dice} className="text-sm font-mono">
                      {dice}: <span className="font-bold text-primary">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog Components</CardTitle>
            <CardDescription>Modal dialogs with accessible overlays</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="dnd">Open Character Creation</Button>
              </DialogTrigger>
              <DialogContent size="lg">
                <DialogHeader>
                  <DialogTitle className="font-dnd">Create New Character</DialogTitle>
                  <DialogDescription>
                    Start your adventure by creating a new D&D character. Choose your race, 
                    class, and background to begin your journey.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input label="Character Name" placeholder="Enter your character's name" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Race</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Human</Badge>
                        <Badge variant="outline">Elf</Badge>
                        <Badge variant="outline">Dwarf</Badge>
                        <Badge variant="outline">Halfling</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Class</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="destructive">Fighter</Badge>
                        <Badge variant="default">Wizard</Badge>
                        <Badge variant="secondary">Cleric</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="dnd">Create Character</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}