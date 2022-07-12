import { virtualSheet, setup } from "quickdraw";

export const sheet = virtualSheet();

export async function initializeTailwind() {
  await import("@app/tailwind.config.ts").then(({ default: config }) => {
    setup({
      ...config,
      sheet,
    });
  });
}
