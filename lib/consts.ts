import { join } from "./mod.ts";

const withBase = (path: string) => join(Deno.cwd(), path);

export default {
  apiManifest: withBase("./app/.qd/manifest.ts"),
  importMap: "import_map.json",
  hmrClient: withBase("./lib/hmr/client.ts"),
  quickdraw: withBase("./app/.qd"),
  genClient: withBase("./app/.qd/client"),
  app: withBase("./app"),
  api: withBase("./app/api"),
  pages: withBase("./app/pages"),
  common: withBase("./app/common"),
  vanilla: withBase("./app/vanilla"),
  globalJS: withBase("./app/global.tsx"),
  lib: withBase("./lib"),
  ext: {
    hydrate: "hydrate",
  },
  assets: withBase("./app/.qd/assets"),
  filenames: {
    imports: "imports.ts",
  },
};
