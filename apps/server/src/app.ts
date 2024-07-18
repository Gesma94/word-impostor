import Fastify from "fastify";
import socketioPlugin from "./plugins/socketio.js";

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  },
});

// manually registering socket io plugin
fastify.register(socketioPlugin);

fastify.get("/ping", (_, reply) => {
  reply.send({ ping: "pong" });
});

fastify.get("/env", (_, reply) => {
  reply.send({ env: process.env.SERVER_COMMON_ENV });
});

export default fastify;
