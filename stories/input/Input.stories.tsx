import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "your@email.com",
    theme: "light",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "your@email.com",
    error: "Invalid email address",
    theme: "light",
  },
};

export const Checkbox: Story = {
    args: {
      label: "Accept Terms",
      type: "checkbox",
      required: true,
      theme: "light",
    },
  };
  
  export const CheckboxWithError: Story = {
    args: {
      label: "Accept Terms",
      type: "checkbox",
      required: true,
      error: "You must accept the terms",
      theme: "light",
    },
  };

  export const Radio: Story = {
    args: {
      label: "Select Option",
      type: "radio",
      name: "options",
      required: true,
      theme: "light",
    },
  };
  
  export const RadioWithError: Story = {
    args: {
      label: "Select Option",
      type: "radio",
      name: "options",
      required: true,
      error: "You must select an option",
      theme: "light",
    },
  };
