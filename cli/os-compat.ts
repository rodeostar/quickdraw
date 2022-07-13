import { normalize } from "./mod.ts";

export const osCompat = (path: string) =>
  normalize(path.replace(Deno.cwd(), ""));
