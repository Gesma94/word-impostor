import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryVariant: Story = {
  args: {
    children: "Join room",
  },
};

export const SecnodaryVariant: Story = {
  args: {
    variant: "secondary",
    children: "Create room",
  },
};
