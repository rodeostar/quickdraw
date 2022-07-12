import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { HMR_PORT } from "../options.ts";

export default (callback: (ws: WebSocketClient) => void) => {
  const wss = new WebSocketServer(HMR_PORT);
  wss.on("connection", function (ws: WebSocketClient) {
    callback(ws);
  });
};
