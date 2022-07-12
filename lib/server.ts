import { initializeTailwind, startServer } from "quickdraw";

export default function server() {
  initializeTailwind();
  startServer(5000);
}
