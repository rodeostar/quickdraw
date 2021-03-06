import {
  BuildOptions,
  build,
  denoPlugin,
  join,
  consts,
  BundleMode,
} from "./mod.ts";

import { osCompat } from "./os-compat.ts";

const sharedConfig: (mode: BundleMode) => Partial<BuildOptions> = (
  mode = "production"
) => ({
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
  minify: mode === "production",
  minifyWhitespace: mode === "production",
  target: "chrome58",
});

export async function bundler(mode: BundleMode = "production", name: string) {
  await build({
    ...sharedConfig(mode),
    entryPoints: [osCompat(join(consts.genClient, `${name}.tsx`))],
    plugins: [
      denoPlugin({
        importMapFile: join(Deno.cwd(), "import_map.json"),
      }),
    ],
    outfile: `${consts.assets}/${name}.bundle.js`,
  });
}

export async function bundleGlobal(mode: BundleMode = "production") {
  await build({
    ...sharedConfig(mode),
    entryPoints: [osCompat(consts.globalJS)],
    plugins: [
      denoPlugin({
        importMapFile: join(Deno.cwd(), "import_map.json"),
      }),
    ],
    outfile: `${consts.assets}/global.js`,
  });
}

export async function bundleHMR(mode: BundleMode = "production") {
  await build({
    ...sharedConfig(mode),
    entryPoints: [osCompat(consts.hmrClient)],
    plugins: [
      denoPlugin({
        importMapFile: join(Deno.cwd(), "import_map.json"),
      }),
    ],
    outfile: `${consts.assets}/hmr.js`,
  });
}
