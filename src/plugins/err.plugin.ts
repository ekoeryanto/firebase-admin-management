import { FastifyError, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { STATUS_CODES } from "http";

const errPlugin: FastifyPluginAsync = async app => {
  const err = (code: number|string, msg?: string) => {
    const message = msg || STATUS_CODES[code];

    const thr = new Error(message);
    (thr as FastifyError).code = code as string;
    (thr as FastifyError).statusCode = +code;

    return thr;
  };

  app.decorate("err", err);
};

export default fp(errPlugin, {
  fastify: "3.x",
  name: "@patriot/fastify-err"
});

declare module "fastify" {
  interface FastifyInstance {
    err(code: number|string, msg?: string): FastifyError
  }
}

