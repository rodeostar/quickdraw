import { Route, Routes, join, BundleMode } from "quickdraw";
import { bundler, bundleGlobal, bundleHMR } from "./bundler.ts";
import { exists, FileHelper, Template, consts } from "./mod.ts";
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts";

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

    // Really could use dynamic imports at runtime ):
    // https://github.com/denoland/deploy_feedback/issues/38
    async writeAPIManifest() {
      const manifest = new Template();
      manifest.append(`import type { APIHandler } from "quickdraw";`);
      manifest.append("const routes: Record<string, APIHandler> = {};");
      const apiDirectory = await recursiveReaddir(consts.api);

      apiDirectory.forEach((dir, index) => {
        const endFileRoute = dir
          .replace(Deno.cwd(), "")
          .replace("\\app", "")
          .replace("/app", "")
          .replace(/\\/g, "/");
        const apiPath = endFileRoute.replace(".ts", "");
        manifest.prepend(`import Handler${index} from "@app${endFileRoute}"`);
        manifest.append(`routes["${apiPath}"] = Handler${index};`);
      });

      manifest.append("export default routes;");
      await Deno.writeTextFile(consts.apiManifest, manifest.get());
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
  await StartupInstance.writeAPIManifest();
  await bundleGlobal(mode);

  if (mode === "development") {
    await bundleHMR(mode);
  }

  if (onComplete) {
    onComplete();
  }
}
