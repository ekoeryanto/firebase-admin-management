import { FastifyPluginAsync } from "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import fp from "fastify-plugin";
import errPlugin from "./err.plugin";
import firebasePlugin from "./firebase.plugin";

const plugins: FastifyPluginAsync = async (app) => {
  app.register(errPlugin);
  app.register(fastifyCors, {
    // add origin here
    origin: ["http://localhost:8080"],
    credentials: true
  });
  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET
  });

  app.register(firebasePlugin);
};

export default fp(plugins);
