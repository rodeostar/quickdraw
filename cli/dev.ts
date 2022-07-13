import {
  debounce,
  consts,
  banner,
  startupMessage,
  open,
  join,
  HMRServer,
  server,
} from "./mod.ts";
import startup from "./startup.ts";

export async function QuickdrawDevelop() {
  await startup();

  banner();
  startupMessage();

  // Launch the server
  server(consts.quickdraw);

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
