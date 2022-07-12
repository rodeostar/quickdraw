import { open, debounce, HMRServer, consts } from "quickdraw";

export default async function dev() {
  const { startup } = await import("quickdraw");
  const { default: server } = await import("./server.ts");

  await startup();

  // Launch the server
  server();

  // Open the browser
  open(`http://localhost:5000`);

  let watcherCallback;

  // Note: only supports single connection for now.
  HMRServer((ws) => {
    watcherCallback = () => ws.send("RELOAD");
  });

  for await (const _event of Deno.watchFs(consts.app)) {
    console.log(_event);
    debounce(startup, 1000)(watcherCallback);
  }
}
