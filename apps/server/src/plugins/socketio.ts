import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import type { ServerOptions } from "socket.io";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@word-impostor/common/types";

declare module "fastify" {
  interface FastifyInstance {
    ["io"]: Server<ClientToServerEvents, ServerToClientEvents>;
  }
}

export default fp(
  async (fastify: FastifyInstance, opts: Partial<ServerOptions>) => {
    fastify.decorate("io", new Server<ClientToServerEvents, ServerToClientEvents>(fastify.server, opts));
  },
  {
    fastify: ">=4.x.x",
    name: "fastify-socket.io",
  },
);
