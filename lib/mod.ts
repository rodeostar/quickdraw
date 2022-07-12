// Remote deps
export { ensureDir } from "https://deno.land/std@0.147.0/fs/mod.ts";
export { debounce } from "https://deno.land/std@0.147.0/async/mod.ts";
export { open } from "https://deno.land/x/open@v0.0.5/index.ts";
export * as colors from "https://deno.land/std@0.147.0/fmt/colors.ts";
export type { BuildOptions } from "https://deno.land/x/esbuild@v0.14.25/mod.js";
export { build } from "https://deno.land/x/esbuild@v0.14.25/mod.js";
export { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.4.1/mod.ts";

export type { Configuration as TailwindConfiguration } from "https://esm.sh/twind@0.16.16";
export { getStyleTag, virtualSheet } from "https://esm.sh/twind@0.16.16/sheets";
export { tw, setup } from "https://esm.sh/twind@0.16.16";
export {
  Request,
  Response,
  Context,
  Application,
  Router as OakRouter,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
export { walk } from "https://deno.land/std@0.147.0/fs/mod.ts";
export { join, normalize } from "https://deno.land/std@0.132.0/path/mod.ts";

export * from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
// Lib deps

import settings from "./config.ts";
export { settings };

export type {
  Routes,
  Route,
  Params,
  RoutedProps,
  APIHandler,
} from "./types.ts";
export type { QuickdrawSettings } from "./config.ts";
export type { SEOProps } from "./tsx/seo.tsx";
export { SearchOpt } from "./tsx/seo.tsx";

import consts from "./util/consts.ts";
export { html } from "./tsx/html.tsx";
export { Log } from "./util/logging.ts";

export { bundler, bundleGlobal, bundleHMR, getMode } from "./bundler.ts";
export { initializeTailwind } from "./tailwind.ts";
export { startServer } from "./backend.ts";
export { exists } from "./util/exists.ts";
export { FileHelper } from "./util/file.ts";
export { Template } from "./util/template.ts";
export { PathHelper } from "./util/path.ts";

export {
  importRoutes,
  importServices,
  routeExists,
  serviceExists,
  routeIsStatic,
  serveAPI,
  serveStatic,
  serveJSX,
  serveError,
} from "./handlers.ts";

import server from "./server.ts";
import startup from "./startup.ts";
import banner, { startupMessage } from "./util/banner.ts";
import HMRServer from "./hmr/server.ts";

import QuickdrawDevelop from "./dev.ts";
import QuickdrawProduction from "./prod.ts";

export { QuickdrawDevelop, QuickdrawProduction };

export { consts, HMRServer, banner, startupMessage, server, startup };
