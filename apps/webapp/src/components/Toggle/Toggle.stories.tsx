import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Editable: Story = {
  args: {},
};
