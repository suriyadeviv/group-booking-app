import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Select, { SelectProps } from './Select';

export default {
  title: 'Components/Select',
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options for the select dropdown',
    },
    label: {
      control: 'text',
      description: 'The label for the select input',
    },
    error: {
      control: 'text',
      description: 'Error message displayed under the select input',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select field is required',
    },
  },
} as Meta;

const Template: StoryFn<SelectProps> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Select your option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  theme: 'light',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Select your option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  error: 'This field is required',
  theme: 'light',
};

export const Required = Template.bind({});
Required.args = {
  label: 'Select your option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  required: true,
  theme: 'light',
};
