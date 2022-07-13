import { initializeTailwind, startServer } from "quickdraw";

export default function server(staticRoot = "./") {
  initializeTailwind();
  startServer(5000, staticRoot);
}
