import { createServer } from "node:http";

import next from "next";

import { attachChatServer, readChatServerConfig } from "./server/chatServer.js";

const isDevelopment = process.argv.includes("--dev");
const { port, hostname } = readChatServerConfig(
  process.env,
  isDevelopment ? "127.0.0.1" : "0.0.0.0",
);
const app = next({ dev: isDevelopment, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((request, response) => {
  void handle(request, response);
});
attachChatServer(httpServer);

httpServer.listen(port, hostname, () => {
  console.log(`> @yaroo/chat ready on http://${hostname}:${port}`);
});
