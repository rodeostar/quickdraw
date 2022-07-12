export { observeRouting, CommonRouter } from "./tsx/router.tsx";
export { hydrateRoutedComponents } from "./tsx/router.csr.tsx";
export {
  h,
  Fragment,
  hydrate,
  Router,
  Component,
} from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
export type { FC } from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
export type {
  Routes,
  Route,
  Params,
  RoutedProps,
  APIHandler,
} from "./types.ts";
export { tw, setup } from "https://esm.sh/twind@0.16.16";

import settings from "./config.ts";
export { settings };
export type { Configuration as TailwindConfiguration } from "https://esm.sh/twind@0.16.16";
