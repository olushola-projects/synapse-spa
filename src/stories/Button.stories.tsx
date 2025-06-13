import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

interface ButtonProps {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  primary = false,
  onClick,
  ...props 
}) => (
  <button
    className={`px-4 py-2 rounded ${
      primary 
        ? 'bg-synapse-primary text-white hover:bg-blue-600' 
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`}
    onClick={onClick}
    {...props}
  >
    {label}
  </button>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};
