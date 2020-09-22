import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async app => {
  app.get("/", async () => ({ root: true }));
};

export default root;
