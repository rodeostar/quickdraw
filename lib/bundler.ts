import { BuildOptions, build, denoPlugin, join, consts } from "quickdraw";

import { osCompat } from "./os-compat.ts";

export type BundleMode = "production" | "development";

export const getMode = (): BundleMode => {
  const m = Deno.env.get("MODE");
  if (m === "development") return "development";
  return "production";
};

const sharedConfig: () => Partial<BuildOptions> = () => ({
  absWorkingDir: Deno.cwd(),
  jsxFactory: "h",
  jsxFragment: "Fragment",
  loader: {
    ".ts": "ts",
    ".js": "js",
    ".tsx": "tsx",
  },
  treeShaking: true,
  logLevel: "silent",
  external: ["tailwind", "tailwindcss"],
  format: "iife",
  bundle: true,
  minify: Deno.env.get("MODE") === "production",
  minifyWhitespace: Deno.env.get("MODE") === "production",
  target: Deno.env.get("MODE") === "production" ? "chrome58" : "esnext",
});

export async function bundler(name: string) {
  await build({
    ...sharedConfig(),
    entryPoints: [osCompat(join(consts.genClient, `${name}.tsx`))],
    plugins: [
      denoPlugin({
        importMapFile: join(Deno.cwd(), consts.importMap),
      }),
    ],
    outfile: `${consts.assets}/${name}.bundle.js`,
  });
}

export async function bundleGlobal() {
  await build({
    ...sharedConfig(),
    entryPoints: [osCompat(consts.globalJS)],
    plugins: [
      denoPlugin({
        importMapFile: join(Deno.cwd(), consts.importMap),
      }),
    ],
    outfile: `${consts.assets}/global.js`,
  });
}

export async function bundleHMR() {
  await build({
    ...sharedConfig(),
    entryPoints: [osCompat(consts.hmrClient)],
    plugins: [
      denoPlugin({
        importMapFile: join(Deno.cwd(), consts.importMap),
      }),
    ],
    outfile: `${consts.assets}/hmr.js`,
  });
}
