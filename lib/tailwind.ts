import { virtualSheet, setup } from "quickdraw";
import config from "@app/tailwind.config.ts";

export const sheet = virtualSheet();

export function initializeTailwind() {
  setup({
    ...config,
    sheet,
  });
}
