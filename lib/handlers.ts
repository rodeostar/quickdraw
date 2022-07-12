import {
  Routes,
  Route,
  APIHandler,
  Context,
  consts,
  html,
  Log,
  walk,
} from "quickdraw";

export type QuickdrawHandler<T = void> = (
  context: Context,
  routes: Routes
) => T;

export type ContextHelper<T> = (context: Context, routes?: Routes) => T;

export const serveStatic: QuickdrawHandler<Promise<void>> = async (context) => {
  Log.info(`$staticReq ${context.request.url.pathname}`);

  await context.send({
    root: consts.quickdraw + "/",
  });
};

export const serveJSX: QuickdrawHandler<(route: Route) => Promise<void>> =
  (context, routes) => async (route: Route) => {
    Log.info(`$jsxReq ${context.request.url.pathname}`);
    const parsed = await html(routes, route);
    context.response.body = parsed;
  };

export const serveAPI = (
  context: Context,
  routes: Record<string, APIHandler>
) => {
  Log.info(
    `$apiReq ${context.request.url.pathname}::${context.request.headers.get(
      "referer"
    )}`
  );
  const handler = serviceExists(context, routes);

  if (handler) {
    handler(context.request, context.response);
  }
};

export const serveError: QuickdrawHandler = (context, routes) => {
  Log.info(`$errorReq ${context.request.url.pathname}`);
  context.response.body = html(routes, routes["/error"]);
};

export const routeExists: ContextHelper<boolean> = (context, routes) => {
  return !!routes && routes[context?.request?.url?.pathname] != null;
};

export const serviceExists = (
  context: Context,
  routes: Record<string, APIHandler>
) => {
  if (!routes) return undefined;
  return routes[context?.request?.url?.pathname] ?? undefined;
};

export const routeIsStatic: ContextHelper<boolean> = (context) => {
  return /\.(css|js|jpg|png|svg|gif|)$/i.test(context.request.url.pathname);
};

export const importRoutes = async () => {
  const results: Routes = {};

  const { default: importPaths } = await import("@app/.qd/imports.ts");

  for (const [name, route] of Object.entries(importPaths)) {
    if (!route.importPath) continue;
    await import(route.importPath).then((contents) => {
      const { default: Component } = contents;
      results[name] = {
        ...(contents?.seo && { seo: contents.seo }),
        ...route,
        Component,
      };
    });
  }

  return results;
};

const getAllfiles = (path: string) =>
  walk(path, { includeDirs: false, exts: [".ts"] });

export const importServices = async () => {
  const routes: Record<string, APIHandler> = {};

  for await (const e of getAllfiles(consts.api)) {
    const key = e.path.replace(/\\/g, "/").split("/api")[1].replace(".ts", "");
    const Handler = await import(`file:///${e.path}`);
    const handler = Handler.default;
    routes["/api" + key] = handler;
  }

  return routes;
};
