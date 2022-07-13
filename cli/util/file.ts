import { Route } from "../mod.ts";
import { Template } from "./template.ts";
import { PathHelper } from "./path.ts";

export class FileHelper {
  name: string;
  path: string;
  hydration: string;
  importPath: string;
  scripts: string;
  import: Template;
  includesHydration: boolean;
  route: Route;

  constructor(filename: string, hasGlobalJS: boolean) {
    // about.tsx -> "about"
    this.name = filename.split(".tsx")[0];

    // about -> "/cwd/about.tsx"
    this.importPath = "@app/pages/" + filename;

    // about -> "/about.hydrate.tsx"
    this.hydration = PathHelper.hdrPath(this.name);

    // home -> "/", index -> "/", about -> "/about"
    this.path =
      this.name === "home" || this.name === "index" ? "/" : `/${this.name}`;

    const scripts = [];

    if (hasGlobalJS) {
      scripts.push(this.createScriptHTML({ src: "/assets/global.js" }));
    }

    if (Deno.env.get("MODE") === "development") {
      scripts.push(this.createScriptHTML({ src: "/assets/hmr.js" }));
    }

    // Merge scripts
    this.scripts = scripts.join("\n");

    // Create template space for imports.ts
    this.import = new Template();

    // Track whether route has hydration
    this.includesHydration = false;

    // Create the route
    this.route = {
      name: this.name,
      path: this.path,
      js: this.scripts,
      importPath: this.importPath,
    };
  }

  createScriptHTML(attrs?: Record<string, string>) {
    return `<script type="text/javascript" defer ${Object.entries(attrs || {})
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ")}></script>`;
  }

  hasHydration(hydrationPaths: string[]) {
    this.includesHydration = hydrationPaths.includes(this.hydration);
  }

  createImport(hydrate = false) {
    // this.import.append('import "@lib/tsx/router.csr.tsx"');
    this.import.append(
      `import ${this.name} from "@app/pages/${this.name}.tsx";`
    );
    this.import.append(`export default ${this.name};`);

    if (hydrate) {
      this.import.prepend(`import "@app/pages/${this.name}.hydrate.tsx";`);
    }
  }
}
