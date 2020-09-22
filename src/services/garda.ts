import { FastifyPluginAsync } from "fastify";
import { auth } from "firebase-admin";

const claimer = (c: auth.DecodedIdToken & { rol?: string[] }) => c.rol?.includes("uad");

const garda: FastifyPluginAsync = async app => {
  // set custom claim
  app.route<{ Body: Record<string, unknown>, Params: { uid: string } }>({
    url: "/claim/:uid",
    method: "PATCH",
    preHandler: [app.verifyIdToken(claimer)],
    async handler(req) {
      this.admin.auth().setCustomUserClaims(req.params.uid, req.body);
      return this.admin.auth()
        .getUser(req.params.uid).then(user => user.toJSON());
    }
  });

  // verify token
  const verifySchema = {
    body: {
      type: "object",
      properties: {
        token: { type: "string" }
      },
      required: ["token"]
    }
  };

  app.route<{ Body: { token: string } }>({
    method: "POST",
    url: "/verify",
    schema: verifySchema,
    preHandler: app.verifyIdToken(),
    async handler(request, reply) {
      const { token } = request.body;
      const { sub } = request.claims;

      const document = await app.admin.firestore().collection("token").doc(token);

      const tokenCol = await document.get();

      if (!tokenCol.exists) {
        throw this.err(404);
      }

      const { expires, until, roles, permissions } = tokenCol.data() as {
         until?: number; expires: number; roles: string[]; permissions: string[]
        };

      if (expires && expires < Math.round(Date.now() / 1000)) {
        throw this.err(401, "Token expires");
      }

      const claims = {
        rol: roles,
        pem: permissions,
        til: until
      };

      await this.admin.auth().setCustomUserClaims(sub, claims);

      reply.code(205).send(claims);
    }
  });

  // list user
  app.route<{ Querystring: { limit: number, next: string }, Params: { uid: string } }>({
    url: "/users",
    method: "GET",
    preHandler: [app.verifyIdToken(claimer)],
    async handler(req) {
      return this.admin.auth().listUsers(req.query.limit || 100,  req.query.next);
    }
  });

  // update user
  app.route<{ Body: Record<string, unknown>, Params: { uid: string } }>({
    url: "/user/:uid",
    method: "PATCH",
    preHandler: [app.verifyIdToken(claimer)],
    async handler(req) {
      this.admin.auth().setCustomUserClaims(req.params.uid, req.body);
      return this.admin.auth()
        .getUser(req.params.uid).then(user => user.toJSON());
    }
  });

  // delete user
  app.route<{ Params: { uid: string } }>({
    url: "/user/:uid",
    method: "DELETE",
    preHandler: [app.verifyIdToken(claimer)],
    async handler(req) {
      const { uid } = req.params;
      await this.admin.auth().deleteUser(uid);
      return {
        uid,
        deleted: true
      };
    }
  });
};

export default garda;
