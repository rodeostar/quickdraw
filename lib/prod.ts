import { server, startup } from "quickdraw";

export default async () => {
  Deno.env.set("MODE", "production");
  await startup(server);
};
