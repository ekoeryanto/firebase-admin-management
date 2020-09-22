import { FastifyPluginAsync } from "fastify";
import plugins from "./plugins";
import services from "./services";

const app: FastifyPluginAsync = async (fastify) => {
  fastify.setNotFoundHandler((_request, reply) => {
    reply.send({
      status: "fail",
      code: (404).toString(36).toUpperCase(),
      message: "Not Found"
    });
  });

  fastify.setErrorHandler((err, _request, reply) => {
    const n = err.statusCode || reply.statusCode;
    reply.send({
      status: n >= 500 ? "error" : "fail",
      code: err.code || (n).toString(36).toUpperCase(),
      message: n === 500 ? "Internal Server Error" : err.message
    });
  });

  fastify.register(plugins);
  fastify.register(services);
};

export default app;
