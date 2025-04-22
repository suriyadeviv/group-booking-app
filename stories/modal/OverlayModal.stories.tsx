import type { Meta, StoryObj } from '@storybook/react';
import { OverlayModal } from './OverlayModal';
import { useState } from 'react';
import { Button } from '@/stories/button/Button';

const meta: Meta<typeof OverlayModal> = {
  title: 'Components/OverlayModal',
  component: OverlayModal,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OverlayModal>;

const ModalWithButton = ({ theme }: { theme?: 'light' | 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Button 
        label="Open Modal" 
        onClick={() => setIsOpen(true)} 
        theme={theme}
      />
      <OverlayModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        theme={theme}
      />
    </div>
  );
};

export const Light: Story = {
  render: () => <ModalWithButton theme="light" />,
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const Dark: Story = {
  render: () => <ModalWithButton theme="dark" />,
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const WithCustomContent: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    theme: 'light',
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="p-8">
        <Button 
          label="Toggle Modal" 
          onClick={() => setIsOpen(!isOpen)} 
          primary 
        />
        <OverlayModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          theme="light"
        />
      </div>
    );
  },
};