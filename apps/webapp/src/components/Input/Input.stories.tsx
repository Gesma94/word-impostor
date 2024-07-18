import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    placeholder: "12342",
  },
};

export const Disabled: Story = {
  args: {
    value: "12342",
    disabled: true,
  },
};
