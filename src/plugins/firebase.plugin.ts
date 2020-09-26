import { FastifyPluginAsync, FastifyRequest, preHandlerHookHandler } from "fastify";
import fp from "fastify-plugin";
import admin from "firebase-admin";

interface FirebasePluginOptions {
  options: admin.ServiceAccount;
  refreshToken?: string;
  name?: string;
}

export type claimerType = (payload: admin.auth.DecodedIdToken) => boolean | undefined

const firebasePlugin: FastifyPluginAsync<FirebasePluginOptions> = async (app, opts) => {
  const {
    FIREBASE_APP_NAME,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_CONFIG,
    FIREBASE_REFRESH_TOKEN,
    FIREBASE_CERT,
    GOOGLE_APPLICATION_CREDENTIALS
  } = process.env;

  const { options = {}, name = FIREBASE_APP_NAME, refreshToken = FIREBASE_REFRESH_TOKEN } = opts;

  let credential;

  if (!admin.apps.length) {
    if (GOOGLE_APPLICATION_CREDENTIALS) {
      if (FIREBASE_CONFIG) {
        admin.initializeApp();
      } else {
        admin.initializeApp({ credential: admin.credential.applicationDefault() }, name);
      }
    } else {
      if (refreshToken) {
        credential = admin.credential.refreshToken(refreshToken);
      } if (FIREBASE_CERT) {
        const cert = FIREBASE_CERT.startsWith("{") ? JSON.parse(FIREBASE_CERT) : require(FIREBASE_CERT);
        credential = admin.credential.cert(cert);
      } else {
        const {
          clientEmail = FIREBASE_CLIENT_EMAIL,
          privateKey = FIREBASE_PRIVATE_KEY,
          projectId = FIREBASE_PROJECT_ID,
        } = options;

        credential = admin.credential.cert({ clientEmail, privateKey, projectId });
      }

      admin.initializeApp({ credential }, name);
    }
  }

  app.decorate("admin", admin);

  const verifyIdToken = (claimer?: claimerType) => async (request: FastifyRequest) => {
    const [type, token = request.cookies.__session] = (request.headers.authorization?.toString() || "").split(" ", 2);

    if (!token || type.toLowerCase() !== "bearer") {
      throw app.err(401, "Invalid token");
    }

    try {
      const claims = await admin.auth().verifyIdToken(token);

      if (claimer && !claimer(claims)) {
        throw app.err(401);
      }

      request.claims = claims;
    } catch (error) {
      app.log.error("firebase authentication error", error);
      if (error.code === "auth/argument-error" || error.message === "Cannot verify token") {
        throw app.err(400);
      }

      throw app.err(401, error.message);
    }
  };

  app.decorate("verifyIdToken", verifyIdToken);
};

export default fp(firebasePlugin, {
  fastify: "3.x",
  name: "@patriot/fastify-firebase",
  dependencies: ["@patriot/fastify-err", "fastify-cookie"]
});

declare module "fastify" {
  interface FastifyInstance {
    admin: admin.app.App
    verifyIdToken: (claimer?: claimerType) => preHandlerHookHandler
  }
  interface FastifyRequest {
    claims: admin.auth.DecodedIdToken
  }
}
