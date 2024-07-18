import type { Meta, StoryObj } from "@storybook/react";
import { Topbar } from "./Topbar";

const meta = {
  title: "Navigation/Topbar",
  component: Topbar,
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
