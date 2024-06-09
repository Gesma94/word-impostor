import "dotenv/config";
import type { CommonType } from "@word-impostor/common/types";
import { isNullOrUndefined } from "@word-impostor/common/utils";
import Fastify from "fastify";

const port = process.env.PORT ? Number(process.env.PORT) : 7717;
const fastify = Fastify({
  logger: true,
});

fastify.get("/ping", (_, reply) => {
  if (isNullOrUndefined({ prop1: 7 } as CommonType)) {
    reply.status(500).send({ error: "is null" });
  }

  reply.send({ ping: "pong" });
});

fastify.get("/env", (_, reply) => {
  reply.send({ env: process.env.SERVER_COMMON_ENV });
});

fastify.listen({ port }, (err, address) => {
  fastify.log.debug(`Listening at ${address}`);
  if (err) throw err;
});
