import type { Meta, StoryObj } from "@storybook/react";
import Alert from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    type: "warning",
    message: "This is a warning alert!",
    theme: "light",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    message: "This is an error alert!",
    theme: "light",
  },
};
