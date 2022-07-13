import {
  routeExists,
  serviceExists,
  routeIsStatic,
  serveAPI,
  serveStatic,
  serveJSX,
  serveError,
  Application,
  OakRouter,
} from "./mod.ts";

import routes from "@app/.qd/imports.ts";
import apiRoutes from "@app/.qd/manifest.ts";

export async function startServer(port = 5000, staticRoot = "./") {
  const router = new OakRouter();
  const app = new Application();

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (context) => {
    const { pathname } = context.request.url;
    const ctx = routes[pathname];
    if (serviceExists(context, apiRoutes)) {
      serveAPI(context, apiRoutes);
    } else if (routeExists(context, routes)) {
      serveJSX(context, routes)(ctx);
    } else if (routeIsStatic(context)) {
      await serveStatic(context, staticRoot);
    } else {
      serveError(context, routes);
    }
  });

  await app.listen({ port });
}
