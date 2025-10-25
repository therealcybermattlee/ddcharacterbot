import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'stat', 'modifier', 'dice'],
      description: 'Visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl'],
      description: 'Size of the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    variant: 'default',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Character Name',
    placeholder: 'Gandalf the Grey',
    variant: 'default',
  },
};

export const WithError: Story = {
  args: {
    label: 'Character Name',
    placeholder: 'Enter name',
    error: 'Character name is required',
    variant: 'error',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Character Level',
    placeholder: '1',
    helper: 'Must be between 1 and 20',
    variant: 'default',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    required: true,
  },
};

export const StatInput: Story = {
  args: {
    label: 'Strength',
    defaultValue: '16',
    variant: 'stat',
    size: 'default',
  },
};

export const ModifierInput: Story = {
  args: {
    defaultValue: '+3',
    variant: 'modifier',
  },
};

export const DiceInput: Story = {
  args: {
    label: 'Damage Roll',
    placeholder: '2d6',
    variant: 'dice',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 w-96">
      <div>
        <h3 className="text-lg font-bold mb-4">Standard Variants</h3>
        <div className="space-y-4">
          <Input label="Default" placeholder="Default input" variant="default" />
          <Input label="Error" placeholder="Error input" error="This field has an error" variant="error" />
          <Input label="Success" placeholder="Success input" variant="success" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">D&D Variants</h3>
        <div className="space-y-4">
          <Input label="Ability Score" defaultValue="16" variant="stat" />
          <Input label="Initiative Modifier" defaultValue="+3" variant="modifier" />
          <Input label="Damage Dice" placeholder="1d8+3" variant="dice" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Sizes</h3>
        <div className="space-y-4">
          <Input label="Small" placeholder="Small input" size="sm" />
          <Input label="Default" placeholder="Default input" size="default" />
          <Input label="Large" placeholder="Large input" size="lg" />
          <Input label="Extra Large" placeholder="Extra large input" size="xl" />
        </div>
      </div>
    </div>
  ),
};
