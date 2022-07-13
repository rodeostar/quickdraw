import type { TailwindConfiguration } from "quickdraw/client";

export default {
  darkMode: "class",
  mode: "silent",
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
} as TailwindConfiguration;
