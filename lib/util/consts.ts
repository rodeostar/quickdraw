import { join } from "quickdraw";

const withBase = (path: string) => join(Deno.cwd(), path);

export default {
  importMap: "import_map.json",
  hmrClient: withBase("./lib/hmr/client.ts"),
  quickdraw: withBase("./.quickdraw"),
  genClient: withBase("./.quickdraw/client"),
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
  assets: withBase("./.quickdraw/assets"),
  filenames: {
    imports: "imports.ts",
  },
};
