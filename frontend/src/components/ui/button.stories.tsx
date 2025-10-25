import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'dnd', 'magic', 'spell', 'skill'],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

export const DNDStyle: Story = {
  args: {
    children: 'Roll Initiative',
    variant: 'dnd',
    size: 'default',
  },
};

export const MagicStyle: Story = {
  args: {
    children: 'Cast Spell',
    variant: 'magic',
    size: 'default',
  },
};

export const SpellStyle: Story = {
  args: {
    children: 'Fireball',
    variant: 'spell',
    size: 'default',
  },
};

export const SkillStyle: Story = {
  args: {
    children: 'Use Skill',
    variant: 'skill',
    size: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete Character',
    variant: 'destructive',
    size: 'default',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'default',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'dnd',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    children: 'Create Character',
    variant: 'magic',
    size: 'xl',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'default',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Standard Variants</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold">D&D Variants</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="dnd">D&D Style</Button>
          <Button variant="magic">Magic</Button>
          <Button variant="spell">Spell</Button>
          <Button variant="skill">Skill</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold">Sizes</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <Button size="sm" variant="dnd">Small</Button>
          <Button size="default" variant="dnd">Default</Button>
          <Button size="lg" variant="dnd">Large</Button>
          <Button size="xl" variant="dnd">Extra Large</Button>
        </div>
      </div>
    </div>
  ),
};
