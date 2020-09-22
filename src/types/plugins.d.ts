import { config } from "@/schemas/config";

declare module "fastify"  {
  interface FastifyInstance {
    config: config
  }
}
