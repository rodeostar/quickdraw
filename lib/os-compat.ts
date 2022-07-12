import { normalize } from "quickdraw";

export const osCompat = (path: string) =>
  normalize(path.replace(Deno.cwd(), ""));
