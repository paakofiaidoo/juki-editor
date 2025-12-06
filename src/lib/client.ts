import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { EngineService } from "../gen/protos/engine_connect";

const transport = createConnectTransport({
  baseUrl: "http://localhost:4220", // Engine port
});

export const engineClient = createClient(EngineService, transport);
export const projectClient = engineClient;
export const pageClient = engineClient;
