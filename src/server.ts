import { config } from "dotenv";
import fastify from "fastify";
import app from "./app";

config();

const server = fastify({
  logger: true
});

server.register(app);

server.listen(process.env.PORT, process.env.ADDRESS);
