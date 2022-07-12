import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { HMR_PATH } from "../options.ts";

function main() {
  const ws: WebSocketClient = new StandardWebSocketClient(HMR_PATH);

  ws.on("message", function (message: MessageEvent) {
    if (message.data === "RELOAD") {
      window.location.reload();
    }
  });
}

main();
