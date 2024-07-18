import type { Preview } from "@storybook/react";
import "../src/base.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "word-impostor",
      values: [{ name: "word-impostor", value: "#191a2f" }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
