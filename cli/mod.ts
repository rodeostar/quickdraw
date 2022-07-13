// Remote deps
export { open } from "https://deno.land/x/open@v0.0.5/index.ts";
export * as colors from "https://deno.land/std@0.147.0/fmt/colors.ts";
export type { BuildOptions } from "https://deno.land/x/esbuild@v0.14.25/mod.js";
export { build } from "https://deno.land/x/esbuild@v0.14.25/mod.js";
export { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.4.1/mod.ts";

export type {
  Route,
  BundleMode,
} from "https://deno.land/x/quickdraw@v0.0.5/mod.ts";
export { server, HMRServer } from "https://deno.land/x/quickdraw@v0.0.5/mod.ts";
export { join, normalize } from "https://deno.land/std@0.132.0/path/mod.ts";

export { debounce } from "https://deno.land/std@0.147.0/async/mod.ts";

export { exists } from "./util/exists.ts";
export { FileHelper } from "./util/file.ts";
export { Template } from "./util/template.ts";
export { PathHelper } from "./util/path.ts";
import consts from "./util/consts.ts";
import banner, { startupMessage } from "./util/banner.ts";

export { consts, banner, startupMessage };
export { QuickdrawDevelop } from "./dev.ts";
export { QuickdrawProduction } from "./prod.ts";
