import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'character', 'stat', 'spell', 'item'],
      description: 'Visual variant of the card',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl'],
      description: 'Size/padding of the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can put any content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const CharacterSheet: Story = {
  render: () => (
    <Card variant="character" className="w-96">
      <CardHeader>
        <CardTitle className="font-dnd text-2xl">Gandalf the Grey</CardTitle>
        <CardDescription>Level 20 Wizard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs font-bold text-gray-600">STR</div>
            <div className="text-2xl font-bold">10</div>
            <div className="text-sm text-gray-500">+0</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-gray-600">INT</div>
            <div className="text-2xl font-bold text-blue-600">20</div>
            <div className="text-sm text-blue-600">+5</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-gray-600">WIS</div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-gray-500">+4</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-sm text-gray-600">HP: 120/120</span>
        <span className="text-sm text-gray-600">AC: 15</span>
      </CardFooter>
    </Card>
  ),
};

export const StatBlock: Story = {
  render: () => (
    <Card variant="stat" className="w-80">
      <CardHeader>
        <CardTitle>Strength</CardTitle>
        <CardDescription>Measures physical power</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          <div className="text-6xl font-bold text-red-600">16</div>
          <div className="text-3xl text-red-600">+3</div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const SpellCard: Story = {
  render: () => (
    <Card variant="spell" className="w-96">
      <CardHeader>
        <CardTitle className="text-spell-700">Fireball</CardTitle>
        <CardDescription>3rd-level evocation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">
          <strong>Casting Time:</strong> 1 action<br />
          <strong>Range:</strong> 150 feet<br />
          <strong>Components:</strong> V, S, M (a tiny ball of bat guano and sulfur)
        </p>
        <p className="text-sm">
          A bright streak flashes from your pointing finger to a point you choose within range and
          then blossoms with a low roar into an explosion of flame.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="spell" size="sm">Cast Spell</Button>
      </CardFooter>
    </Card>
  ),
};

export const ItemCard: Story = {
  render: () => (
    <Card variant="item" className="w-80">
      <CardHeader>
        <CardTitle className="text-amber-800">Sword of Destiny</CardTitle>
        <CardDescription className="text-amber-700">Legendary weapon (longsword)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm"><strong>Damage:</strong> 1d8+3 slashing</p>
        <p className="text-sm"><strong>Properties:</strong> Versatile (1d10), Magical</p>
        <p className="text-sm text-amber-900">
          This ancient blade glows with a faint golden light and grants its wielder advantage on
          saving throws against being frightened.
        </p>
      </CardContent>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card variant="default" className="w-64">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Standard card variant</CardDescription>
        </CardHeader>
        <CardContent>
          Default card styling
        </CardContent>
      </Card>

      <Card variant="outline" className="w-64">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>Card with thicker border</CardDescription>
        </CardHeader>
        <CardContent>
          Outline card styling
        </CardContent>
      </Card>

      <Card variant="character" className="w-64">
        <CardHeader>
          <CardTitle>Character</CardTitle>
          <CardDescription>D&D character sheet</CardDescription>
        </CardHeader>
        <CardContent>
          Character sheet styling
        </CardContent>
      </Card>

      <Card variant="spell" className="w-64">
        <CardHeader>
          <CardTitle>Spell</CardTitle>
          <CardDescription>Spell card</CardDescription>
        </CardHeader>
        <CardContent>
          Spell card styling
        </CardContent>
      </Card>
    </div>
  ),
};
