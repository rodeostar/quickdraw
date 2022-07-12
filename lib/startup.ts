import {
  Route,
  Routes,
  consts,
  bundler,
  bundleGlobal,
  bundleHMR,
  join,
  exists,
  FileHelper,
  Template,
  BundleMode,
} from "quickdraw";

export default async function startup(
  mode: BundleMode = "production",
  onComplete?: () => void
) {
  class Startup {
    pages: FileHelper[];
    hydraters: string[];
    routes: Routes;

    constructor() {
      this.pages = [];
      this.hydraters = [];
      this.routes = {};
    }

    async getPages() {
      const hasGlobalJS = await exists(consts.globalJS);

      for await (const { name } of Deno.readDir(consts.pages)) {
        if (name.includes(consts.ext.hydrate)) {
          this.hydraters.push(name);
        } else {
          this.pages.push(new FileHelper(name, hasGlobalJS));
        }
      }
    }

    createRoutes() {
      for (const page of this.pages) {
        this.routes[page.path] = page.route;
        page.hasHydration(this.hydraters);
        page.createImport();
      }
    }

    async writeChunks() {
      const chunks = new Template();
      // Append required types for the template
      const TEMPLATE_TYPES = 'import type { Routes } from "quickdraw/client";';

      // Create an object mapping of the routes
      const TEMPLATE_RECORD = `const routes: Routes = ${JSON.stringify(
        this.routes
      )};`;

      // Import a page component
      const TEMPLATE_IMPORT = (route: Route) =>
        `import ${route.name} from "@app/pages/${route.name}.tsx";`;

      // Add the imported component to the mapping
      const TEMPLATE_COMPONENT = (route: Route) =>
        `routes["${route.path}"].Component = ${route.name};`;

      chunks.append(TEMPLATE_TYPES);
      chunks.append(TEMPLATE_RECORD);

      for (const route of Object.values(this.routes)) {
        chunks.prepend(TEMPLATE_IMPORT(route));
        chunks.append(TEMPLATE_COMPONENT(route));
      }

      chunks.append(`\nexport default routes;`);

      // Writeout the generate template
      await Deno.writeTextFile(
        join(consts.quickdraw, consts.filenames.imports),
        chunks.get()
      );
    }

    async bundlePages() {
      for (const page of this.pages) {
        await bundler(mode, page.name);
      }
    }
  }

  const StartupInstance = new Startup();
  await StartupInstance.getPages();
  StartupInstance.createRoutes();
  await StartupInstance.writeChunks();
  await bundleGlobal(mode);

  if (mode === "development") {
    await bundleHMR(mode);
  }

  if (onComplete) {
    onComplete();
  }
}
