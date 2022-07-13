import * as log from "https://deno.land/std@0.147.0/log/mod.ts";

export const Log = {
  info: (msg: string) => {
    log.info(["[", new Date().toLocaleTimeString(), "]", ` ${msg} `].join(""));
  },
};
