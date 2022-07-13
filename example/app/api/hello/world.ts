import type { APIHandler } from "@lib/types.ts";

const handler: APIHandler = (_, response) => {
  response.headers.set("Content-Type", "application/json");
  response.body = {
    hello: "world",
  };
};

export default handler;
