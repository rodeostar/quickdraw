import {
  Routes,
  Route,
  APIHandler,
  Context,
  consts,
  html,
  Log,
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
  const route = context?.request?.url?.pathname;
  if (!routes || !route.includes("/api")) return undefined;
  return routes[route] ?? undefined;
};

export const routeIsStatic: ContextHelper<boolean> = (context) => {
  return /\.(css|js|jpg|png|svg|gif|)$/i.test(context.request.url.pathname);
};
