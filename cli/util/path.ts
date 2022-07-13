import { consts } from "../mod.ts";

export const PathHelper = {
  split(str = "") {
    return str.split("/");
  },
  join(...str: string[]) {
    return str.join("/");
  },
  lastSegment(str = "") {
    return this.split(str).at(-1);
  },
  abs(str = "") {
    return `/${str}`;
  },
  hdrPath(str: string) {
    return str.replace(".tsx", [consts.ext.hydrate, "tsx"].join("."));
  },
};
