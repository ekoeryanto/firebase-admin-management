import { NowRequest, NowResponse } from "@vercel/node";
import fastify from "fastify";
import app from "./app";

export default function (req: NowRequest, res: NowResponse): void {
  const api = fastify({
    ignoreTrailingSlash: true,
    logger: true
  });

  api.register(app);

  api.ready()
    .then(() => {
      api.server.emit("request", req, res);
    });
}
