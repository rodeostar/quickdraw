export * from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
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

import settings from "./config.ts";
import server from "./server.ts";
import HMRServer from "./hmr/server.ts";

export { HMRServer, server, settings };
export { Log } from "./logging.ts";

export type {
  BundleMode,
  QuickdrawOptions,
  CDNPrefix,
  Routes,
  Route,
  Params,
  RoutedProps,
  APIHandler,
} from "./types.ts";

export type { QuickdrawSettings } from "./config.ts";
export type { SEOProps } from "./tsx/seo.tsx";
export { SearchOpt } from "./tsx/seo.tsx";

export { html } from "./tsx/html.tsx";
export { initializeTailwind } from "./tailwind.ts";
export { startServer } from "./backend.ts";

export {
  routeExists,
  serviceExists,
  routeIsStatic,
  serveAPI,
  serveStatic,
  serveJSX,
  serveError,
} from "./handlers.ts";
