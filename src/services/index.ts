import { FastifyPluginAsync } from "fastify";
import garda from "./garda";
import root from "./root";

const services: FastifyPluginAsync = async (app) => {
  app.register(root);
  app.register(garda);
};

export default services;
