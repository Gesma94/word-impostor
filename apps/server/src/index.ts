import type { CommonType } from "@word-impostor/common/types";
import { isNullOrUndefined } from "@word-impostor/common/utils";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/ping", (_, reply) => {
  if (isNullOrUndefined({ prop1: 7 } as CommonType)) {
    reply.status(500).send({ error: "is null" });
  }

  reply.send({ hello: "pong" });
});

fastify.listen({ port: 3000 }, (err, address) => {
  fastify.log.debug(`Listening at ${address}`);
  if (err) throw err;
});
