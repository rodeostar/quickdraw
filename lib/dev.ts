import { open, debounce, join, HMRServer, consts } from "quickdraw";

export default async function dev() {
  const { startup } = await import("quickdraw");
  const { default: server } = await import("./server.ts");

  await startup("development");

  // Launch the server
  server();

  // Open the browser
  open(`http://localhost:5000`);

  let watcherCallback;

  // Note: only supports single connection for now.
  HMRServer((ws) => {
    watcherCallback = () => ws.send("RELOAD");
  });

  const folders = [];

  for await (const { name } of Deno.readDir(consts.app)) {
    if (name != ".qd") {
      folders.push(join(consts.app, name));
    }
  }
  for await (const _event of Deno.watchFs(folders, { recursive: true })) {
    debounce(startup, 1000)("development", watcherCallback);
  }
}
