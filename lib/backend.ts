import {
  importRoutes,
  importServices,
  routeExists,
  serviceExists,
  routeIsStatic,
  serveAPI,
  serveStatic,
  serveJSX,
  serveError,
  banner,
  startupMessage,
  Application,
  OakRouter,
} from "quickdraw";

export async function startServer(port = 5000) {
  const router = new OakRouter();
  const app = new Application();
  const routes = await importRoutes();
  const apiRoutes = await importServices();

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(async (context) => {
    const ctx = routes[context.request.url.pathname];
    if (serviceExists(context, apiRoutes)) {
      serveAPI(context, apiRoutes);
    } else if (routeExists(context, routes)) {
      await serveJSX(context, routes)(ctx);
    } else if (routeIsStatic(context)) {
      await serveStatic(context, routes);
    } else {
      serveError(context, routes);
    }
  });

  banner();
  if (Deno.env.get("MODE") === "development") {
    await startupMessage(port);
  }
  await app.listen({ port });
}
